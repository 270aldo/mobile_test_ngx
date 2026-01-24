import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius } from '@/constants/theme';

interface StatusPillProps {
  children: string;
}

/**
 * StatusPill - Estado corto (Pendiente / Semana 3)
 *
 * Basado en: mobile_genesis_hybrid_v2_flow.html
 * .status-pill {
 *   border: 1px solid rgba(109, 0, 255, 0.5);
 *   background: rgba(109, 0, 255, 0.18);
 *   padding: 4px 10px;
 *   border-radius: 999px;
 *   font-size: 10px;
 *   text-transform: uppercase;
 *   letter-spacing: 0.12em;
 * }
 */
export function StatusPill({ children }: StatusPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.statusPillBg,
    borderWidth: 1,
    borderColor: colors.statusPillBorder,
    borderRadius: borderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    color: colors.text,
    fontSize: typography.fontSize.label,
    fontWeight: typography.fontWeight.regular,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
  },
});
