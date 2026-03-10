// ─── Household ────────────────────────────────────────────────────────────────

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free'
  | 'halal'
  | 'kosher';

export interface HouseholdMember {
  id: string;
  name: string;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  biologicalSex: 'male' | 'female';
  activityLevel: ActivityLevel;
  dietaryRestrictions: DietaryRestriction[];
  /** Optional override — if null, app computes from Harris-Benedict */
  dailyCalorieTarget: number | null;
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  createdAt: string;
  updatedAt: string;
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface MacroNutrients {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
}

export interface MicroNutrients {
  sodiumMg?: number;
  calciumMg?: number;
  ironMg?: number;
  vitaminCMg?: number;
  vitaminDIu?: number;
  potassiumMg?: number;
}

export type NutritionFacts = MacroNutrients & MicroNutrients;

export interface NutritionalConstraints {
  memberId: string;
  dailyCaloriesMin: number;
  dailyCaloriesMax: number;
  proteinPctMin: number; // % of total calories
  carbsPctMax: number;
  fatPctMax: number;
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

export type MeasurementUnit =
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'tsp'
  | 'tbsp'
  | 'cup'
  | 'oz'
  | 'lb'
  | 'piece'
  | 'serving';

export interface Ingredient {
  id: string;
  name: string;
  /** Nutrition per 100g */
  nutritionPer100g: NutritionFacts;
  defaultUnit: MeasurementUnit;
  allergens: string[];
  /** e.g. 'protein', 'grain', 'vegetable', 'fat', 'dairy' */
  category: string;
}

export interface IngredientRatio {
  ingredientId: string;
  ingredient: Ingredient;
  amount: number;
  unit: MeasurementUnit;
  /** Computed nutrition for this quantity */
  computedNutrition: NutritionFacts;
}

// ─── Meals & Plans ────────────────────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  name: string;
  mealType: MealType;
  ingredients: IngredientRatio[];
  totalNutrition: NutritionFacts;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  tags: string[];
}

export interface DayPlan {
  date: string; // ISO date string YYYY-MM-DD
  meals: Meal[];
  totalNutrition: NutritionFacts;
  /** Per-member nutrition breakdown */
  memberNutrition: Record<string, NutritionFacts>;
}

export interface WeeklyPlan {
  id: string;
  householdId: string;
  weekStartDate: string; // ISO date string
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
