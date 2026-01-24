import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'mint' | 'chip' | 'ghost' | 'coach' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Button - NGX Premium Button
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 *
 * Variants:
 * - primary: violeta solido + glow (CTA principal)
 * - secondary: borde blanco 20% + texto 70%
 * - mint: verde mint para acciones del coach
 * - chip: borde chrome, texto pequeño uppercase
 */
export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        variantStyles.button,
        sizeStyles.button,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'mint' || variant === 'coach' ? colors.void : colors.text}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            variantStyles.text,
            sizeStyles.text,
            isDisabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function getVariantStyles(variant: ButtonVariant): {
  button: ViewStyle;
  text: TextStyle;
} {
  switch (variant) {
    case 'primary':
      return {
        button: {
          backgroundColor: colors.ngx,
          borderRadius: borderRadius.full,
          ...shadows.primaryGlow,
        },
        text: {
          color: colors.text,
          fontWeight: typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    case 'secondary':
      return {
        button: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        text: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: typography.fontWeight.regular,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    case 'mint':
    case 'coach':
      return {
        button: {
          backgroundColor: colors.mint,
          borderRadius: borderRadius.full,
        },
        text: {
          color: colors.void,
          fontWeight: typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    case 'chip':
      return {
        button: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: colors.chipBorder,
        },
        text: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: typography.fontWeight.regular,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    case 'ghost':
      return {
        button: {
          backgroundColor: 'transparent',
          borderRadius: borderRadius.full,
        },
        text: {
          color: colors.ngx,
          fontWeight: typography.fontWeight.medium,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    case 'danger':
      return {
        button: {
          backgroundColor: colors.error,
          borderRadius: borderRadius.full,
        },
        text: {
          color: colors.text,
          fontWeight: typography.fontWeight.bold,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.widest,
        },
      };

    default:
      return {
        button: {},
        text: {},
      };
  }
}

function getSizeStyles(size: ButtonSize): {
  button: ViewStyle;
  text: TextStyle;
} {
  switch (size) {
    case 'sm':
      return {
        button: {
          paddingVertical: 8,
          paddingHorizontal: spacing.lg,
        },
        text: {
          fontSize: typography.fontSize.sm,
        },
      };
    case 'lg':
      return {
        button: {
          paddingVertical: 14,
          paddingHorizontal: spacing.xl,
        },
        text: {
          fontSize: typography.fontSize.lg,
        },
      };
    case 'md':
    default:
      return {
        button: {
          paddingVertical: 12,
          paddingHorizontal: spacing.xl,
        },
        text: {
          fontSize: typography.fontSize.sm,
        },
      };
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textDisabled: {
    opacity: 0.7,
  },
});
