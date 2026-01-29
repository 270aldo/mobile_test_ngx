import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { MessageSquare, User, ChevronRight, ExternalLink } from 'lucide-react-native';
import { GlassCard } from '@/components/ui';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface CoachNoteMessageProps {
  /** Coach name */
  coachName: string;
  /** Note content */
  content: string;
  /** Time ago string */
  timeAgo?: string;
  /** WhatsApp number for responses */
  whatsappNumber?: string;
  /** Custom CTA text */
  ctaText?: string;
  /** Custom CTA action */
  onCtaPress?: () => void;
  /** Test ID */
  testID?: string;
}

/**
 * CoachNoteMessage - Coach note displayed as chat message
 *
 * Differentiates from GENESIS messages with:
 * - Mint accent color (instead of violet)
 * - Coach icon and name
 * - WhatsApp response CTA
 * - "NOTA DE TU COACH" label
 */
export function CoachNoteMessage({
  coachName,
  content,
  timeAgo,
  whatsappNumber,
  ctaText = 'Responder vía WhatsApp',
  onCtaPress,
  testID,
}: CoachNoteMessageProps) {
  const handleWhatsAppPress = () => {
    if (onCtaPress) {
      onCtaPress();
      return;
    }

    if (whatsappNumber) {
      const digits = whatsappNumber.replace(/[^0-9]/g, '');
      if (digits.length === 0) return;
      Linking.openURL(`https://wa.me/${digits}`);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Coach Avatar */}
      <View style={styles.avatar}>
        <User size={14} color={colors.mint} />
      </View>

      {/* Message Content */}
      <GlassCard variant="mint" style={styles.messageCard}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <MessageSquare size={12} color={colors.mint} />
            <Text style={styles.label}>NOTA DE TU COACH</Text>
          </View>
          {timeAgo && <Text style={styles.timeAgo}>{timeAgo}</Text>}
        </View>

        {/* Content */}
        <Text style={styles.content}>{content}</Text>

        {/* Coach Attribution */}
        <Text style={styles.attribution}>— {coachName}</Text>

        {/* WhatsApp CTA */}
        {(whatsappNumber || onCtaPress) && (
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            onPress={handleWhatsAppPress}
          >
            <Text style={styles.ctaText}>{ctaText}</Text>
            <ExternalLink size={14} color={colors.mint} />
          </Pressable>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 245, 170, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageCard: {
    maxWidth: '80%',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
    letterSpacing: 1,
  },
  timeAgo: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  content: {
    fontSize: typography.fontSize.base,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  attribution: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 170, 0.2)',
  },
  ctaButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
  },
  ctaText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
  },
});
