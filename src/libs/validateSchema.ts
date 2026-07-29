import { variant, object, literal, string, picklist, optional } from "valibot";
import { branchesInfo } from "./branchesInfo";

import type { InferOutput } from "valibot";

/** Object keys as a non-empty tuple for `picklist`. */
function langKeys<T extends Record<string, unknown>>(branches: T) {
  return Object.keys(branches) as [keyof T & string, ...Array<keyof T & string>];
}

export const interwikiParamsSchema = variant("community", [
  object({
    community: literal("scp"),
    pagename: string(),
    lang: picklist(langKeys(branchesInfo.scp)),
    type: string(),
    preventWikidotBaseStyle: optional(string(), "true"),
  }),
  object({
    community: literal("wl"),
    pagename: string(),
    lang: picklist(langKeys(branchesInfo.wl)),
    type: string(),
    preventWikidotBaseStyle: optional(string(), "true"),
  }),
  object({
    community: literal("br"),
    pagename: string(),
    lang: picklist(langKeys(branchesInfo.br)),
    type: string(),
    preventWikidotBaseStyle: optional(string(), "true"),
  }),
]);

export type InterwikiParams = InferOutput<typeof interwikiParamsSchema>;
