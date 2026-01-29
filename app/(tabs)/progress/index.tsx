import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import {
  ViewSelector,
  SeasonView,
  WeekView,
  MetricsView,
  PhotosView,
  type ProgressView,
} from '@/components/progress';
import { colors, spacing, typography, layout } from '@/constants/theme';
import { useProfile } from '@/stores/profile';
import { useActiveSeason, useWeekWorkouts } from '@/stores/season';
import { useWorkoutStreak, useBadges } from '@/stores/progress';

// Storage key for user's preferred view
const PREFERRED_VIEW_KEY = '@progress_preferred_view';

// Days of week mapping
const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

/**
 * ProgressScreen - 4 Selectable Views
 *
 * Views:
 * - SEASON: Progress toward season goal, week X/12
 * - SEMANA: Weekly adherence, streak, completion by area
 * - MÉTRICAS: Charts for weight, volume, PRs
 * - FOTOS: Progress photos timeline
 *
 * User's preferred view is saved and restored.
 */
export default function ProgressScreen() {
  const [activeView, setActiveView] = useState<ProgressView>('week');

  // Load user's preferred view on mount
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const loadPreferredView = async () => {
      try {
        const saved = await SecureStore.getItemAsync(PREFERRED_VIEW_KEY);
        if (saved && ['season', 'week', 'metrics', 'photos'].includes(saved)) {
          setActiveView(saved as ProgressView);
        }
      } catch (error) {
        console.error('Failed to load preferred view:', error);
      }
    };
    loadPreferredView();
  }, []);

  // Save user's preferred view when changed
  const handleViewChange = async (view: ProgressView) => {
    setActiveView(view);
    if (Platform.OS === 'web') return;
    try {
      await SecureStore.setItemAsync(PREFERRED_VIEW_KEY, view);
    } catch (error) {
      console.error('Failed to save preferred view:', error);
    }
  };

  // Store data
  const profile = useProfile();
  const activeSeason = useActiveSeason();
  const weekWorkouts = useWeekWorkouts();
  const workoutStreak = useWorkoutStreak();
  const badges = useBadges();

  // Derived data
  const seasonNumber = activeSeason?.number ?? 1;
  const weekNumber = activeSeason?.current_week ?? 1;
  const currentPhase = activeSeason?.current_phase ?? 'foundation';

  const currentWeight = profile?.weight_kg ?? 0;
  const bodyFat = profile?.body_fat_percentage ?? 0;
  const weeklyGoal = profile?.training_days_per_week ?? 4;

  // Calculate weekly progress
  const completedWorkouts = weekWorkouts?.filter(w => w.status === 'completed').length ?? 0;

  // Map week workouts to days
  const weeklyProgress = DAYS.map((day, index) => {
    const workout = weekWorkouts?.find(w => w.day_of_week === index);
    return {
      day,
      completed: workout?.status === 'completed',
    };
  });

  // PR data from badges
  const prCount = badges?.filter(b => b.badge_type === 'pr').length ?? 0;
  const recentPRs = badges
    ?.filter(b => b.badge_type === 'pr')
    .slice(0, 5)
    .map(b => ({
      id: b.id,
      exercise: b.title || 'Unknown',
      value: b.description || '',
      date: b.earned_at
        ? new Date(b.earned_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
          })
        : '',
    })) ?? [];

  // Render active view content
  const renderContent = () => {
    switch (activeView) {
      case 'season':
        return (
          <SeasonView
            seasonNumber={seasonNumber}
            seasonName={activeSeason?.goal ?? 'FOUNDATION'}
            currentWeek={weekNumber}
            currentPhase={currentPhase}
            startWeight={0} // TODO: Add to profile type
            currentWeight={currentWeight}
            targetWeight={0} // TODO: Add to profile type
            startBodyFat={0} // TODO: Add to profile type
            currentBodyFat={bodyFat}
            targetBodyFat={0} // TODO: Add to profile type
            testID="season-view"
          />
        );

      case 'week':
        return (
          <WeekView
            workoutsCompleted={completedWorkouts}
            workoutGoal={weeklyGoal}
            weeklyProgress={weeklyProgress}
            streak={workoutStreak?.current_count ?? 0}
            nutritionAdherence={0} // TODO: Connect to nutrition store
            mindfulnessSessions={0} // TODO: Connect to mindfulness store
            mindfulnessGoal={5}
            testID="week-view"
          />
        );

      case 'metrics':
        return (
          <MetricsView
            currentWeight={currentWeight}
            currentBodyFat={bodyFat}
            streak={workoutStreak?.current_count ?? 0}
            prCount={prCount}
            recentPRs={recentPRs}
            weeklyVolume={[0, 0, 0, 0, 0, 0, 0]} // TODO: Calculate from workout logs
            testID="metrics-view"
          />
        );

      case 'photos':
        return (
          <PhotosView
            photos={[]} // TODO: Connect to photos store
            onTakePhoto={() => {}}
            testID="photos-view"
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium gradient background */}
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['rgba(0, 245, 170, 0.06)', 'transparent']}
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>PROGRESS</Text>
            <Text style={styles.headerTitle}>Tu Progreso</Text>
          </View>
          <View style={styles.seasonBadge}>
            <Text style={styles.seasonText}>S{seasonNumber} • W{weekNumber}</Text>
          </View>
        </View>

        {/* View Selector */}
        <View style={styles.selectorContainer}>
          <ViewSelector
            activeView={activeView}
            onViewChange={handleViewChange}
            testID="view-selector"
          />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
  },
  headerLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  seasonBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.25)',
  },
  seasonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 1,
  },

  // View Selector
  selectorContainer: {
    paddingHorizontal: layout.contentPadding,
    marginBottom: spacing.md,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
});
