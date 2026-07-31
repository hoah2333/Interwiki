import { parse } from "valibot";
import { wikidotQuickModuleSchema } from "../validateSchema";

import type { AddLinkCallback, Branch } from "../links";

/**
 * Searches for pages whose fullname matches the given string in the given set of Wikidot sites using Wikidot's
 * PageLookupQModule.
 *
 * @param currentBranch - Configuration for the current branch.
 * @param branches - The branches configuration for the current community. All passed branches will be searched for the
 * target page.
 * @param fullname - The substring to compare fullnames against. If an underscore "_" is provided, all pages on the
 * site will match.
 * @param addLink - A function that will be called for each found translation.
 */
export async function wikidotLookup(
  currentBranch: Branch,
  branches: Record<string, Branch>,
  fullname: string,
  addLink: AddLinkCallback,
) {
  await Promise.all(
    Object.keys(branches)
      .filter((branchLang) => branches[branchLang].url !== currentBranch.url)
      .map((branchLang) => addTranslationForBranch(currentBranch, branchLang, branches[branchLang], fullname, addLink)),
  );
}

/**
 * For the given target branch, find a page that is a translation of the page fullname in the current branch. If one
 * exists, create a menu item for it.
 *
 * @param currentBranch - Configuration for the current branch.
 * @param targetBranchLang - The language code of the branch.
 * @param targetBranch - Configuration for the branch to lookup.
 * @param fullname - The Wikidot fullname of the page to lookup.
 * @param addLink - A function that will be called for each found translation.
 */
async function addTranslationForBranch(
  currentBranch: Branch,
  targetBranchLang: string,
  targetBranch: Branch,
  fullname: string,
  addLink: AddLinkCallback,
) {
  // Replace the current site's category with the target site's category, if either are defined
  // E.g.:
  // WL CN "wanderers:page" -> WL EN "page"
  // WL EN "page" -> WL CN "wanderers:page"
  const replacedFullname = fullname.startsWith(currentBranch.category)
    ? targetBranch.category + fullname.slice(currentBranch.category.length)
    : fullname;

  // A fullname can be at most 60 characters long. If the target fullname is any longer, truncate it
  const targetFullname = replacedFullname.slice(0, 60).replace(/-$/, "");

  // If the original fullname was 59 characters long (because the limit is 60, minus one if it would have ended with a
  // hyphen), it could have been truncated. If the target fullname is shorter than the original fullname (due to
  // stripping the category), the last bit of the fullname is not recoverable
  const couldHaveBeenTruncated = fullname.length >= 59 && targetFullname.length < fullname.length;

  // Find pages in the target branch matching this fullname
  const fullnames = await findPagesInSiteStartingWith(currentBranch.url, targetBranch.id, targetFullname);
  // If there is an exact match, a translation has been found
  if (
    fullnames.some((matchedFullname) => {
      // If the end of the fullname is possibly missing, check only that the matched fullname starts with the target.
      // This is unlikely to produce a false positive because the fullnames involved are very long (~60 chars)
      if (couldHaveBeenTruncated) {
        return matchedFullname.startsWith(targetFullname);
      }
      // Otherwise, check for exact matches only
      return matchedFullname === targetFullname;
    })
  ) {
    addLink(
      targetBranch.url + targetFullname,
      targetBranch.name,
      targetBranchLang,
      false, // Cannot distinguish original translation
    );
  }
}

/**
 * In the given Wikidot site, searches for pages whose fullnames start with the given string.
 *
 * A 'fullname' is also referred to as a page's 'UNIX name'.
 *
 * @param currentBranchUrl - Url for the current branch.
 * @param siteId - The numeric Wikidot site ID of the site to search.
 * @param fullname - The substring to compare fullnames against. If an underscore "_" is provided, all pages
 * on the site will match.
 */
async function findPagesInSiteStartingWith(currentBranchUrl: string, siteId: string, fullname: string) {
  const url = new URL(`${currentBranchUrl}quickmodule.php`);
  url.searchParams.set("module", "PageLookupQModule");
  url.searchParams.set("s", siteId);
  url.searchParams.set("q", fullname);

  try {
    const request = await fetch(url);
    if (request.ok) {
      const response = parse(wikidotQuickModuleSchema, await request.json());
      return response.pages.map((page) => page.unix_name);
    }
    throw new Error(`Request failed for ${url}`);
  } catch (error) {
    // Parsing failed - assume there are no matching pages
    console.error(`Interwiki: lookup failed for ${siteId}/${fullname}`);
    console.error(error);
    return [];
  }
}
