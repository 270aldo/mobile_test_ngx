import { View, Text, StyleSheet } from 'react-native';
import { Target, TrendingUp, Calendar } from 'lucide-react-native';
import { GlassCard, ProgressRing, Label } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

interface SeasonViewProps {
  /** Season number */
  seasonNumber?: number;
  /** Season name/goal */
  seasonName?: string;
  /** Current week (1-12) */
  currentWeek?: number;
  /** Current phase */
  currentPhase?: string;
  /** Starting weight */
  startWeight?: number;
  /** Current weight */
  currentWeight?: number;
  /** Target weight */
  targetWeight?: number;
  /** Starting body fat % */
  startBodyFat?: number;
  /** Current body fat % */
  currentBodyFat?: number;
  /** Target body fat % */
  targetBodyFat?: number;
  /** Test ID */
  testID?: string;
}

/**
 * SeasonView - Season progress toward goal
 *
 * Shows:
 * - Overall season progress (week X/12)
 * - Phase indicator
 * - Start vs Current vs Target comparisons
 */
export function SeasonView({
  seasonNumber = 1,
  seasonName = 'FOUNDATION',
  currentWeek = 1,
  currentPhase = 'Adaptación',
  startWeight = 0,
  currentWeight = 0,
  targetWeight = 0,
  startBodyFat = 0,
  currentBodyFat = 0,
  targetBodyFat = 0,
  testID,
}: SeasonViewProps) {
  const weekProgress = Math.round((currentWeek / 12) * 100);

  // Calculate phase (1-4 = Adaptation, 5-8 = Development, 9-12 = Peak)
  const getPhaseInfo = () => {
    if (currentWeek <= 4) return { name: 'Adaptación', number: 1 };
    if (currentWeek <= 8) return { name: 'Desarrollo', number: 2 };
    return { name: 'Peak/Deload', number: 3 };
  };

  const phaseInfo = getPhaseInfo();

  // Weight change
  const weightChange = currentWeight - startWeight;
  const weightChangeText = weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1);

  // Body fat change
  const bfChange = currentBodyFat - startBodyFat;
  const bfChangeText = bfChange > 0 ? `+${bfChange.toFixed(1)}` : bfChange.toFixed(1);

  return (
    <View style={styles.container} testID={testID}>
      {/* Season Progress Card */}
      <GlassCard variant="hero" style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View>
            <Label color="ngx">{`TEMPORADA ${seasonNumber}`}</Label>
            <Text style={styles.seasonName}>{seasonName}</Text>
          </View>
          <ProgressRing
            progress={weekProgress}
            size={80}
            strokeWidth={6}
            value={`${currentWeek}`}
            sublabel="/12"
          />
        </View>

        {/* Phase Progress */}
        <View style={styles.phaseContainer}>
          <View style={styles.phaseTrack}>
            <View style={[styles.phaseDot, currentWeek >= 1 && styles.phaseDotActive]} />
            <View style={[styles.phaseLine, currentWeek >= 4 && styles.phaseLineActive]} />
            <View style={[styles.phaseDot, currentWeek >= 5 && styles.phaseDotActive]} />
            <View style={[styles.phaseLine, currentWeek >= 8 && styles.phaseLineActive]} />
            <View style={[styles.phaseDot, currentWeek >= 9 && styles.phaseDotActive]} />
          </View>
          <View style={styles.phaseLabels}>
            <Text style={[styles.phaseLabel, currentWeek <= 4 && styles.phaseLabelActive]}>
              Fase 1
            </Text>
            <Text style={[styles.phaseLabel, currentWeek > 4 && currentWeek <= 8 && styles.phaseLabelActive]}>
              Fase 2
            </Text>
            <Text style={[styles.phaseLabel, currentWeek > 8 && styles.phaseLabelActive]}>
              Fase 3
            </Text>
          </View>
        </View>

        <View style={styles.currentPhase}>
          <Calendar size={14} color={colors.mint} />
          <Text style={styles.currentPhaseText}>
            Actualmente en: {phaseInfo.name}
          </Text>
        </View>
      </GlassCard>

      {/* Comparisons */}
      <Text style={styles.sectionTitle}>Inicio vs Actual</Text>

      <View style={styles.comparisonGrid}>
        {/* Weight Comparison */}
        <GlassCard style={styles.comparisonCard}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonLabel}>Peso</Text>
            <View style={[
              styles.changeBadge,
              weightChange < 0 ? styles.changeBadgePositive : styles.changeBadgeNeutral
            ]}>
              <TrendingUp size={12} color={weightChange < 0 ? colors.mint : colors.textMuted} />
              <Text style={[
                styles.changeText,
                weightChange < 0 ? styles.changeTextPositive : styles.changeTextNeutral
              ]}>
                {weightChangeText} kg
              </Text>
            </View>
          </View>

          <View style={styles.comparisonValues}>
            <View style={styles.comparisonValue}>
              <Text style={styles.valueLabel}>Inicio</Text>
              <Text style={styles.valueNumber}>
                {startWeight > 0 ? `${startWeight} kg` : '--'}
              </Text>
            </View>
            <View style={styles.comparisonArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.comparisonValue}>
              <Text style={styles.valueLabel}>Actual</Text>
              <Text style={[styles.valueNumber, styles.valueNumberHighlight]}>
                {currentWeight > 0 ? `${currentWeight} kg` : '--'}
              </Text>
            </View>
          </View>

          {targetWeight > 0 && (
            <View style={styles.targetRow}>
              <Target size={12} color={colors.textMuted} />
              <Text style={styles.targetText}>Meta: {targetWeight} kg</Text>
            </View>
          )}
        </GlassCard>

        {/* Body Fat Comparison */}
        <GlassCard style={styles.comparisonCard}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.comparisonLabel}>Grasa Corporal</Text>
            <View style={[
              styles.changeBadge,
              bfChange < 0 ? styles.changeBadgePositive : styles.changeBadgeNeutral
            ]}>
              <TrendingUp size={12} color={bfChange < 0 ? colors.mint : colors.textMuted} />
              <Text style={[
                styles.changeText,
                bfChange < 0 ? styles.changeTextPositive : styles.changeTextNeutral
              ]}>
                {bfChangeText}%
              </Text>
            </View>
          </View>

          <View style={styles.comparisonValues}>
            <View style={styles.comparisonValue}>
              <Text style={styles.valueLabel}>Inicio</Text>
              <Text style={styles.valueNumber}>
                {startBodyFat > 0 ? `${startBodyFat}%` : '--'}
              </Text>
            </View>
            <View style={styles.comparisonArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.comparisonValue}>
              <Text style={styles.valueLabel}>Actual</Text>
              <Text style={[styles.valueNumber, styles.valueNumberHighlight]}>
                {currentBodyFat > 0 ? `${currentBodyFat}%` : '--'}
              </Text>
            </View>
          </View>

          {targetBodyFat > 0 && (
            <View style={styles.targetRow}>
              <Target size={12} color={colors.textMuted} />
              <Text style={styles.targetText}>Meta: {targetBodyFat}%</Text>
            </View>
          )}
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  heroCard: {
    borderColor: 'rgba(109, 0, 255, 0.2)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  seasonName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },

  // Phase progress
  phaseContainer: {
    marginBottom: spacing.md,
  },
  phaseTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  phaseDotActive: {
    backgroundColor: colors.ngx,
    borderColor: colors.ngx,
  },
  phaseLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: spacing.xs,
  },
  phaseLineActive: {
    backgroundColor: colors.ngx,
  },
  phaseLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phaseLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  phaseLabelActive: {
    color: colors.ngx,
    fontWeight: typography.fontWeight.semibold,
  },
  currentPhase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  currentPhaseText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
  },

  // Section
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Comparisons
  comparisonGrid: {
    gap: spacing.md,
  },
  comparisonCard: {
    padding: spacing.md,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  comparisonLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 100,
  },
  changeBadgePositive: {
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  changeBadgeNeutral: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  changeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  changeTextPositive: {
    color: colors.mint,
  },
  changeTextNeutral: {
    color: colors.textMuted,
  },
  comparisonValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonValue: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonArrow: {
    paddingHorizontal: spacing.md,
  },
  arrowText: {
    fontSize: typography.fontSize.lg,
    color: colors.textMuted,
  },
  valueLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  valueNumber: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
  },
  valueNumberHighlight: {
    color: colors.text,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  targetText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
