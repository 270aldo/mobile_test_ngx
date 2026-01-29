import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Pill, Check, Clock, ShieldCheck, ChevronRight, Info } from 'lucide-react-native';
import { GlassCard, PulseDot } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type SupplementStatus = 'verified' | 'pending' | 'suggested';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  status: SupplementStatus;
  taken?: boolean;
  notes?: string;
}

interface SupplementCardProps {
  /** List of supplements */
  supplements?: Supplement[];
  /** On supplement tap */
  onSupplementPress?: (supplement: Supplement) => void;
  /** On view all press */
  onViewAllPress?: () => void;
  /** Test ID */
  testID?: string;
}

const STATUS_CONFIG: Record<SupplementStatus, { label: string; color: string; bg: string }> = {
  verified: { label: 'Coach Verified', color: colors.mint, bg: 'rgba(0, 245, 170, 0.15)' },
  pending: { label: 'Pendiente', color: colors.warning, bg: 'rgba(255, 179, 71, 0.15)' },
  suggested: { label: 'Sugerido', color: colors.ngx, bg: 'rgba(109, 0, 255, 0.15)' },
};

/**
 * SupplementCard - Supplement tracking with coach verification
 *
 * Shows daily supplement stack with:
 * - Coach Verified badge for approved supplements
 * - Take tracking with timing
 * - Notes from coach
 */
export function SupplementCard({
  supplements = [],
  onSupplementPress,
  onViewAllPress,
  testID,
}: SupplementCardProps) {
  const verifiedCount = supplements.filter((s) => s.status === 'verified').length;
  const takenCount = supplements.filter((s) => s.taken).length;

  return (
    <GlassCard style={styles.card} testID={testID}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Pill size={18} color={colors.mint} />
          </View>
          <View>
            <Text style={styles.title}>Suplementos</Text>
            <Text style={styles.subtitle}>
              {takenCount}/{supplements.length} tomados hoy
            </Text>
          </View>
        </View>
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={14} color={colors.mint} />
          <Text style={styles.verifiedText}>{verifiedCount} verificados</Text>
        </View>
      </View>

      {/* Supplements List */}
      <View style={styles.list}>
        {supplements.length === 0 ? (
          <View style={styles.emptyState}>
            <Info size={24} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Tu coach puede sugerir suplementos basados en tus objetivos
            </Text>
          </View>
        ) : (
          supplements.slice(0, 4).map((supplement) => (
            <Pressable
              key={supplement.id}
              style={styles.supplementItem}
              onPress={() => onSupplementPress?.(supplement)}
            >
              <View style={styles.supplementLeft}>
                <Pressable
                  style={[
                    styles.checkCircle,
                    supplement.taken && styles.checkCircleChecked,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    onSupplementPress?.(supplement);
                  }}
                >
                  {supplement.taken && <Check size={14} color={colors.void} />}
                </Pressable>
                <View style={styles.supplementInfo}>
                  <View style={styles.supplementNameRow}>
                    <Text
                      style={[
                        styles.supplementName,
                        supplement.taken && styles.supplementNameTaken,
                      ]}
                    >
                      {supplement.name}
                    </Text>
                    {supplement.status === 'verified' && (
                      <View style={styles.miniVerifiedBadge}>
                        <ShieldCheck size={10} color={colors.mint} />
                      </View>
                    )}
                    {supplement.status === 'pending' && (
                      <PulseDot color="warning" size={6} />
                    )}
                  </View>
                  <View style={styles.supplementMeta}>
                    <Text style={styles.dosage}>{supplement.dosage}</Text>
                    <View style={styles.timingBadge}>
                      <Clock size={10} color={colors.textMuted} />
                      <Text style={styles.timing}>{supplement.timing}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>

      {/* Status Legend */}
      {supplements.length > 0 && (
        <View style={styles.legend}>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: config.color }]} />
              <Text style={styles.legendText}>{config.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* View All Button */}
      {supplements.length > 4 && (
        <Pressable style={styles.viewAllButton} onPress={onViewAllPress}>
          <Text style={styles.viewAllText}>
            Ver todos ({supplements.length})
          </Text>
          <ChevronRight size={16} color={colors.mint} />
        </Pressable>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    borderRadius: borderRadius.full,
  },
  verifiedText: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },
  list: {
    gap: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  supplementLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleChecked: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  supplementName: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  supplementNameTaken: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  miniVerifiedBadge: {
    padding: 2,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderRadius: 4,
  },
  supplementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  dosage: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  timingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timing: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.medium,
  },
});
