import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, Activity, Trophy, TrendingUp, ChevronRight } from 'lucide-react-native';
import { GlassCard, StatCard } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface PRRecord {
  id: string;
  exercise: string;
  value: string;
  date: string;
}

interface MetricsViewProps {
  /** Current weight */
  currentWeight?: number;
  /** Current body fat % */
  currentBodyFat?: number;
  /** Current streak */
  streak?: number;
  /** Number of PRs achieved */
  prCount?: number;
  /** Recent PRs */
  recentPRs?: PRRecord[];
  /** Weekly volume data for chart */
  weeklyVolume?: number[];
  /** Test ID */
  testID?: string;
}

/**
 * MetricsView - Charts and trends
 *
 * Shows:
 * - Key stats cards (weight, body fat, streak, PRs)
 * - Volume chart
 * - Recent PRs list
 */
export function MetricsView({
  currentWeight = 0,
  currentBodyFat = 0,
  streak = 0,
  prCount = 0,
  recentPRs = [],
  weeklyVolume = [0, 0, 0, 0, 0, 0, 0],
  testID,
}: MetricsViewProps) {
  const maxVolume = Math.max(...weeklyVolume, 1);
  const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  return (
    <View style={styles.container} testID={testID}>
      {/* Stats Grid */}
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
          value={currentBodyFat > 0 ? `${currentBodyFat}%` : '--'}
          sublabel="actual"
          progress={75}
          color="mint"
          style={styles.statCard}
        />
        <StatCard
          icon={TrendingUp}
          label="Racha"
          value={`${streak}`}
          sublabel="días"
          progress={Math.min(streak * 10, 100)}
          color="warning"
          style={styles.statCard}
        />
        <StatCard
          icon={Trophy}
          label="PRs"
          value={`${prCount}`}
          sublabel="logrados"
          progress={Math.min(prCount * 20, 100)}
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
            <Text style={styles.chartTrendText}>
              {weeklyVolume.reduce((a, b) => a + b, 0).toLocaleString()} kg
            </Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          {weeklyVolume.map((volume, index) => (
            <View key={index} style={styles.chartBar}>
              <View style={styles.barWrapper}>
                <LinearGradient
                  colors={volume > 0
                    ? [colors.ngx, colors.primaryLight]
                    : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                  }
                  style={[
                    styles.barFill,
                    { height: `${Math.max((volume / maxVolume) * 100, 5)}%` },
                  ]}
                />
              </View>
              <Text style={[
                styles.barLabel,
                volume > 0 && styles.barLabelActive,
              ]}>
                {DAYS[index]}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Recent PRs */}
      {recentPRs.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PRs Recientes</Text>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todo</Text>
              <ChevronRight size={14} color={colors.textMuted} />
            </Pressable>
          </View>

          <GlassCard style={styles.prsCard} padding="none">
            {recentPRs.slice(0, 5).map((pr, index) => (
              <View key={pr.id}>
                <View style={styles.prItem}>
                  <View style={styles.prIcon}>
                    <Trophy size={16} color={colors.warning} />
                  </View>
                  <View style={styles.prContent}>
                    <Text style={styles.prExercise}>{pr.exercise}</Text>
                    <Text style={styles.prDate}>{pr.date}</Text>
                  </View>
                  <Text style={styles.prValue}>{pr.value}</Text>
                </View>
                {index < Math.min(recentPRs.length, 5) - 1 && (
                  <View style={styles.prDivider} />
                )}
              </View>
            ))}
          </GlassCard>
        </>
      )}

      {recentPRs.length === 0 && (
        <GlassCard style={styles.emptyCard}>
          <Trophy size={32} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Sin PRs aún</Text>
          <Text style={styles.emptyText}>
            Tus récords personales aparecerán aquí
          </Text>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
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

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
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

  // PRs
  prsCard: {},
  prItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  prIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 179, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prContent: {
    flex: 1,
  },
  prExercise: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  prDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  prValue: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.mint,
  },
  prDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: spacing.md,
  },

  // Empty state
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
