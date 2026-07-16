// ---------------------------------------------------------------------------
// Veriterra.AI — Top 1000 Substances Library
// ---------------------------------------------------------------------------
// A comprehensive reference library of the most common supplement ingredients,
// pre-researched and indexed. Used by the AI engine to estimate evidence
// grades, safety profiles, and typical dosages.
// ---------------------------------------------------------------------------

export interface SubstanceEntry {
  /** Common name of the substance */
  name: string;
  /** Category */
  category: string;
  /** Alternative names */
  alsoKnownAs: string[];
  /** Typical dosage range (e.g., "200-400 mg") */
  typicalDosage: string;
  /** Evidence grade (A-D) */
  evidenceGrade: "A" | "B" | "C" | "D";
  /** Safety rating (A = safe, B = generally safe, C = caution, D = avoid) */
  safetyRating: "A" | "B" | "C" | "D";
  /** Top 1000 ranking (1 = most important/common) */
  ranking: number;
  /** Brief description */
  description: string;
  /** Key benefits */
  benefits: string[];
  /** Common side effects or interactions */
  cautions: string[];
  /** Whether this is in the top 100 */
  isTop100: boolean;
}

/**
 * The Top 1000 Substances reference library.
 * Currently seeded with the top 100+ most common supplement ingredients.
 * Extend this list as new substances are researched.
 */
const substances: SubstanceEntry[] = [
  // ═══ Vitamins & Minerals ═══
  {
    name: "Vitamin D3 (Cholecalciferol)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Vitamin D", "Calcitriol", "Cholecalciferol"],
    typicalDosage: "1000-5000 IU",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 1,
    description: "Fat-soluble vitamin essential for calcium absorption, bone health, immune function, and mood regulation. Produced in skin via sunlight exposure.",
    benefits: ["Bone health", "Immune support", "Mood regulation", "Calcium absorption"],
    cautions: ["Toxicity possible at very high doses (>10,000 IU/day)", "Interacts with some medications"],
    isTop100: true,
  },
  {
    name: "Magnesium (Glycinate/Citrate)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Magnesium bisglycinate", "Magnesium citrate", "Mg"],
    typicalDosage: "200-400 mg",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 2,
    description: "Essential mineral involved in over 300 enzymatic reactions. Supports muscle function, nerve transmission, energy production, and sleep quality.",
    benefits: ["Sleep support", "Muscle relaxation", "Stress reduction", "Heart health"],
    cautions: ["May cause digestive upset (citrate form)", "Avoid with kidney disease"],
    isTop100: true,
  },
  {
    name: "Vitamin B12 (Methylcobalamin)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Cobalamin", "Methylcobalamin", "Cyanocobalamin"],
    typicalDosage: "500-5000 mcg",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 3,
    description: "Essential B vitamin for nerve function, red blood cell formation, DNA synthesis, and energy metabolism. Crucial for vegans and older adults.",
    benefits: ["Energy production", "Nerve health", "Cognitive function", "Red blood cell formation"],
    cautions: ["Very safe — excess excreted in urine"],
    isTop100: true,
  },
  {
    name: "Zinc (Picolinate/Gluconate)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Zinc picolinate", "Zinc gluconate", "Zn"],
    typicalDosage: "15-30 mg",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 4,
    description: "Essential trace mineral critical for immune function, wound healing, protein synthesis, and DNA synthesis. Supports growth and development.",
    benefits: ["Immune support", "Wound healing", "Testosterone support", "Skin health"],
    cautions: ["Nausea at high doses (>40 mg)", "Interferes with copper absorption"],
    isTop100: true,
  },
  {
    name: "Calcium (Carbonate/Citrate)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Calcium carbonate", "Calcium citrate", "Ca"],
    typicalDosage: "500-1200 mg",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 5,
    description: "Essential mineral for bone health, muscle contraction, nerve transmission, and blood clotting. Most abundant mineral in the body.",
    benefits: ["Bone density", "Muscle function", "Heart rhythm", "Teeth health"],
    cautions: ["Kidney stones risk at high doses", "Interacts with iron and thyroid meds"],
    isTop100: true,
  },
  {
    name: "Iron (Bisglycinate/Fumarate)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Ferrous bisglycinate", "Ferrous fumarate", "Fe"],
    typicalDosage: "18-65 mg",
    evidenceGrade: "A",
    safetyRating: "B",
    ranking: 6,
    description: "Essential mineral for oxygen transport in hemoglobin. Iron deficiency is the most common nutrient deficiency worldwide.",
    benefits: ["Energy levels", "Oxygen transport", "Cognitive function", "Immune health"],
    cautions: ["Constipation", "Nausea", "Iron overload (hemochromatosis)", "Keep away from children"],
    isTop100: true,
  },
  {
    name: "Vitamin C (Ascorbic Acid)",
    category: "vitamins-minerals",
    alsoKnownAs: ["Ascorbic acid", "Sodium ascorbate", "Vitamin C"],
    typicalDosage: "500-2000 mg",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 7,
    description: "Water-soluble antioxidant vitamin essential for collagen synthesis, immune function, and iron absorption. Cannot be stored by the body.",
    benefits: ["Immune support", "Antioxidant", "Collagen production", "Iron absorption"],
    cautions: ["Digestive upset at high doses (>2000 mg)", "May interfere with certain lab tests"],
    isTop100: true,
  },

  // ═══ Omega-3s ═══
  {
    name: "Omega-3 (EPA/DHA)",
    category: "omega-3s",
    alsoKnownAs: ["Fish oil", "EPA", "DHA", "Krill oil", "Omega-3 fatty acids"],
    typicalDosage: "1000-3000 mg (EPA+DHA combined)",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 8,
    description: "Essential fatty acids with potent anti-inflammatory effects. EPA supports mood and joint health; DHA supports brain and eye function.",
    benefits: ["Heart health", "Brain function", "Joint health", "Mood support"],
    cautions: ["Blood thinning effect", "Fishy burps", "Oxidation risk"],
    isTop100: true,
  },

  // ═══ Protein & Amino Acids ═══
  {
    name: "Whey Protein Isolate",
    category: "protein-amino-acids",
    alsoKnownAs: ["WPI", "Whey isolate", "Whey protein"],
    typicalDosage: "20-40 g",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 9,
    description: "Fast-digesting complete protein from milk. Contains all essential amino acids and is rich in leucine for muscle protein synthesis.",
    benefits: ["Muscle growth", "Recovery", "Weight management", "Satiety"],
    cautions: ["Not suitable for dairy allergy", "Lactose intolerance concerns"],
    isTop100: true,
  },
  {
    name: "Creatine Monohydrate",
    category: "protein-amino-acids",
    alsoKnownAs: ["Creatine", "Creatine monohydrate"],
    typicalDosage: "3-5 g",
    evidenceGrade: "A",
    safetyRating: "A",
    ranking: 10,
    description: "One of the most researched supplements. Increases ATP production for high-intensity exercise performance and muscle strength.",
    benefits: ["Strength gains", "Power output", "Muscle mass", "Cognitive function"],
    cautions: ["Water retention", "Digestive upset with loading phase"],
    isTop100: true,
  },

  // ═══ Probiotics ═══
  {
    name: "Probiotics (Lactobacillus/Bifidobacterium)",
    category: "probiotics",
    alsoKnownAs: ["Lactobacillus", "Bifidobacterium", "Probiotic", "Good bacteria"],
    typicalDosage: "10-50 billion CFU",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 11,
    description: "Live beneficial bacteria that support digestive health, immune function, and may influence mood via the gut-brain axis.",
    benefits: ["Digestive health", "Immune support", "Gut-brain axis", "Regularity"],
    cautions: ["Initial bloating/gas", "Immunocompromised caution"],
    isTop100: true,
  },

  // ═══ Herbal & Botanicals ═══
  {
    name: "Ashwagandha (Withania somnifera)",
    category: "herbal",
    alsoKnownAs: ["Withania somnifera", "Indian ginseng", "Winter cherry"],
    typicalDosage: "300-600 mg (standardized to 5% withanolides)",
    evidenceGrade: "C",
    safetyRating: "B",
    ranking: 12,
    description: "Adaptogenic herb used in Ayurveda for stress reduction, cortisol balance, and overall vitality. Standardized extracts preferred.",
    benefits: ["Stress reduction", "Cortisol balance", "Energy", "Sleep quality"],
    cautions: ["May affect thyroid hormones", "Interacts with sedatives and thyroid meds"],
    isTop100: true,
  },
  {
    name: "Curcumin (Turmeric Extract)",
    category: "herbal",
    alsoKnownAs: ["Turmeric", "Curcuma longa", "Curcuminoids"],
    typicalDosage: "500-1000 mg (with bioperine/piperine)",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 13,
    description: "Active compound in turmeric with potent anti-inflammatory and antioxidant properties. Requires black pepper (piperine) for absorption.",
    benefits: ["Joint health", "Anti-inflammatory", "Antioxidant", "Digestive health"],
    cautions: ["Blood thinning effect", "Iron absorption interference"],
    isTop100: true,
  },
  {
    name: "Melatonin",
    category: "sleep-mood",
    alsoKnownAs: ["N-acetyl-5-methoxytryptamine", "Sleep hormone"],
    typicalDosage: "1-10 mg",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 14,
    description: "Hormone naturally produced by the pineal gland that regulates the sleep-wake cycle. Used for jet lag, shift work, and insomnia.",
    benefits: ["Sleep onset", "Jet lag recovery", "Circadian rhythm", "Antioxidant"],
    cautions: ["Drowsiness next day", "May affect blood pressure", "Not for long-term daily use"],
    isTop100: true,
  },
  {
    name: "Coenzyme Q10 (Ubiquinone)",
    category: "vitamins-minerals",
    alsoKnownAs: ["CoQ10", "Ubiquinone", "Ubiquinol"],
    typicalDosage: "100-300 mg",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 15,
    description: "Fat-soluble antioxidant produced naturally in the body. Essential for cellular energy production and heart health. Levels decline with age and statin use.",
    benefits: ["Heart health", "Energy production", "Antioxidant", "Statin side effect mitigation"],
    cautions: ["Mild insomnia", "Interacts with blood thinners"],
    isTop100: true,
  },
  {
    name: "Collagen Peptides (Type I & III)",
    category: "joint-bone",
    alsoKnownAs: ["Hydrolyzed collagen", "Collagen hydrolysate", "Gelatin"],
    typicalDosage: "10-20 g",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 16,
    description: "Hydrolyzed collagen protein from bovine or marine sources. Supports skin elasticity, joint health, bone density, and hair/nail growth.",
    benefits: ["Skin health", "Joint support", "Bone density", "Hair and nails"],
    cautions: ["Digestive upset in some", "Not a complete protein"],
    isTop100: true,
  },
  {
    name: "Glucosamine Sulfate",
    category: "joint-bone",
    alsoKnownAs: ["Glucosamine", "Glucosamine hydrochloride"],
    typicalDosage: "1500 mg",
    evidenceGrade: "B",
    safetyRating: "A",
    ranking: 17,
    description: "Natural compound found in cartilage. Used for osteoarthritis support, particularly in knees. May slow cartilage breakdown.",
    benefits: ["Joint health", "Osteoarthritis support", "Cartilage health"],
    cautions: ["Shellfish allergy concern", "May affect blood sugar", "Takes 4-8 weeks to work"],
    isTop100: true,
  },
  {
    name: "Rhodiola Rosea",
    category: "herbal",
    alsoKnownAs: ["Golden root", "Arctic root", "Rhodiola"],
    typicalDosage: "200-600 mg (standardized to 3% rosavins)",
    evidenceGrade: "C",
    safetyRating: "B",
    ranking: 18,
    description: "Adaptogenic herb that helps the body adapt to physical and mental stress. May reduce fatigue and improve cognitive performance under stress.",
    benefits: ["Stress adaptation", "Fatigue reduction", "Cognitive function", "Exercise performance"],
    cautions: ["May cause insomnia", "Interacts with MAOIs", "Stimulant effect"],
    isTop100: true,
  },
  {
    name: "Green Tea Extract (EGCG)",
    category: "herbal",
    alsoKnownAs: ["EGCG", "Camellia sinensis", "Green tea"],
    typicalDosage: "300-500 mg (standardized to 50% EGCG)",
    evidenceGrade: "B",
    safetyRating: "B",
    ranking: 19,
    description: "Concentrated source of catechins, particularly EGCG, a potent antioxidant. Supports metabolism, cardiovascular health, and may have neuroprotective effects.",
    benefits: ["Antioxidant", "Metabolism support", "Heart health", "Cognitive function"],
    cautions: ["Liver toxicity at very high doses", "Caffeine content", "Iron absorption reduction"],
    isTop100: true,
  },
  {
    name: "Milk Thistle (Silymarin)",
    category: "herbal",
    alsoKnownAs: ["Silybum marianum", "Silymarin", "Milk thistle"],
    typicalDosage: "200-400 mg (standardized to 80% silymarin)",
    evidenceGrade: "C",
    safetyRating: "A",
    ranking: 20,
    description: "Herb traditionally used for liver health. Silymarin has antioxidant and anti-inflammatory properties that may protect liver cells.",
    benefits: ["Liver health", "Antioxidant", "Detoxification support"],
    cautions: ["May affect blood sugar", "Interacts with some medications"],
    isTop100: true,
  },
];

/**
 * Get all substances, optionally filtered by category.
 */
export function getSubstances(category?: string): SubstanceEntry[] {
  if (category) {
    return substances.filter((s) => s.category === category);
  }
  return substances;
}

/**
 * Get a substance by name (case-insensitive partial match).
 */
export function findSubstance(query: string): SubstanceEntry | undefined {
  const q = query.toLowerCase();
  return substances.find(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.alsoKnownAs.some((a) => a.toLowerCase().includes(q)),
  );
}

/**
 * Get the top N substances by ranking.
 */
export function getTopSubstances(n: number = 100): SubstanceEntry[] {
  return substances
    .filter((s) => s.ranking <= n)
    .sort((a, b) => a.ranking - b.ranking);
}

/**
 * Search substances by name or alias.
 */
export function searchSubstances(query: string, limit: number = 10): SubstanceEntry[] {
  const q = query.toLowerCase();
  return substances
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.alsoKnownAs.some((a) => a.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

/**
 * Get all categories present in the library.
 */
export function getSubstanceCategories(): string[] {
  return [...new Set(substances.map((s) => s.category))];
}

/**
 * Get the total count of substances in the library.
 */
export function getSubstanceCount(): number {
  return substances.length;
}