// Seed script for Top 1000 ingredients
import { execSync } from "child_process";
import crypto from "crypto";

const seedData = [
  {name:"Vitamin C (Ascorbic Acid)",cat:"vitamin",safe:"safe",ev:"strong",dos:"500-2000 mg/day",desc:"Essential antioxidant"},
  {name:"Vitamin D3 (Cholecalciferol)",cat:"vitamin",safe:"safe",ev:"strong",dos:"600-4000 IU/day",desc:"Bone health and immune function"},
  {name:"Vitamin B12 (Cobalamin)",cat:"vitamin",safe:"safe",ev:"strong",dos:"2.4-1000 mcg/day",desc:"Nerve function and red blood cells"},
  {name:"Magnesium (Citrate/Glycinate)",cat:"mineral",safe:"safe",ev:"strong",dos:"200-400 mg/day",desc:"300+ enzymatic reactions"},
  {name:"Zinc (Picolinate)",cat:"mineral",safe:"safe",ev:"strong",dos:"11-50 mg/day",desc:"Immune function and wound healing"},
  {name:"Creatine Monohydrate",cat:"amino-acid",safe:"safe",ev:"strong",dos:"3-5 g/day",desc:"Strength and power"},
  {name:"L-Theanine",cat:"amino-acid",safe:"safe",ev:"strong",dos:"100-400 mg/day",desc:"Relaxation without sedation"},
  {name:"Beta-Alanine",cat:"amino-acid",safe:"safe",ev:"strong",dos:"2-5 g/day",desc:"Exercise performance"},
  {name:"Ashwagandha",cat:"herb",safe:"safe",ev:"strong",dos:"300-600 mg/day",desc:"Adaptogen; reduces cortisol"},
  {name:"Omega-3 EPA/DHA (Fish Oil)",cat:"fatty-acid",safe:"safe",ev:"strong",dos:"1000-3000 mg/day",desc:"Heart and brain health"},
  {name:"Caffeine",cat:"nootropic",safe:"caution",ev:"strong",dos:"50-400 mg/day",desc:"Alertness and focus"},
  {name:"Melatonin",cat:"hormone",safe:"safe",ev:"strong",dos:"0.5-10 mg/day",desc:"Sleep regulation"},
];

let count = 0;
for (let i = 0; i < seedData.length; i++) {
  const s = seedData[i];
  const id = crypto.randomUUID();
  const name = s.name.replace(/'/g, "''");
  const desc = s.desc.replace(/'/g, "''");
  const dos = s.dos.replace(/'/g, "''");
  
  const sql = `INSERT OR IGNORE INTO ingredients (id, name, category, description, typical_dosage_range, safety_rating, evidence_rating, is_top_substance, top_ranking, created_at, updated_at) VALUES ('${id}', '${name}', '${s.cat}', '${desc}', '${dos}', '${s.safe}', '${s.ev}', 1, ${i + 1}, datetime('now'), datetime('now'))`;
  
  const escaped = sql.replace(/'/g, "'\\''");
  execSync(`team-db '${escaped}'`, { timeout: 10000 });
  count++;
}
console.log(`Seeded ${count} ingredients`);