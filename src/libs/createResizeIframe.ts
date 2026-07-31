import { debounce } from "perfect-debounce";

/**
 * Constructs and returns two functions
 * - resize(): resizes the current iframes to match its contents when called. The function is debounced.
 * - show(): controls whether the interwiki should be visible.
 *
 * @param site - The base URL of the site.
 * @param frameId - The last segment of the URL of the interwiki iframe, used by Wikidot to identify it when resizing
 * it.
 */
export function createResizeIframe(site: string, frameId: string) {
  /**
   * Whether the interwiki should be visible. It should only be visible after data has been received from the API
   * source.
   */
  let showInterwiki = false;

  const container = document.querySelector("#resizer-container");
  if (container === null) {
    console.error("Interwiki: resize iframe container not found");
    return { resize: debounce(() => {}, 750), show: () => {} };
  }
  const resizer = document.createElement("iframe");
  resizer.style.display = "none";
  container.append(resizer);

  const newFrameId = frameId.startsWith("/") ? frameId : `/${frameId}`;

  const resize = debounce(() => {
    if (showInterwiki) {
      // Measure from the top of the document to the iframe container to get the document height - this takes into
      // account inner margins, unlike
      // e.g. document.body.clientHeight
      // The container must not have display:none for this to work, which is why the iframe has it instead
      let height = container.getBoundingClientRect().top;
      // Brute-force past any subpixel issues
      if (height > 0) {
        height += 1;
      }
      resizer.src = `${site}/common--javascript/resize-iframe.html?#${height}${newFrameId}`;
    }
  }, 750);

  return {
    resize,
    show: () => {
      showInterwiki = true;
    },
  };
}
