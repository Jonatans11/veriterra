// ---------------------------------------------------------------------------
// Veriterra.AI — Database Schema Definition
// ---------------------------------------------------------------------------
// This module defines the canonical SQLite schema for the Veriterra data model.
// The web engineer can import schema definitions, and the migrate script
// creates the tables via the team-db CLI.
// ---------------------------------------------------------------------------

// ── Schema creation SQL (executed via team-db) ──────────────────────────────
export const CREATE_TABLES_SQL: string[] = [
  // Brands
  `CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  // Categories
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_category_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (parent_category_id) REFERENCES categories(id)
  )`,

  // Products
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    barcode TEXT,
    image_url TEXT,
    description TEXT,
    serving_size TEXT,
    servings_per_container INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)`,
  `CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id)`,
  `CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id)`,

  // Ingredients / Substances (Top 1000 reference library)
  `CREATE TABLE IF NOT EXISTS ingredients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
      'vitamin','mineral','herb','amino-acid','probiotic','enzyme',
      'fatty-acid','hormone','nootropic','adaptogen','antioxidant','other'
    )),
    description TEXT,
    typical_dosage_range TEXT,
    safety_rating TEXT CHECK (safety_rating IN ('safe','caution','avoid','insufficient-data')),
    evidence_rating TEXT CHECK (evidence_rating IN ('strong','moderate','limited','inconclusive','none')),
    is_top_substance INTEGER NOT NULL DEFAULT 0,
    top_ranking INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category)`,
  `CREATE INDEX IF NOT EXISTS idx_ingredients_is_top ON ingredients(is_top_substance)`,

  // Ingredient aliases (one-to-many)
  `CREATE TABLE IF NOT EXISTS ingredient_aliases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingredient_id TEXT NOT NULL,
    alias TEXT NOT NULL,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    UNIQUE(ingredient_id, alias)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ingredient_aliases_alias ON ingredient_aliases(alias)`,

  // Product ↔ Ingredient mapping
  `CREATE TABLE IF NOT EXISTS product_ingredients (
    product_id TEXT NOT NULL,
    ingredient_id TEXT NOT NULL,
    amount_mg REAL,
    percent_daily_value REAL,
    is_proprietary_blend INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, ingredient_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  )`,

  // Lab Results
  `CREATE TABLE IF NOT EXISTS lab_results (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    lab_name TEXT NOT NULL,
    test_date TEXT NOT NULL,
    measured_vs_claimed_percent REAL NOT NULL,
    report_url TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lab_results_product_id ON lab_results(product_id)`,

  // Contaminant readings (one-to-many from lab_results)
  `CREATE TABLE IF NOT EXISTS contaminant_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lab_result_id TEXT NOT NULL,
    contaminant TEXT NOT NULL,
    amount_mcg REAL NOT NULL,
    safety_limit_mcg REAL NOT NULL,
    FOREIGN KEY (lab_result_id) REFERENCES lab_results(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_contaminant_readings_lab_result ON contaminant_readings(lab_result_id)`,

  // Evidence grades
  `CREATE TABLE IF NOT EXISTS evidence_grades (
    id TEXT PRIMARY KEY,
    ingredient_id TEXT NOT NULL,
    claim TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('A','B','C','D')),
    summary TEXT NOT NULL,
    assessed_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_evidence_grades_ingredient ON evidence_grades(ingredient_id)`,

  // Evidence source URLs (one-to-many from evidence_grades)
  `CREATE TABLE IF NOT EXISTS evidence_source_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evidence_grade_id TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (evidence_grade_id) REFERENCES evidence_grades(id)
  )`,

  // Research reports (knowledge base)
  `CREATE TABLE IF NOT EXISTS research_reports (
    id TEXT PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('product','ingredient')),
    target_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in-progress','completed','failed')),
    ai_summary TEXT,
    ai_key_findings TEXT,
    ai_estimated_efficacy REAL CHECK (ai_estimated_efficacy IS NULL OR (ai_estimated_efficacy >= 0 AND ai_estimated_efficacy <= 100)),
    ai_research_notes TEXT,
    generated_at TEXT,
    expires_at TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(target_type, target_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_research_reports_target ON research_reports(target_type, target_id)`,
  `CREATE INDEX IF NOT EXISTS idx_research_reports_status ON research_reports(status)`,

  // Research report source URLs
  `CREATE TABLE IF NOT EXISTS report_source_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id TEXT NOT NULL,
    url TEXT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES research_reports(id)
  )`,

  // AI Estimates (Autonomous AI Engine)
  `CREATE TABLE IF NOT EXISTS ai_estimates (
    id TEXT PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('product','ingredient')),
    target_id TEXT NOT NULL,
    estimated_label_accuracy REAL CHECK (estimated_label_accuracy IS NULL OR (estimated_label_accuracy >= 0 AND estimated_label_accuracy <= 100)),
    estimated_purity_safety REAL CHECK (estimated_purity_safety IS NULL OR (estimated_purity_safety >= 0 AND estimated_purity_safety <= 100)),
    estimated_evidence REAL CHECK (estimated_evidence IS NULL OR (estimated_evidence >= 0 AND estimated_evidence <= 100)),
    estimated_formulation REAL CHECK (estimated_formulation IS NULL OR (estimated_formulation >= 0 AND estimated_formulation <= 100)),
    estimated_value REAL CHECK (estimated_value IS NULL OR (estimated_value >= 0 AND estimated_value <= 100)),
    estimated_composite REAL CHECK (estimated_composite IS NULL OR (estimated_composite >= 0 AND estimated_composite <= 100)),
    confidence_score REAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    model_version TEXT NOT NULL,
    generated_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    UNIQUE(target_type, target_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_ai_estimates_target ON ai_estimates(target_type, target_id)`,

  // Affiliate links
  `CREATE TABLE IF NOT EXISTS affiliate_links (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    url TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('amazon','iherb','other')),
    price_snapshot REAL,
    price_currency TEXT NOT NULL DEFAULT 'USD',
    price_captured_at TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_affiliate_links_product ON affiliate_links(product_id)`,
  `CREATE INDEX IF NOT EXISTS idx_affiliate_links_active ON affiliate_links(is_active)`,

  // Scoring snapshots (immutable)
  `CREATE TABLE IF NOT EXISTS scoring_snapshots (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    snapshot_json TEXT NOT NULL,
    composite_score INTEGER NOT NULL CHECK (composite_score >= 0 AND composite_score <= 100),
    verdict TEXT NOT NULL,
    methodology_version TEXT NOT NULL,
    computed_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_scoring_snapshots_product ON scoring_snapshots(product_id)`,
  `CREATE INDEX IF NOT EXISTS idx_scoring_snapshots_composite ON scoring_snapshots(composite_score)`,
];

// ── Drop tables SQL (for reset/rollback in dev) ────────────────────────────
export const DROP_TABLES_SQL: string[] = [
  "DROP TABLE IF EXISTS scoring_snapshots",
  "DROP TABLE IF EXISTS affiliate_links",
  "DROP TABLE IF EXISTS ai_estimates",
  "DROP TABLE IF EXISTS report_source_urls",
  "DROP TABLE IF EXISTS research_reports",
  "DROP TABLE IF EXISTS evidence_source_urls",
  "DROP TABLE IF EXISTS evidence_grades",
  "DROP TABLE IF EXISTS contaminant_readings",
  "DROP TABLE IF EXISTS lab_results",
  "DROP TABLE IF EXISTS product_ingredients",
  "DROP TABLE IF EXISTS ingredient_aliases",
  "DROP TABLE IF EXISTS ingredients",
  "DROP TABLE IF EXISTS products",
  "DROP TABLE IF EXISTS categories",
  "DROP TABLE IF EXISTS brands",
];

// ── Table definitions metadata (for the web engineer to reference) ─────────
export interface TableDefinition {
  name: string;
  description: string;
  columns: { name: string; type: string; description: string }[];
}

export const TABLE_DEFINITIONS: TableDefinition[] = [
  {
    name: "brands",
    description: "Supplement brand/manufacturer information",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "name", type: "TEXT", description: "Brand name" },
      { name: "website", type: "TEXT", description: "Brand website URL" },
      { name: "description", type: "TEXT", description: "Brand description" },
      { name: "logo_url", type: "TEXT", description: "Brand logo URL" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
      { name: "updated_at", type: "TEXT (ISO 8601)", description: "Last update timestamp" },
    ],
  },
  {
    name: "categories",
    description: "Supplement categories (e.g., multivitamin, protein, probiotic)",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "name", type: "TEXT", description: "Category name" },
      { name: "slug", type: "TEXT", description: "URL-friendly slug" },
      { name: "description", type: "TEXT", description: "Category description" },
      { name: "parent_category_id", type: "TEXT (UUID)", description: "Parent category for hierarchy" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
    ],
  },
  {
    name: "products",
    description: "Dietary supplement products",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "name", type: "TEXT", description: "Product name" },
      { name: "brand_id", type: "TEXT (UUID)", description: "FK to brands" },
      { name: "category_id", type: "TEXT (UUID)", description: "FK to categories" },
      { name: "barcode", type: "TEXT", description: "UPC/EAN/GTIN barcode" },
      { name: "image_url", type: "TEXT", description: "Product image URL" },
      { name: "description", type: "TEXT", description: "Product description" },
      { name: "serving_size", type: "TEXT", description: "Serving size (e.g., '2 capsules')" },
      { name: "servings_per_container", type: "INTEGER", description: "Total servings per container" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
      { name: "updated_at", type: "TEXT (ISO 8601)", description: "Last update timestamp" },
    ],
  },
  {
    name: "ingredients",
    description: "Reference library of substances — the Top 1000 knowledge base",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "name", type: "TEXT", description: "Common name" },
      { name: "category", type: "TEXT (enum)", description: "Ingredient category" },
      { name: "description", type: "TEXT", description: "Detailed description" },
      { name: "typical_dosage_range", type: "TEXT", description: "Typical effective dosage range" },
      { name: "safety_rating", type: "TEXT (enum)", description: "Safety assessment" },
      { name: "evidence_rating", type: "TEXT (enum)", description: "Overall evidence strength" },
      { name: "is_top_substance", type: "INTEGER (bool)", description: "In Top 1000 library" },
      { name: "top_ranking", type: "INTEGER", description: "Rank among top substances" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
      { name: "updated_at", type: "TEXT (ISO 8601)", description: "Last update timestamp" },
    ],
  },
  {
    name: "research_reports",
    description: "Cached AI-generated research reports — first request triggers live research, subsequent requests read cache",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "target_type", type: "TEXT (enum)", description: "'product' or 'ingredient'" },
      { name: "target_id", type: "TEXT (UUID)", description: "FK to products or ingredients" },
      { name: "status", type: "TEXT (enum)", description: "Report generation status" },
      { name: "ai_summary", type: "TEXT", description: "AI-generated summary" },
      { name: "ai_key_findings", type: "TEXT (JSON array)", description: "Key findings as JSON array" },
      { name: "ai_estimated_efficacy", type: "REAL (0-100)", description: "AI-estimated efficacy score" },
      { name: "ai_research_notes", type: "TEXT", description: "AI research notes" },
      { name: "generated_at", type: "TEXT (ISO 8601)", description: "When the report was generated" },
      { name: "expires_at", type: "TEXT (ISO 8601)", description: "Cache expiration" },
      { name: "view_count", type: "INTEGER", description: "Number of views" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
      { name: "updated_at", type: "TEXT (ISO 8601)", description: "Last update timestamp" },
    ],
  },
  {
    name: "ai_estimates",
    description: "AI-estimated scores — always clearly flagged, never overwrite real lab/manual data",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "target_type", type: "TEXT (enum)", description: "'product' or 'ingredient'" },
      { name: "target_id", type: "TEXT (UUID)", description: "FK to products or ingredients" },
      { name: "estimated_*", type: "REAL (0-100)", description: "AI-estimated dimension scores" },
      { name: "confidence_score", type: "REAL (0-100)", description: "AI confidence in its estimate" },
      { name: "model_version", type: "TEXT", description: "AI model version" },
      { name: "generated_at", type: "TEXT (ISO 8601)", description: "Generation timestamp" },
      { name: "expires_at", type: "TEXT (ISO 8601)", description: "When the estimate expires" },
    ],
  },
  {
    name: "affiliate_links",
    description: "Affiliate purchase links with transparent pricing snapshots",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Primary key" },
      { name: "product_id", type: "TEXT (UUID)", description: "FK to products" },
      { name: "url", type: "TEXT", description: "Affiliate URL" },
      { name: "platform", type: "TEXT (enum)", description: "Platform (amazon, iherb, other)" },
      { name: "price_snapshot", type: "REAL", description: "Price at time of capture" },
      { name: "price_currency", type: "TEXT", description: "Currency code (USD)" },
      { name: "price_captured_at", type: "TEXT (ISO 8601)", description: "When price was captured" },
      { name: "is_active", type: "INTEGER (bool)", description: "Whether link is active" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "Creation timestamp" },
      { name: "updated_at", type: "TEXT (ISO 8601)", description: "Last update timestamp" },
    ],
  },
  {
    name: "scoring_snapshots",
    description: "Immutable scoring snapshots — the source of truth for published scores",
    columns: [
      { name: "id", type: "TEXT (UUID)", description: "Snapshot ID (PK)" },
      { name: "product_id", type: "TEXT (UUID)", description: "FK to products" },
      { name: "snapshot_json", type: "TEXT (JSON)", description: "Full ScoringSnapshot JSON" },
      { name: "composite_score", type: "INTEGER (0-100)", description: "Composite score (denormalized for fast queries)" },
      { name: "verdict", type: "TEXT", description: "Plain-language verdict" },
      { name: "methodology_version", type: "TEXT", description: "Scoring methodology version" },
      { name: "computed_at", type: "TEXT (ISO 8601)", description: "When the score was computed" },
      { name: "created_at", type: "TEXT (ISO 8601)", description: "DB insertion timestamp" },
    ],
  },
];