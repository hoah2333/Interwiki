import { debounce } from "perfect-debounce";

/**
 * Whether the interwiki should be visible. It should only be visible after data has been received from the API source.
 */
export const flags = { showInterwiki: false };

/**
 * Constructs and returns a function that, when called, resizes the current iframes to match its contents. The function
 * is debounced.
 *
 * @param site - The base URL of the site.
 * @param frameId - The last segment of the URL of the interwiki iframe, used by Wikidot to identify it when resizing
 * it.
 */
export function createResizeIframe(site: string, frameId: string) {
  const container = document.getElementById("resizer-container");
  const resizer = document.createElement("iframe");
  resizer.style.display = "none";
  container?.appendChild(resizer);

  if (frameId[0] !== "/") frameId = `/${frameId}`;

  return debounce(() => {
    if (flags.showInterwiki) {
      // Measure from the top of the document to the iframe container to get the document height - this takes into
      // account inner margins, unlike
      // e.g. document.body.clientHeight
      // The container must not have display:none for this to work, which is why the iframe has it instead
      let height = container?.getBoundingClientRect().top;
      // Brute-force past any subpixel issues
      if (height) height += 1;
      resizer.src = `${site}/common--javascript/resize-iframe.html?#${height}${frameId}`;
    }
  }, 750);
}
