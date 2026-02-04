import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, Utensils, Brain, Video, ChevronRight } from 'lucide-react-native';
import { GlassCard, Label } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

const PRIMARY_SEGMENTS = [
  {
    key: 'train',
    label: 'Train',
    icon: Dumbbell,
    color: colors.ngx,
    iconBg: 'rgba(109, 0, 255, 0.18)',
    route: '/(tabs)/train' as const,
  },
  {
    key: 'nourish',
    label: 'Nourish',
    icon: Utensils,
    color: colors.warning,
    iconBg: 'rgba(255, 179, 71, 0.16)',
    route: '/(tabs)/nourish' as const,
  },
  {
    key: 'mind',
    label: 'Mind',
    icon: Brain,
    color: colors.mint,
    iconBg: 'rgba(0, 245, 170, 0.16)',
    route: '/(tabs)/mind' as const,
  },
] as const;

const SECONDARY_ACCESS = {
  key: 'video',
  label: 'Video Library',
  description: 'Demos + técnica',
  icon: Video,
  route: '/(tabs)/video' as const,
};

interface QuickAccessProps {
  testID?: string;
}

export function QuickAccess({ testID }: QuickAccessProps) {
  const router = useRouter();

  return (
    <View testID={testID}>
      <Label color="muted" style={styles.sectionLabel}>FOCUS</Label>
      <View style={styles.segmentRow}>
        {PRIMARY_SEGMENTS.map((segment) => (
          <Pressable
            key={segment.key}
            style={styles.segment}
            onPress={() => router.push(segment.route)}
            testID={`focus-segment-${segment.key}`}
          >
            <View style={[styles.segmentIcon, { backgroundColor: segment.iconBg }]}>
              <segment.icon size={18} color={segment.color} />
            </View>
            <Text style={styles.segmentLabel}>{segment.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.libraryPressable}
        onPress={() => router.push(SECONDARY_ACCESS.route)}
        testID={`focus-segment-${SECONDARY_ACCESS.key}`}
      >
        <GlassCard style={styles.libraryCard}>
          <View style={styles.libraryRow}>
            <View style={styles.libraryIcon}>
              <SECONDARY_ACCESS.icon size={20} color={colors.ngx} />
            </View>
            <View style={styles.libraryText}>
              <Text style={styles.libraryTitle}>{SECONDARY_ACCESS.label}</Text>
              <Text style={styles.librarySubtitle}>{SECONDARY_ACCESS.description}</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </View>
        </GlassCard>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  segment: {
    flex: 1,
    minHeight: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  segmentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  libraryPressable: {
    marginTop: spacing.xs,
  },
  libraryCard: {
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.2)',
  },
  libraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  libraryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(109, 0, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  libraryText: {
    flex: 1,
  },
  libraryTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  librarySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});
