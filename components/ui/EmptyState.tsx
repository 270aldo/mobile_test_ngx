import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox, Dumbbell, TrendingUp, MessageSquare } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '@/constants/theme';

type EmptyStateType = 'default' | 'workouts' | 'progress' | 'messages';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EMPTY_STATE_CONFIG: Record<EmptyStateType, {
  icon: typeof Inbox;
  title: string;
  message: string;
}> = {
  default: {
    icon: Inbox,
    title: 'Nada por aquí',
    message: 'No hay datos disponibles todavía.',
  },
  workouts: {
    icon: Dumbbell,
    title: 'Sin entrenamientos',
    message: 'Tu primer workout te espera. Es hora de empezar.',
  },
  progress: {
    icon: TrendingUp,
    title: 'Sin historial',
    message: 'Completa tu primer entrenamiento para ver tu progreso.',
  },
  messages: {
    icon: MessageSquare,
    title: 'Sin mensajes',
    message: 'Pregunta algo a GENESIS para empezar la conversación.',
  },
};

/**
 * EmptyState - Motivational empty state display
 *
 * Shows when there's no content to display.
 * Includes optional CTA to guide the user.
 */
export function EmptyState({
  type = 'default',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const config = EMPTY_STATE_CONFIG[type];
  const IconComponent = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconComponent size={32} color={colors.ngx} />
      </View>
      <Text style={styles.title}>{title || config.title}</Text>
      <Text style={styles.message}>{message || config.message}</Text>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          onPress={onAction}
          style={styles.actionButton}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109, 0, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.md,
  },
});
