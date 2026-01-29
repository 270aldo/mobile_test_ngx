import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { colors, typography } from '@/constants/theme';

interface LabelProps {
  children: string;
  color?: 'muted' | 'ngx' | 'mint' | 'chrome' | 'warning';
  style?: StyleProp<TextStyle>;
}

/**
 * Label - 10px uppercase tracking-widest
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * Labels: 10px, uppercase, tracking-widest
 */
export function Label({ children, color = 'muted', style }: LabelProps) {
  const colorMap = {
    muted: colors.textMuted,
    ngx: colors.ngx,
    mint: colors.mint,
    chrome: colors.chromeDark,
    warning: colors.warning,
  };

  return (
    <Text style={[styles.label, { color: colorMap[color] }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.regular,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
  },
});
