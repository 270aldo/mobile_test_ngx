import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, Play, ChevronRight, Check, Calendar } from 'lucide-react-native';
import { GlassCard, Button, Label, ProgressRing } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

type WorkoutStatus = 'pending' | 'in_progress' | 'completed' | 'rest_day';

interface FitnessCardProps {
  /** Workout title */
  title?: string;
  /** Workout type (e.g., "Push", "Pull", "Legs") */
  type?: string;
  /** Duration in minutes */
  duration?: number;
  /** Number of exercises */
  exerciseCount?: number;
  /** Current progress (exercises completed) */
  exercisesCompleted?: number;
  /** Workout status */
  status?: WorkoutStatus;
  /** Test ID for testing */
  testID?: string;
}

/**
 * FitnessCard - Today's workout card for Home Hub
 *
 * States:
 * - pending: Show "Start Workout" CTA
 * - in_progress: Show progress + "Continue" CTA
 * - completed: Show checkmark + summary
 * - rest_day: Show recovery message
 */
export function FitnessCard({
  title = 'Push Day',
  type = 'Fuerza',
  duration = 45,
  exerciseCount = 8,
  exercisesCompleted = 0,
  status = 'pending',
  testID,
}: FitnessCardProps) {
  const router = useRouter();

  const progress = exerciseCount > 0
    ? Math.round((exercisesCompleted / exerciseCount) * 100)
    : 0;

  const handlePress = () => {
    router.push('/(tabs)/train');
  };

  if (status === 'rest_day') {
    return (
      <GlassCard style={styles.card} testID={testID}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Calendar size={18} color={colors.mint} />
            </View>
            <Label color="mint">DÍA DE RECUPERACIÓN</Label>
          </View>
        </View>
        <Text style={styles.title}>Día de Descanso</Text>
        <Text style={styles.restSubtitle}>
          Recupera y vuelve más fuerte mañana
        </Text>
        <View style={styles.restSuggestions}>
          <Text style={styles.suggestionText}>
            Sugerido: Mobility • Estiramientos • Caminata
          </Text>
        </View>
      </GlassCard>
    );
  }

  if (status === 'completed') {
    return (
      <GlassCard style={[styles.card, styles.cardCompleted]} testID={testID}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, styles.iconCompleted]}>
              <Check size={18} color={colors.mint} />
            </View>
            <Label color="mint">COMPLETADO</Label>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.completedSubtitle}>
          {exerciseCount} ejercicios • {duration} min
        </Text>
        <Pressable style={styles.viewDetails} onPress={handlePress}>
          <Text style={styles.viewDetailsText}>Ver resumen</Text>
          <ChevronRight size={16} color={colors.mint} />
        </Pressable>
      </GlassCard>
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <GlassCard style={styles.card} testID={testID}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Dumbbell size={18} color={colors.ngx} />
            </View>
            <Label color="ngx">ENTRENAMIENTO</Label>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </View>

        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {type} • {duration} min • {exerciseCount} ejercicios
            </Text>

            {status === 'in_progress' && (
              <View style={styles.progressInfo}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {exercisesCompleted}/{exerciseCount}
                </Text>
              </View>
            )}
          </View>

          {status === 'in_progress' && (
            <ProgressRing
              progress={progress}
              size={60}
              strokeWidth={4}
              value={`${progress}%`}
            />
          )}
        </View>

        <Button
          variant="primary"
          onPress={handlePress}
          fullWidth
          testID="start-workout-cta"
        >
          <Play size={16} color={colors.text} style={{ marginRight: 6 }} />
          {status === 'in_progress' ? 'Continuar' : 'Empezar Workout'}
        </Button>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.15)',
  },
  cardCompleted: {
    borderColor: 'rgba(0, 245, 170, 0.15)',
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
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCompleted: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  info: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.ngx,
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  restSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  restSuggestions: {
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
  },
  completedSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewDetailsText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },
});
