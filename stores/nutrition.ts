/**
 * Nutrition Store
 *
 * Manages daily meals and macro targets.
 * Persists to Supabase food_logs and nutrition_targets tables.
 * Uses optimistic updates — UI stays instant, Supabase syncs in background.
 * Uses selectors to avoid unnecessary re-renders.
 */

import { create } from 'zustand';
import { nutritionApi } from '@/services/api/nutrition';
import { getTodayDate } from '@/services/api/base';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionState {
  meals: Record<MealType, FoodItem[]>;
  targets: MacroTargets;
  currentDate: string;
  isLoading: boolean;
  error: string | null;
}

interface NutritionActions {
  fetchTodayNutrition: (userId: string) => Promise<void>;
  fetchTargets: (userId: string) => Promise<void>;
  addFood: (mealType: MealType, item: Omit<FoodItem, 'id'> & { id?: string }, userId?: string) => void;
  removeFood: (mealType: MealType, itemId: string) => void;
  clearMeal: (mealType: MealType, userId?: string) => void;
  setTargets: (targets: Partial<MacroTargets>, userId?: string) => void;
  reset: () => void;
}

type NutritionStore = NutritionState & NutritionActions;

const emptyMeals: Record<MealType, FoodItem[]> = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};

const defaultTargets: MacroTargets = {
  calories: 2400,
  protein: 180,
  carbs: 250,
  fat: 70,
};

const initialState: NutritionState = {
  meals: { ...emptyMeals },
  targets: { ...defaultTargets },
  currentDate: getTodayDate(),
  isLoading: false,
  error: null,
};

export const useNutritionStore = create<NutritionStore>((set) => ({
  ...initialState,

  fetchTodayNutrition: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const today = getTodayDate();
      const logs = await nutritionApi.getFoodLogsByDate(userId, today);

      const meals: Record<MealType, FoodItem[]> = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      };

      for (const log of logs) {
        const mealType = log.meal_type as MealType;
        if (meals[mealType]) {
          meals[mealType].push({
            id: log.id,
            name: log.name,
            calories: Number(log.calories),
            protein: Number(log.protein),
            carbs: Number(log.carbs),
            fat: Number(log.fat),
          });
        }
      }

      set({ meals, currentDate: today, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchTargets: async (userId: string) => {
    try {
      const result = await nutritionApi.getTargets(userId);
      if (result) {
        set({
          targets: {
            calories: Number(result.calories),
            protein: Number(result.protein),
            carbs: Number(result.carbs),
            fat: Number(result.fat),
          },
        });
      }
      // If null, keep defaults
    } catch (err) {
      console.error('Failed to fetch nutrition targets:', err);
    }
  },

  addFood: (mealType, item, userId) => {
    const tempId = item.id ?? `${mealType}-${Date.now()}`;
    const newItem: FoodItem = { ...item, id: tempId };

    // Optimistic update
    set((state) => ({
      meals: {
        ...state.meals,
        [mealType]: [...state.meals[mealType], newItem],
      },
    }));

    // Background persist
    if (userId) {
      nutritionApi
        .addFoodLog(userId, {
          meal_type: mealType,
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        })
        .then((saved) => {
          // Replace temp ID with server UUID
          set((state) => ({
            meals: {
              ...state.meals,
              [mealType]: state.meals[mealType].map((f) =>
                f.id === tempId ? { ...f, id: saved.id } : f
              ),
            },
          }));
        })
        .catch((err) => {
          console.error('Failed to persist food log:', err);
        });
    }
  },

  removeFood: (mealType, itemId) => {
    // Optimistic update
    set((state) => ({
      meals: {
        ...state.meals,
        [mealType]: state.meals[mealType].filter((item) => item.id !== itemId),
      },
    }));

    // Background persist — UUID format IDs are server-persisted
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);
    if (isUUID) {
      nutritionApi.removeFoodLog(itemId).catch((err) => {
        console.error('Failed to remove food log:', err);
      });
    }
  },

  clearMeal: (mealType, userId) => {
    // Optimistic update
    set((state) => ({
      meals: {
        ...state.meals,
        [mealType]: [],
      },
    }));

    // Background persist
    if (userId) {
      nutritionApi.clearMealLogs(userId, mealType).catch((err) => {
        console.error('Failed to clear meal logs:', err);
      });
    }
  },

  setTargets: (targets, userId) => {
    // Optimistic update
    set((state) => ({
      targets: { ...state.targets, ...targets },
    }));

    // Background persist
    if (userId) {
      nutritionApi.upsertTargets(userId, targets).catch((err) => {
        console.error('Failed to persist nutrition targets:', err);
      });
    }
  },

  reset: () => set({ ...initialState, meals: { ...emptyMeals }, targets: { ...defaultTargets } }),
}));

// Selector hooks
export const useNutritionMeals = () => useNutritionStore((s) => s.meals);
export const useNutritionTargets = () => useNutritionStore((s) => s.targets);
export const useNutritionTotals = () => useNutritionStore((s) => {
  const items = [
    ...s.meals.breakfast,
    ...s.meals.lunch,
    ...s.meals.dinner,
    ...s.meals.snacks,
  ];
  return {
    calories: items.reduce((sum, item) => sum + item.calories, 0),
    protein: items.reduce((sum, item) => sum + item.protein, 0),
    carbs: items.reduce((sum, item) => sum + item.carbs, 0),
    fat: items.reduce((sum, item) => sum + item.fat, 0),
  };
});
export const useNutritionLoading = () => useNutritionStore((s) => s.isLoading);
export const useNutritionError = () => useNutritionStore((s) => s.error);
