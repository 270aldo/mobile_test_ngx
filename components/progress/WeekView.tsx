import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Dumbbell, Utensils, Brain, TrendingUp } from 'lucide-react-native';
import { GlassCard, ProgressRing } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

// Days of week mapping (Spanish)
const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

interface DayProgress {
  day: string;
  completed: boolean;
}

interface WeekViewProps {
  /** Workouts completed this week */
  workoutsCompleted?: number;
  /** Weekly workout goal */
  workoutGoal?: number;
  /** Days with workout completed */
  weeklyProgress?: DayProgress[];
  /** Current streak in days */
  streak?: number;
  /** Nutrition adherence (0-100) */
  nutritionAdherence?: number;
  /** Mindfulness sessions this week */
  mindfulnessSessions?: number;
  /** Mindfulness goal */
  mindfulnessGoal?: number;
  /** Test ID */
  testID?: string;
}

/**
 * WeekView - Weekly adherence and streak
 *
 * Shows:
 * - Workouts completed vs goal
 * - Day-by-day completion dots
 * - Current streak
 * - Adherence by area (fitness, nutrition, mind)
 */
export function WeekView({
  workoutsCompleted = 0,
  workoutGoal = 4,
  weeklyProgress = DAYS.map((day) => ({ day, completed: false })),
  streak = 0,
  nutritionAdherence = 0,
  mindfulnessSessions = 0,
  mindfulnessGoal = 5,
  testID,
}: WeekViewProps) {
  const workoutProgress = workoutGoal > 0
    ? Math.round((workoutsCompleted / workoutGoal) * 100)
    : 0;

  const mindProgress = mindfulnessGoal > 0
    ? Math.round((mindfulnessSessions / mindfulnessGoal) * 100)
    : 0;

  return (
    <View style={styles.container} testID={testID}>
      {/* Main Week Card */}
      <GlassCard variant="mint" style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <View style={styles.weekInfo}>
            <Text style={styles.weekLabel}>ESTA SEMANA</Text>
            <Text style={styles.weekTitle}>
              {workoutsCompleted} de {workoutGoal} sesiones
            </Text>
            <Text style={styles.weekSubtitle}>
              {workoutGoal - workoutsCompleted > 0
                ? `${workoutGoal - workoutsCompleted} restantes para tu meta`
                : '¡Meta semanal completada!'}
            </Text>
          </View>
          <ProgressRing
            progress={workoutProgress}
            size={80}
            strokeWidth={6}
            color="mint"
            value={`${workoutsCompleted}`}
            sublabel={`/${workoutGoal}`}
          />
        </View>

        {/* Week Days */}
        <View style={styles.weekDays}>
          {weeklyProgress.map((day, index) => (
            <View
              key={index}
              style={[
                styles.dayDot,
                day.completed && styles.dayDotComplete,
              ]}
            >
              <Text style={[
                styles.dayText,
                day.completed && styles.dayTextComplete,
              ]}>
                {day.day}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Streak Card */}
      <GlassCard style={styles.streakCard}>
        <View style={styles.streakContent}>
          <View style={styles.streakIcon}>
            <Flame size={24} color={colors.warning} />
          </View>
          <View style={styles.streakInfo}>
            <Text style={styles.streakLabel}>RACHA ACTUAL</Text>
            <Text style={styles.streakValue}>{streak} días</Text>
          </View>
          {streak > 0 && (
            <View style={styles.streakBadge}>
              <TrendingUp size={14} color={colors.mint} />
            </View>
          )}
        </View>
      </GlassCard>

      {/* Adherence by Area */}
      <Text style={styles.sectionTitle}>Adherencia por área</Text>

      <View style={styles.adherenceGrid}>
        {/* Fitness */}
        <GlassCard style={styles.adherenceCard}>
          <View style={[styles.adherenceIcon, styles.adherenceIconFitness]}>
            <Dumbbell size={18} color={colors.ngx} />
          </View>
          <Text style={styles.adherenceLabel}>Fitness</Text>
          <View style={styles.adherenceBar}>
            <LinearGradient
              colors={[colors.ngx, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.adherenceFill, { width: `${workoutProgress}%` }]}
            />
          </View>
          <Text style={styles.adherencePercent}>{workoutProgress}%</Text>
        </GlassCard>

        {/* Nutrition */}
        <GlassCard style={styles.adherenceCard}>
          <View style={[styles.adherenceIcon, styles.adherenceIconNutrition]}>
            <Utensils size={18} color={colors.warning} />
          </View>
          <Text style={styles.adherenceLabel}>Nutrición</Text>
          <View style={styles.adherenceBar}>
            <LinearGradient
              colors={[colors.warning, '#FFD93D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.adherenceFill, { width: `${nutritionAdherence}%` }]}
            />
          </View>
          <Text style={styles.adherencePercent}>{nutritionAdherence}%</Text>
        </GlassCard>

        {/* Mind */}
        <GlassCard style={styles.adherenceCard}>
          <View style={[styles.adherenceIcon, styles.adherenceIconMind]}>
            <Brain size={18} color={colors.mint} />
          </View>
          <Text style={styles.adherenceLabel}>Mind</Text>
          <View style={styles.adherenceBar}>
            <LinearGradient
              colors={[colors.mint, '#00D4AA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.adherenceFill, { width: `${mindProgress}%` }]}
            />
          </View>
          <Text style={styles.adherencePercent}>{mindProgress}%</Text>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },

  // Week Card
  weekCard: {
    borderColor: 'rgba(0, 245, 170, 0.25)',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  weekInfo: {
    flex: 1,
  },
  weekLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    letterSpacing: 2,
    marginBottom: 4,
  },
  weekTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  weekSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 245, 170, 0.15)',
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotComplete: {
    backgroundColor: colors.mint,
  },
  dayText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  dayTextComplete: {
    color: colors.void,
  },

  // Streak Card
  streakCard: {
    padding: spacing.md,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  streakValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  streakBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Adherence
  adherenceGrid: {
    gap: spacing.sm,
  },
  adherenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  adherenceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adherenceIconFitness: {
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  adherenceIconNutrition: {
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
  },
  adherenceIconMind: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  adherenceLabel: {
    width: 70,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  adherenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  adherenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  adherencePercent: {
    width: 40,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
