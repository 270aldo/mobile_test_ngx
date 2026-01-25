import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  Scale,
  Activity,
  Dumbbell,
  Calendar,
  ChevronRight,
  Camera,
  Trophy,
} from 'lucide-react-native';
import { GlassCard, StatusPill, ProgressRing, StatCard, CoachNoteCard } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';
import { useProfile } from '@/stores/profile';
import { useActiveSeason, useWeekWorkouts } from '@/stores/season';
import { useWorkoutStreak, useBadges } from '@/stores/progress';
import { useCoachNotesByLocation, useCoachNotes } from '@/hooks/useCoachNotes';
import { useRouter } from 'expo-router';

// Days of week mapping
const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export default function ProgressScreen() {
  const router = useRouter();
  const profile = useProfile();
  const activeSeason = useActiveSeason();
  const weekWorkouts = useWeekWorkouts();
  const workoutStreak = useWorkoutStreak();
  const badges = useBadges();
  const progressNotes = useCoachNotesByLocation('progress');
  const { dismiss: dismissNote } = useCoachNotes();

  // Calculate stats from real data
  const currentWeight = profile?.weight_kg ?? 0;
  const bodyFat = profile?.body_fat_percentage ?? 0;
  const weeklyGoal = profile?.training_days_per_week ?? 4;

  // Calculate weekly progress
  const completedWorkouts = weekWorkouts?.filter(w => w.status === 'completed').length ?? 0;
  const weekProgress = weeklyGoal > 0 ? (completedWorkouts / weeklyGoal) * 100 : 0;

  // Map week workouts to days
  const weeklyProgress = DAYS.map((day, index) => {
    const workout = weekWorkouts?.find(w => w.day_of_week === index);
    return {
      day,
      completed: workout?.status === 'completed',
      volume: 0, // Would need workout logs for actual volume
    };
  });

  const maxVolume = 1; // Placeholder

  // PR count from badges
  const prCount = badges?.filter(b => b.badge_type === 'pr').length ?? 0;

  // Season display
  const seasonNumber = activeSeason?.number ?? 1;
  const weekNumber = activeSeason?.current_week ?? 1;

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
            <Text style={styles.headerLabel}>TACTICAL MAP</Text>
            <Text style={styles.headerTitle}>Tu Progreso</Text>
          </View>
          <View style={styles.seasonBadge}>
            <Text style={styles.seasonText}>S{seasonNumber} • W{weekNumber}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Week Summary Card */}
          <GlassCard variant="mint" style={styles.weekCard} backgroundImage={require('@/assets/ngx_wearable.png')}>
            <View style={styles.weekContent}>
              <View style={styles.weekInfo}>
                <Text style={styles.weekLabel}>ESTA SEMANA</Text>
                <Text style={styles.weekTitle}>
                  {completedWorkouts} de {weeklyGoal} sesiones
                </Text>
                <Text style={styles.weekSubtitle}>
                  {weeklyGoal - completedWorkouts > 0
                    ? `${weeklyGoal - completedWorkouts} restantes para tu meta`
                    : 'Meta semanal completada'}
                </Text>
              </View>
              <ProgressRing
                progress={weekProgress}
                size={80}
                strokeWidth={6}
                color="mint"
                value={`${completedWorkouts}`}
                sublabel={`/${weeklyGoal}`}
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

          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Métricas clave</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Scale}
              label="Peso"
              value={currentWeight > 0 ? `${currentWeight}` : '--'}
              sublabel="kg"
              progress={100}
              color="primary"
              style={styles.statCard}
            />
            <StatCard
              icon={Activity}
              label="Body Fat"
              value={bodyFat > 0 ? `${bodyFat}%` : '--'}
              sublabel="actual"
              progress={75}
              color="mint"
              style={styles.statCard}
            />
            <StatCard
              icon={Dumbbell}
              label="Racha"
              value={`${workoutStreak?.current_count ?? 0}`}
              sublabel="días"
              progress={(workoutStreak?.current_count ?? 0) * 10}
              color="warning"
              style={styles.statCard}
            />
            <StatCard
              icon={Trophy}
              label="PRs"
              value={`${prCount}`}
              sublabel="logrados"
              progress={prCount * 20}
              color="chrome"
              style={styles.statCard}
            />
          </View>

          {/* Volume Chart */}
          <GlassCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Sesiones de la Semana</Text>
              <View style={styles.chartTrend}>
                <TrendingUp size={14} color={colors.mint} />
                <Text style={styles.chartTrendText}>{completedWorkouts}/{weeklyGoal}</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barWrapper}>
                    <LinearGradient
                      colors={day.completed
                        ? [colors.ngx, colors.primaryLight]
                        : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                      }
                      style={[
                        styles.barFill,
                        { height: `${Math.max((day.volume / maxVolume) * 100, 5)}%` },
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.barLabel,
                    day.completed && styles.barLabelActive,
                  ]}>
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Registrar</Text>
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Scale size={20} color={colors.ngx} />
              </View>
              <Text style={styles.actionLabel}>Peso</Text>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Activity size={20} color={colors.ngx} />
              </View>
              <Text style={styles.actionLabel}>Medidas</Text>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Camera size={20} color={colors.ngx} />
              </View>
              <Text style={styles.actionLabel}>Foto</Text>
            </Pressable>
          </View>

          {/* Coach Notes */}
          {progressNotes.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Notas del Coach</Text>
              {progressNotes.map((note) => (
                <CoachNoteCard
                  key={note.id}
                  title={note.title}
                  content={note.content}
                  priority={(note.priority as 'info' | 'action' | 'celebration') ?? 'info'}
                  ctaText={note.cta_text ?? undefined}
                  onCtaPress={note.cta_action ? () => router.push(note.cta_action as any) : undefined}
                  onDismiss={() => dismissNote(note.id)}
                  testID={`coach-note-${note.id}`}
                />
              ))}
            </>
          )}

          {/* Badges Section */}
          {badges && badges.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Logros recientes</Text>
                <Pressable style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>Ver todo</Text>
                  <ChevronRight size={14} color={colors.textMuted} />
                </Pressable>
              </View>

              <GlassCard style={styles.activityCard} padding="none">
                {badges.slice(0, 3).map((badge, index) => (
                  <View key={badge.id}>
                    <View style={styles.activityItem}>
                      <View style={[
                        styles.activityDot,
                        badge.badge_type === 'pr' && styles.activityDotPr,
                      ]} />
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{badge.title}</Text>
                        <Text style={styles.activityTime}>{badge.description}</Text>
                      </View>
                      <Trophy size={16} color={colors.warning} />
                    </View>
                    {index < Math.min(badges.length, 3) - 1 && (
                      <View style={styles.activityDivider} />
                    )}
                  </View>
                ))}
              </GlassCard>
            </>
          )}
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

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
    gap: spacing.lg,
  },

  // Week Card
  weekCard: {
    borderColor: 'rgba(0, 245, 170, 0.25)',
  },
  weekContent: {
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

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: -spacing.sm,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
  },

  // Chart
  chartCard: {},
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  chartTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartTrendText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barWrapper: {
    width: 28,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  barLabelActive: {
    color: colors.ngx,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: spacing.xs,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(109, 0, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },

  // Activity
  activityCard: {},
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ngx,
  },
  activityDotPr: {
    backgroundColor: colors.mint,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  activityTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: spacing.md,
  },
});
