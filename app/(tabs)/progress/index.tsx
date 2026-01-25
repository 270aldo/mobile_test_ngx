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
import { GlassCard, StatusPill, ProgressRing, StatCard } from '@/components/ui';
import { colors, spacing, typography, layout, borderRadius, touchTarget } from '@/constants/theme';

// Mock stats
const stats = {
  currentWeight: 82.5,
  weightChange: -1.2,
  bodyFat: 18.5,
  bodyFatChange: -0.8,
  totalVolume: 24680,
  volumeChange: 12,
  weeklyWorkouts: 3,
  weeklyGoal: 4,
};

const weeklyProgress = [
  { day: 'L', completed: true, volume: 4200 },
  { day: 'M', completed: true, volume: 3800 },
  { day: 'X', completed: true, volume: 4500 },
  { day: 'J', completed: false, volume: 0 },
  { day: 'V', completed: false, volume: 0 },
  { day: 'S', completed: false, volume: 0 },
  { day: 'D', completed: false, volume: 0 },
];

const recentActivity = [
  { id: '1', title: 'Peso registrado: 82.5 kg', time: 'Hoy, 8:30 AM', type: 'weight' },
  { id: '2', title: 'Upper Body completado', time: 'Ayer, 7:15 PM', type: 'workout' },
  { id: '3', title: 'PR en Bench Press: 85 kg', time: 'Hace 2 días', type: 'pr' },
];

export default function ProgressScreen() {
  const maxVolume = Math.max(...weeklyProgress.map(d => d.volume), 1);
  const weekProgress = (stats.weeklyWorkouts / stats.weeklyGoal) * 100;

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
            <Text style={styles.seasonText}>S2 • W3</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Week Summary Card */}
          <GlassCard variant="mint" style={styles.weekCard}>
            <View style={styles.weekContent}>
              <View style={styles.weekInfo}>
                <Text style={styles.weekLabel}>ESTA SEMANA</Text>
                <Text style={styles.weekTitle}>
                  {stats.weeklyWorkouts} de {stats.weeklyGoal} sesiones
                </Text>
                <Text style={styles.weekSubtitle}>
                  {stats.weeklyGoal - stats.weeklyWorkouts} restantes para tu meta
                </Text>
              </View>
              <ProgressRing
                progress={weekProgress}
                size={80}
                strokeWidth={6}
                color="mint"
                value={`${stats.weeklyWorkouts}`}
                sublabel={`/${stats.weeklyGoal}`}
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
              value={`${stats.currentWeight}`}
              sublabel="kg"
              progress={100}
              color="primary"
              style={styles.statCard}
            />
            <StatCard
              icon={Activity}
              label="Body Fat"
              value={`${stats.bodyFat}%`}
              sublabel={`${stats.bodyFatChange > 0 ? '+' : ''}${stats.bodyFatChange}%`}
              progress={75}
              color="mint"
              style={styles.statCard}
            />
            <StatCard
              icon={Dumbbell}
              label="Volumen"
              value={`${(stats.totalVolume / 1000).toFixed(1)}k`}
              sublabel="kg total"
              progress={85}
              color="warning"
              style={styles.statCard}
            />
            <StatCard
              icon={Trophy}
              label="PRs"
              value="3"
              sublabel="este mes"
              progress={60}
              color="chrome"
              style={styles.statCard}
            />
          </View>

          {/* Volume Chart */}
          <GlassCard style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Volumen Semanal</Text>
              <View style={styles.chartTrend}>
                <TrendingUp size={14} color={colors.mint} />
                <Text style={styles.chartTrendText}>+{stats.volumeChange}%</Text>
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

          {/* Recent Activity */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todo</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </Pressable>
          </View>

          <GlassCard style={styles.activityCard} padding="none">
            {recentActivity.map((item, index) => (
              <View key={item.id}>
                <View style={styles.activityItem}>
                  <View style={[
                    styles.activityDot,
                    item.type === 'pr' && styles.activityDotPr,
                  ]} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityTime}>{item.time}</Text>
                  </View>
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
                {index < recentActivity.length - 1 && (
                  <View style={styles.activityDivider} />
                )}
              </View>
            ))}
          </GlassCard>
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
