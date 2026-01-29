import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Brain, Play, X } from 'lucide-react-native';
import { GlassCard, Button, Label } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

interface MindCardProps {
  /** Title of today's session */
  sessionTitle?: string;
  /** Duration in minutes */
  duration?: number;
  /** Whether the session has been completed today */
  completed?: boolean;
  /** Callback when user dismisses for today */
  onDismiss?: () => void;
  /** Test ID for testing */
  testID?: string;
}

/**
 * MindCard - Morning visualization / mindfulness card
 *
 * Appears on Home Hub to encourage daily mental preparation.
 * Links to visualization session with GENESIS voice guidance.
 */
export function MindCard({
  sessionTitle = 'Visualización Matutina',
  duration = 5,
  completed = false,
  onDismiss,
  testID,
}: MindCardProps) {
  const router = useRouter();

  if (completed) {
    return null; // Don't show if already completed today
  }

  return (
    <GlassCard style={styles.card} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Brain size={20} color={colors.mint} />
        </View>
        <Label color="mint">MENTE</Label>
        {onDismiss && (
          <Pressable style={styles.dismissButton} onPress={onDismiss}>
            <X size={16} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>{sessionTitle}</Text>
      <Text style={styles.subtitle}>
        Prepara tu mente para el día
      </Text>

      <View style={styles.meta}>
        <Text style={styles.duration}>{duration} min</Text>
        <Text style={styles.separator}>•</Text>
        <Text style={styles.guide}>Guiado por GENESIS</Text>
      </View>

      <View style={styles.actions}>
        <Button
          variant="mint"
          onPress={() => router.push('/(tabs)/mind')}
          style={styles.startButton}
        >
          <Play size={16} color={colors.void} style={{ marginRight: 6 }} />
          Comenzar
        </Button>
        {onDismiss && (
          <Pressable style={styles.skipButton} onPress={onDismiss}>
            <Text style={styles.skipText}>Saltar hoy</Text>
          </Pressable>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButton: {
    marginLeft: 'auto',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  duration: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  separator: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  guide: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  startButton: {
    flex: 1,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
