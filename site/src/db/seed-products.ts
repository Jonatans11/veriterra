// ---------------------------------------------------------------------------
// Veriterra.AI — Seed Sample Products Script
// ---------------------------------------------------------------------------
// Populates the database with sample products, brands, categories,
// and scoring data. This gives the catalog page real data to display.
//
// Run: node scripts/seed-products.mjs
// ---------------------------------------------------------------------------

import { execSync } from "child_process";
import crypto from "crypto";

function db(sql) {
  const escaped = sql.replace(/'/g, "'\\''");
  const output = execSync(`team-db '${escaped}'`, {
    encoding: "utf-8",
    timeout: 15000,
  });
  return JSON.parse(output.trim() || "[]");
}

function uuid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString().replace("T", " ").replace("Z", "");
}

console.log("🌱 Seeding sample products...");

// ── Brands ─────────────────────────────────────────────────────────────────
const brands = [
  { id: uuid(), name: "NatureVita", website: "https://naturevita.example.com", description: "Premium plant-based supplements backed by clinical research." },
  { id: uuid(), name: "PureNutrients", website: "https://purenutrients.example.com", description: "Third-party tested vitamins and minerals for daily wellness." },
  { id: uuid(), name: "OmegaCore", website: "https://omegacore.example.com", description: "Specialists in omega-3 fatty acids and cardiovascular health." },
  { id: uuid(), name: "BioStrength", website: "https://biostrength.example.com", description: "Science-driven sports nutrition for peak performance." },
  { id: uuid(), name: "ZenHerbs", website: "https://zenherbs.example.com", description: "Traditional herbal remedies meeting modern quality standards." },
];

for (const b of brands) {
  db(`INSERT OR IGNORE INTO brands (id, name, website, description, created_at, updated_at)
      VALUES ('${b.id}', '${b.name.replace(/'/g, "''")}', '${b.website}', '${b.description.replace(/'/g, "''")}', datetime('now'), datetime('now'))`);
}
console.log(`   ✅ ${brands.length} brands`);

// ── Categories ─────────────────────────────────────────────────────────────
const categories = [
  { id: uuid(), name: "Vitamins & Minerals", slug: "vitamins-minerals", description: "Essential vitamins and mineral supplements for daily health." },
  { id: uuid(), name: "Protein & Amino Acids", slug: "protein-amino-acids", description: "Protein powders, BCAAs, and amino acid supplements." },
  { id: uuid(), name: "Omega-3s & Fatty Acids", slug: "omega-3s", description: "Fish oil, flaxseed oil, and essential fatty acids." },
  { id: uuid(), name: "Herbal & Botanicals", slug: "herbal", description: "Herbal extracts and botanical supplements." },
  { id: uuid(), name: "Sports Nutrition", slug: "sports-nutrition", description: "Pre-workout, post-workout, and performance supplements." },
  { id: uuid(), name: "Sleep & Mood", slug: "sleep-mood", description: "Supplements for restful sleep and balanced mood." },
];

for (const c of categories) {
  db(`INSERT OR IGNORE INTO categories (id, name, slug, description, created_at)
      VALUES ('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.slug}', '${c.description.replace(/'/g, "''")}', datetime('now'))`);
}
console.log(`   ✅ ${categories.length} categories`);

// ── Products ───────────────────────────────────────────────────────────────
const products = [
  {
    id: uuid(),
    name: "Vitamin D3 + K2 Complex",
    brand_idx: 0,
    category_idx: 0,
    barcode: "8500123456789",
    description: "High-potency vitamin D3 (5000 IU) with K2 (Menaquinone-7) for optimal calcium utilization and bone health. Third-party tested for purity and potency.",
    serving_size: "1 capsule",
    servings_per_container: 120,
    ingredients: [{ name: "Vitamin D3 (Cholecalciferol)", rank: 2 }, { name: "Vitamin K2 (Menaquinone)", rank: 7 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 98, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports bone health", grade: "A" }, { claim: "Improves calcium absorption", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.95, bioavailabilityScore: 0.9, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.25, categoryBenchmarkCost: 0.35, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Magnesium Glycinate 400mg",
    brand_idx: 1,
    category_idx: 0,
    barcode: "8500123456796",
    description: "Highly bioavailable magnesium glycinate for stress relief, sleep quality, and muscle recovery. Chelated form for superior absorption.",
    serving_size: "2 capsules",
    servings_per_container: 60,
    ingredients: [{ name: "Magnesium (Citrate/Glycinate)", rank: 8 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 101, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports sleep quality", grade: "A" }, { claim: "Reduces muscle tension", grade: "B" }], source: "manual" },
      formulation: { doseAdequacyScore: 1.0, bioavailabilityScore: 0.95, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.30, categoryBenchmarkCost: 0.35, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Omega-3 Fish Oil Triple Strength",
    brand_idx: 2,
    category_idx: 2,
    barcode: "8500123456802",
    description: "Concentrated omega-3 fish oil providing 1500mg EPA and 500mg DHA per serving. Molecularly distilled for purity. Enteric-coated for no fish burps.",
    serving_size: "2 softgels",
    servings_per_container: 60,
    ingredients: [{ name: "Omega-3 EPA/DHA (Fish Oil)", rank: 19 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 97, source: "lab" },
      puritySafety: { contaminants: [{ contaminant: "Mercury", amountMcg: 0.02, safetyLimitMcg: 0.5 }], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports cardiovascular health", grade: "A" }, { claim: "Supports brain function", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.9, bioavailabilityScore: 0.85, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.55, categoryBenchmarkCost: 0.60, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Creatine Monohydrate Micronized",
    brand_idx: 3,
    category_idx: 4,
    barcode: "8500123456819",
    description: "Micronized creatine monohydrate powder. 5g per serving. Third-party tested for purity. Zero fillers or artificial ingredients.",
    serving_size: "1 scoop (5g)",
    servings_per_container: 60,
    ingredients: [{ name: "Creatine Monohydrate", rank: 6 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 102, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Improves strength and power", grade: "A" }, { claim: "Increases lean muscle mass", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 1.0, bioavailabilityScore: 0.9, thirdPartyCertified: 0, source: "manual" },
      value: { costPerEffectiveDose: 0.15, categoryBenchmarkCost: 0.20, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Ashwagandha KSM-66 600mg",
    brand_idx: 4,
    category_idx: 3,
    barcode: "8500123456826",
    description: "Standardized KSM-66 ashwagandha root extract (5% withanolides). Clinically studied for stress reduction and cognitive function.",
    serving_size: "1 capsule",
    servings_per_container: 90,
    ingredients: [{ name: "Ashwagandha", rank: 9 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 99, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Reduces stress and cortisol", grade: "A" }, { claim: "Supports cognitive function", grade: "B" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.85, bioavailabilityScore: 0.95, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.40, categoryBenchmarkCost: 0.50, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Zinc Picolinate 50mg",
    brand_idx: 1,
    category_idx: 0,
    barcode: "8500123456833",
    description: "Highly absorbable zinc picolinate for immune support. 50mg elemental zinc per capsule. Free from common allergens.",
    serving_size: "1 capsule",
    servings_per_container: 100,
    ingredients: [{ name: "Zinc (Picolinate)", rank: 5 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 100, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: false, source: "lab" },
      evidence: { claims: [{ claim: "Supports immune function", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.8, bioavailabilityScore: 0.9, thirdPartyCertified: 0, source: "manual" },
      value: { costPerEffectiveDose: 0.10, categoryBenchmarkCost: 0.15, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "L-Theanine 200mg with Suntheanine",
    brand_idx: 0,
    category_idx: 5,
    barcode: "8500123456840",
    description: "Pure L-theanine from patented Suntheanine. Promotes relaxation without drowsiness. Perfect for stress relief and focus.",
    serving_size: "1 capsule",
    servings_per_container: 60,
    ingredients: [{ name: "L-Theanine", rank: 7 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 96, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Promotes relaxation without sedation", grade: "A" }, { claim: "Improves focus when paired with caffeine", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.9, bioavailabilityScore: 0.85, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.35, categoryBenchmarkCost: 0.40, source: "manual" },
    },
  },
  {
    id: uuid(),
    name: "Beta-Alanine 3g Extended Release",
    brand_idx: 3,
    category_idx: 4,
    barcode: "8500123456857",
    description: "Extended release beta-alanine for sustained carnosine levels without paresthesia. 3g per serving. Research-backed dosage.",
    serving_size: "3 capsules",
    servings_per_container: 50,
    ingredients: [{ name: "Beta-Alanine", rank: 8 }],
    score_input: {
      labelAccuracy: { measuredVsClaimedPercent: 95, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: false, source: "lab" },
      evidence: { claims: [{ claim: "Improves high-intensity exercise performance", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.85, bioavailabilityScore: 0.7, thirdPartyCertified: 0, source: "manual" },
      value: { costPerEffectiveDose: 0.45, categoryBenchmarkCost: 0.40, source: "manual" },
    },
  },
];

let productCount = 0;
for (const p of products) {
  const brand = brands[p.brand_idx];
  const cat = categories[p.category_idx];
  const desc = p.description.replace(/'/g, "''");
  const name = p.name.replace(/'/g, "''");

  db(`INSERT OR IGNORE INTO products (id, name, brand_id, category_id, barcode, description, serving_size, servings_per_container, created_at, updated_at)
      VALUES ('${p.id}', '${name}', '${brand.id}', '${cat.id}', '${p.barcode}', '${desc}', '${p.serving_size}', ${p.servings_per_container}, datetime('now'), datetime('now'))`);

  productCount++;
}
console.log(`   ✅ ${productCount} products`);

// ── Product-Ingredient mappings ────────────────────────────────────────────
let piCount = 0;
for (const p of products) {
  for (const ing of p.ingredients) {
    // Find the ingredient in the database by name
    const found = db(`SELECT id FROM ingredients WHERE name LIKE '%${ing.name.replace(/'/g, "''")}%' AND is_top_substance = 1 LIMIT 1`);
    if (found.length > 0) {
      db(`INSERT OR IGNORE INTO product_ingredients (product_id, ingredient_id, is_proprietary_blend)
          VALUES ('${p.id}', '${found[0].id}', 0)`);
      piCount++;
    }
  }
}
console.log(`   ✅ ${piCount} product-ingredient mappings`);

// ── Scoring Engine ────────────────────────────────────────────────────────
console.log("\n📊 Computing scores with scoring engine...");

// We need to use the scoring engine library
// The scoring engine is at /home/team/shared/scoring-engine
// Let's import it directly
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const scoringEngine = require("/home/team/shared/scoring-engine/dist/index.js");

let scoreCount = 0;
for (const p of products) {
  try {
    const result = scoringEngine.score(p.score_input);
    const snapshot = scoringEngine.createSnapshot(p.id, result, p.score_input);

    db(`INSERT OR IGNORE INTO scoring_snapshots (id, product_id, snapshot_json, composite_score, verdict, methodology_version, computed_at, created_at)
        VALUES ('${snapshot.snapshotId}', '${p.id}',
                '${JSON.stringify(snapshot).replace(/'/g, "''")}',
                ${snapshot.compositeScore},
                '${snapshot.verdict.replace(/'/g, "''")}',
                '${snapshot.methodologyVersion}',
                '${snapshot.computedAt}',
                datetime('now'))`);
    scoreCount++;
    console.log(`   ${snapshot.compositeScore}/100 — ${p.name} (${snapshot.verdict})`);
  } catch (err) {
    console.error(`   ❌ Failed to score ${p.name}: ${err.message}`);
  }
}
console.log(`   ✅ ${scoreCount} scoring snapshots created`);

// ── Research Reports ──────────────────────────────────────────────────────
console.log("\n📄 Creating sample research reports...");
let reportCount = 0;

const reports = [
  { productId: products[0].id, summary: "Vitamin D3 + K2 shows strong evidence for bone health benefits. Multiple clinical trials support the combined formulation for improved calcium absorption versus D3 alone. Lab testing confirmed 98% potency — within acceptable range.", efficacy: 85 },
  { productId: products[2].id, summary: "Omega-3 fish oil from OmegaCore demonstrates excellent purity with mercury levels 25x below safety limits. EPA/DHA ratio of 3:1 aligns with cardiovascular research guidelines. IFOS-certified molecular distillation ensures contaminant-free product.", efficacy: 82 },
  { productId: products[3].id, summary: "Creatine monohydrate remains the most researched sports supplement with over 1000 studies confirming safety and efficacy. This micronized version offers enhanced mixability. Lab results show 102% of labeled creatine content.", efficacy: 95 },
];

for (const r of reports) {
  const id = uuid();
  const summary = r.summary.replace(/'/g, "''");
  db(`INSERT OR IGNORE INTO research_reports (id, target_type, target_id, status, ai_summary, ai_estimated_efficacy, generated_at, expires_at, view_count, created_at, updated_at)
      VALUES ('${id}', 'product', '${r.productId}', 'completed',
              '${summary}', ${r.efficacy},
              datetime('now', '-1 days'),
              datetime('now', '+29 days'),
              ${Math.floor(Math.random() * 50) + 5},
              datetime('now', '-1 days'),
              datetime('now'))`);
  reportCount++;
}
console.log(`   ✅ ${reportCount} research reports`);

// ── Summary ────────────────────────────────────────────────────────────────
console.log("\n📊 Seed Summary:");
console.log(`   Brands:        ${brands.length}`);
console.log(`   Categories:    ${categories.length}`);
console.log(`   Products:      ${productCount}`);
console.log(`   Ingredient maps: ${piCount}`);
console.log(`   Scores:        ${scoreCount}`);
console.log(`   Reports:       ${reportCount}`);
console.log("\n✅ Seeding complete!");