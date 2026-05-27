import Anthropic from "@anthropic-ai/sdk";
import type { SearchInterpretation } from "./types";

const MODEL = "claude-sonnet-4-6";

const QUERY_PROPERTIES_TOOL = {
  name: "query_properties",
  description:
    "Search the active org's CRE properties by structured filters. Use when the user is asking about buildings, assets, properties, or anything tied to physical real estate.",
  input_schema: {
    type: "object" as const,
    properties: {
      asset_class: {
        type: "string",
        enum: [
          "office",
          "retail",
          "industrial",
          "multifamily",
          "hospitality",
          "mixed_use",
        ],
      },
      state: { type: "string", description: "2-letter US state code" },
      city: { type: "string" },
      min_cap_rate: { type: "number" },
      max_cap_rate: { type: "number" },
      min_price_usd: { type: "number" },
      max_price_usd: { type: "number" },
      keyword: { type: "string" },
      limit: { type: "integer", maximum: 100 },
    },
    required: [],
  },
};

const QUERY_DEALS_TOOL = {
  name: "query_deals",
  description:
    "Search the active org's deals by structured filters. Use when the user is asking about pipeline, deals, LOIs, diligence, closings, or anything transactional.",
  input_schema: {
    type: "object" as const,
    properties: {
      stage: {
        type: "string",
        enum: [
          "sourcing",
          "loi",
          "diligence",
          "closing",
          "closed_won",
          "closed_lost",
        ],
      },
      min_amount_usd: { type: "number" },
      max_amount_usd: { type: "number" },
      min_probability: { type: "number" },
      max_probability: { type: "number" },
      owner_name: { type: "string" },
      closing_within_days: { type: "integer" },
      closed_within_days: { type: "integer" },
      keyword: { type: "string" },
      limit: { type: "integer", maximum: 100 },
    },
    required: [],
  },
};

const SYSTEM_PROMPT = `You are the AI search agent for DealPipe, a commercial real estate (CRE) deal pipeline platform.

The user asks natural-language questions about their org's properties or deals. Choose the right tool (query_properties or query_deals) and translate the question into structured filters.

Rules:
- Prices are in USD. "$10M" = 10000000. "$1.5K" = 1500.
- Cap rates are percent values (e.g. 7.5, not 0.075).
- "Closed deals" means stage closed_won or closed_lost. "Recently" usually implies the last 60-90 days — use closed_within_days.
- "Closing soon" means upcoming expected_close — use closing_within_days.
- States: use the 2-letter US code (Texas → TX, California → CA).
- If the user is ambiguous between properties and deals, prefer properties.
- Always call exactly one tool, never both.`;

export async function callClaudeSearch(
  query: string,
): Promise<SearchInterpretation> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [QUERY_PROPERTIES_TOOL, QUERY_DEALS_TOOL],
    tool_choice: { type: "any" },
    messages: [{ role: "user", content: query }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a tool call");
  }

  const input = toolUse.input as Record<string, unknown>;
  if (toolUse.name === "query_properties") {
    return {
      kind: "properties",
      filter: input as SearchInterpretation["filter"],
      explanation: "Parsed by Claude tool-use.",
    } as SearchInterpretation;
  }
  if (toolUse.name === "query_deals") {
    return {
      kind: "deals",
      filter: input as SearchInterpretation["filter"],
      explanation: "Parsed by Claude tool-use.",
    } as SearchInterpretation;
  }
  throw new Error(`Unknown tool from Claude: ${toolUse.name}`);
}
