import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Hexagon,
  Bell,
  Play,
  Calendar,
  Flame,
  Moon,
  Droplet,
  Footprints,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react-native';
import {
  GlassCard,
  Button,
  Label,
  StatusPill,
  PulseDot,
  ProgressRing,
  StatCard,
  CoachNoteCard,
  LoadingState,
} from '@/components/ui';
import { useUser } from '@/stores/auth';
import { useProfile } from '@/stores/profile';
import { useActiveSeason, useTodayWorkout, useWeekWorkouts, useSeasonLoading } from '@/stores/season';
import { useWorkoutStreak } from '@/stores/progress';
import { useAppData } from '@/hooks';
import { useCoachNotesByLocation, useCoachNotes } from '@/hooks/useCoachNotes';
import { colors, spacing, typography, layout, touchTarget } from '@/constants/theme';

export default function HomeScreen() {
  const user = useUser();
  const router = useRouter();

  // Fetch all app data on mount
  useAppData();

  // Store data
  const profile = useProfile();
  const activeSeason = useActiveSeason();
  const todayWorkout = useTodayWorkout();
  const weekWorkouts = useWeekWorkouts();
  const isLoading = useSeasonLoading();
  const workoutStreak = useWorkoutStreak();
  const homeNotes = useCoachNotesByLocation('home');
  const { dismiss: dismissNote } = useCoachNotes();

  // Calculate time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // Calculate week progress from store data
  const completedDays = weekWorkouts?.filter(w => w.status === 'completed').length ?? 0;
  const totalDays = weekWorkouts?.length || 7;
  const weekProgress = Math.round((completedDays / totalDays) * 100);

  // Display name from profile or email fallback
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Atleta';

  // Season info
  const seasonNumber = activeSeason?.number ?? 1;
  const weekNumber = activeSeason?.current_week ?? 1;
  const phaseName = activeSeason?.current_phase?.toUpperCase() ?? 'FOUNDATION';

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Hexagon size={20} color={colors.ngx} fill={colors.ngx} fillOpacity={0.2} />
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>{displayName}</Text>
            </View>
          </View>
          <Pressable style={styles.notificationButton}>
            <Bell size={20} color={colors.chrome} />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Season Badge */}
          <View style={styles.seasonBadge}>
            <View style={styles.seasonDot} />
            <Text style={styles.seasonText}>SEASON {seasonNumber} • WEEK {weekNumber} • {phaseName}</Text>
          </View>

          {/* Hero Mission Card */}
          {todayWorkout ? (
            <GlassCard
              variant="hero"
              style={styles.heroCard}
              backgroundImage={require('@/assets/ngx_gym_lift.png')}
            >
              <View style={styles.heroContent}>
                {/* Left: Info */}
                <View style={styles.heroInfo}>
                  <Label color="ngx">Misión del día</Label>
                  <Text style={styles.heroTitle}>{todayWorkout.title}</Text>
                  <Text style={styles.heroSubtitle}>
                    {todayWorkout.type || 'Fuerza'} // {todayWorkout.focus_muscles?.join(', ') || 'General'}
                  </Text>

                  <View style={styles.heroMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaValue}>{todayWorkout.estimated_duration_minutes || 45}</Text>
                      <Text style={styles.metaLabel}>min</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                      <Text style={styles.metaValue}>{todayWorkout.exercise_blocks?.length || 5}</Text>
                      <Text style={styles.metaLabel}>ejercicios</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                      <Text style={styles.metaValue}>Dif</Text>
                      <Text style={styles.metaLabel}>{todayWorkout.difficulty || 7}/10</Text>
                    </View>
                  </View>
                </View>

                {/* Right: Progress Ring */}
                <View style={styles.heroProgress}>
                  <ProgressRing
                    progress={weekProgress}
                    size={90}
                    strokeWidth={6}
                    value={`${completedDays}/${totalDays}`}
                    sublabel="semana"
                  />
                </View>
              </View>

              {/* CTA Button */}
              <Button
                variant="primary"
                onPress={() => router.push('/(tabs)/train')}
                fullWidth
                testID="start-workout-button"
                style={styles.heroCta}
              >
                <Play size={18} color={colors.text} style={{ marginRight: 8 }} />
                Iniciar sesión
              </Button>

              {/* Secondary actions */}
              <View style={styles.heroActions}>
                <Pressable style={styles.heroAction}>
                  <Calendar size={14} color={colors.textMuted} />
                  <Text style={styles.heroActionText}>Reprogramar</Text>
                </Pressable>
                <View style={styles.heroActionDivider} />
                <Pressable style={styles.heroAction}>
                  <Text style={styles.heroActionText}>Ver detalles</Text>
                  <ChevronRight size={14} color={colors.textMuted} />
                </Pressable>
              </View>
            </GlassCard>
          ) : (
            <GlassCard variant="hero" style={styles.heroCard}>
              <View style={styles.restDayContent}>
                <Text style={styles.restDayTitle}>Día de descanso</Text>
                <Text style={styles.restDaySubtitle}>
                  {workoutStreak?.current_count
                    ? `Racha actual: ${workoutStreak.current_count} días`
                    : 'Recupera y vuelve más fuerte'}
                </Text>
              </View>
            </GlassCard>
          )}

          {/* Stats Grid */}
          <Text style={styles.sectionTitle}>Métricas del día</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Flame}
              label="Calorías"
              value="1,680"
              sublabel="/ 2,300"
              progress={73}
              color="warning"
              style={styles.statCard}
            />
            <StatCard
              icon={Moon}
              label="Sueño"
              value="7.1h"
              sublabel="Anoche"
              progress={89}
              color="primary"
              style={styles.statCard}
            />
            <StatCard
              icon={Droplet}
              label="Agua"
              value="2.3L"
              sublabel="/ 3.0L"
              progress={77}
              color="mint"
              style={styles.statCard}
            />
            <StatCard
              icon={Footprints}
              label="Pasos"
              value="7,820"
              sublabel="Hoy"
              progress={78}
              color="chrome"
              style={styles.statCard}
            />
          </View>

          {/* Coach Notes */}
          {homeNotes.length > 0 && homeNotes.map((note) => (
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

          {/* GENESIS Card */}
          <Pressable onPress={() => router.push('/(tabs)/chat')}>
            <GlassCard style={styles.genesisCard}>
              <View style={styles.genesisContent}>
                <View style={styles.genesisIcon}>
                  <Sparkles size={24} color={colors.ngx} />
                </View>
                <View style={styles.genesisText}>
                  <Text style={styles.genesisTitle}>GENESIS</Text>
                  <Text style={styles.genesisSubtitle}>
                    Pregunta lo que quieras sobre tu programa
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </View>
            </GlassCard>
          </Pressable>
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
    alignItems: 'center',
    paddingHorizontal: layout.contentPadding,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greeting: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  notificationButton: {
    width: touchTarget.min,
    height: touchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: touchTarget.min / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.void,
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

  // Season Badge
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.2)',
  },
  seasonDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ngx,
  },
  seasonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.ngx,
    letterSpacing: 1.5,
  },

  // Hero Card
  heroCard: {
    marginTop: spacing.xs,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  heroInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  metaLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroProgress: {
    alignItems: 'center',
  },
  heroCta: {
    marginBottom: spacing.md,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  heroActionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  heroActionDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: spacing.xs,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: -spacing.sm,
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

  // Rest Day
  restDayContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  restDayTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  restDaySubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },

  // GENESIS Card
  genesisCard: {
    paddingVertical: spacing.md,
  },
  genesisContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  genesisIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genesisText: {
    flex: 1,
  },
  genesisTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 2,
  },
  genesisSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});
