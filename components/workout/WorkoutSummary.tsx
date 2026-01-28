import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { colors, spacing, typography, borderRadius, layout } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';

export interface WorkoutStats {
  totalSets: number;
  totalReps: number;
  totalVolume: number; // kg
  estimatedCalories: number;
  averageRpe?: number;
  prsSet?: number; // number of personal records
}

export interface WorkoutSummaryData {
  mood_after: number;
  notes?: string;
}

interface WorkoutSummaryProps {
  visible: boolean;
  workoutTitle: string;
  workoutType?: string;
  duration: number; // minutes
  stats: WorkoutStats;
  onSave: (data: WorkoutSummaryData) => void;
  onClose: () => void;
  genesisFeedback?: string;
  streakCount?: number;
  isLoading?: boolean;
}

const moodEmojis = ['😫', '😕', '😐', '🙂', '💪'];
const moodLabels = ['Exhausto', 'Cansado', 'Normal', 'Bien', 'Increíble'];

/**
 * WorkoutSummary - Post-workout completion screen
 *
 * Features:
 * - Confetti celebration animation
 * - Stats grid (sets, reps, volume, calories)
 * - Mood selector (1-5)
 * - Optional notes
 * - GENESIS AI feedback
 * - Streak display
 */
export function WorkoutSummary({
  visible,
  workoutTitle,
  workoutType,
  duration,
  stats,
  onSave,
  onClose,
  genesisFeedback,
  streakCount = 0,
  isLoading = false,
}: WorkoutSummaryProps) {
  const [moodAfter, setMoodAfter] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [saved, setSaved] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const confettiRef = useRef<ConfettiCannon>(null);

  // Reset state and animate when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset state
      setMoodAfter(3);
      setNotes('');
      setShowConfetti(true);
      setSaved(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);

      // Entry animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Trigger haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [visible]);

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({ mood_after: moodAfter, notes: notes || undefined });
    setSaved(true);
  };

  const handleMoodSelect = (index: number) => {
    Haptics.selectionAsync();
    setMoodAfter(index + 1);
  };

  const formatVolume = (kg: number) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)}k`;
    }
    return kg.toString();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0F', '#0D0B14', '#050505']}
          style={StyleSheet.absoluteFill}
        />

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{ x: 195, y: -20 }}
          fadeOut
          explosionSpeed={350}
          fallSpeed={3000}
          colors={[colors.ngx, colors.mint, '#FFD700', '#FF6B6B', '#4ECDC4']}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.title}>SESIÓN COMPLETA</Text>
              {workoutType && (
                <Text style={styles.workoutType}>{workoutType}</Text>
              )}
            </View>

            {/* Workout Card */}
            <GlassCard style={styles.workoutCard}>
              <Text style={styles.workoutTitle}>{workoutTitle}</Text>
              <Text style={styles.workoutDuration}>{duration} minutos</Text>
            </GlassCard>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>📊</Text>
                <Text style={styles.statValue}>{stats.totalSets}</Text>
                <Text style={styles.statLabel}>sets</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🔥</Text>
                <Text style={styles.statValue}>{stats.estimatedCalories}</Text>
                <Text style={styles.statLabel}>kcal</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>💪</Text>
                <Text style={styles.statValue}>{formatVolume(stats.totalVolume)}</Text>
                <Text style={styles.statLabel}>kg vol</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>⏱️</Text>
                <Text style={styles.statValue}>{duration}</Text>
                <Text style={styles.statLabel}>min</Text>
              </View>
            </View>

            {/* PRs indicator */}
            {stats.prsSet && stats.prsSet > 0 && (
              <View style={styles.prBadge}>
                <Text style={styles.prEmoji}>🏆</Text>
                <Text style={styles.prText}>
                  {stats.prsSet} {stats.prsSet === 1 ? 'nuevo PR' : 'nuevos PRs'}!
                </Text>
              </View>
            )}

            {!saved ? (
              <>
                {/* Mood Selector */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>¿Cómo te sientes?</Text>
                  <View style={styles.moodRow}>
                    {moodEmojis.map((emoji, index) => (
                      <Pressable
                        key={index}
                        style={[
                          styles.moodButton,
                          moodAfter === index + 1 && styles.moodButtonActive,
                        ]}
                        onPress={() => handleMoodSelect(index)}
                      >
                        <Text style={styles.moodEmoji}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Text style={styles.moodLabel}>
                    {moodLabels[moodAfter - 1]}
                  </Text>
                </View>

                {/* Notes */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Notas (opcional)</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="¿Cómo fue la sesión? ¿Alguna molestia?"
                    placeholderTextColor={colors.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Save Button */}
                <Button
                  variant="mint"
                  onPress={handleSave}
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'GUARDANDO...' : 'GUARDAR SESIÓN'}
                </Button>
              </>
            ) : (
              <>
                {/* GENESIS Feedback */}
                {genesisFeedback && (
                  <GlassCard variant="elevated" style={styles.feedbackCard}>
                    <View style={styles.feedbackHeader}>
                      <View style={styles.genesisIcon}>
                        <Text style={styles.genesisIconText}>⬡</Text>
                      </View>
                      <Text style={styles.feedbackLabel}>GENESIS dice:</Text>
                    </View>
                    <Text style={styles.feedbackText}>{genesisFeedback}</Text>
                  </GlassCard>
                )}

                {/* Streak */}
                {streakCount > 1 && (
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakEmoji}>🔥</Text>
                    <Text style={styles.streakText}>
                      Racha: {streakCount} días
                    </Text>
                  </View>
                )}

                {/* Back to Home */}
                <Button variant="primary" onPress={onClose} fullWidth>
                  VOLVER AL INICIO
                </Button>

                {/* Share option */}
                <Pressable style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>
                    📤 Compartir logro
                  </Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    borderWidth: 2,
    borderColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  checkmark: {
    fontSize: 40,
    color: colors.mint,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: 2,
  },
  workoutType: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  workoutTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  workoutDuration: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  prBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  prEmoji: {
    fontSize: 20,
  },
  prText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#FFD700',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  moodButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonActive: {
    borderColor: colors.ngx,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.fontSize.base,
    minHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.ngx,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  genesisIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genesisIconText: {
    fontSize: 14,
    color: colors.text,
  },
  feedbackLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 1,
  },
  feedbackText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: borderRadius.full,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.warning,
  },
  shareButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  shareButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
});

export default WorkoutSummary;
