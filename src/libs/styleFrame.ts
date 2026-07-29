// Expose identity for interwikiFrame
window.isStyleFrame = true;

// Find interwikiFrames in the parent that have initialised before this styleFrame did, and push the query parameters
// to it
Array.from(parent).forEach((frame) => {
  try {
    if (frame.isInterwikiFrame) {
      frame.requestStyleChange(location.search);
    }
  } catch (error) {
    // If an interwikiFrame in the parent isn't ready to receive a style change request, that's fine - it will pull the
    // style from this styleFrame when it's ready
    if (!(error instanceof DOMException)) {
      // All other errors must be reported
      throw error;
    }
  }
});
