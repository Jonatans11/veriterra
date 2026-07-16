// ---------------------------------------------------------------------------
// Veriterra.AI — Product Discoverer
// ---------------------------------------------------------------------------
// Discovers new products from the database that haven't been scored yet,
// or that only have AI-estimated scores (no lab data).
// ---------------------------------------------------------------------------

import type { AiDiscoveredProduct } from "./types.js";

/**
 * Discover products that need AI scoring.
 *
 * Checks the database for products that:
 * 1. Have no scoring snapshot at all
 * 2. Only have AI-estimated scores (no lab data exists)
 *
 * Returns a list of products ready for AI estimation.
 */
export async function discoverProducts(
  maxCount: number = 10,
): Promise<AiDiscoveredProduct[]> {
  // In this initial implementation, we return a curated list of
  // common supplement products that would be discovered by the AI.
  // In production, this would query the database and web search APIs.
  const products: AiDiscoveredProduct[] = [
    {
      id: "magnesium-glycinate",
      name: "Magnesium Glycinate 200mg",
      brand: "Natural Vitality",
      category: "vitamins-minerals",
      description: "Highly absorbable magnesium bisglycinate for muscle relaxation, sleep support, and stress management. Chelated form for superior bioavailability.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "probiotic-50b",
      name: "Probiotic 50 Billion CFU",
      brand: "Garden of Life",
      category: "probiotics",
      description: "High-potency probiotic with 50 billion CFU and 16 diverse strains for comprehensive digestive and immune support. Shelf-stable, no refrigeration needed.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "ashwagandha-600mg",
      name: "Ashwagandha Root Extract 600mg",
      brand: "Organic India",
      category: "herbal",
      description: "Organic ashwagandha root extract standardized to 5% withanolides for stress reduction, cortisol balance, and adrenal support. Certified organic and non-GMO.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "whey-protein-isolate",
      name: "Whey Protein Isolate 25g",
      brand: "Optimum Nutrition",
      category: "protein-amino-acids",
      description: "Premium whey protein isolate with 25g protein per serving, 0g sugar, and 110 calories. Instantized for easy mixing. Third-party tested for quality.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "coq10-100mg",
      name: "CoQ10 100mg Ubiquinone",
      brand: "Doctor's Best",
      category: "vitamins-minerals",
      description: "High-potency Coenzyme Q10 for cardiovascular health and cellular energy production. Bioavailable form with added black pepper extract for enhanced absorption.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "melatonin-5mg",
      name: "Melatonin 5mg Rapid Release",
      brand: "Natrol",
      category: "sleep-mood",
      description: "Fast-dissolving melatonin tablets for occasional sleeplessness and jet lag support. Drug-free, non-habit forming. Strawberry flavored.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "curcumin-biopiperine",
      name: "Curcumin 500mg with Bioperine",
      brand: "NOW Foods",
      category: "herbal",
      description: "Standardized curcumin extract from turmeric root with Bioperine black pepper extract for enhanced absorption. Supports joint health and antioxidant activity.",
      discoveredAt: new Date().toISOString(),
    },
    {
      id: "collagen-peptides",
      name: "Hydrolyzed Collagen Peptides Type I & III",
      brand: "Vital Proteins",
      category: "joint-bone",
      description: "Grass-fed, pasture-raised hydrolyzed collagen peptides for skin, hair, nails, bones, and joints. Unflavored, dissolves easily in hot or cold liquids.",
      discoveredAt: new Date().toISOString(),
    },
  ];

  return products.slice(0, maxCount);
}

/**
 * Check if a product has lab data in the database.
 * In production, this queries the DB. Currently returns false (no lab data).
 */
export async function hasLabData(productId: string): Promise<boolean> {
  // In production, query: SELECT COUNT(*) FROM lab_results WHERE product_id = ?
  // For now, all discovered products start without lab data
  return false;
}

/**
 * Check if a product already has a scoring snapshot.
 * In production, this queries the DB.
 */
export async function hasExistingScore(productId: string): Promise<boolean> {
  // In production, query: SELECT COUNT(*) FROM scoring_snapshots WHERE product_id = ?
  return false;
}