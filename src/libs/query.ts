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
