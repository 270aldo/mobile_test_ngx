import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface VisualizationPhase {
  id: string;
  name: string;
  duration: number; // seconds
  instruction: string;
}

interface VisualizationPlayerProps {
  /** Session title */
  title?: string;
  /** Workout name for visualization */
  workoutName?: string;
  /** Total duration in minutes */
  totalDuration?: number;
  /** Optional custom phases for the session */
  phases?: VisualizationPhase[];
  /** Coach name for affirmation */
  coachNote?: string;
  /** On completion callback */
  onComplete?: () => void;
  /** On skip callback */
  onSkip?: () => void;
  /** Test ID */
  testID?: string;
}

const DEFAULT_PHASES: VisualizationPhase[] = [
  {
    id: 'intro',
    name: 'Respiración',
    duration: 30,
    instruction: 'Cierra los ojos. Inhala profundo... exhala lento...',
  },
  {
    id: 'visualization',
    name: 'Visualización',
    duration: 90,
    instruction: 'Visualiza tu workout de hoy. Cada ejercicio perfecto...',
  },
  {
    id: 'intention',
    name: 'Intención',
    duration: 90,
    instruction: 'Hoy me enfocaré en la conexión mente-músculo...',
  },
  {
    id: 'affirmation',
    name: 'Afirmación',
    duration: 60,
    instruction: 'Soy fuerte. Soy capaz. Hoy doy mi mejor esfuerzo.',
  },
  {
    id: 'transition',
    name: 'Transición',
    duration: 30,
    instruction: 'Lentamente abre los ojos. Estás listo para tu día.',
  },
];

/**
 * VisualizationPlayer - Morning visualization session player
 *
 * Features:
 * - Guided breathing animation
 * - Phase progress indicator
 * - GENESIS voice integration ready
 * - Play/pause/skip controls
 */
export function VisualizationPlayer({
  title = 'Visualización Matutina',
  workoutName = 'Push Day',
  totalDuration,
  phases: customPhases,
  coachNote,
  onComplete,
  onSkip,
  testID,
}: VisualizationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [phaseElapsedTime, setPhaseElapsedTime] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  const phases = customPhases && customPhases.length > 0 ? customPhases : DEFAULT_PHASES;
  const sessionDurationSeconds = totalDuration != null
    ? totalDuration * 60
    : phases.reduce((sum, phase) => sum + phase.duration, 0);

  // Keep callback ref fresh
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset session state when content changes
    setIsPlaying(false);
    setCurrentPhaseIndex(0);
    setElapsedTime(0);
    setPhaseElapsedTime(0);
  }, [phases, sessionDurationSeconds]);

  // Breathing animation
  const breathScale = useSharedValue(1);
  const breathOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isPlaying && currentPhaseIndex === 0) {
      // Breathing animation during intro phase
      breathScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      breathOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [isPlaying, currentPhaseIndex]);

  // Timer effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;

          if (newTime >= sessionDurationSeconds) {
            setIsPlaying(false);
            onCompleteRef.current?.();
            return sessionDurationSeconds;
          }
          return newTime;
        });

        setPhaseElapsedTime((prev) => {
          const currentPhase = phases[currentPhaseIndex] ?? phases[0];
          const newPhaseTime = prev + 1;

          if (newPhaseTime >= currentPhase.duration) {
            // Move to next phase
            if (currentPhaseIndex < phases.length - 1) {
              setCurrentPhaseIndex((i) => i + 1);
              return 0;
            }
          }
          return newPhaseTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentPhaseIndex, phases, sessionDurationSeconds]);

  const breathAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
    opacity: breathOpacity.value,
  }));

  const currentPhase = phases[currentPhaseIndex] ?? phases[0];
  const progressPercent = sessionDurationSeconds > 0
    ? (elapsedTime / sessionDurationSeconds) * 100
    : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Breathing orb */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.orbOuter, breathAnimatedStyle]} />
        <View style={styles.orbInner}>
          <Text style={styles.phaseName}>{currentPhase.name}</Text>
          <Text style={styles.phaseTime}>
            {formatTime(Math.max(0, currentPhase.duration - phaseElapsedTime))}
          </Text>
        </View>
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>{currentPhase.instruction}</Text>

      {/* Workout context */}
      <View style={styles.contextContainer}>
        <Text style={styles.contextLabel}>Hoy:</Text>
        <Text style={styles.contextValue}>{workoutName}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.timeText}>{formatTime(sessionDurationSeconds)}</Text>
        </View>
      </View>

      {/* Phase indicators */}
      <View style={styles.phaseIndicators}>
        {phases.map((phase, index) => (
          <View
            key={phase.id}
            style={[
              styles.phaseIndicator,
              index <= currentPhaseIndex && styles.phaseIndicatorActive,
              index === currentPhaseIndex && styles.phaseIndicatorCurrent,
            ]}
          />
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={styles.controlButton}
          onPress={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX size={24} color={colors.textMuted} />
          ) : (
            <Volume2 size={24} color={colors.text} />
          )}
        </Pressable>

        <Pressable
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause size={32} color={colors.void} />
          ) : (
            <Play size={32} color={colors.void} style={{ marginLeft: 4 }} />
          )}
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={onSkip}
        >
          <SkipForward size={24} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Coach note if available */}
      {coachNote && (
        <View style={styles.coachNote}>
          <Text style={styles.coachNoteLabel}>Nota del coach:</Text>
          <Text style={styles.coachNoteText}>{coachNote}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Breathing orb
  orbContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  orbOuter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.ngx,
  },
  orbInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.void,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(109, 0, 255, 0.3)',
  },
  phaseName: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  phaseTime: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },

  // Instruction
  instruction: {
    fontSize: typography.fontSize.lg,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },

  // Context
  contextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    borderRadius: borderRadius.full,
  },
  contextLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  contextValue: {
    fontSize: typography.fontSize.sm,
    color: colors.ngx,
    fontWeight: typography.fontWeight.semibold,
  },

  // Progress
  progressContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.ngx,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },

  // Phase indicators
  phaseIndicators: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  phaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  phaseIndicatorActive: {
    backgroundColor: 'rgba(109, 0, 255, 0.5)',
  },
  phaseIndicatorCurrent: {
    backgroundColor: colors.ngx,
    transform: [{ scale: 1.2 }],
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: colors.mint,
  },

  // Coach note
  coachNote: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 245, 170, 0.1)',
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.mint,
  },
  coachNoteLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.mint,
    marginBottom: spacing.xs,
  },
  coachNoteText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
