import { ResizeObserver } from "@juggle/resize-observer";
import { safeParse } from "valibot";
import { branchesInfo } from "./branchesInfo";
import { createResizeIframe } from "./createResizeIframe";
import { addTranslations } from "./links";
import { addExternalStyle, createRequestStyleChange } from "./styles";
import { interwikiParamsSchema } from "./validateSchema";

import type { InterwikiParams } from "./validateSchema";

addEventListener("DOMContentLoaded", () => {
  const community = getQueryString(location.search, "community");
  const pagename = getQueryString(location.search, "pagename");
  const lang = getQueryString(location.search, "lang");
  const type = getQueryString(location.search, "type");
  const preventWikidotBaseStyle = getQueryString(location.search, "preventWikidotBaseStyle") ?? "true";

  const result = safeParse(interwikiParamsSchema, { community, pagename, lang, type, preventWikidotBaseStyle });

  if (!result.success) {
    console.error("Invalid interwiki params:", result.issues);
    return;
  }

  createInterwiki(result.output);

  // Expose identity for styleFrame
  window.isInterwikiFrame = true;
});

/**
 * Retrieves the value of the query parameter in the URL with the given key, if provided, otherwise returns the empty
 * string.
 *
 * @param query - The URL query.
 * @param name - The name of the parameter to get.
 */
export function getQueryString(query: string, name: string) {
  const searchParams = new URLSearchParams(query);
  const values = searchParams.getAll(name);
  return values.length > 0 ? values.at(-1) : "";
}

/**
 * Finds styleFrames embedded in the parent page and pulls their style change requests for the interwikiFrame to use.
 *
 * styleFrames will also attempt to push their styles to the interwikiFrame. The two methods work in unison to ensure
 * that the interwikiFrame receives all styles regardless of what order the iframesinitialise in.
 *
 * This function is also called on window reload prompted by the interwiki's click-to-refresh, at which point it is
 * very likely that all styleFrames will have finished initialising.
 */
function pullStyles() {
  // Find styleFrames in the parent that have initialised before this interwikiFrame did, and pull their query
  // parameters
  Array.from(parent).forEach((frame) => {
    try {
      if (frame.isStyleFrame) {
        window.requestStyleChange(frame.location.search);
      }
    } catch (error: unknown) {
      // styleFrames that have not finished initialising will push their styles to the interwikiFrame when they are
      // ready
      if (!(error instanceof DOMException)) {
        // All other errors must be reported
        throw error;
      }
    }
  });
}

/**
 * Main procedure for the interwiki. Prepare contextual data, apply CSS styling, and add links to translations.
 *
 * @param community - The community of the interwiki.
 * @param pagename - The Wikidot fullname of the current page.
 * @param currentBranchLang - The language code of the current branch of the given community.
 * @param type - The type of the interwiki, for potentially different styles of interwiki in the same page.
 * @param preventWikidotBaseStyle - Whether to prevent the addition of Wikidot's base style to the interwiki. If any
 * value other than the string "true", the style will be added with priority -1.
 */
export function createInterwiki(params: InterwikiParams) {
  const { community, pagename, lang: currentBranchLang, type, preventWikidotBaseStyle } = params;

  const sanitizedPagename = pagename
    .replace(/^_default:/, "")
    .replaceAll(/[^\w\-:]+/g, "-")
    .toLowerCase()
    .replace(/^_/, "#")
    .replaceAll("_", "-")
    .replace(/#/, "_")
    .replaceAll(/^-+|-+$/g, "");

  // Reverse replace the desolation canon URL
  // const desolations = ["desolation-backrooms-guide"];

  // for (var i = 0; i < desolations.length; i++) {
  //   if (pagename != desolations[i]) {
  //     pagename = pagename.replace(/^desolation-/, "desolation:");
  //   }
  // }

  // Get the list of branches for the given community
  const branches = branchesInfo[community];

  // Get the config for the current branch (lang already validated for this community)
  const currentBranch = branches[currentBranchLang as keyof typeof branches];

  // Construct the function that will resize the frame after changes
  const site = document.referrer;
  const frameId = location.href.replace(/^.*\//, "/");
  const resize = createResizeIframe(site, frameId);

  // Resize frame when size changes are detected
  const observer = new ResizeObserver(resize);
  observer.observe(document.documentElement);

  // Construct the function that will be called internally and by styleFrames to request style changes
  window.requestStyleChange = createRequestStyleChange(currentBranch.url ?? "", type || "default");

  // Add Wikidot's base style unless instructed otherwise
  if (preventWikidotBaseStyle !== "true") {
    addExternalStyle(-1, "//d3g0gp89917ko0.cloudfront.net/v--3e3a6f7dbcc9/common--theme/base/css/style.css", false);
  }

  pullStyles();
  addTranslations(branches, currentBranchLang, sanitizedPagename);
}
