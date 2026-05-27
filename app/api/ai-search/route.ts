import { NextResponse } from "next/server";
import { listDeals, listOrgMembers, listProperties } from "@/lib/data";
import { callClaudeSearch } from "@/lib/ai-search/claude";
import { parseFallback } from "@/lib/ai-search/fallback";
import { filterDeals, filterProperties } from "@/lib/ai-search/filter";
import {
  summariseDealResults,
  summarisePropertyResults,
} from "@/lib/ai-search/summary";
import type { SearchResponse } from "@/lib/ai-search/types";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse<SearchResponse>> {
  let body: { query?: string; orgId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body must be JSON: { query, orgId }" },
      { status: 400 },
    );
  }
  const query = body.query?.trim();
  const orgId = body.orgId;
  if (!query || !orgId) {
    return NextResponse.json(
      { ok: false, error: "Missing `query` or `orgId`" },
      { status: 400 },
    );
  }

  let interpretation;
  let backend: "claude" | "fallback" = "fallback";

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      interpretation = await callClaudeSearch(query);
      backend = "claude";
    } else {
      interpretation = parseFallback(query);
    }
  } catch (err) {
    // Claude error — fall back to the keyword parser so the demo still answers.
    console.error("[ai-search] Claude failed, falling back:", err);
    interpretation = parseFallback(query);
    backend = "fallback";
  }

  if (interpretation.kind === "properties") {
    const properties = await listProperties({ orgId });
    const results = filterProperties(properties, interpretation.filter);
    return NextResponse.json({
      ok: true,
      type: "properties",
      results,
      summary: summarisePropertyResults(interpretation.filter, results),
      interpretation,
      backend,
    });
  }

  const [deals, members] = await Promise.all([
    listDeals({ orgId }),
    listOrgMembers({ orgId }),
  ]);
  const memberMap = new Map(members.map((m) => [m.id, { name: m.name }]));
  const results = filterDeals(deals, interpretation.filter, memberMap);
  return NextResponse.json({
    ok: true,
    type: "deals",
    results,
    summary: summariseDealResults(interpretation.filter, results),
    interpretation,
    backend,
  });
}
