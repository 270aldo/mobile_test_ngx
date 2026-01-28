import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { Button } from '@/components/ui';

interface RestTimerProps {
  visible: boolean;
  duration: number; // seconds
  onComplete: () => void;
  onSkip: () => void;
  onExtend: (seconds: number) => void;
  coachNote?: string;
  nextExercise?: string;
}

const CIRCLE_SIZE = 220;
const STROKE_WIDTH = 10;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * RestTimer - Countdown timer between sets
 *
 * Features:
 * - Animated progress ring
 * - Haptic feedback every 30s and on complete
 * - Coach notes display
 * - Extend/skip functionality
 * - Auto-dismiss on complete
 */
export function RestTimer({
  visible,
  duration,
  onComplete,
  onSkip,
  onExtend,
  coachNote,
  nextExercise,
}: RestTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const [totalDuration, setTotalDuration] = useState(duration);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Calculate progress (0 to 1)
  const progress = totalDuration > 0 ? (totalDuration - remaining) / totalDuration : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Reset timer when visible changes
  useEffect(() => {
    if (visible) {
      setRemaining(duration);
      setTotalDuration(duration);
    }
  }, [visible, duration]);

  // Countdown logic
  useEffect(() => {
    if (!visible || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          // Timer complete
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(onComplete, 500);
          return 0;
        }

        // Haptic feedback every 30s
        if (next % 30 === 0 && next > 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Warning at 10 seconds
        if (next === 10) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, remaining, onComplete]);

  // Pulse animation when timer is low
  useEffect(() => {
    if (remaining <= 10 && remaining > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [remaining <= 10]);

  const handleExtend = useCallback(() => {
    Haptics.selectionAsync();
    setRemaining((prev) => prev + 30);
    setTotalDuration((prev) => prev + 30);
    onExtend(30);
  }, [onExtend]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSkip();
  }, [onSkip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <BlurView intensity={60} tint="dark" style={styles.container}>
          {/* Label */}
          <Text style={styles.label}>DESCANSO</Text>

          {/* Timer Circle */}
          <Animated.View
            style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            {/* Background circle */}
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {/* Progress circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke={remaining <= 10 ? colors.warning : colors.ngx}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
              />
            </Svg>

            {/* Timer value */}
            <View style={styles.timerValueContainer}>
              <Text
                style={[
                  styles.timerValue,
                  remaining <= 10 && styles.timerValueWarning,
                ]}
              >
                {formatTime(remaining)}
              </Text>
            </View>
          </Animated.View>

          {/* Recommended duration */}
          <Text style={styles.recommended}>Recomendado: {duration}s</Text>

          {/* Coach Note */}
          {coachNote && (
            <View style={styles.coachNote}>
              <Text style={styles.coachNoteLabel}>💡 Coach tip:</Text>
              <Text style={styles.coachNoteText}>{coachNote}</Text>
            </View>
          )}

          {/* Next exercise preview */}
          {nextExercise && (
            <View style={styles.nextExercise}>
              <Text style={styles.nextLabel}>SIGUIENTE</Text>
              <Text style={styles.nextName}>{nextExercise}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              variant="secondary"
              onPress={handleExtend}
              style={styles.actionButton}
            >
              + 30 seg
            </Button>
            <Button
              variant="primary"
              onPress={handleSkip}
              style={styles.actionButton}
            >
              Saltar →
            </Button>
          </View>
        </BlurView>

        {/* Background gradient */}
        <LinearGradient
          colors={['rgba(109, 0, 255, 0.1)', 'transparent', 'rgba(0, 0, 0, 0.5)']}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: spacing.xl,
  },
  timerContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  svg: {
    position: 'absolute',
  },
  timerValueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 64,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  timerValueWarning: {
    color: colors.warning,
  },
  recommended: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  coachNote: {
    backgroundColor: 'rgba(0, 245, 170, 0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: colors.mint,
  },
  coachNoteLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  coachNoteText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  nextExercise: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
  },
  nextLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  nextName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});

export default RestTimer;
