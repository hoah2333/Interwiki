import {
  any,
  array,
  boolean,
  literal,
  null_,
  nullable,
  number,
  object,
  optional,
  picklist,
  string,
  union,
  variant,
} from "valibot";
import { branchesInfo } from "./branchesInfo";

import type { InferOutput, ObjectEntries, ObjectSchema } from "valibot";

/** Object keys as a non-empty tuple for `picklist`. */
function langKeys<T extends Record<string, unknown>>(branches: T) {
  const keys = Object.keys(branches).filter((key): key is keyof T & string => Object.hasOwn(branches, key));
  const [first, ...rest] = keys;
  if (first === undefined) {
    throw new Error("Expected at least one language key");
  }
  return [first, ...rest];
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

const cromPageSchema = object({ url: string() });
const cromOriginalPageSchema = object({ url: string(), translations: array(cromPageSchema) });
const cromTranslationsSchema = object({
  translations: array(cromPageSchema),
  translationOf: nullable(cromOriginalPageSchema),
});
export const cromTranslationsWithPageSchema = object({ page: cromTranslationsSchema });
export const cromRequestSchema = <T extends ObjectEntries>(objectSchema: ObjectSchema<T, undefined>) =>
  union([
    object({ data: null_(), errors: array(object({ message: string(), locations: any() })) }),
    object({ data: objectSchema }),
  ]);

export const wikidotQuickModuleSchema = object({ pages: array(object({ unix_name: string(), title: string() })) });

export const styleRequestInputSchema = object({
  type: string(),
  priority: number(),
  override: optional(boolean(), false),
  theme: optional(string()),
  css: optional(string()),
});
export const styleRequestSchema = union([
  object({ kind: literal("ready") }),
  object({ kind: literal("style"), style: styleRequestInputSchema }),
]);

export type StyleRequestInput = InferOutput<typeof styleRequestInputSchema>;
export type StyleRequest = InferOutput<typeof styleRequestSchema>;
