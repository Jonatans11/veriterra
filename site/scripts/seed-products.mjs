// ---------------------------------------------------------------------------
// Veriterra.AI — Seed Sample Products (Executable Script)
// ---------------------------------------------------------------------------
// Run: node scripts/seed-products.mjs
// Populates the shared Turso database with sample products, brands,
// categories, product-ingredient mappings, scoring snapshots, and
// research reports using the scoring engine library.
// ---------------------------------------------------------------------------

import { execSync } from "child_process";
import crypto from "crypto";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load scoring engine from the site's node_modules
const siteRoot = path.resolve(__dirname, "..");
const scoringEngine = require(path.join(siteRoot, "node_modules", "@veriterra", "scoring-engine", "dist", "index.js"));

function db(sql) {
  const escaped = sql.replace(/'/g, "'\\''");
  const output = execSync(`team-db '${escaped}'`, { encoding: "utf-8", timeout: 15000 });
  return JSON.parse(output.trim() || "[]");
}

function uuid() { return crypto.randomUUID(); }

console.log("🌱 Seeding sample products...\n");

// ── Brands ─────────────────────────────────────────────────────────────────
const brands = [
  { id: uuid(), name: "NatureVita", website: "https://naturevita.example.com", desc: "Premium plant-based supplements backed by clinical research." },
  { id: uuid(), name: "PureNutrients", website: "https://purenutrients.example.com", desc: "Third-party tested vitamins and minerals for daily wellness." },
  { id: uuid(), name: "OmegaCore", website: "https://omegacore.example.com", desc: "Specialists in omega-3 fatty acids and cardiovascular health." },
  { id: uuid(), name: "BioStrength", website: "https://biostrength.example.com", desc: "Science-driven sports nutrition for peak performance." },
  { id: uuid(), name: "ZenHerbs", website: "https://zenherbs.example.com", desc: "Traditional herbal remedies meeting modern quality standards." },
];

for (const b of brands) {
  db(`INSERT OR IGNORE INTO brands (id, name, website, description, created_at, updated_at)
      VALUES ('${b.id}', '${esc(b.name)}', '${b.website}', '${esc(b.desc)}', datetime('now'), datetime('now'))`);
}
console.log(`   ✅ ${brands.length} brands`);

// ── Categories ─────────────────────────────────────────────────────────────
const categories = [
  { id: uuid(), name: "Vitamins & Minerals", slug: "vitamins-minerals", desc: "Essential vitamins and mineral supplements." },
  { id: uuid(), name: "Protein & Amino Acids", slug: "protein-amino-acids", desc: "Protein powders, BCAAs, and amino acids." },
  { id: uuid(), name: "Omega-3s & Fatty Acids", slug: "omega-3s", desc: "Fish oil, flaxseed oil, and essential fatty acids." },
  { id: uuid(), name: "Herbal & Botanicals", slug: "herbal", desc: "Herbal extracts and botanical supplements." },
  { id: uuid(), name: "Sports Nutrition", slug: "sports-nutrition", desc: "Pre-workout, post-workout, and performance supplements." },
  { id: uuid(), name: "Sleep & Mood", slug: "sleep-mood", desc: "Supplements for restful sleep and balanced mood." },
];

for (const c of categories) {
  db(`INSERT OR IGNORE INTO categories (id, name, slug, description, created_at)
      VALUES ('${c.id}', '${esc(c.name)}', '${c.slug}', '${esc(c.desc)}', datetime('now'))`);
}
console.log(`   ✅ ${categories.length} categories`);

// ── Products ───────────────────────────────────────────────────────────────
const products = [
  {
    id: uuid(), name: "Vitamin D3 + K2 Complex",
    brandIdx: 0, catIdx: 0,
    barcode: "8500123456789",
    desc: "High-potency vitamin D3 (5000 IU) with K2 (Menaquinone-7) for optimal bone health. Third-party tested.",
    servingSize: "1 capsule", servings: 120,
    ingredients: ["Vitamin D3 (Cholecalciferol)", "Vitamin K2 (Menaquinone)"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 98, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports bone health", grade: "A" }, { claim: "Improves calcium absorption", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.95, bioavailabilityScore: 0.9, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.25, categoryBenchmarkCost: 0.35, source: "manual" },
    },
  },
  {
    id: uuid(), name: "Magnesium Glycinate 400mg",
    brandIdx: 1, catIdx: 0,
    barcode: "8500123456796",
    desc: "Highly bioavailable magnesium glycinate for stress relief, sleep, and muscle recovery.",
    servingSize: "2 capsules", servings: 60,
    ingredients: ["Magnesium (Citrate/Glycinate)"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 101, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports sleep quality", grade: "A" }, { claim: "Reduces muscle tension", grade: "B" }], source: "manual" },
      formulation: { doseAdequacyScore: 1.0, bioavailabilityScore: 0.95, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.30, categoryBenchmarkCost: 0.35, source: "manual" },
    },
  },
  {
    id: uuid(), name: "Omega-3 Fish Oil Triple Strength",
    brandIdx: 2, catIdx: 2,
    barcode: "8500123456802",
    desc: "Concentrated omega-3 with 1500mg EPA + 500mg DHA. Molecularly distilled. Enteric-coated.",
    servingSize: "2 softgels", servings: 60,
    ingredients: ["Omega-3 EPA/DHA (Fish Oil)"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 97, source: "lab" },
      puritySafety: { contaminants: [{ contaminant: "Mercury", amountMcg: 0.02, safetyLimitMcg: 0.5 }], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Supports cardiovascular health", grade: "A" }, { claim: "Supports brain function", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.9, bioavailabilityScore: 0.85, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.55, categoryBenchmarkCost: 0.60, source: "manual" },
    },
  },
  {
    id: uuid(), name: "Creatine Monohydrate Micronized",
    brandIdx: 3, catIdx: 4,
    barcode: "8500123456819",
    desc: "Micronized creatine monohydrate. 5g per serving. Third-party tested. No fillers.",
    servingSize: "1 scoop (5g)", servings: 60,
    ingredients: ["Creatine Monohydrate"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 102, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Improves strength and power", grade: "A" }, { claim: "Increases lean muscle mass", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 1.0, bioavailabilityScore: 0.9, thirdPartyCertified: 0, source: "manual" },
      value: { costPerEffectiveDose: 0.15, categoryBenchmarkCost: 0.20, source: "manual" },
    },
  },
  {
    id: uuid(), name: "Ashwagandha KSM-66 600mg",
    brandIdx: 4, catIdx: 3,
    barcode: "8500123456826",
    desc: "Standardized KSM-66 ashwagandha extract (5% withanolides). Clinically studied for stress reduction.",
    servingSize: "1 capsule", servings: 90,
    ingredients: ["Ashwagandha"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 99, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Reduces stress and cortisol", grade: "A" }, { claim: "Supports cognitive function", grade: "B" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.85, bioavailabilityScore: 0.95, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.40, categoryBenchmarkCost: 0.50, source: "manual" },
    },
  },
  {
    id: uuid(), name: "L-Theanine 200mg Suntheanine",
    brandIdx: 0, catIdx: 5,
    barcode: "8500123456833",
    desc: "Pure L-theanine from patented Suntheanine. Promotes relaxation without drowsiness.",
    servingSize: "1 capsule", servings: 60,
    ingredients: ["L-Theanine"],
    score: {
      labelAccuracy: { measuredVsClaimedPercent: 96, source: "lab" },
      puritySafety: { contaminants: [], thirdPartyTested: true, source: "lab" },
      evidence: { claims: [{ claim: "Promotes relaxation without sedation", grade: "A" }, { claim: "Improves focus with caffeine", grade: "A" }], source: "manual" },
      formulation: { doseAdequacyScore: 0.9, bioavailabilityScore: 0.85, thirdPartyCertified: 1, source: "manual" },
      value: { costPerEffectiveDose: 0.35, categoryBenchmarkCost: 0.40, source: "manual" },
    },
  },
];

let productCount = 0;
for (const p of products) {
  const brand = brands[p.brandIdx];
  const cat = categories[p.catIdx];
  db(`INSERT OR IGNORE INTO products (id, name, brand_id, category_id, barcode, description, serving_size, servings_per_container, created_at, updated_at)
      VALUES ('${p.id}', '${esc(p.name)}', '${brand.id}', '${cat.id}', '${p.barcode}', '${esc(p.desc)}', '${p.servingSize}', ${p.servings}, datetime('now'), datetime('now'))`);
  productCount++;
}
console.log(`   ✅ ${productCount} products`);

// ── Product-Ingredient mappings ────────────────────────────────────────────
let piCount = 0;
for (const p of products) {
  for (const ingName of p.ingredients) {
    const found = db(`SELECT id FROM ingredients WHERE name LIKE '%${esc(ingName)}%' AND is_top_substance = 1 LIMIT 1`);
    if (found.length > 0) {
      db(`INSERT OR IGNORE INTO product_ingredients (product_id, ingredient_id, is_proprietary_blend)
          VALUES ('${p.id}', '${found[0].id}', 0)`);
      piCount++;
    }
  }
}
console.log(`   ✅ ${piCount} product-ingredient mappings`);

// ── Scoring Snapshots ─────────────────────────────────────────────────────
console.log("\n📊 Computing scores with scoring engine...");
let scoreCount = 0;

for (const p of products) {
  try {
    const result = scoringEngine.score(p.score);
    const snapshot = scoringEngine.createSnapshot(p.id, result, p.score);
    const snapshotJson = JSON.stringify(snapshot);

    db(`INSERT OR IGNORE INTO scoring_snapshots (id, product_id, snapshot_json, composite_score, verdict, methodology_version, computed_at, created_at)
        VALUES ('${snapshot.snapshotId}', '${p.id}', '${esc(snapshotJson)}', ${snapshot.compositeScore}, '${esc(snapshot.verdict)}', '${snapshot.methodologyVersion}', '${snapshot.computedAt}', datetime('now'))`);
    scoreCount++;
    console.log(`   ${snapshot.compositeScore}/100 — ${p.name} (${snapshot.verdict})`);
  } catch (err) {
    console.error(`   ❌ ${p.name}: ${err.message}`);
  }
}
console.log(`   ✅ ${scoreCount} scoring snapshots`);

// ── Research Reports ──────────────────────────────────────────────────────
console.log("\n📄 Creating sample research reports...");
const reports = [
  { pid: products[0].id, summary: "Vitamin D3 + K2 shows strong evidence for bone health. Lab testing confirmed 98% potency. Multiple clinical trials support the combined formulation versus D3 alone.", eff: 85 },
  { pid: products[2].id, summary: "Omega-3 fish oil demonstrates excellent purity with mercury levels 25x below safety limits. IFOS-certified. EPA/DHA ratio of 3:1 aligns with cardiovascular research guidelines.", eff: 82 },
  { pid: products[3].id, summary: "Creatine monohydrate is the most researched sports supplement (>1000 studies). Lab results show 102% of labeled content. Micronized form improves mixability.", eff: 95 },
  { pid: products[4].id, summary: "KSM-66 ashwagandha is one of the most studied adaptogenic extracts. Reduces cortisol by up to 30% in stressed adults. Third-party tested for withanolide content.", eff: 78 },
];

let reportCount = 0;
for (const r of reports) {
  const id = uuid();
  db(`INSERT OR IGNORE INTO research_reports (id, target_type, target_id, status, ai_summary, ai_estimated_efficacy, generated_at, expires_at, view_count, created_at, updated_at)
      VALUES ('${id}', 'product', '${r.pid}', 'completed', '${esc(r.summary)}', ${r.eff},
              datetime('now', '-1 days'), datetime('now', '+29 days'), ${Math.floor(Math.random() * 50 + 5)},
              datetime('now', '-1 days'), datetime('now'))`);
  reportCount++;
}
console.log(`   ✅ ${reportCount} research reports`);

// ── Lab Results ───────────────────────────────────────────────────────────
console.log("\n🔬 Adding lab results...");
const labResults = [
  { pid: products[0].id, lab: "Eurofins", date: "2026-05-15", mvp: 98, contaminants: [] },
  { pid: products[2].id, lab: "Eurofins", date: "2026-04-20", mvp: 97, contaminants: [{ c: "Mercury", a: 0.02, s: 0.5 }] },
  { pid: products[3].id, lab: "NSF International", date: "2026-06-01", mvp: 102, contaminants: [] },
];

let labCount = 0;
for (const lr of labResults) {
  const id = uuid();
  db(`INSERT OR IGNORE INTO lab_results (id, product_id, lab_name, test_date, measured_vs_claimed_percent, created_at)
      VALUES ('${id}', '${lr.pid}', '${lr.lab}', '${lr.date}', ${lr.mvp}, datetime('now'))`);
  labCount++;

  for (const ct of lr.contaminants) {
    db(`INSERT OR IGNORE INTO contaminant_readings (lab_result_id, contaminant, amount_mcg, safety_limit_mcg)
        VALUES ('${id}', '${ct.c}', ${ct.a}, ${ct.s})`);
  }
}
console.log(`   ✅ ${labCount} lab results`);

// ── Affiliate Links ───────────────────────────────────────────────────────
console.log("\n🔗 Adding affiliate links...");
for (const p of products) {
  const id = uuid();
  db(`INSERT OR IGNORE INTO affiliate_links (id, product_id, url, platform, price_snapshot, price_currency, is_active, created_at, updated_at)
      VALUES ('${id}', '${p.id}', 'https://amazon.example.com/${p.barcode}', 'amazon', ${2.99 + Math.random() * 20}, 'USD', 1, datetime('now'), datetime('now'))`);
}
console.log(`   ✅ ${products.length} affiliate links`);

// ── Summary ────────────────────────────────────────────────────────────────
console.log("\n📊 Summary:");
console.log(`   Brands:       ${brands.length}`);
console.log(`   Categories:   ${categories.length}`);
console.log(`   Products:     ${productCount}`);
console.log(`   Ingredient maps: ${piCount}`);
console.log(`   Scores:       ${scoreCount}`);
console.log(`   Reports:      ${reportCount}`);
console.log(`   Lab results:  ${labCount}`);
console.log("\n✅ Seeding complete!");

function esc(s) { return String(s ?? "").replace(/'/g, "''"); }