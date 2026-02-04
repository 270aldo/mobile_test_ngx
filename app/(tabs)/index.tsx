import { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  DailyHubHeader,
  FitnessCard,
  NutritionCard,
  MindCard,
  QuickStats,
  QuickAccess,
} from '@/components/home';
import { CoachNoteCard, ScreenBackground } from '@/components/ui';
import { useUser } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { useActiveSeason, useTodayWorkout, useWeekWorkouts } from '@/stores/season';
import { useNutritionTotals, useNutritionTargets } from '@/stores/nutrition';
import { useHasCompletedMindfulnessToday } from '@/stores/mindfulness';
import { useAppData } from '@/hooks';
import { useCoachNotesByLocation, useCoachNotes } from '@/hooks/useCoachNotes';
import { colors, spacing, layout } from '@/constants/theme';
import { getTodayDate } from '@/services/api/base';
import { isCoachCtaRoute } from '@/constants/routes';

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

  // Local state for dismissing mind card (persisted per day)
  const [mindDismissed, setMindDismissed] = useState(false);

  // Local state for water tracking
  const [waterGlasses, setWaterGlasses] = useState(0);
  const waterHydrated = useRef(false);

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

  const handleCtaPress = (route: string | null | undefined) => {
    if (route && isCoachCtaRoute(route)) {
      router.push(route as any);
    }
  };

  const todayKey = `@mind_card_dismissed_${getTodayDate()}`;
  const waterKey = `@water_glasses_${getTodayDate()}`;

  useEffect(() => {
    let isMounted = true;
    const loadDismissed = async () => {
      const value =
        Platform.OS === 'web'
          ? (typeof localStorage !== 'undefined' ? localStorage.getItem(todayKey) : null)
          : await SecureStore.getItemAsync(todayKey);
      if (isMounted) {
        setMindDismissed(value === 'true');
      }
    };
    loadDismissed();
    return () => {
      isMounted = false;
    };
  }, [todayKey]);

  useEffect(() => {
    let isMounted = true;
    const loadWater = async () => {
      const value =
        Platform.OS === 'web'
          ? (typeof localStorage !== 'undefined' ? localStorage.getItem(waterKey) : null)
          : await SecureStore.getItemAsync(waterKey);
      const parsed = value ? Number(value) : 0;
      if (isMounted) {
        setWaterGlasses(Number.isFinite(parsed) ? parsed : 0);
        waterHydrated.current = true;
      }
    };
    loadWater();
    return () => {
      isMounted = false;
    };
  }, [waterKey]);

  useEffect(() => {
    if (!waterHydrated.current) return;
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(waterKey, String(waterGlasses));
      }
      return;
    }
    SecureStore.setItemAsync(waterKey, String(waterGlasses));
  }, [waterGlasses, waterKey]);

  const handleDismissMindCard = async () => {
    setMindDismissed(true);
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(todayKey, 'true');
      }
      return;
    }
    await SecureStore.setItemAsync(todayKey, 'true');
  };

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
    <ScreenBackground glowColors={['rgba(109, 0, 255, 0.08)', 'transparent']}>
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
              onCtaPress={note.cta_action ? () => handleCtaPress(note.cta_action) : undefined}
              onDismiss={() => dismissNote(note.id)}
              testID={`coach-note-${note.id}`}
            />
          ))}

          {/* Quick Focus - Primary modules */}
          <QuickAccess testID="quick-access" />

          {/* 2. Mind Card - Morning visualization (dismissable) */}
          {showMindCard && (
            <MindCard
              sessionTitle="Visualización Matutina"
              duration={5}
              completed={false}
              onDismiss={handleDismissMindCard}
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
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
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
