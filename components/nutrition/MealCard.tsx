import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Plus, Coffee, Sun, Moon, Cookie, Check } from 'lucide-react-native';
import { GlassCard } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealCardProps {
  /** Type of meal */
  type: MealType;
  /** Logged food items */
  items?: FoodItem[];
  /** Target calories for this meal */
  targetCalories?: number;
  /** Whether the meal is suggested (recommended time) */
  isSuggested?: boolean;
  /** On add food press */
  onAddPress?: () => void;
  /** On item press */
  onItemPress?: (item: FoodItem) => void;
  /** Test ID */
  testID?: string;
}

const MEAL_CONFIG: Record<MealType, { label: string; labelEs: string; icon: typeof Coffee; time: string }> = {
  breakfast: { label: 'Breakfast', labelEs: 'Desayuno', icon: Coffee, time: '7:00 - 9:00' },
  lunch: { label: 'Lunch', labelEs: 'Almuerzo', icon: Sun, time: '12:00 - 14:00' },
  dinner: { label: 'Dinner', labelEs: 'Cena', icon: Moon, time: '19:00 - 21:00' },
  snacks: { label: 'Snacks', labelEs: 'Snacks', icon: Cookie, time: 'Todo el día' },
};

/**
 * MealCard - Individual meal tracking card
 *
 * Shows logged foods for a meal with total macros.
 * Highlights suggested meal based on time of day.
 */
export function MealCard({
  type,
  items = [],
  targetCalories = 500,
  isSuggested = false,
  onAddPress,
  onItemPress,
  testID,
}: MealCardProps) {
  const config = MEAL_CONFIG[type];
  const Icon = config.icon;

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = items.reduce((sum, item) => sum + item.fat, 0);

  const hasItems = items.length > 0;
  const isComplete = totalCalories >= targetCalories * 0.8;

  return (
    <GlassCard
      style={[styles.card, isSuggested && styles.suggestedCard]}
      testID={testID}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, isSuggested && styles.iconContainerSuggested]}>
            <Icon size={18} color={isSuggested ? colors.mint : colors.textMuted} />
          </View>
          <View>
            <Text style={[styles.mealLabel, isSuggested && styles.mealLabelSuggested]}>
              {config.labelEs}
            </Text>
            <Text style={styles.mealTime}>{config.time}</Text>
          </View>
        </View>

        {hasItems ? (
          <View style={styles.totalsContainer}>
            <Text style={styles.totalCalories}>{totalCalories}</Text>
            <Text style={styles.totalUnit}>kcal</Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, isComplete && styles.statusBadgeComplete]}>
            {isComplete ? (
              <Check size={14} color={colors.mint} />
            ) : (
              <Text style={styles.statusText}>Pendiente</Text>
            )}
          </View>
        )}
      </View>

      {/* Food Items */}
      {hasItems && (
        <View style={styles.itemsList}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={styles.foodItem}
              onPress={() => onItemPress?.(item)}
            >
              <Text style={styles.foodName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.foodCalories}>{item.calories} kcal</Text>
            </Pressable>
          ))}

          {/* Macro Summary */}
          <View style={styles.macroSummary}>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.mint }]} />
              <Text style={styles.macroText}>P: {totalProtein}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.ngx }]} />
              <Text style={styles.macroText}>C: {totalCarbs}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.macroText}>F: {totalFat}g</Text>
            </View>
          </View>
        </View>
      )}

      {/* Add Button */}
      <Pressable style={styles.addButton} onPress={onAddPress}>
        <Plus size={16} color={isSuggested ? colors.mint : colors.textMuted} />
        <Text style={[styles.addButtonText, isSuggested && styles.addButtonTextSuggested]}>
          {hasItems ? 'Añadir más' : 'Añadir comida'}
        </Text>
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
  suggestedCard: {
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSuggested: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  mealLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  mealLabelSuggested: {
    color: colors.mint,
  },
  mealTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  totalsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  totalCalories: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  totalUnit: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  statusBadgeComplete: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  itemsList: {
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  foodName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.md,
  },
  foodCalories: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  macroSummary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  addButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  addButtonTextSuggested: {
    color: colors.mint,
  },
});
