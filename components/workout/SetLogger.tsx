import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { Button } from '@/components/ui';

export interface SetLogData {
  weight_kg: number;
  reps_completed: number;
  rpe?: number;
  completed: boolean;
  failed?: boolean;
}

interface SetLoggerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: SetLogData) => void;
  exerciseName: string;
  setNumber: number;
  totalSets: number;
  lastWeight?: number;
  targetReps?: string;
  recommendedRpe?: number;
}

/**
 * SetLogger - Modal for logging individual sets
 *
 * Features:
 * - Weight input with stepper (2.5kg increments)
 * - Reps input with stepper
 * - Optional RPE selector (6-10)
 * - Last weight reference
 * - Haptic feedback
 */
export function SetLogger({
  visible,
  onClose,
  onSave,
  exerciseName,
  setNumber,
  totalSets,
  lastWeight = 0,
  targetReps = '8-12',
  recommendedRpe = 8,
}: SetLoggerProps) {
  const [weight, setWeight] = useState(lastWeight || 20);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState<number | null>(null);

  // Reset state when modal opens or lastWeight changes
  useEffect(() => {
    if (visible) {
      setWeight(lastWeight || 20);
      setReps(10);
      setRpe(null);
    }
  }, [visible, lastWeight]);

  const handleSave = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      weight_kg: weight,
      reps_completed: reps,
      rpe: rpe ?? undefined,
      completed: true,
    });
    onClose();
  }, [weight, reps, rpe, onSave, onClose]);

  const handleFailed = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onSave({
      weight_kg: weight,
      reps_completed: reps,
      rpe: rpe ?? undefined,
      completed: false,
      failed: true,
    });
    onClose();
  }, [weight, reps, rpe, onSave, onClose]);

  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    step: number
  ) => {
    Haptics.selectionAsync();
    setter((v) => v + step);
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    step: number,
    min = 0
  ) => {
    Haptics.selectionAsync();
    setter((v) => Math.max(min, v - step));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          <BlurView intensity={40} tint="dark" style={styles.blur}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.setLabel}>SET {setNumber} DE {totalSets}</Text>
              <Text style={styles.exerciseName}>{exerciseName}</Text>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PESO (kg)</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => handleDecrement(setWeight, 2.5)}
                >
                  <Text style={styles.stepperButtonText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{weight.toFixed(1)}</Text>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => handleIncrement(setWeight, 2.5)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </Pressable>
              </View>
              {lastWeight > 0 && (
                <Text style={styles.inputHint}>Último: {lastWeight}kg</Text>
              )}
            </View>

            {/* Reps Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REPETICIONES</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => handleDecrement(setReps, 1, 1)}
                >
                  <Text style={styles.stepperButtonText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{reps}</Text>
                <Pressable
                  style={styles.stepperButton}
                  onPress={() => handleIncrement(setReps, 1)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </Pressable>
              </View>
              <Text style={styles.inputHint}>Objetivo: {targetReps}</Text>
            </View>

            {/* RPE Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RPE (opcional)</Text>
              <View style={styles.rpeRow}>
                {[6, 7, 8, 9, 10].map((value) => (
                  <Pressable
                    key={value}
                    style={[
                      styles.rpeButton,
                      rpe === value && styles.rpeButtonActive,
                      value === recommendedRpe && styles.rpeButtonRecommended,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setRpe(rpe === value ? null : value);
                    }}
                  >
                    <Text
                      style={[
                        styles.rpeButtonText,
                        rpe === value && styles.rpeButtonTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.rpeHint}>
                {rpe === 6 && 'Podría hacer 4+ reps más'}
                {rpe === 7 && 'Podría hacer 3 reps más'}
                {rpe === 8 && 'Podría hacer 2 reps más'}
                {rpe === 9 && 'Podría hacer 1 rep más'}
                {rpe === 10 && 'Máximo esfuerzo'}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button variant="primary" onPress={handleSave} fullWidth>
                ✓ GUARDAR SET
              </Button>

              <Pressable style={styles.failedButton} onPress={handleFailed}>
                <Text style={styles.failedButtonText}>No completé este set</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </BlurView>

          {/* Top highlight */}
          <LinearGradient
            colors={['transparent', 'rgba(109, 0, 255, 0.5)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topHighlight}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 0,
  },
  blur: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl + 20, // Extra for home indicator
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: spacing.xl,
    right: spacing.xl,
    height: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  setLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 2,
  },
  exerciseName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  stepperValue: {
    fontSize: 40,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    minWidth: 120,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  inputHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  rpeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  rpeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rpeButtonActive: {
    backgroundColor: colors.ngx,
    borderColor: colors.ngx,
  },
  rpeButtonRecommended: {
    borderColor: 'rgba(109, 0, 255, 0.5)',
  },
  rpeButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  rpeButtonTextActive: {
    color: colors.text,
  },
  rpeHint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    minHeight: 18,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  failedButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  failedButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.error,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
});

export default SetLogger;
