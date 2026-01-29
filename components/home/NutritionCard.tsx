import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, ChevronRight, Plus } from 'lucide-react-native';
import { GlassCard, Label, ProgressRing } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface MacroData {
  current: number;
  target: number;
}

interface NutritionCardProps {
  /** Current calories consumed */
  calories?: MacroData;
  /** Protein in grams */
  protein?: MacroData;
  /** Carbs in grams */
  carbs?: MacroData;
  /** Fat in grams */
  fat?: MacroData;
  /** Next meal suggestion */
  nextMeal?: string;
  /** Test ID for testing */
  testID?: string;
}

/**
 * NutritionCard - Daily nutrition tracking card for Home Hub
 *
 * Shows:
 * - Calorie progress ring
 * - Macro bars (P/C/F)
 * - Next meal suggestion
 * - Quick add button
 */
export function NutritionCard({
  calories = { current: 0, target: 2200 },
  protein = { current: 0, target: 180 },
  carbs = { current: 0, target: 220 },
  fat = { current: 0, target: 70 },
  nextMeal = 'Desayuno',
  testID,
}: NutritionCardProps) {
  const router = useRouter();

  const calorieProgress = Math.min(100, Math.round((calories.current / calories.target) * 100));

  const renderMacroBar = (
    label: string,
    current: number,
    target: number,
    color: string
  ) => {
    const progress = Math.min(100, Math.round((current / target) * 100));
    return (
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <View style={styles.macroBarContainer}>
          <View
            style={[
              styles.macroBarFill,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.macroValue}>{current}g</Text>
      </View>
    );
  };

  return (
    <Pressable onPress={() => router.push('/(tabs)/nourish')}>
      <GlassCard style={styles.card} testID={testID}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Utensils size={18} color={colors.warning} />
            </View>
            <Label color="warning">NUTRICIÓN</Label>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>

        <View style={styles.content}>
          {/* Calorie Ring */}
          <View style={styles.calorieSection}>
            <ProgressRing
              progress={calorieProgress}
              size={70}
              strokeWidth={5}
              value={`${calories.current}`}
              sublabel="kcal"
              color="warning"
            />
          </View>

          {/* Macro Bars */}
          <View style={styles.macrosSection}>
            {renderMacroBar('P', protein.current, protein.target, '#00F5AA')}
            {renderMacroBar('C', carbs.current, carbs.target, colors.ngx)}
            {renderMacroBar('F', fat.current, fat.target, colors.warning)}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.nextMeal}>
            <Text style={styles.nextMealLabel}>Próximo:</Text>
            <Text style={styles.nextMealValue}>{nextMeal}</Text>
          </View>
          <Pressable
            style={styles.quickAddButton}
            onPress={(e) => {
              e.stopPropagation();
              router.push('/nutrition/log');
            }}
          >
            <Plus size={16} color={colors.text} />
            <Text style={styles.quickAddText}>Añadir</Text>
          </Pressable>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 71, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  calorieSection: {
    alignItems: 'center',
  },
  macrosSection: {
    flex: 1,
    gap: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  macroLabel: {
    width: 16,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  macroBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroValue: {
    width: 40,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  nextMeal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nextMealLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  nextMealValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
  },
  quickAddText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
});
