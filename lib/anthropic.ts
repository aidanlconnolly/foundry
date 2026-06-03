import Anthropic from "@anthropic-ai/sdk";

/** Single shared client, lazily reading ANTHROPIC_API_KEY at first use. */
let _client: Anthropic | undefined;
export function anthropic(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to .env.local (see .env.local.example).",
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

/** Reasoning / chat / web-search model. */
export const MODEL_SMART = "claude-sonnet-4-6";
/** Cheap model for short structured tasks. */
export const MODEL_CHEAP = "claude-haiku-4-5";

/** Strip ```json fences and surrounding prose, returning the JSON substring. */
export function extractJson(text: string): string {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // Fall back to the outermost { } or [ ].
  const firstObj = t.indexOf("{");
  const firstArr = t.indexOf("[");
  const start =
    firstArr === -1
      ? firstObj
      : firstObj === -1
        ? firstArr
        : Math.min(firstObj, firstArr);
  if (start > 0) {
    const lastObj = t.lastIndexOf("}");
    const lastArr = t.lastIndexOf("]");
    const end = Math.max(lastObj, lastArr);
    if (end > start) t = t.slice(start, end + 1);
  }
  return t;
}

/** Web-search server tool (executed by Anthropic) for landscape/case refresh. */
export const WEB_SEARCH_TOOL = {
  type: "web_search_20250305" as const,
  name: "web_search" as const,
  max_uses: 6,
};
