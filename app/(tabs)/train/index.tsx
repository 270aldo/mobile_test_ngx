import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Timer,
  Flame,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  ChevronRight,
  Zap,
} from 'lucide-react-native';
import { GlassCard, Button, StatusPill, ProgressRing } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';

// Mock exercise data
const exercises = [
  {
    id: '1',
    name: 'Bench Press',
    sets: '4 x 8-10',
    weight: '80kg',
    rpe: '7-8',
    completed: true,
  },
  {
    id: '2',
    name: 'Overhead Press',
    sets: '3 x 10-12',
    weight: '45kg',
    rpe: '7',
    completed: true,
  },
  {
    id: '3',
    name: 'Incline DB Press',
    sets: '3 x 12',
    weight: '30kg',
    rpe: '8',
    completed: false,
    current: true,
  },
  {
    id: '4',
    name: 'Cable Flyes',
    sets: '3 x 15',
    weight: '15kg',
    rpe: '8',
    completed: false,
  },
  {
    id: '5',
    name: 'Tricep Pushdowns',
    sets: '3 x 12-15',
    weight: '25kg',
    rpe: '7',
    completed: false,
  },
];

export default function TrainScreen() {
  const router = useRouter();
  const completedCount = exercises.filter((e) => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(109, 0, 255, 0.1)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={20} color={colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>ACTIVE OPS</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
          </View>
          <View style={{ width: touchTarget.min }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Timer Card */}
          <GlassCard variant="hero" style={styles.timerCard}>
            <View style={styles.timerContent}>
              {/* Timer Display */}
              <View style={styles.timerMain}>
                <Text style={styles.timerLabel}>TIEMPO</Text>
                <Text style={styles.timerValue}>24:35</Text>
                <Text style={styles.workoutName}>Upper Body // Push</Text>
              </View>

              {/* Progress Ring */}
              <ProgressRing
                progress={progress}
                size={100}
                strokeWidth={8}
                value={`${completedCount}/${exercises.length}`}
                sublabel="ejercicios"
              />
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Flame size={16} color={colors.warning} />
                <Text style={styles.statValue}>186</Text>
                <Text style={styles.statLabel}>kcal</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Zap size={16} color={colors.mint} />
                <Text style={styles.statValue}>4,200</Text>
                <Text style={styles.statLabel}>kg vol</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Timer size={16} color={colors.ngx} />
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>sets left</Text>
              </View>
            </View>
          </GlassCard>

          {/* Current Exercise */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ejercicio Actual</Text>
          </View>

          {exercises
            .filter((e) => e.current)
            .map((exercise) => (
              <GlassCard key={exercise.id} variant="elevated" style={styles.currentExercise}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>3</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.currentExerciseName}>{exercise.name}</Text>
                    <Text style={styles.exercisePrescription}>
                      {exercise.sets} @ {exercise.weight} • RPE {exercise.rpe}
                    </Text>
                  </View>
                  <StatusPill>Set 2/3</StatusPill>
                </View>

                {/* Set Progress */}
                <View style={styles.setProgress}>
                  {[1, 2, 3].map((set) => (
                    <View
                      key={set}
                      style={[
                        styles.setDot,
                        set === 1 && styles.setDotComplete,
                        set === 2 && styles.setDotCurrent,
                      ]}
                    >
                      {set === 1 && <CheckCircle2 size={14} color={colors.void} />}
                      {set === 2 && <Text style={styles.setDotText}>2</Text>}
                      {set === 3 && <Text style={styles.setDotTextInactive}>3</Text>}
                    </View>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.exerciseActions}>
                  <Button variant="secondary" onPress={() => {}} style={styles.actionBtn}>
                    <Pause size={16} color={colors.text} style={{ marginRight: 6 }} />
                    Pausar
                  </Button>
                  <Button variant="primary" onPress={() => {}} style={styles.actionBtn}>
                    <CheckCircle2 size={16} color={colors.text} style={{ marginRight: 6 }} />
                    Completar Set
                  </Button>
                </View>
              </GlassCard>
            ))}

          {/* Exercise List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todos los Ejercicios</Text>
            <Text style={styles.sectionSubtitle}>{completedCount}/{exercises.length} completados</Text>
          </View>

          {exercises.map((exercise, index) => (
            <Pressable key={exercise.id}>
              <GlassCard
                style={[
                  styles.exerciseCard,
                  exercise.current && styles.exerciseCardCurrent,
                ]}
                padding="md"
              >
                <View style={styles.exerciseRow}>
                  {/* Status */}
                  <View style={[
                    styles.exerciseStatus,
                    exercise.completed && styles.exerciseStatusComplete,
                    exercise.current && styles.exerciseStatusCurrent,
                  ]}>
                    {exercise.completed ? (
                      <CheckCircle2 size={18} color={colors.void} />
                    ) : exercise.current ? (
                      <Play size={14} color={colors.void} fill={colors.void} />
                    ) : (
                      <Text style={styles.exerciseIndex}>{index + 1}</Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.exerciseDetails}>
                    <Text style={[
                      styles.exerciseName,
                      exercise.completed && styles.exerciseNameComplete,
                    ]}>
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseMeta}>
                      {exercise.sets} @ {exercise.weight}
                    </Text>
                  </View>

                  {/* Right */}
                  {exercise.current ? (
                    <StatusPill>En curso</StatusPill>
                  ) : (
                    <ChevronRight size={18} color={colors.textMuted} />
                  )}
                </View>
              </GlassCard>
            </Pressable>
          ))}

          {/* Finish Button */}
          <Button
            variant="mint"
            onPress={() => {}}
            fullWidth
            style={styles.finishButton}
          >
            Finalizar Sesión
          </Button>
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
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    borderRadius: 100,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  liveText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    letterSpacing: 1,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.md,
  },

  // Timer Card
  timerCard: {
    marginBottom: spacing.sm,
  },
  timerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timerMain: {
    flex: 1,
  },
  timerLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  workoutName: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },

  // Current Exercise
  currentExercise: {
    marginBottom: spacing.sm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  exerciseInfo: {
    flex: 1,
  },
  currentExerciseName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  exercisePrescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  setProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  setDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDotComplete: {
    backgroundColor: colors.mint,
  },
  setDotCurrent: {
    backgroundColor: colors.ngx,
    borderWidth: 2,
    borderColor: 'rgba(109, 0, 255, 0.5)',
  },
  setDotText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  setDotTextInactive: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },

  // Exercise List
  exerciseCard: {
    marginBottom: spacing.xs,
  },
  exerciseCardCurrent: {
    borderColor: 'rgba(109, 0, 255, 0.4)',
    borderWidth: 1,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  exerciseStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseStatusComplete: {
    backgroundColor: colors.mint,
  },
  exerciseStatusCurrent: {
    backgroundColor: colors.ngx,
  },
  exerciseIndex: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  exerciseNameComplete: {
    color: colors.textMuted,
  },
  exerciseMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Finish
  finishButton: {
    marginTop: spacing.lg,
  },
});
