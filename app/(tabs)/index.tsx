import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  DailyHubHeader,
  FitnessCard,
  NutritionCard,
  MindCard,
  QuickStats,
  QuickAccess,
} from '@/components/home';
import { CoachNoteCard } from '@/components/ui';
import { useUser } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { useActiveSeason, useTodayWorkout, useWeekWorkouts } from '@/stores/season';
import { useNutritionTotals, useNutritionTargets } from '@/stores/nutrition';
import { useHasCompletedMindfulnessToday } from '@/stores/mindfulness';
import { useAppData } from '@/hooks';
import { useCoachNotesByLocation, useCoachNotes } from '@/hooks/useCoachNotes';
import { colors, spacing, layout } from '@/constants/theme';

/**
 * HomeScreen - "Tu Día" Hub
 *
 * The central hub that shows the user their day at a glance.
 * Philosophy: User opens app and knows in 2 seconds what to do.
 *
 * Structure (max 5 blocks):
 * 1. Header with greeting + season progress
 * 2. Mind Card (morning visualization) - dismissable
 * 3. Fitness Card (today's workout)
 * 4. Nutrition Card (macros + next meal)
 * 5. Quick Stats (water + sleep)
 * + Coach Note (when exists, priority)
 */
export default function HomeScreen() {
  const router = useRouter();
  const user = useUser();

  // Local state for dismissing mind card
  const [mindDismissed, setMindDismissed] = useState(false);

  // Local state for water tracking
  const [waterGlasses, setWaterGlasses] = useState(0);

  // Fetch all app data on mount
  useAppData();

  // Store data
  const profile = useProfile();
  const activeSeason = useActiveSeason();
  const todayWorkout = useTodayWorkout();
  const weekWorkouts = useWeekWorkouts();
  const nutritionTotals = useNutritionTotals();
  const nutritionTargets = useNutritionTargets();
  const homeNotes = useCoachNotesByLocation('home');
  const mindfulnessCompleted = useHasCompletedMindfulnessToday();
  const { dismiss: dismissNote } = useCoachNotes();

  // Display name from profile or email fallback
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Atleta';

  // Season info
  const seasonNumber = activeSeason?.number ?? 1;
  const weekNumber = activeSeason?.current_week ?? 1;
  const seasonName = activeSeason?.current_phase?.toUpperCase() ?? 'FOUNDATION';

  // Calculate workout status
  const getWorkoutStatus = () => {
    if (!todayWorkout) return 'rest_day';
    if (todayWorkout.status === 'completed') return 'completed';
    if (todayWorkout.status === 'in_progress') return 'in_progress';
    return 'pending';
  };

  // Calculate exercises completed
  const exercisesCompleted = todayWorkout?.exercise_blocks?.filter(
    (block: any) => block.status === 'completed'
  ).length ?? 0;

  // Check if it's morning for mind card visibility
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;
  const showMindCard = isMorning && !mindDismissed && !mindfulnessCompleted;

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle radial glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(109, 0, 255, 0.08)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header with greeting + season */}
          <DailyHubHeader
            displayName={displayName}
            seasonNumber={seasonNumber}
            weekNumber={weekNumber}
            seasonName={seasonName}
            hasNotifications={homeNotes.length > 0}
            onNotificationPress={() => {/* TODO: Open notifications */}}
            testID="daily-hub-header"
          />

          {/* Coach Note - Priority display when exists */}
          {homeNotes.length > 0 && homeNotes.map((note) => (
            <CoachNoteCard
              key={note.id}
              title={note.title ?? ''}
              content={note.content ?? ''}
              priority={(['info', 'action', 'celebration'].includes(note.priority ?? '') ? note.priority as 'info' | 'action' | 'celebration' : 'info')}
              ctaText={note.cta_text ?? undefined}
              onCtaPress={note.cta_action ? () => router.push(note.cta_action as any) : undefined}
              onDismiss={() => dismissNote(note.id)}
              testID={`coach-note-${note.id}`}
            />
          ))}

          {/* 2. Mind Card - Morning visualization (dismissable) */}
          {showMindCard && (
            <MindCard
              sessionTitle="Visualización Matutina"
              duration={5}
              completed={false}
              onDismiss={() => setMindDismissed(true)}
              testID="mind-card"
            />
          )}

          {/* 3. Fitness Card - Today's workout */}
          <FitnessCard
            title={todayWorkout?.title ?? 'Push Day'}
            type={todayWorkout?.type ?? 'Fuerza'}
            duration={todayWorkout?.estimated_duration_minutes ?? 45}
            exerciseCount={todayWorkout?.exercise_blocks?.length ?? 8}
            exercisesCompleted={exercisesCompleted}
            status={getWorkoutStatus()}
            testID="fitness-card"
          />

          {/* 4. Nutrition Card - Macros + next meal */}
          <NutritionCard
            calories={{ current: nutritionTotals.calories, target: nutritionTargets.calories }}
            protein={{ current: nutritionTotals.protein, target: nutritionTargets.protein }}
            carbs={{ current: nutritionTotals.carbs, target: nutritionTargets.carbs }}
            fat={{ current: nutritionTotals.fat, target: nutritionTargets.fat }}
            nextMeal="Desayuno"
            testID="nutrition-card"
          />

          {/* 5. Quick Stats - Water + Sleep */}
          <QuickStats
            waterCurrent={waterGlasses}
            waterTarget={8}
            sleepHours={7.2}
            onAddWater={() => setWaterGlasses((prev) => Math.min(prev + 1, 12))}
            onRemoveWater={() => setWaterGlasses((prev) => Math.max(prev - 1, 0))}
            testID="quick-stats"
          />

          {/* 6. Quick Access - Always visible module navigation */}
          <QuickAccess testID="quick-access" />
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
    height: 400,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },
});
