import OpenAI from "openai";

let _client: OpenAI | null = null;
let _initialized = false;

export function getOpenAIClient(): OpenAI | null {
  if (_initialized) return _client;
  _initialized = true;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    _client = null;
    return null;
  }
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const client = getOpenAIClient();
    if (!client) {
      throw new Error(
        "OPENAI_API_KEY is not configured. Please add it to environment secrets.",
      );
    }
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
