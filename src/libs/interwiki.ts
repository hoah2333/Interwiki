import { match } from "ts-pattern";
import { safeParse } from "valibot";
import { branchesInfo } from "./branchesInfo";
import { createResizeIframe } from "./createResizeIframe";
import { addTranslations } from "./links";
import { getQueryString } from "./query";
import { broadcast, onMessage } from "./styleChannel";
import { addExternalStyle, handleStyleChange } from "./styles";
import { interwikiParamsSchema } from "./validateSchema";

import type { InterwikiParams } from "./validateSchema";

await initInterwiki();

async function initInterwiki() {
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

  await createInterwiki(result.output);
}

function sanitizePagename(pagename: string) {
  const sanitized = pagename
    .replace(/^_default:/, "")
    .replaceAll(/[^\w\-:]+/g, "-")
    .toLowerCase()
    .replace(/^_/, "#")
    .replaceAll("_", "-")
    .replace(/#/, "_")
    .replaceAll(/^-+|-+$/g, "");

  // Reverse replace the desolation canon URL
  const desolationsExpection = ["desolation-backrooms-guide"];
  if (desolationsExpection.includes(sanitized)) {
    return sanitized;
  }
  return sanitized.replace(/^desolation-/, "desolation:");
}

/**
 * Main procedure for the interwiki. Prepare contextual data, apply CSS styling, and add links to translations.
 *
 * @param params - Validated interwiki query parameters.
 */
export async function createInterwiki(params: InterwikiParams) {
  const { pagename, type, preventWikidotBaseStyle } = params;

  const sanitizedPagename = sanitizePagename(pagename);

  const { branches, currentBranch, currentBranchLang } = match(params)
    .with({ community: "scp" }, (p) => ({
      branches: branchesInfo.scp,
      currentBranch: branchesInfo.scp[p.lang],
      currentBranchLang: p.lang,
    }))
    .with({ community: "wl" }, (p) => ({
      branches: branchesInfo.wl,
      currentBranch: branchesInfo.wl[p.lang],
      currentBranchLang: p.lang,
    }))
    .with({ community: "br" }, (p) => ({
      branches: branchesInfo.br,
      currentBranch: branchesInfo.br[p.lang],
      currentBranchLang: p.lang,
    }))
    .exhaustive();

  // Construct the function that will resize the frame after changes
  const site = document.referrer;
  const frameId = location.href.replace(/^.*\//, "/");
  const { resize, show } = createResizeIframe(site, frameId);

  // Resize frame when size changes are detected
  const observer = new ResizeObserver(() => {
    void resize();
  });
  observer.observe(document.documentElement);

  onMessage((message) => {
    if (message.kind === "style") {
      handleStyleChange(currentBranch.url ?? "", type || "default", message.style);
    }
  });

  // Add Wikidot's base style unless instructed otherwise
  if (preventWikidotBaseStyle !== "true") {
    addExternalStyle(-1, "//d3g0gp89917ko0.cloudfront.net/v--3e3a6f7dbcc9/common--theme/base/css/style.css", false);
  }

  broadcast({ kind: "ready" });
  await addTranslations(branches, currentBranchLang, sanitizedPagename, show);
}
