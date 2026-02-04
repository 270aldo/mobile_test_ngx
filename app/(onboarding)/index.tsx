import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { Button, GlassCard, Input, ScreenBackground } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuthStore, type ProfileUpdate } from '@/stores/auth';
import { router } from 'expo-router';

const TOTAL_STEPS = 14;

const STEP_TITLES = [
  'Bienvenido a NGX GENESIS',
  'Elige tu objetivo principal',
  'Experiencia de entrenamiento',
  'Métricas corporales',
  'Frecuencia semanal',
  'Equipamiento disponible',
  'Tiempo disponible',
  'Lesiones y limitaciones',
  'Preferencia nutricional',
  'Horario de sueño',
  'Conoce a tu coach',
  'Calibración de GENESIS',
  'Elige tu plan',
  'Configuración completa',
] as const;

type StepCopy = {
  subtitle: string;
  cta: string;
};

const STEP_COPY: Record<number, StepCopy> = {
  1: {
    subtitle: 'Vamos a personalizar tu entrenamiento. Esto toma unos 5 minutos.',
    cta: 'Comenzar',
  },
  2: {
    subtitle: 'Elige tu prioridad para ajustar tu programa.',
    cta: 'Continuar',
  },
  3: {
    subtitle: 'Cuéntanos tu experiencia para calibrar la intensidad.',
    cta: 'Continuar',
  },
  4: {
    subtitle: 'Usamos métricas básicas para personalizar cargas.',
    cta: 'Continuar',
  },
  5: {
    subtitle: '¿Cuántos días por semana puedes entrenar?',
    cta: 'Continuar',
  },
  6: {
    subtitle: 'Selecciona el equipo al que tienes acceso.',
    cta: 'Continuar',
  },
  7: {
    subtitle: '¿Cuánto tiempo puedes dedicar por sesión?',
    cta: 'Continuar',
  },
  8: {
    subtitle: 'Cuéntanos sobre lesiones o limitaciones.',
    cta: 'Continuar',
  },
  9: {
    subtitle: 'Elige un enfoque nutricional que se adapte a ti.',
    cta: 'Continuar',
  },
  10: {
    subtitle: 'Tu sueño nos ayuda a gestionar la recuperación.',
    cta: 'Continuar',
  },
  11: {
    subtitle: 'Te asignaremos un coach según tus objetivos.',
    cta: 'Continuar',
  },
  12: {
    subtitle: 'GENESIS está calibrando tu programa.',
    cta: 'Continuar',
  },
  13: {
    subtitle: 'Elige el plan que potencia tu transformación.',
    cta: 'Continuar',
  },
  14: {
    subtitle: 'Estás listo. Empecemos tu temporada.',
    cta: 'Entrar a la app',
  },
};

const STEP_OPTIONS: Record<number, string[]> = {
  2: ['Fuerza y tamaño', 'Rendimiento atlético', 'Longevidad y salud', 'Recomposición corporal'],
  3: ['Principiante', 'Intermedio', 'Avanzado', 'Atleta'],
  5: ['2-3 días', '4 días', '5 días', '6+ días'],
  6: ['Gimnasio completo', 'Solo mancuernas', 'Bandas y peso corporal', 'Equipo mínimo'],
  7: ['30 min', '45 min', '60 min', '75+ min'],
  9: ['Balanceada', 'Alta en proteína', 'Baja en carbos', 'Basada en plantas'],
  10: ['Antes de 10pm', '10pm - 12am', 'Después de medianoche', 'Irregular'],
  13: ['Core', 'Elite', 'Coach + AI', 'Indeciso'],
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [metrics, setMetrics] = useState({
    age: '',
    heightCm: '',
    weightKg: '',
    limitations: '',
    gender: '',
  });

  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const isLoading = useAuthStore((s) => s.isLoading);

  const currentCopy = useMemo(() => STEP_COPY[step], [step]);
  const options = STEP_OPTIONS[step] ?? [];

  const onSelect = (value: string) => {
    setSelections((prev) => ({ ...prev, [step]: value }));
  };

  const buildProfileUpdates = (): ProfileUpdate => {
    const goalMap: Record<string, ProfileUpdate['goal']> = {
      'Fuerza y tamaño': 'muscle',
      'Rendimiento atlético': 'performance',
      'Longevidad y salud': 'longevity',
      'Recomposición corporal': 'hybrid',
    };

    const experienceMap: Record<string, ProfileUpdate['experience_level']> = {
      Principiante: 'beginner',
      Intermedio: 'intermediate',
      Avanzado: 'advanced',
      Atleta: 'advanced',
    };

    const trainingDaysMap: Record<string, number> = {
      '2-3 días': 3,
      '4 días': 4,
      '5 días': 5,
      '6+ días': 6,
    };

    const durationMap: Record<string, number> = {
      '30 min': 30,
      '45 min': 45,
      '60 min': 60,
      '75+ min': 75,
    };

    const equipmentMap: Record<string, ProfileUpdate['equipment_access']> = {
      'Gimnasio completo': 'gym',
      'Solo mancuernas': 'home',
      'Bandas y peso corporal': 'home',
      'Equipo mínimo': 'home',
    };

    const activityMap: Record<string, ProfileUpdate['activity_level']> = {
      '2-3 días': 'light',
      '4 días': 'moderate',
      '5 días': 'active',
      '6+ días': 'active',
    };

    const genderMap: Record<string, ProfileUpdate['gender']> = {
      Hombre: 'male',
      Mujer: 'female',
      Otro: 'other',
    };

    const parsedAge = Number(metrics.age);
    const parsedHeight = Number(metrics.heightCm);
    const parsedWeight = Number(metrics.weightKg);

    return {
      goal: goalMap[selections[2]],
      experience_level: experienceMap[selections[3]],
      training_days_per_week: trainingDaysMap[selections[5]],
      session_duration_minutes: durationMap[selections[7]],
      equipment_access: equipmentMap[selections[6]],
      activity_level: activityMap[selections[5]],
      gender: genderMap[metrics.gender],
      age: Number.isFinite(parsedAge) && parsedAge > 0 ? parsedAge : undefined,
      height_cm:
        Number.isFinite(parsedHeight) && parsedHeight > 0
          ? parsedHeight
          : undefined,
      weight_kg:
        Number.isFinite(parsedWeight) && parsedWeight > 0
          ? parsedWeight
          : undefined,
      limitations: metrics.limitations
        ? metrics.limitations
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
    };
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      return;
    }

    const { error } = await completeOnboarding(buildProfileUpdates(), {
      nutrition_preference: selections[9],
      sleep_schedule: selections[10],
    });
    if (!error) {
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <ScreenBackground gradientColors={[colors.background, colors.surface]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.stepLabel}>{`PASO ${step} / ${TOTAL_STEPS}`}</Text>
            <Text style={styles.title}>{STEP_TITLES[step - 1]}</Text>
            <Text style={styles.subtitle}>{currentCopy.subtitle}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Sparkles size={28} color={colors.primary} />
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.body}>
          {step === 4 ? (
            <GlassCard style={styles.infoCard} padding="lg">
              <Input
                label="Edad"
                placeholder="ej. 32"
                keyboardType="number-pad"
                value={metrics.age}
                onChangeText={(value) =>
                  setMetrics((prev) => ({ ...prev, age: value }))
                }
                testID="onboarding-age-input"
              />
              <View style={styles.metricsRow}>
                <View style={styles.metricColumn}>
                  <Input
                    label="Estatura (cm)"
                    placeholder="ej. 178"
                    keyboardType="number-pad"
                    value={metrics.heightCm}
                    onChangeText={(value) =>
                      setMetrics((prev) => ({ ...prev, heightCm: value }))
                    }
                    testID="onboarding-height-input"
                    containerStyle={styles.metricInput}
                  />
                </View>
                <View style={styles.metricColumn}>
                  <Input
                    label="Peso (kg)"
                    placeholder="ej. 82"
                    keyboardType="number-pad"
                    value={metrics.weightKg}
                    onChangeText={(value) =>
                      setMetrics((prev) => ({ ...prev, weightKg: value }))
                    }
                    testID="onboarding-weight-input"
                    containerStyle={styles.metricInput}
                  />
                </View>
              </View>
              <Text style={styles.sectionLabel}>Género</Text>
              <View style={styles.inlineOptions}>
                {['Hombre', 'Mujer', 'Otro'].map((option) => (
                  <Pressable
                    key={option}
                    onPress={() =>
                      setMetrics((prev) => ({ ...prev, gender: option }))
                    }
                    style={({ pressed }) => [
                      styles.inlineOption,
                      metrics.gender === option && styles.inlineOptionSelected,
                      pressed && styles.optionPressed,
                    ]}
                    testID={`onboarding-gender-${option}`}
                  >
                    <Text
                      style={[
                        styles.inlineOptionText,
                        metrics.gender === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </GlassCard>
          ) : step === 8 ? (
            <GlassCard style={styles.infoCard} padding="lg">
              <Text style={styles.infoTitle}>Lesiones o limitaciones</Text>
              <Text style={styles.infoText}>
                Indica lo que debamos considerar. Separa con comas.
              </Text>
              <Input
                label="Limitaciones"
                placeholder="ej. dolor de rodilla, hombro"
                value={metrics.limitations}
                onChangeText={(value) =>
                  setMetrics((prev) => ({ ...prev, limitations: value }))
                }
                testID="onboarding-limitations-input"
              />
            </GlassCard>
          ) : options.length > 0 ? (
            <View style={styles.optionsGrid}>
              {options.map((option) => {
                const isSelected = selections[step] === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => onSelect(option)}
                    style={({ pressed }) => [
                      styles.optionButton,
                      isSelected && styles.optionButtonSelected,
                      pressed && styles.optionPressed,
                    ]}
                    testID={`onboarding-option-${step}-${option}`}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <GlassCard style={styles.infoCard} padding="lg">
              <Text style={styles.infoTitle}>GENESIS Notes</Text>
              <Text style={styles.infoText}>
                This step collects qualitative inputs. We will add structured
                inputs here next.
              </Text>
            </GlassCard>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerActions}>
            <Button
              variant="secondary"
              onPress={handleBack}
              disabled={step === 1}
              testID="onboarding-back-button"
              style={styles.backButton}
            >
              Back
            </Button>
            <Button
              onPress={handleNext}
              loading={isLoading}
              testID="onboarding-next-button"
              style={styles.nextButton}
            >
              {currentCopy.cta}
            </Button>
          </View>
          <Text style={styles.footerHint}>
            {step === TOTAL_STEPS
              ? 'We will generate your season next.'
              : 'Your answers shape your AI program.'}
          </Text>
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    maxWidth: 260,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    maxWidth: 260,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 3,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  optionsGrid: {
    gap: spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricColumn: {
    flex: 1,
  },
  metricInput: {
    marginBottom: 0,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inlineOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
  },
  inlineOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  inlineOptionText: {
    color: colors.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  optionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.surface,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(109, 0, 255, 0.15)',
  },
  optionPressed: {
    opacity: 0.8,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  infoCard: {
    marginTop: spacing.lg,
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  footerHint: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
