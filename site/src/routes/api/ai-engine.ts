// ---------------------------------------------------------------------------
// Veriterra.AI — AI Engine API Route
// ---------------------------------------------------------------------------
// REST endpoint to trigger the AI engine and view results.
// Accessible at /api/ai-engine
// ---------------------------------------------------------------------------

import { createAPIFileRoute } from "@tanstack/react-start";
import { AiEngine } from "~/lib/ai-engine";

export const APIRoute = createAPIFileRoute("/api/ai-engine")({
  GET: async () => {
    const engine = new AiEngine();
    const results = await engine.runCycle();

    return new Response(
      JSON.stringify({
        ok: true,
        cycleRun: new Date().toISOString(),
        productsScored: results.length,
        results: results.map((r) => ({
          productId: r.productId,
          productName: r.productName,
          brand: r.brand,
          compositeScore: r.compositeScore,
          verdict: r.verdict,
          dimensions: r.dimensions,
          hasLabData: r.hasLabData,
          scoredAt: r.scoredAt,
          dataSource: "ai-estimate",
        })),
        methodologyVersion: "1.0.0",
        note: "AI-estimated scores are clearly flagged and can never overwrite lab data.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },
});