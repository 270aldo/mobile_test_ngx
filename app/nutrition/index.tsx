import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Plus, BarChart3, Pill } from 'lucide-react-native';
import { GlassCard, Button, Label } from '@/components/ui';
import { MacroRing, MacroBar, MealCard, SupplementCard } from '@/components/nutrition';
import { colors, spacing, typography, layout } from '@/constants/theme';

// Mock data - TODO: Replace with real data from stores
const MOCK_MACROS = {
  calories: { current: 1450, target: 2200 },
  protein: { current: 98, target: 180 },
  carbs: { current: 145, target: 220 },
  fat: { current: 48, target: 70 },
};

const MOCK_MEALS = {
  breakfast: [
    { id: '1', name: 'Avena con plátano', calories: 350, protein: 12, carbs: 58, fat: 8 },
    { id: '2', name: 'Huevos revueltos (3)', calories: 210, protein: 18, carbs: 2, fat: 15 },
  ],
  lunch: [
    { id: '3', name: 'Pechuga de pollo (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
    { id: '4', name: 'Arroz integral (150g)', calories: 180, protein: 4, carbs: 38, fat: 2 },
  ],
  dinner: [],
  snacks: [
    { id: '5', name: 'Proteína whey', calories: 120, protein: 24, carbs: 3, fat: 1 },
  ],
};

const MOCK_SUPPLEMENTS = [
  { id: '1', name: 'Creatina Monohidrato', dosage: '5g', timing: 'Post-entreno', status: 'verified' as const, taken: true },
  { id: '2', name: 'Vitamina D3', dosage: '4000 UI', timing: 'Mañana', status: 'verified' as const, taken: true },
  { id: '3', name: 'Omega 3', dosage: '2g EPA/DHA', timing: 'Con comida', status: 'verified' as const, taken: false },
  { id: '4', name: 'ZMA', dosage: '1 cápsula', timing: 'Antes de dormir', status: 'pending' as const, taken: false },
];

/**
 * NutritionScreen - Main nutrition tracking dashboard
 *
 * Shows:
 * - Daily calorie and macro progress
 * - Meal cards with food logging
 * - Supplement tracking with coach verification
 */
export default function NutritionScreen() {
  const router = useRouter();
  const [showRemaining, setShowRemaining] = useState(false);

  // Determine which meal to suggest based on time
  const getSuggestedMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return 'breakfast';
    if (hour >= 10 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 20) return 'dinner';
    return 'snacks';
  };

  const suggestedMeal = getSuggestedMeal();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'Nutrición',
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <Button variant="ghost" onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </Button>
          ),
          headerRight: () => (
            <Pressable
              style={styles.headerButton}
              onPress={() => router.push('/nutrition/supplements' as any)}
            >
              <Pill size={20} color={colors.mint} />
            </Pressable>
          ),
        }}
      />

      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Calorie Overview */}
          <GlassCard variant="hero" style={styles.calorieCard}>
            <View style={styles.calorieHeader}>
              <Label color="warning">CALORÍAS HOY</Label>
              <Pressable onPress={() => setShowRemaining(!showRemaining)}>
                <Text style={styles.toggleText}>
                  {showRemaining ? 'Ver consumido' : 'Ver restante'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.calorieContent}>
              <MacroRing
                current={MOCK_MACROS.calories.current}
                target={MOCK_MACROS.calories.target}
                showRemaining={showRemaining}
              />
            </View>
          </GlassCard>

          {/* Macro Breakdown */}
          <GlassCard style={styles.macrosCard}>
            <View style={styles.macrosHeader}>
              <View style={styles.macrosHeaderLeft}>
                <BarChart3 size={18} color={colors.textMuted} />
                <Text style={styles.macrosTitle}>Macronutrientes</Text>
              </View>
            </View>

            <View style={styles.macrosList}>
              <MacroBar
                label="Proteína"
                current={MOCK_MACROS.protein.current}
                target={MOCK_MACROS.protein.target}
                color={colors.mint}
                showFullLabel
              />
              <MacroBar
                label="Carbohidratos"
                current={MOCK_MACROS.carbs.current}
                target={MOCK_MACROS.carbs.target}
                color={colors.ngx}
                showFullLabel
              />
              <MacroBar
                label="Grasas"
                current={MOCK_MACROS.fat.current}
                target={MOCK_MACROS.fat.target}
                color={colors.warning}
                showFullLabel
              />
            </View>
          </GlassCard>

          {/* Meals Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comidas</Text>
            <Pressable onPress={() => router.push('/nutrition/log')}>
              <View style={styles.addButton}>
                <Plus size={16} color={colors.mint} />
                <Text style={styles.addButtonText}>Añadir</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.mealsGrid}>
            <MealCard
              type="breakfast"
              items={MOCK_MEALS.breakfast}
              isSuggested={suggestedMeal === 'breakfast'}
              onAddPress={() => router.push('/nutrition/log')}
            />
            <MealCard
              type="lunch"
              items={MOCK_MEALS.lunch}
              isSuggested={suggestedMeal === 'lunch'}
              onAddPress={() => router.push('/nutrition/log')}
            />
            <MealCard
              type="dinner"
              items={MOCK_MEALS.dinner}
              isSuggested={suggestedMeal === 'dinner'}
              onAddPress={() => router.push('/nutrition/log')}
            />
            <MealCard
              type="snacks"
              items={MOCK_MEALS.snacks}
              isSuggested={suggestedMeal === 'snacks'}
              onAddPress={() => router.push('/nutrition/log')}
            />
          </View>

          {/* Supplements Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suplementos</Text>
          </View>

          <SupplementCard
            supplements={MOCK_SUPPLEMENTS}
            onViewAllPress={() => router.push('/nutrition/supplements' as any)}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  headerButton: {
    padding: spacing.sm,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingTop: 100, // Account for header
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Calorie Card
  calorieCard: {
    alignItems: 'center',
    borderColor: 'rgba(255, 179, 71, 0.15)',
  },
  calorieHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  toggleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  calorieContent: {
    paddingVertical: spacing.md,
  },

  // Macros Card
  macrosCard: {
    padding: spacing.md,
  },
  macrosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  macrosHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macrosTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  macrosList: {
    gap: spacing.lg,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },

  // Meals Grid
  mealsGrid: {
    gap: spacing.md,
  },
});
