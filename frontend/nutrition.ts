import type {
  HouseholdMember,
  NutritionFacts,
  MacroNutrients,
  IngredientRatio,
  MeasurementUnit,
} from '@/types';

// ─── BMR / TDEE ───────────────────────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/** Harris-Benedict Revised (Mifflin-St Jeor equation) */
export function computeBMR(member: HouseholdMember): number {
  const { weightKg, heightCm, ageYears, biologicalSex } = member;
  if (biologicalSex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
}

export function computeTDEE(member: HouseholdMember): number {
  const multiplier = ACTIVITY_MULTIPLIERS[member.activityLevel] ?? 1.2;
  return Math.round(computeBMR(member) * multiplier);
}

export function getDailyCalorieTarget(member: HouseholdMember): number {
  return member.dailyCalorieTarget ?? computeTDEE(member);
}

// ─── Unit conversions to grams ────────────────────────────────────────────────

const UNIT_TO_GRAMS: Partial<Record<MeasurementUnit, number>> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

/** Returns grams, or null if unit is volume/piece (requires density) */
export function toGrams(
  amount: number,
  unit: MeasurementUnit
): number | null {
  const factor = UNIT_TO_GRAMS[unit];
  return factor !== undefined ? amount * factor : null;
}

// ─── Nutrition computation ────────────────────────────────────────────────────

export function computeNutritionForRatio(
  ratio: IngredientRatio
): NutritionFacts {
  const grams = toGrams(ratio.amount, ratio.unit);
  if (grams === null) return ratio.ingredient.nutritionPer100g; // fallback
  const factor = grams / 100;
  const n = ratio.ingredient.nutritionPer100g;
  return {
    calories: round(n.calories * factor),
    proteinG: round(n.proteinG * factor),
    carbsG: round(n.carbsG * factor),
    fatG: round(n.fatG * factor),
    fiberG: round(n.fiberG * factor),
    sugarG: round(n.sugarG * factor),
    sodiumMg: n.sodiumMg !== undefined ? round(n.sodiumMg * factor) : undefined,
    calciumMg:
      n.calciumMg !== undefined ? round(n.calciumMg * factor) : undefined,
    ironMg: n.ironMg !== undefined ? round(n.ironMg * factor) : undefined,
    vitaminCMg:
      n.vitaminCMg !== undefined ? round(n.vitaminCMg * factor) : undefined,
    vitaminDIu:
      n.vitaminDIu !== undefined ? round(n.vitaminDIu * factor) : undefined,
    potassiumMg:
      n.potassiumMg !== undefined ? round(n.potassiumMg * factor) : undefined,
  };
}

export function sumNutrition(facts: NutritionFacts[]): NutritionFacts {
  return facts.reduce<NutritionFacts>(
    (acc, n) => ({
      calories: acc.calories + n.calories,
      proteinG: acc.proteinG + n.proteinG,
      carbsG: acc.carbsG + n.carbsG,
      fatG: acc.fatG + n.fatG,
      fiberG: acc.fiberG + n.fiberG,
      sugarG: acc.sugarG + n.sugarG,
      sodiumMg: add(acc.sodiumMg, n.sodiumMg),
      calciumMg: add(acc.calciumMg, n.calciumMg),
      ironMg: add(acc.ironMg, n.ironMg),
      vitaminCMg: add(acc.vitaminCMg, n.vitaminCMg),
      vitaminDIu: add(acc.vitaminDIu, n.vitaminDIu),
      potassiumMg: add(acc.potassiumMg, n.potassiumMg),
    }),
    zeroNutrition()
  );
}

export function getMacroPctOfCalories(
  nutrition: MacroNutrients
): { protein: number; carbs: number; fat: number } {
  const total = nutrition.calories || 1;
  return {
    protein: round((nutrition.proteinG * 4 / total) * 100),
    carbs: round((nutrition.carbsG * 4 / total) * 100),
    fat: round((nutrition.fatG * 9 / total) * 100),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function round(n: number, dp = 1): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

function add(a?: number, b?: number): number | undefined {
  if (a === undefined && b === undefined) return undefined;
  return (a ?? 0) + (b ?? 0);
}

export function zeroNutrition(): NutritionFacts {
  return {
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    sugarG: 0,
  };
}
