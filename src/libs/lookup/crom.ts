import { parse } from "valibot";
import { cromRequestSchema, cromTranslationsWithPageSchema } from "../validateSchema";

import type { AddLinkCallback, Branch } from "../links";
import type { CromTranslations } from "../validateSchema";

/**
 * A helper function to create a GraphQL like query string from a template string and substitutions.
 * This is used for formatting friendly.
 * @param query
 * @param substitutions
 * @returns
 */
const gql = (query: TemplateStringsArray, ...substitutions: Array<string>): string =>
  String.raw(query, ...substitutions);

// GraphQL query for Crom API
const query = gql`
  query InterwikiQuery($url: URL!) {
    page(url: $url) {
      translations {
        url
      }
      translationOf {
        url
        translations {
          url
        }
      }
    }
  }
`;

// GraphQL endpoints for Crom API fallback
// Generally used for proxying
const apiList = ["https://apiv1.crom.avn.sh/graphql", "https://zh.xjo.ch/crom/graphql"];

/**
 * Searches for pages whose fullname matches the given string in the given set of Wikidot sites using Crom query.
 *
 * @param currentBranch - Configuration for the current branch.
 * @param branches - The branches configuration for the current community. All passed branches will be searched for the
 * target page.
 * @param fullname - The fullname of the target page.
 * @param addLink - A function that will be called for each found translation.
 */
export async function cromLookup(
  currentBranch: Branch,
  branches: Record<string, Branch>,
  fullname: string,
  addLink: AddLinkCallback,
) {
  const page = await executeQuery(normaliseUrl(currentBranch.url + fullname), 0);
  if (page === null) {
    return;
  }

  parseTranslations(page, currentBranch, branches, addLink);
}

/**
 * Normalises a branch URL to one accepted by Crom.
 */
function normaliseUrl(url: string) {
  if (!url.includes(".wikidot.com")) {
    throw new Error(`Crom requires wikidot.com branch URLs (${url})`);
  }
  return url.replace(/^https:/, "http:");
}

/**
 * Parses the response from the Crom API into a list of translations.
 *
 * @param response - The response from the Crom API.
 * @param currentBranch - Configuration for the current branch.
 * @param branches - The branches configuration for the current community. All passed branches will be searched for the
 * target page.
 * @param addLink - A function that will be called for each found translation.
 */
function parseTranslations(
  response: CromTranslations,
  currentBranch: Branch,
  branches: Record<string, Branch>,
  addLink: AddLinkCallback,
) {
  const original = response.translationOf?.url ?? null;
  const translations: Array<string> = [
    // Extract translations of this page
    ...response.translations.map((page) => page.url),
    // Extract translations of this page's translation root
    ...(response.translationOf === null
      ? []
      : [response.translationOf.url, ...response.translationOf.translations.map((page) => page.url)]),
  ];

  translations.forEach((translation) => {
    // Do not add this translation if it is from the current branch
    const fromCurrentBranch = translation.startsWith(normaliseUrl(currentBranch.url));
    if (fromCurrentBranch) {
      return;
    }

    const targetBranchLang = Object.keys(branches).find((branchLang) =>
      translation.startsWith(normaliseUrl(branches[branchLang].url)),
    );
    if (targetBranchLang === undefined) {
      // Crom may support unofficial/unconfigured branches
      console.warn(`Interwiki: unknown branch ${translation}`);
      return;
    }

    addLink(translation, branches[targetBranchLang].name, targetBranchLang, original === translation);
  });
}

/**
 * Queries the Crom API for translations of the given page.
 *
 * @param url - The HTTP Wikidot URL of the page for which to look up translations.
 * @param endpointIndex - Retry index for Crom endpoints.
 * @param callback - Will be called with the response from Crom.
 */
async function executeQuery(url: string, endpointIndex: number) {
  try {
    const request = await fetch(apiList[endpointIndex], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { url } }),
    });
    if (request.ok) {
      const response = parse(cromRequestSchema(cromTranslationsWithPageSchema), await request.json());
      if (response.data === null) {
        throw new Error(
          response.errors.length > 0 ? response.errors.map((error) => error.message).join(", ") : "No specific error",
        );
      }
      return response.data.page;
    }
    throw new Error(String(request.status));
  } catch (error) {
    if (endpointIndex + 1 < apiList.length) {
      return executeQuery(url, endpointIndex + 1);
    }
    console.error(`Interwiki: lookup failed for ${url}`);
    console.error(error);
    return null;
  }
}
