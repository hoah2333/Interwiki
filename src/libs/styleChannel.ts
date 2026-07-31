import { safeParse } from "valibot";
import { getQueryString } from "./query";
import { styleRequestSchema } from "./validateSchema";

import type { StyleRequest, StyleRequestInput } from "./validateSchema";

export function broadcast(message: StyleRequest) {
  const frames = Array.from({ length: parent.length }, (_, i) => parent[i]);
  // Find interwikiFrames in the parent that have initialised before this frame did, and post message to it.
  frames.forEach((frame) => {
    try {
      if (frame.location.origin === location.origin && frame !== self) {
        frame.postMessage(message, frame.location.origin);
      }
    } catch (error) {
      // If an interwikiFrame in the parent isn't ready to receive a style change request, skip it. We will handle that
      // later on.
      if (!(error instanceof DOMException)) {
        // All other errors must be reported
        throw error;
      }
    }
  });
}

export function onMessage(handler: (message: StyleRequest) => void) {
  addEventListener("message", (event) => {
    if (event.origin === location.origin) {
      const result = safeParse(styleRequestSchema, event.data);
      if (result.success) {
        handler(result.output);
      }
    }
  });
}

export function parseStyleChange(request: string): StyleRequestInput {
  const styleType = getQueryString(request, "type") ?? "default";
  const priorityRaw = getQueryString(request, "priority");
  const priority = Number(priorityRaw);
  const overrideRaw = getQueryString(request, "override") ?? "0";
  const override = Boolean(Number(overrideRaw));
  const theme = getQueryString(request, "theme");
  const css = getQueryString(request, "css");
  return { type: styleType, priority, override, theme, css };
}
