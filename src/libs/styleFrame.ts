import { safeParse } from "valibot";
import { broadcast, onMessage, parseStyleChange } from "./styleChannel";
import { styleRequestInputSchema } from "./validateSchema";

const styleChange = parseStyleChange(location.search);

const style = safeParse(styleRequestInputSchema, styleChange);
if (style.success) {
  broadcast({ kind: "style", style: style.output });
  onMessage((message) => {
    if (message.kind === "ready") {
      broadcast({ kind: "style", style: style.output });
    }
  });
} else {
  console.error("Interwiki: rejected style change. Issue:", style.issues);
}
