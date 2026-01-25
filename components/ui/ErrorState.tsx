import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle, WifiOff, ServerCrash } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '@/constants/theme';

type ErrorType = 'default' | 'network' | 'server';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ERROR_CONFIG: Record<ErrorType, {
  icon: typeof AlertTriangle;
  title: string;
  message: string;
}> = {
  default: {
    icon: AlertTriangle,
    title: 'Algo salió mal',
    message: 'Ocurrió un error inesperado. Intenta de nuevo.',
  },
  network: {
    icon: WifiOff,
    title: 'Sin conexión',
    message: 'Verifica tu conexión a internet e intenta de nuevo.',
  },
  server: {
    icon: ServerCrash,
    title: 'Error del servidor',
    message: 'Nuestros servidores están temporalmente fuera de servicio.',
  },
};

/**
 * ErrorState - Error feedback display
 *
 * Shows when an operation fails.
 * Includes retry button to recover from errors.
 */
export function ErrorState({
  type = 'default',
  title,
  message,
  onRetry,
  retryLabel = 'Reintentar',
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];
  const IconComponent = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconComponent size={32} color={colors.error} />
      </View>
      <Text style={styles.title}>{title || config.title}</Text>
      <Text style={styles.message}>{message || config.message}</Text>
      {onRetry && (
        <Button
          variant="secondary"
          onPress={onRetry}
          style={styles.retryButton}
        >
          {retryLabel}
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
    backgroundColor: 'rgba(255, 71, 87, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
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
  retryButton: {
    marginTop: spacing.md,
  },
});
