import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { GlassCard, Button, StatusPill, ProgressRing, EmptyState, ScreenBackground } from '@/components/ui';
import { SetLogger, RestTimer, WorkoutSummary } from '@/components/workout';
import type { SetLogData, WorkoutSummaryData } from '@/components/workout';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';
import { useTodayWorkout, useSeasonLoading } from '@/stores/season';
import { useWorkoutStore, useCurrentWorkout, useExerciseBlocks, useWorkoutInProgress, useSetLogs } from '@/stores/workout';
import { useUser } from '@/stores/auth';
import type { ExerciseBlock } from '@/types';

export default function TrainScreen() {
  const router = useRouter();
  const user = useUser();
  const todayWorkout = useTodayWorkout();
  const isLoading = useSeasonLoading();
  const currentWorkout = useCurrentWorkout();
  const exerciseBlocks = useExerciseBlocks();
  const isWorkoutInProgress = useWorkoutInProgress();
  const setLogs = useSetLogs();

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Workout player state
  const [showSetLogger, setShowSetLogger] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [lastLoggedWeight, setLastLoggedWeight] = useState<number | undefined>();

  // Timer effect
  useEffect(() => {
    if (!isWorkoutInProgress || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutInProgress, isPaused]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Use real exercise blocks or fallback to todayWorkout blocks (memoized to stabilize deps)
  const exercises = useMemo(() => {
    return exerciseBlocks.length > 0
      ? exerciseBlocks
      : todayWorkout?.exercise_blocks ?? [];
  }, [exerciseBlocks, todayWorkout?.exercise_blocks]);

  // Track completed exercises (for now, mock status based on order)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const completedCount = completedIds.size;
  const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  // Current exercise (defined early for use in handlers)
  const currentExercise = exercises[currentIndex] as ExerciseBlock | undefined;
  const nextExercise = exercises[currentIndex + 1] as ExerciseBlock | undefined;
  const loggedSetsByExercise = useMemo(() => {
    return setLogs.reduce<Record<string, number>>((acc, log) => {
      const id = log.exercise_block_id;
      if (id) {
        acc[id] = (acc[id] ?? 0) + 1;
      }
      return acc;
    }, {});
  }, [setLogs]);

  // Track whether we're transitioning between exercises (last set completed)
  const pendingExerciseTransition = useRef(false);

  // Start workout handler
  const handleStartWorkout = useCallback(async () => {
    if (!user?.id || !todayWorkout?.id) return;
    try {
      await useWorkoutStore.getState().startWorkout(todayWorkout.id, user.id);
    } catch (error) {
      console.error('Failed to start workout:', error);
      Alert.alert('Error', 'No se pudo iniciar el workout.');
    }
  }, [user?.id, todayWorkout?.id]);

  // Complete exercise handler
  const handleCompleteExercise = useCallback((exerciseId: string) => {
    setCompletedIds((prev) => new Set([...prev, exerciseId]));
    setCurrentIndex((prev) => Math.min(prev + 1, exercises.length - 1));
  }, [exercises.length]);

  // Set logging flow handlers
  const handleSaveSet = useCallback(async (data: SetLogData) => {
    if (!currentExercise) return;

    try {
      // Auto-start workout if not started yet
      if (!isWorkoutInProgress && user?.id && todayWorkout?.id) {
        await useWorkoutStore.getState().startWorkout(todayWorkout.id, user.id);
      }

      // Save to store
      await useWorkoutStore.getState().logSet({
        exercise_block_id: currentExercise.id,
        workout_log_id: '', // Will be filled by store
        set_number: currentSetIndex + 1,
        weight_kg: data.weight_kg,
        reps_completed: data.reps_completed,
        rpe: data.rpe ?? null,
        completed: data.completed,
        notes: null,
      });

      // Track last weight for reference
      setLastLoggedWeight(data.weight_kg);

      // Close logger
      setShowSetLogger(false);

      // Check if this was the last set of the exercise
      const totalSets = currentExercise.sets || 3;
      const isLastSet = currentSetIndex + 1 >= totalSets;

      if (isLastSet) {
        // Check if workout is complete (last exercise)
        if (currentIndex + 1 >= exercises.length) {
          handleCompleteExercise(currentExercise.id);
          setCurrentSetIndex(0);
          setLastLoggedWeight(undefined);
          setShowSummary(true);
        } else {
          // Show rest timer before transitioning to next exercise
          pendingExerciseTransition.current = true;
          setShowRestTimer(true);
        }
      } else {
        // Show rest timer, then increment set
        pendingExerciseTransition.current = false;
        setShowRestTimer(true);
      }
    } catch (error) {
      console.error('Failed to log set:', error);
      Alert.alert('Error', 'No se pudo guardar el set. Intenta de nuevo.');
    }
  }, [currentExercise, currentSetIndex, currentIndex, exercises.length, isWorkoutInProgress, user?.id, todayWorkout?.id, handleCompleteExercise]);

  // Rest timer handlers
  const handleRestComplete = useCallback(() => {
    setShowRestTimer(false);

    if (pendingExerciseTransition.current && currentExercise) {
      // Transition to next exercise
      handleCompleteExercise(currentExercise.id);
      setCurrentSetIndex(0);
      setLastLoggedWeight(undefined);
      pendingExerciseTransition.current = false;
    } else {
      // Next set of same exercise
      setCurrentSetIndex(prev => prev + 1);
    }
  }, [currentExercise, handleCompleteExercise]);

  const handleRestSkip = useCallback(() => {
    handleRestComplete();
  }, [handleRestComplete]);

  const handleRestExtend = useCallback((_seconds: number) => {
    // RestTimer handles internally
  }, []);

  // Reset all workout state
  const resetWorkoutState = useCallback(() => {
    setElapsedSeconds(0);
    setIsPaused(false);
    setCurrentSetIndex(0);
    setCompletedIds(new Set());
    setCurrentIndex(0);
    setLastLoggedWeight(undefined);
    setShowSetLogger(false);
    setShowRestTimer(false);
    setShowSummary(false);
    pendingExerciseTransition.current = false;
  }, []);

  // Workout summary handlers
  const handleSaveSummary = useCallback(async (data: WorkoutSummaryData) => {
    try {
      await useWorkoutStore.getState().completeWorkout({
        mood_after: data.mood_after,
        notes: data.notes,
      });
      resetWorkoutState();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to save summary:', error);
      Alert.alert('Error', 'No se pudo guardar el resumen.');
    }
  }, [resetWorkoutState, router]);

  const handleCloseSummary = useCallback(() => {
    resetWorkoutState();
    router.replace('/(tabs)');
  }, [resetWorkoutState, router]);

  // Calculate real stats from set logs
  const workoutStats = useMemo(() => {
    const totalSets = setLogs.length;
    const totalReps = setLogs.reduce((sum, log) => sum + (log.reps_completed ?? 0), 0);
    const totalVolume = setLogs.reduce((sum, log) => sum + ((log.weight_kg ?? 0) * (log.reps_completed ?? 0)), 0);
    const estimatedCalories = Math.round(totalVolume * 0.05); // rough estimate
    const logsWithRpe = setLogs.filter(l => l.rpe != null);
    const averageRpe = logsWithRpe.length > 0
      ? logsWithRpe.reduce((sum, log) => sum + (log.rpe ?? 0), 0) / logsWithRpe.length
      : undefined;

    // Sets remaining calculation
    const totalExpectedSets = exercises.reduce((sum, ex) => sum + (ex.sets || 3), 0);
    const setsRemaining = Math.max(0, totalExpectedSets - totalSets);

    return {
      totalSets,
      totalReps,
      totalVolume,
      estimatedCalories,
      averageRpe,
      setsRemaining,
    };
  }, [setLogs, exercises]);

  // Handle manual exercise selection - reset set tracking
  const handleSelectExercise = useCallback((index: number) => {
    setCurrentIndex(index);
    setCurrentSetIndex(0);
    setLastLoggedWeight(undefined);
  }, []);

  const handleFinishSession = useCallback(() => {
    if (workoutStats.setsRemaining > 0) {
      Alert.alert(
        'Finalizar sesión',
        `Te quedan ${workoutStats.setsRemaining} sets. ¿Quieres finalizar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', style: 'destructive', onPress: () => setShowSummary(true) },
        ]
      );
      return;
    }
    setShowSummary(true);
  }, [workoutStats.setsRemaining]);

  // Cleanup modals when navigating away
  useEffect(() => {
    return () => {
      setShowSetLogger(false);
      setShowRestTimer(false);
      setShowSummary(false);
    };
  }, []);

  // Reset timer when workout ends
  useEffect(() => {
    if (!isWorkoutInProgress && elapsedSeconds > 0) {
      setElapsedSeconds(0);
      setIsPaused(false);
    }
  }, [isWorkoutInProgress, elapsedSeconds]);

  // Format number helper
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  // If loading or no workout
  if (isLoading) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.ngx} />
        </View>
      </ScreenBackground>
    );
  }

  if (!todayWorkout) {
    return (
      <ScreenBackground>
        <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', padding: spacing.xl }]}>
          <EmptyState
            type="workouts"
            title="No hay entrenamiento hoy"
            message="Descansa hoy y vuelve mañana más fuerte"
          />
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground glowColors={['rgba(109, 0, 255, 0.1)', 'transparent']}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={20} color={colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>SESIÓN ACTIVA</Text>
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
          <GlassCard variant="hero" style={styles.timerCard} backgroundImage={require('@/assets/ngx_pullup.png')}>
            <View style={styles.timerContent}>
              {/* Timer Display */}
              <View style={styles.timerMain}>
                <Text style={styles.timerLabel}>TIEMPO</Text>
                <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
                <Text style={styles.workoutName}>{todayWorkout.title} // {todayWorkout.type || 'Fuerza'}</Text>
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
                <Text style={styles.statValue}>{workoutStats.estimatedCalories}</Text>
                <Text style={styles.statLabel}>kcal</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Zap size={16} color={colors.mint} />
                <Text style={styles.statValue}>{formatNumber(workoutStats.totalVolume)}</Text>
                <Text style={styles.statLabel}>kg vol.</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Timer size={16} color={colors.ngx} />
                <Text style={styles.statValue}>{workoutStats.setsRemaining}</Text>
                <Text style={styles.statLabel}>sets</Text>
              </View>
            </View>
          </GlassCard>

          {/* Current Exercise */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ejercicio Actual</Text>
          </View>

          {currentExercise && (
            <GlassCard key={currentExercise.id} variant="elevated" style={styles.currentExercise}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{currentIndex + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.currentExerciseName}>{currentExercise.exercise_name}</Text>
                  <Text style={styles.exercisePrescription}>
                    {currentExercise.sets || 3} x {currentExercise.reps || '8-12'} @ {currentExercise.weight_prescription || 'RPE 7-8'}
                  </Text>
                </View>
                <StatusPill>{`Set ${currentSetIndex + 1}/${currentExercise.sets || 3}`}</StatusPill>
              </View>

              <View style={styles.exerciseMetaRow}>
              <Text style={styles.exerciseMetaText}>
                {currentExercise.sets || 3} sets • {currentExercise.reps || '8-12'} reps
              </Text>
              <Text style={styles.exerciseMetaDivider}>•</Text>
              <Text style={styles.exerciseMetaText}>
                Rest {currentExercise.rest_seconds || 90}s
              </Text>
                {currentExercise.tempo && (
                  <>
                    <Text style={styles.exerciseMetaDivider}>•</Text>
                    <Text style={styles.exerciseMetaText}>Tempo {currentExercise.tempo}</Text>
                  </>
              )}
              {typeof loggedSetsByExercise[currentExercise.id] === 'number' && (
                <>
                  <Text style={styles.exerciseMetaDivider}>•</Text>
                  <Text style={styles.exerciseMetaText}>
                    {loggedSetsByExercise[currentExercise.id]}/{currentExercise.sets || 3} sets
                  </Text>
                </>
              )}
            </View>

              {(currentExercise.coaching_cues?.length || currentExercise.notes) && (
                <View style={styles.coachTip}>
                  <Text style={styles.coachTipLabel}>Coach Tip</Text>
                  <Text style={styles.coachTipText}>
                    {currentExercise.coaching_cues?.[0] ?? currentExercise.notes}
                  </Text>
                </View>
              )}

              {/* Set Progress */}
              <View style={styles.setProgress}>
                {Array.from({ length: currentExercise.sets || 3 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.setDot,
                      i < currentSetIndex && styles.setDotComplete,
                      i === currentSetIndex && styles.setDotCurrent,
                    ]}
                  >
                    {i < currentSetIndex && <CheckCircle2 size={14} color={colors.void} />}
                    {i === currentSetIndex && <Text style={styles.setDotText}>{i + 1}</Text>}
                    {i > currentSetIndex && <Text style={styles.setDotTextInactive}>{i + 1}</Text>}
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.exerciseActions}>
                <Button variant="secondary" onPress={() => setIsPaused(!isPaused)} style={styles.actionBtn}>
                  {isPaused ? (
                    <Play size={16} color={colors.text} style={{ marginRight: 6 }} />
                  ) : (
                    <Pause size={16} color={colors.text} style={{ marginRight: 6 }} />
                  )}
                  {isPaused ? 'Reanudar' : 'Pausar'}
                </Button>
                <Button
                  variant="primary"
                  onPress={() => setShowSetLogger(true)}
                  style={styles.actionBtn}
                >
                  <CheckCircle2 size={16} color={colors.text} style={{ marginRight: 6 }} />
                  Registrar Set
                </Button>
              </View>
            </GlassCard>
          )}

          {nextExercise && (
            <GlassCard variant="elevated" style={styles.nextExerciseCard}>
              <Text style={styles.nextExerciseLabel}>Up Next</Text>
              <Text style={styles.nextExerciseName}>{nextExercise.exercise_name}</Text>
              <Text style={styles.nextExerciseMeta}>
                {nextExercise.sets || 3} x {nextExercise.reps || '8-12'} • Rest {nextExercise.rest_seconds || 90}s
              </Text>
            </GlassCard>
          )}

          {/* Exercise List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todos los Ejercicios</Text>
            <Text style={styles.sectionSubtitle}>{completedCount}/{exercises.length} completados</Text>
          </View>

          {exercises.map((exercise, index) => {
            const isCompleted = completedIds.has(exercise.id);
            const isCurrent = index === currentIndex;

            return (
              <Pressable key={exercise.id} onPress={() => handleSelectExercise(index)}>
                <GlassCard
                  style={[
                    styles.exerciseCard,
                    isCurrent && styles.exerciseCardCurrent,
                  ]}
                  padding="md"
                >
                  <View style={styles.exerciseRow}>
                    {/* Status */}
                    <View style={[
                      styles.exerciseStatus,
                      isCompleted && styles.exerciseStatusComplete,
                      isCurrent && styles.exerciseStatusCurrent,
                    ]}>
                      {isCompleted ? (
                        <CheckCircle2 size={18} color={colors.void} />
                      ) : isCurrent ? (
                        <Play size={14} color={colors.void} fill={colors.void} />
                      ) : (
                        <Text style={styles.exerciseIndex}>{index + 1}</Text>
                      )}
                    </View>

                    {/* Info */}
                  <View style={styles.exerciseDetails}>
                    <Text style={[
                      styles.exerciseName,
                      isCompleted && styles.exerciseNameComplete,
                    ]}>
                      {exercise.exercise_name}
                    </Text>
                    <Text style={styles.exerciseMeta}>
                      {exercise.sets || 3} x {exercise.reps || '8-12'} @ {exercise.weight_prescription || 'RPE 7-8'} • {loggedSetsByExercise[exercise.id] ?? 0}/{exercise.sets || 3} sets
                    </Text>
                  </View>

                    {/* Right */}
                    {isCurrent ? (
                      <StatusPill>En curso</StatusPill>
                    ) : (
                      <ChevronRight size={18} color={colors.textMuted} />
                    )}
                  </View>
                </GlassCard>
              </Pressable>
            );
          })}

          {/* Finish Button */}
          <Button
            variant="mint"
            onPress={handleFinishSession}
            fullWidth
            style={styles.finishButton}
          >
            Finalizar Sesión
          </Button>
        </ScrollView>
      </SafeAreaView>

      {/* Set Logger Modal */}
      {currentExercise && (
        <SetLogger
          visible={showSetLogger}
          onClose={() => setShowSetLogger(false)}
          onSave={handleSaveSet}
          exerciseName={currentExercise.exercise_name}
          setNumber={currentSetIndex + 1}
          totalSets={currentExercise.sets || 3}
          lastWeight={lastLoggedWeight}
          targetReps={currentExercise.reps || '8-12'}
          recommendedRpe={8}
          coachingCues={currentExercise.coaching_cues ?? []}
          tempo={currentExercise.tempo}
          restSeconds={currentExercise.rest_seconds}
          weightPrescription={currentExercise.weight_prescription}
          videoUrl={currentExercise.video_url}
        />
      )}

      {/* Rest Timer */}
      <RestTimer
        visible={showRestTimer}
        duration={currentExercise?.rest_seconds || 90}
        onComplete={handleRestComplete}
        onSkip={handleRestSkip}
        onExtend={handleRestExtend}
        coachNote={currentExercise?.coaching_cues?.[0]}
        nextExercise={currentIndex + 1 < exercises.length ? exercises[currentIndex + 1].exercise_name : undefined}
      />

      {/* Workout Summary */}
      <WorkoutSummary
        visible={showSummary}
        workoutTitle={todayWorkout?.title || 'Workout'}
        workoutType={todayWorkout?.type ?? undefined}
        duration={Math.floor(elapsedSeconds / 60)}
        stats={{
          totalSets: workoutStats.totalSets,
          totalReps: workoutStats.totalReps,
          totalVolume: workoutStats.totalVolume,
          estimatedCalories: workoutStats.estimatedCalories,
          averageRpe: workoutStats.averageRpe,
        }}
        onSave={handleSaveSummary}
        onClose={handleCloseSummary}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  exerciseMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  exerciseMetaText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  exerciseMetaDivider: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  coachTip: {
    backgroundColor: 'rgba(109, 0, 255, 0.12)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.25)',
  },
  coachTipLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coachTipText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
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
  nextExerciseCard: {
    marginBottom: spacing.sm,
  },
  nextExerciseLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  nextExerciseName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nextExerciseMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
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
