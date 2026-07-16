// ---------------------------------------------------------------------------
// Veriterra.AI — Research Portal Server Function
// ---------------------------------------------------------------------------

import { createServerFn } from "@tanstack/react-start";
import { discoverProducts, AiEngine } from "~/lib/ai-engine";
import type { AiDiscoveredProduct, AiScoringResult } from "~/lib/ai-engine";

/**
 * Get products discovered by the AI engine.
 */
export const getDiscoveredProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const products = await discoverProducts(8);
    return products;
  });

/**
 * Run the AI engine cycle and score all discovered products.
 */
export const runAiEngineCycle = createServerFn({ method: "GET" })
  .handler(async () => {
    const engine = new AiEngine();
    const results = await engine.runCycle();
    return results;
  });

/**
 * Get AI-estimated scores for a specific product.
 */
export const getAiScore = createServerFn({ method: "GET" })
  .validator((productId: string) => {
    if (!/^[a-z0-9_-]+$/.test(productId.trim())) {
      throw new Error("Invalid product ID");
    }
    return productId.trim();
  })
  .handler(async ({ data: productId }) => {
    const products = await discoverProducts(50);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { found: false as const, error: "Product not found" };
    }

    const engine = new AiEngine();
    const result = await engine.scoreProduct(product);

    if (!result) {
      return { found: false as const, error: "Product has lab data — AI scoring not available" };
    }

    return { found: true as const, result };
  });

export type DiscoveredProductsResponse = Awaited<ReturnType<typeof getDiscoveredProducts>>;
export type AiEngineCycleResponse = Awaited<ReturnType<typeof runAiEngineCycle>>;
export type AiScoreResponse = Awaited<ReturnType<typeof getAiScore>>;