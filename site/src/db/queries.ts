// ---------------------------------------------------------------------------
// Veriterra.AI — Database Query Functions
// ---------------------------------------------------------------------------
// Server-side query functions for the website. Import these inside
// createServerFn() handlers or API routes.
//
// All functions use the team-db CLI wrapper from ./db.ts.
// Types are aligned with @veriterra/research-engine's schema.
// ---------------------------------------------------------------------------

import { sql, escape } from "./db";

// ── Types (mirrored from @veriterra/research-engine for standalone use) ────

export interface DbProduct {
  id: string;
  name: string;
  brand_id: string;
  category_id: string;
  barcode: string | null;
  image_url: string | null;
  description: string | null;
  serving_size: string | null;
  servings_per_container: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbBrand {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_category_id: string | null;
  created_at: string;
}

export interface DbIngredient {
  id: string;
  name: string;
  category: string;
  description: string | null;
  typical_dosage_range: string | null;
  safety_rating: string | null;
  evidence_rating: string | null;
  is_top_substance: number;
  top_ranking: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbLabResult {
  id: string;
  product_id: string;
  lab_name: string;
  test_date: string;
  measured_vs_claimed_percent: number;
  report_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface DbEvidenceGrade {
  id: string;
  ingredient_id: string;
  claim: string;
  grade: string;
  summary: string;
  assessed_at: string;
  created_at: string;
}

export interface DbResearchReport {
  id: string;
  target_type: string;
  target_id: string;
  status: string;
  ai_summary: string | null;
  ai_key_findings: string | null;
  ai_estimated_efficacy: number | null;
  ai_research_notes: string | null;
  generated_at: string | null;
  expires_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbAffiliateLink {
  id: string;
  product_id: string;
  url: string;
  platform: string;
  price_snapshot: number | null;
  price_currency: string;
  price_captured_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface DbScoringSnapshot {
  id: string;
  product_id: string;
  snapshot_json: string;
  composite_score: number;
  verdict: string;
  methodology_version: string;
  computed_at: string;
  created_at: string;
}

// ── Product queries ────────────────────────────────────────────────────────

/** Get all products with their brand and category names. */
export function getProducts(options?: { limit?: number; offset?: number; categorySlug?: string }): Array<DbProduct & { brand_name?: string; category_name?: string; category_slug?: string }> {
  let query = `
    SELECT p.*, b.name as brand_name, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN brands b ON p.brand_id = b.id
    JOIN categories c ON p.category_id = c.id
  `;

  const params: string[] = [];

  if (options?.categorySlug) {
    query += ` WHERE c.slug = '${escape(options.categorySlug)}'`;
  }

  query += ` ORDER BY p.created_at DESC`;

  if (options?.limit) {
    query += ` LIMIT ${options.limit}`;
  }
  if (options?.offset) {
    query += ` OFFSET ${options.offset}`;
  }

  return sql(query);
}

/** Get a single product by ID with brand, category, and score. */
export function getProductById(productId: string): (DbProduct & { brand_name?: string; category_name?: string; composite_score?: number; verdict?: string }) | null {
  const rows = sql<DbProduct & { brand_name?: string; category_name?: string; composite_score?: number; verdict?: string }>(
    `SELECT p.*, b.name as brand_name, c.name as category_name,
            ss.composite_score, ss.verdict
     FROM products p
     JOIN brands b ON p.brand_id = b.id
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN scoring_snapshots ss ON ss.product_id = p.id
     WHERE p.id = '${escape(productId)}'
     ORDER BY ss.created_at DESC
     LIMIT 1`,
  );
  return rows.length > 0 ? rows[0] : null;
}

/** Get products by barcode. */
export function getProductByBarcode(barcode: string): (DbProduct & { brand_name?: string; category_name?: string }) | null {
  const rows = sql<DbProduct & { brand_name?: string; category_name?: string }>(
    `SELECT p.*, b.name as brand_name, c.name as category_name
     FROM products p
     JOIN brands b ON p.brand_id = b.id
     JOIN categories c ON p.category_id = c.id
     WHERE p.barcode = '${escape(barcode)}'
     LIMIT 1`,
  );
  return rows.length > 0 ? rows[0] : null;
}

/** Get recently scored products (those with scoring snapshots). */
export function getRecentlyScoredProducts(limit = 4): DbScoringSnapshot[] {
  return sql<DbScoringSnapshot>(
    `SELECT ss.* FROM scoring_snapshots ss
     ORDER BY ss.created_at DESC
     LIMIT ${limit}`,
  );
}

// ── Brand queries ──────────────────────────────────────────────────────────

/** Get all brands. */
export function getBrands(): DbBrand[] {
  return sql<DbBrand>("SELECT * FROM brands ORDER BY name ASC");
}

/** Get a brand by ID. */
export function getBrandById(brandId: string): DbBrand | null {
  const rows = sql<DbBrand>(`SELECT * FROM brands WHERE id = '${escape(brandId)}'`);
  return rows.length > 0 ? rows[0] : null;
}

// ── Category queries ───────────────────────────────────────────────────────

/** Get all categories with product counts. */
export function getCategoriesWithCounts(): Array<DbCategory & { product_count: number }> {
  return sql<DbCategory & { product_count: number }>(
    `SELECT c.*, COUNT(p.id) as product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`,
  );
}

/** Get a category by slug. */
export function getCategoryBySlug(slug: string): DbCategory | null {
  const rows = sql<DbCategory>(
    `SELECT * FROM categories WHERE slug = '${escape(slug)}'`,
  );
  return rows.length > 0 ? rows[0] : null;
}

// ── Ingredient queries ─────────────────────────────────────────────────────

/** Get top substances from the reference library. */
export function getTopIngredients(limit = 12): DbIngredient[] {
  return sql<DbIngredient>(
    `SELECT * FROM ingredients
     WHERE is_top_substance = 1
     ORDER BY top_ranking ASC
     LIMIT ${limit}`,
  );
}

/** Search ingredients by name. */
export function searchIngredients(query: string, limit = 10): DbIngredient[] {
  return sql<DbIngredient>(
    `SELECT * FROM ingredients
     WHERE name LIKE '%${escape(query)}%'
     ORDER BY is_top_substance DESC, top_ranking ASC
     LIMIT ${limit}`,
  );
}

// ── Lab result queries ─────────────────────────────────────────────────────

/** Get lab results for a product. */
export function getLabResultsForProduct(productId: string): DbLabResult[] {
  return sql<DbLabResult>(
    `SELECT * FROM lab_results
     WHERE product_id = '${escape(productId)}'
     ORDER BY test_date DESC`,
  );
}

/** Get contaminant readings for a lab result. */
export function getContaminantReadings(labResultId: string): Array<{ contaminant: string; amount_mcg: number; safety_limit_mcg: number }> {
  return sql(
    `SELECT contaminant, amount_mcg, safety_limit_mcg
     FROM contaminant_readings
     WHERE lab_result_id = '${escape(labResultId)}'`,
  );
}

// ── Evidence queries ───────────────────────────────────────────────────────

/** Get evidence grades for an ingredient. */
export function getEvidenceForIngredient(ingredientId: string): DbEvidenceGrade[] {
  return sql<DbEvidenceGrade>(
    `SELECT * FROM evidence_grades
     WHERE ingredient_id = '${escape(ingredientId)}'
     ORDER BY assessed_at DESC`,
  );
}

// ── Research report queries ────────────────────────────────────────────────

/** Get a research report for a product or ingredient. */
export function getResearchReport(targetType: string, targetId: string): DbResearchReport | null {
  const rows = sql<DbResearchReport>(
    `SELECT * FROM research_reports
     WHERE target_type = '${escape(targetType)}' AND target_id = '${escape(targetId)}'`,
  );
  return rows.length > 0 ? rows[0] : null;
}

/** Get recent research reports. */
export function getRecentReports(limit = 5): DbResearchReport[] {
  return sql<DbResearchReport>(
    `SELECT * FROM research_reports
     WHERE status = 'completed'
     ORDER BY generated_at DESC
     LIMIT ${limit}`,
  );
}

// ── Scoring snapshot queries ───────────────────────────────────────────────

/** Get the latest scoring snapshot for a product. */
export function getLatestScore(productId: string): DbScoringSnapshot | null {
  const rows = sql<DbScoringSnapshot>(
    `SELECT * FROM scoring_snapshots
     WHERE product_id = '${escape(productId)}'
     ORDER BY created_at DESC
     LIMIT 1`,
  );
  return rows.length > 0 ? rows[0] : null;
}

/** Get all scoring snapshots for a product (history). */
export function getScoreHistory(productId: string): DbScoringSnapshot[] {
  return sql<DbScoringSnapshot>(
    `SELECT * FROM scoring_snapshots
     WHERE product_id = '${escape(productId)}'
     ORDER BY created_at DESC`,
  );
}

// ── Affiliate link queries ─────────────────────────────────────────────────

/** Get active affiliate links for a product. */
export function getAffiliateLinks(productId: string): DbAffiliateLink[] {
  return sql<DbAffiliateLink>(
    `SELECT * FROM affiliate_links
     WHERE product_id = '${escape(productId)}' AND is_active = 1
     ORDER BY platform ASC`,
  );
}

// ── Dashboard / stats queries ──────────────────────────────────────────────

/** Get quick stats for the admin dashboard. */
export function getDashboardStats(): { productCount: number; scoreCount: number; ingredientCount: number } {
  const products = sql<{ count: number }>("SELECT COUNT(*) as count FROM products");
  const scores = sql<{ count: number }>("SELECT COUNT(*) as count FROM scoring_snapshots");
  const ingredients = sql<{ count: number }>("SELECT COUNT(*) as count FROM ingredients WHERE is_top_substance = 1");

  return {
    productCount: products[0]?.count ?? 0,
    scoreCount: scores[0]?.count ?? 0,
    ingredientCount: ingredients[0]?.count ?? 0,
  };
}