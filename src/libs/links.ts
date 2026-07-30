import { flags } from "./createResizeIframe";
import { cromLookup } from "./lookup/crom";

// Configure which lookup method is currently active
const lookupMethod = cromLookup;

export type AddLinkCallback = (pageUrl: string, branchName: string, branchLang: string, isOriginal: boolean) => void;

/**
 * Configuration for a single branch.
 *
 * A branch is usually a whole Wikidot site but can be restricted to a single category of a Wikidot site.
 */
export interface Branch {
  /** The official name of the branch. */
  name: string;
  /** The text of the header that will appear at the top of the Interwiki. */
  head: string;
  /** The URL of the site that contains this branch, with a trailing slash. */
  url: string;
  /** The numeric Wikidot site ID of the site that contains this branch. */
  id: string;
  /** The category within this site that contains the branch, with a trailing colon; or, if the branch is not contained
   * to any category within the site, the empty string.
   */
  category: string;
}

/**
 * Requests translation data for the current page from all configured branches. Also sets the hover information in the
 * refresh link to the current time.
 *
 * @param branches - The branches configuration for the current community.
 * @param currentBranchLang - The language code of the current branch, as defined in the community's branches config.
 * @param pagename - The fullname of the page in the current branch to find translations for.
 */
export async function addTranslations(branches: Record<string, Branch>, currentBranchLang: string, pagename: string) {
  // Get the config for the current branch, if configured
  const currentBranch = branches[currentBranchLang];

  // Hide the side block by default (will be unhidden if there is at least one translation)
  const sideBlock = Array.from(document.querySelectorAll(".side-block")).find(
    (element) => element instanceof HTMLDivElement,
  );

  // Construct the header
  const header = Array.from(document.querySelectorAll(".heading p")).find(
    (element) => element instanceof HTMLParagraphElement,
  );

  if (!sideBlock || !header) {
    return;
  }

  sideBlock.style.display = "none";
  header.textContent = currentBranch.head;

  await lookupMethod(
    currentBranch,
    branches,
    pagename,
    (pageUrl: string, branchName: string, branchLang: string, isOriginal: boolean) => {
      addTranslationLink(pageUrl, branchName, branchLang, isOriginal);
      // Indicate that data has been received
      flags.showInterwiki = true;
    },
  );
}

/**
 * Create a new menu item, containing a link to a page in a given branch, and append it to the side block.
 *
 * @param pageUrl - The URL of the translation to link to.
 * @param branchName - The name of the branch.
 * @param branchLang - The language code of the branch.
 * @param isOriginal - Whether this link is for the original article rather than a translation.
 */
function addTranslationLink(pageUrl: string, branchName: string, branchLang: string, isOriginal: boolean) {
  const sideBlock = Array.from(document.querySelectorAll(".side-block")).find(
    (element) => element instanceof HTMLDivElement,
  );
  if (!sideBlock) {
    return;
  }
  const menuItems = Array.from(sideBlock.querySelectorAll(".menu-item")).filter(
    (element) => element instanceof HTMLDivElement,
  );

  // There is a translation, so unhide the side block if it is hidden
  sideBlock.style.display = "";

  // Create the new menu item
  const newMenuItem = document.createElement("div");
  newMenuItem.classList.add("menu-item");
  if (isOriginal) {
    newMenuItem.classList.add("original");
  }
  // Record its branch's language code in the element
  newMenuItem.setAttribute("name", branchLang);

  // Create the bullet point image
  const bullet = document.createElement("img");
  bullet.setAttribute("src", "//sigma9.scpwikicn.com/cn/img/default.png");
  bullet.setAttribute("alt", "default.png");
  bullet.classList.add("image");
  newMenuItem.append(bullet);

  // Create the actual link
  const link = document.createElement("a");
  link.setAttribute("href", pageUrl);
  link.setAttribute("target", "_parent");
  link.textContent = branchName;
  newMenuItem.append(link);

  // Add the new menu item to the end of the side block by default
  sideBlock.append(newMenuItem);
  // Then find the first existing menu item whose lang code is alphabetically greater than the new item, and move the
  // new item to just before it
  menuItems.some((menuItem) => {
    if ((menuItem.getAttribute("name") ?? "") > branchLang) {
      menuItem.before(newMenuItem);
      return true;
    }
    return false;
  });
}
