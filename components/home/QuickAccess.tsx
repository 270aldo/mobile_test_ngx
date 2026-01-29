import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, Utensils, Brain, Video } from 'lucide-react-native';
import { GlassCard, Label } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

const MODULES = [
  {
    key: 'train',
    label: 'Train',
    icon: Dumbbell,
    color: colors.ngx,
    borderColor: 'rgba(109, 0, 255, 0.15)',
    route: '/(tabs)/train' as const,
  },
  {
    key: 'nourish',
    label: 'Nourish',
    icon: Utensils,
    color: colors.warning,
    borderColor: 'rgba(255, 179, 71, 0.1)',
    route: '/(tabs)/nourish' as const,
  },
  {
    key: 'mind',
    label: 'Mente',
    icon: Brain,
    color: colors.mint,
    borderColor: 'rgba(0, 245, 170, 0.15)',
    route: '/(tabs)/mind' as const,
  },
  {
    key: 'video',
    label: 'Video',
    icon: Video,
    color: colors.ngx,
    borderColor: 'rgba(109, 0, 255, 0.15)',
    route: '/(tabs)/video' as const,
  },
] as const;

interface QuickAccessProps {
  testID?: string;
}

export function QuickAccess({ testID }: QuickAccessProps) {
  const router = useRouter();

  return (
    <View testID={testID}>
      <Label color="muted" style={styles.sectionLabel}>ACCESO RÁPIDO</Label>
      <View style={styles.row}>
        {MODULES.map((mod) => (
          <Pressable
            key={mod.key}
            style={styles.tile}
            onPress={() => router.push(mod.route)}
          >
            <GlassCard style={[styles.tileCard, { borderColor: mod.borderColor }]}>
              <mod.icon size={22} color={mod.color} />
              <Text style={styles.tileLabel}>{mod.label}</Text>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    flexBasis: '48%',
  },
  tileCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
  },
  tileLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
