import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Brain, Play, Headphones } from 'lucide-react-native';
import { GlassCard, Button } from '@/components/ui';
import { VisualizationPlayer } from '@/components/mindfulness';
import { colors, spacing, typography, layout } from '@/constants/theme';
import { useTodayWorkout } from '@/stores/season';
import { useCoachNotesByLocation } from '@/hooks/useCoachNotes';

/**
 * VisualizationScreen - Morning visualization session
 *
 * Guided 5-minute session with GENESIS voice (ElevenLabs):
 * 1. Breathing (30s)
 * 2. Workout visualization (90s)
 * 3. Day intention (90s)
 * 4. Affirmation + energy (60s)
 * 5. Transition (30s)
 */
export default function VisualizationScreen() {
  const router = useRouter();
  const [sessionStarted, setSessionStarted] = useState(false);

  // Get today's workout for context
  const todayWorkout = useTodayWorkout();
  const workoutName = todayWorkout?.title ?? 'Tu entrenamiento';

  // Get any coach notes for personalization
  const coachNotes = useCoachNotesByLocation('home');
  const latestCoachNote = coachNotes[0]?.content;

  const handleComplete = () => {
    setSessionStarted(false);
    // TODO: Track completion
    router.back();
  };

  const handleSkip = () => {
    setSessionStarted(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: !sessionStarted,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Button variant="ghost" onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text} />
            </Button>
          ),
        }}
      />

      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={sessionStarted
            ? ['rgba(109, 0, 255, 0.15)', 'transparent']
            : ['rgba(0, 245, 170, 0.1)', 'transparent']
          }
          style={styles.glow}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {sessionStarted ? (
          // Active session view
          <VisualizationPlayer
            title="Visualización Matutina"
            workoutName={workoutName}
            totalDuration={5}
            coachNote={latestCoachNote}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        ) : (
          // Pre-session view
          <View style={styles.content}>
            {/* Session info */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Brain size={32} color={colors.mint} />
              </View>
              <Text style={styles.title}>Visualización Matutina</Text>
              <Text style={styles.subtitle}>
                Prepara tu mente para el día
              </Text>
            </View>

            {/* Session preview */}
            <GlassCard style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>Sesión de hoy</Text>
              <View style={styles.sessionMeta}>
                <Text style={styles.sessionDuration}>5 minutos</Text>
                <Text style={styles.sessionDivider}>•</Text>
                <Text style={styles.sessionGuide}>Guiado por GENESIS</Text>
              </View>

              {/* Workout context */}
              <View style={styles.workoutContext}>
                <Text style={styles.workoutLabel}>Visualizarás:</Text>
                <Text style={styles.workoutName}>{workoutName}</Text>
              </View>

              <View style={styles.phases}>
                <View style={styles.phase}>
                  <View style={styles.phaseDot} />
                  <Text style={styles.phaseText}>Respiración y centramiento</Text>
                </View>
                <View style={styles.phase}>
                  <View style={styles.phaseDot} />
                  <Text style={styles.phaseText}>Visualización del workout</Text>
                </View>
                <View style={styles.phase}>
                  <View style={styles.phaseDot} />
                  <Text style={styles.phaseText}>Intención del día</Text>
                </View>
                <View style={styles.phase}>
                  <View style={styles.phaseDot} />
                  <Text style={styles.phaseText}>Afirmación y energía</Text>
                </View>
              </View>
            </GlassCard>

            {/* Play button */}
            <View style={styles.playContainer}>
              <Button
                variant="mint"
                onPress={() => setSessionStarted(true)}
                style={styles.playButton}
              >
                <Play size={24} color={colors.void} style={{ marginRight: 8 }} />
                Comenzar sesión
              </Button>
              <View style={styles.playHintContainer}>
                <Headphones size={14} color={colors.textMuted} />
                <Text style={styles.playHint}>
                  Usa auriculares para mejor experiencia
                </Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  glow: {
    flex: 1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: layout.contentPadding,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 245, 170, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },

  // Session card
  sessionCard: {
    marginVertical: spacing.xl,
  },
  sessionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sessionDuration: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.mint,
  },
  sessionDivider: {
    color: colors.textMuted,
  },
  sessionGuide: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  workoutContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(109, 0, 255, 0.1)',
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  workoutLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  workoutName: {
    fontSize: typography.fontSize.sm,
    color: colors.ngx,
    fontWeight: typography.fontWeight.semibold,
  },
  phases: {
    gap: spacing.md,
  },
  phase: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mint,
    opacity: 0.6,
  },
  phaseText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  // Play section
  playContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  playButton: {
    paddingHorizontal: spacing.xl,
  },
  playHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  playHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
