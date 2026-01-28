# PHASE 2: WORKOUT PLAYER - IMPLEMENTACIÓN COMPLETA

> **Para Claude Code** - El corazón de la experiencia GENESIS

---

## 🎯 POR QUÉ EL WORKOUT PLAYER ES CRÍTICO

### Impacto en Retención

El Workout Player es donde el usuario pasa **el 80% de su tiempo activo** en la app. Es el momento de máxima atención donde:

1. **Se genera el hábito** - Un flujo fluido = volver mañana
2. **Se percibe el valor** - "Esta app sabe lo que hace"
3. **Se justifica el precio** - $199-499/mes se siente barato si la experiencia es premium
4. **Se diferencia de competidores** - Donde apps genéricas fallan

### Métricas que Impacta

| Métrica | Sin Player Premium | Con Player Premium |
|---------|-------------------|-------------------|
| Workout completion rate | ~60% | ~85% |
| Return next day | ~40% | ~70% |
| Week 1 retention | ~50% | ~75% |
| Month 1 retention | ~20% | ~45% |

**Un Workout Player excepcional puede DUPLICAR tu retention.**

---

## 📊 ESTADO ACTUAL vs OBJETIVO

### Lo que EXISTE (train/index.tsx)

✅ Timer básico funcionando
✅ Lista de ejercicios del workout
✅ Progress ring
✅ Estados de ejercicio (completado/actual/pendiente)
✅ Conexión a stores (todayWorkout, exerciseBlocks)

### Lo que FALTA

❌ **Log de sets real** - Solo marca ejercicio completo, no sets individuales
❌ **Input de peso/reps** - No hay forma de registrar lo que hizo el usuario
❌ **Rest timer** - Crítico para hipertrofia/fuerza
❌ **Video/instrucciones** - El usuario no sabe cómo hacer el ejercicio
❌ **Historial del ejercicio** - "¿Cuánto levanté la semana pasada?"
❌ **RPE input** - Percepción de esfuerzo para auto-regulación
❌ **Notas de ejercicio** - El coach puede dejar tips específicos
❌ **Superset/Circuit support** - Ejercicios agrupados
❌ **Swipe navigation** - Pasar entre ejercicios con gesto
❌ **Haptic feedback** - Sensación táctil al completar
❌ **Workout summary** - Resumen al finalizar
❌ **GENESIS feedback** - Comentario de IA post-workout

---

## 🏗️ ARQUITECTURA DEL WORKOUT PLAYER

### Flujo de Pantallas

```
[Home] → [Pre-Workout] → [Workout Player] → [Set Logger] → [Rest Timer] → [Summary]
              ↓                   ↓                              ↓
         Warm-up tips      Exercise View              GENESIS Feedback
```

### Componentes Necesarios

```
components/workout/
├── WorkoutPlayer.tsx        # Orquestador principal
├── ExerciseView.tsx         # Vista de ejercicio individual
├── SetLogger.tsx            # Modal para registrar set
├── RestTimer.tsx            # Timer de descanso con animación
├── ExerciseHistory.tsx      # Historial de este ejercicio
├── ExerciseInstructions.tsx # Video + cues del coach
├── WorkoutSummary.tsx       # Pantalla final
├── WorkoutHeader.tsx        # Header con timer global
├── ExerciseList.tsx         # Lista lateral/inferior
└── ProgressIndicator.tsx    # Indicador de progreso visual
```

---

## 📱 DISEÑO UX DETALLADO

### 1. Pre-Workout Screen (Nueva)

Antes de empezar, mostrar:
- Nombre del workout + tipo
- Músculos objetivo (con diagrama visual)
- Duración estimada
- Notas del coach (si existen)
- "¿Cómo te sientes hoy?" (1-5 para energy_level)

```typescript
// app/(tabs)/train/pre-workout.tsx
interface PreWorkoutData {
  mood_before: number; // 1-5
  energy_level: number; // 1-5
  notes?: string;
}
```

### 2. Exercise View (Core del Player)

Layout de pantalla completa para cada ejercicio:

```
┌─────────────────────────────────────┐
│  ← Back            00:34:21    ⋮   │  ← Header con timer global
├─────────────────────────────────────┤
│                                     │
│    [VIDEO/GIF del ejercicio]        │  ← 40% de pantalla
│                                     │
├─────────────────────────────────────┤
│  BENCH PRESS                    2/5 │  ← Nombre + progreso
│  Pecho, Tríceps                     │  ← Músculos
├─────────────────────────────────────┤
│  Prescripción: 4x8-10 @ RPE 8       │
│  Descanso: 90s                      │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ ✓   │ │  2  │ │  3  │ │  4  │   │  ← Set indicators
│  │ 80kg│ │     │ │     │ │     │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  Último workout: 77.5kg x 10        │  ← Historial
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │     REGISTRAR SET           │    │  ← CTA principal
│  └─────────────────────────────┘    │
│                                     │
│  [Ver instrucciones]  [Saltar]      │  ← Acciones secundarias
└─────────────────────────────────────┘
```

### 3. Set Logger Modal

Modal que aparece al tocar "Registrar Set":

```
┌─────────────────────────────────────┐
│           SET 2 DE 4                │
│         Bench Press                 │
├─────────────────────────────────────┤
│                                     │
│  PESO (kg)                          │
│  ┌─────────────────────────────┐    │
│  │    [-]     80.0     [+]     │    │  ← Stepper con 2.5kg steps
│  └─────────────────────────────┘    │
│  Último: 77.5kg                     │
│                                     │
│  REPETICIONES                       │
│  ┌─────────────────────────────┐    │
│  │    [-]      10      [+]     │    │  ← Stepper
│  └─────────────────────────────┘    │
│  Objetivo: 8-10                     │
│                                     │
│  RPE (opcional)                     │
│  ┌─────────────────────────────┐    │
│  │ 6 │ 7 │ 8 │ 9 │ 10│ F │    │    │  ← RPE selector
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │     ✓ GUARDAR SET           │    │  ← Haptic feedback
│  └─────────────────────────────┘    │
│                                     │
│  [No completé este set]             │  ← Marcar como fallido
└─────────────────────────────────────┘
```

### 4. Rest Timer

Aparece automáticamente después de registrar set (excepto último):

```
┌─────────────────────────────────────┐
│                                     │
│           DESCANSO                  │
│                                     │
│      ┌───────────────────┐          │
│      │                   │          │
│      │       1:23        │          │  ← Countdown grande
│      │                   │          │
│      │   ───────────○    │          │  ← Progress ring
│      └───────────────────┘          │
│                                     │
│      Recomendado: 90s               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     SALTAR DESCANSO         │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     + 30 SEGUNDOS           │    │  ← Extender descanso
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

**Comportamiento:**
- Vibración suave cada 30s
- Vibración fuerte cuando termina
- Auto-dismiss y mostrar siguiente set
- Si hay coach_notes para el ejercicio, mostrarlas aquí

### 5. Workout Summary

Al finalizar todos los ejercicios:

```
┌─────────────────────────────────────┐
│                                     │
│         ✓ SESIÓN COMPLETA           │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Upper Body Power          │    │
│  │   47:23 minutos             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────┬─────┬─────┬─────┐         │
│  │ 📊  │ 🔥  │ 💪  │ ⏱️  │         │
│  │ 24  │1240 │6800 │ 47  │         │
│  │sets │kcal │ kg  │ min │         │
│  └─────┴─────┴─────┴─────┘         │
│                                     │
│  ¿Cómo te sientes?                  │
│  😫  😕  😐  🙂  💪                 │  ← mood_after
│                                     │
│  Notas (opcional)                   │
│  ┌─────────────────────────────┐    │
│  │ Hombro derecho un poco...   │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     GUARDAR SESIÓN          │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘

        ↓ Después de guardar ↓

┌─────────────────────────────────────┐
│                                     │
│     [Animación de confeti]          │
│                                     │
│         🏆 ¡EXCELENTE!              │
│                                     │
│  GENESIS dice:                      │
│  ┌─────────────────────────────┐    │
│  │ "Gran sesión. Tu volumen    │    │
│  │  de pecho aumentó 12% vs    │    │
│  │  la semana pasada. El RPE   │    │
│  │  promedio de 8 indica que   │    │
│  │  estás en el rango óptimo.  │    │
│  │  Mañana: recuperación."     │    │
│  └─────────────────────────────┘    │
│                                     │
│  🔥 Racha: 4 días                   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     VOLVER AL INICIO        │    │
│  └─────────────────────────────┘    │
│                                     │
│  [Compartir en redes]               │
└─────────────────────────────────────┘
```

---

## 💾 DATA LAYER

### Store Updates Necesarios

```typescript
// stores/workout.ts - AGREGAR

interface WorkoutState {
  // ... existing

  // Active session tracking
  activeSetIndex: number;
  activeExerciseIndex: number;
  restTimerSeconds: number;
  isResting: boolean;

  // Pre/Post workout data
  preWorkoutData: {
    mood_before: number;
    energy_level: number;
  } | null;
}

interface WorkoutActions {
  // ... existing

  // New actions
  setActiveExercise: (index: number) => void;
  setActiveSet: (index: number) => void;
  startRestTimer: (seconds: number) => void;
  skipRest: () => void;
  extendRest: (seconds: number) => void;
  setPreWorkoutData: (data: PreWorkoutData) => void;

  // Enhanced logging
  logSetWithDetails: (data: {
    exercise_block_id: string;
    set_number: number;
    reps_completed: number;
    weight_kg: number;
    rpe?: number;
    notes?: string;
    completed: boolean;
  }) => Promise<void>;
}
```

### API Additions

```typescript
// services/api/workout.ts - AGREGAR

export const workoutApi = {
  // ... existing

  // Get exercise history for a user
  getExerciseHistory: async (userId: string, exerciseName: string, limit = 10) => {
    const { data, error } = await supabase
      .from('set_logs')
      .select(`
        *,
        workout_logs!inner (
          workout_id,
          workouts!inner (
            scheduled_date,
            title
          )
        )
      `)
      .eq('workout_logs.user_id', userId)
      .ilike('exercise_blocks.exercise_name', exerciseName)
      .order('logged_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get last performance for specific exercise
  getLastPerformance: async (userId: string, exerciseBlockId: string) => {
    // Buscar el último set_log de este ejercicio
    const { data, error } = await supabase
      .from('set_logs')
      .select('weight_kg, reps_completed, rpe')
      .eq('exercise_block_id', exerciseBlockId)
      .order('logged_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Calculate workout stats
  calculateWorkoutStats: async (workoutLogId: string) => {
    const { data: sets, error } = await supabase
      .from('set_logs')
      .select('weight_kg, reps_completed')
      .eq('workout_log_id', workoutLogId);

    if (error) throw error;

    const totalSets = sets?.length || 0;
    const totalVolume = sets?.reduce((acc, s) =>
      acc + (s.weight_kg || 0) * (s.reps_completed || 0), 0) || 0;
    const estimatedCalories = Math.round(totalSets * 8 + totalVolume * 0.05);

    return { totalSets, totalVolume, estimatedCalories };
  },
};
```

### Database: Exercise Library (Nueva tabla)

Para videos e instrucciones:

```sql
-- Nueva tabla para biblioteca de ejercicios
CREATE TABLE exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identifiers
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  aliases TEXT[], -- ["press de banca", "bench", "pecho plano"]

  -- Categorization
  primary_muscle TEXT NOT NULL,
  secondary_muscles TEXT[],
  equipment TEXT[], -- ["barbell", "bench", "rack"]
  movement_pattern TEXT, -- "push", "pull", "squat", "hinge", "carry"

  -- Instructions
  description TEXT,
  coaching_cues TEXT[],
  common_mistakes TEXT[],

  -- Media
  video_url TEXT,
  thumbnail_url TEXT,
  gif_url TEXT,

  -- Metadata
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  is_compound BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda
CREATE INDEX exercise_library_name_idx ON exercise_library USING gin(to_tsvector('spanish', name));
CREATE INDEX exercise_library_aliases_idx ON exercise_library USING gin(aliases);

-- Seed inicial con ejercicios comunes
INSERT INTO exercise_library (name, slug, primary_muscle, equipment, coaching_cues) VALUES
('Bench Press', 'bench-press', 'chest', ARRAY['barbell', 'bench'], ARRAY['Retrae escápulas', 'Pies firmes en el suelo', 'Barra sobre pecho medio']),
('Squat', 'squat', 'quadriceps', ARRAY['barbell', 'rack'], ARRAY['Rodillas hacia afuera', 'Pecho arriba', 'Profundidad paralela o más']),
('Deadlift', 'deadlift', 'hamstrings', ARRAY['barbell'], ARRAY['Espalda neutra', 'Barra pegada al cuerpo', 'Empuja el piso']),
('Pull-up', 'pull-up', 'back', ARRAY['pull-up bar'], ARRAY['Escápulas abajo y atrás', 'Codos hacia las costillas', 'Control en bajada']);
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### PASO 1: Componentes Base

```typescript
// components/workout/SetLogger.tsx
import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard, Button } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

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

interface SetLogData {
  weight_kg: number;
  reps_completed: number;
  rpe?: number;
  completed: boolean;
}

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
  const [weight, setWeight] = useState(lastWeight);
  const [reps, setReps] = useState(10);
  const [rpe, setRpe] = useState<number | null>(null);

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

  const handleIncrement = (setter: (v: number) => void, value: number, step: number) => {
    Haptics.selectionAsync();
    setter(value + step);
  };

  const handleDecrement = (setter: (v: number) => void, value: number, step: number, min = 0) => {
    Haptics.selectionAsync();
    setter(Math.max(min, value - step));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <GlassCard variant="elevated" style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SET {setNumber} DE {totalSets}</Text>
            <Text style={styles.subtitle}>{exerciseName}</Text>
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PESO (kg)</Text>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepperButton}
                onPress={() => handleDecrement(setWeight, weight, 2.5)}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{weight.toFixed(1)}</Text>
              <Pressable
                style={styles.stepperButton}
                onPress={() => handleIncrement(setWeight, weight, 2.5)}
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
                onPress={() => handleDecrement(setReps, reps, 1, 1)}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{reps}</Text>
              <Pressable
                style={styles.stepperButton}
                onPress={() => handleIncrement(setReps, reps, 1)}
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
                  <Text style={[
                    styles.rpeButtonText,
                    rpe === value && styles.rpeButtonTextActive,
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Actions */}
          <Button variant="primary" onPress={handleSave} fullWidth>
            ✓ GUARDAR SET
          </Button>

          <Pressable style={styles.skipButton} onPress={onClose}>
            <Text style={styles.skipButtonText}>Cancelar</Text>
          </Pressable>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
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
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.sm,
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  stepperValue: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    minWidth: 120,
    textAlign: 'center',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rpeButtonActive: {
    backgroundColor: colors.ngx,
  },
  rpeButtonRecommended: {
    borderColor: 'rgba(109, 0, 255, 0.5)',
  },
  rpeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  rpeButtonTextActive: {
    color: colors.text,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  skipButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
});
```

### PASO 2: Rest Timer Component

```typescript
// components/workout/RestTimer.tsx
import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard, Button } from '@/components/ui';
import { colors, spacing, typography } from '@/constants/theme';

interface RestTimerProps {
  visible: boolean;
  duration: number; // seconds
  onComplete: () => void;
  onSkip: () => void;
  onExtend: (seconds: number) => void;
  coachNote?: string;
}

export function RestTimer({
  visible,
  duration,
  onComplete,
  onSkip,
  onExtend,
  coachNote,
}: RestTimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const progress = (duration - remaining) / duration;

  useEffect(() => {
    if (!visible) {
      setRemaining(duration);
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onComplete();
          return 0;
        }

        // Haptic every 30s
        if (prev % 30 === 0 && prev !== duration) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, duration, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <View style={styles.overlay}>
        <GlassCard variant="elevated" style={styles.container}>
          <Text style={styles.label}>DESCANSO</Text>

          {/* Timer Circle */}
          <View style={styles.timerContainer}>
            <View style={styles.timerRing}>
              <Text style={styles.timerValue}>{formatTime(remaining)}</Text>
            </View>
            {/* Progress ring would be SVG/Skia in real implementation */}
          </View>

          <Text style={styles.recommended}>Recomendado: {duration}s</Text>

          {/* Coach Note */}
          {coachNote && (
            <View style={styles.coachNote}>
              <Text style={styles.coachNoteLabel}>💡 Coach tip:</Text>
              <Text style={styles.coachNoteText}>{coachNote}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              variant="secondary"
              onPress={() => onExtend(30)}
              style={styles.actionButton}
            >
              + 30 seg
            </Button>
            <Button
              variant="primary"
              onPress={onSkip}
              style={styles.actionButton}
            >
              Saltar
            </Button>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: spacing.xl,
  },
  timerContainer: {
    marginBottom: spacing.xl,
  },
  timerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: colors.ngx,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    fontSize: 56,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  recommended: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  coachNote: {
    backgroundColor: 'rgba(0, 245, 170, 0.08)',
    borderRadius: 12,
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
    lineHeight: 20,
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
```

### PASO 3: Workout Summary Component

```typescript
// components/workout/WorkoutSummary.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GlassCard, Button } from '@/components/ui';
import { colors, spacing, typography, layout } from '@/constants/theme';

interface WorkoutSummaryProps {
  workoutTitle: string;
  duration: number; // minutes
  stats: {
    totalSets: number;
    totalVolume: number;
    estimatedCalories: number;
  };
  onSave: (data: { mood_after: number; notes?: string }) => void;
  genesisFeedback?: string;
  streakCount?: number;
}

const moodEmojis = ['😫', '😕', '😐', '🙂', '💪'];

export function WorkoutSummary({
  workoutTitle,
  duration,
  stats,
  onSave,
  genesisFeedback,
  streakCount,
}: WorkoutSummaryProps) {
  const [moodAfter, setMoodAfter] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [showConfetti, setShowConfetti] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({ mood_after: moodAfter, notes: notes || undefined });
    setSaved(true);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#0D0B14', '#050505']}
        style={StyleSheet.absoluteFill}
      />

      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: 200, y: -20 }}
          fadeOut
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.title}>SESIÓN COMPLETA</Text>
          </View>

          {/* Workout Card */}
          <GlassCard style={styles.workoutCard}>
            <Text style={styles.workoutTitle}>{workoutTitle}</Text>
            <Text style={styles.workoutDuration}>{duration} minutos</Text>
          </GlassCard>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSets}</Text>
              <Text style={styles.statLabel}>sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.estimatedCalories}</Text>
              <Text style={styles.statLabel}>kcal</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}k</Text>
              <Text style={styles.statLabel}>kg vol</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{duration}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
          </View>

          {!saved ? (
            <>
              {/* Mood Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>¿Cómo te sientes?</Text>
                <View style={styles.moodRow}>
                  {moodEmojis.map((emoji, index) => (
                    <GlassCard
                      key={index}
                      style={[
                        styles.moodButton,
                        moodAfter === index + 1 && styles.moodButtonActive,
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setMoodAfter(index + 1);
                      }}
                    >
                      <Text style={styles.moodEmoji}>{emoji}</Text>
                    </GlassCard>
                  ))}
                </View>
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
                />
              </View>

              {/* Save Button */}
              <Button variant="mint" onPress={handleSave} fullWidth>
                GUARDAR SESIÓN
              </Button>
            </>
          ) : (
            <>
              {/* GENESIS Feedback */}
              {genesisFeedback && (
                <GlassCard variant="elevated" style={styles.feedbackCard}>
                  <Text style={styles.feedbackLabel}>GENESIS dice:</Text>
                  <Text style={styles.feedbackText}>{genesisFeedback}</Text>
                </GlassCard>
              )}

              {/* Streak */}
              {streakCount && streakCount > 1 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakEmoji}>🔥</Text>
                  <Text style={styles.streakText}>Racha: {streakCount} días</Text>
                </View>
              )}

              {/* Back to Home */}
              <Button variant="primary" onPress={() => {}} fullWidth>
                VOLVER AL INICIO
              </Button>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
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
  content: {
    padding: layout.contentPadding,
    paddingBottom: layout.contentPaddingBottom,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  checkmark: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: 2,
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
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    borderColor: colors.ngx,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 28,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    fontSize: typography.fontSize.base,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  feedbackCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.ngx,
  },
  feedbackLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.ngx,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 100,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.warning,
  },
});
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Componentes
- [ ] `SetLogger.tsx` - Modal de registro de set
- [ ] `RestTimer.tsx` - Timer de descanso
- [ ] `WorkoutSummary.tsx` - Pantalla de resumen
- [ ] `ExerciseHistory.tsx` - Historial del ejercicio
- [ ] `ExerciseInstructions.tsx` - Video + coaching cues

### Database
- [ ] Crear tabla `exercise_library`
- [ ] Seed con ejercicios básicos
- [ ] Index para búsqueda

### Store Updates
- [ ] Agregar `activeSetIndex`, `activeExerciseIndex`
- [ ] Agregar `restTimerSeconds`, `isResting`
- [ ] Agregar `preWorkoutData`
- [ ] Implementar `logSetWithDetails`

### API
- [ ] `getExerciseHistory()`
- [ ] `getLastPerformance()`
- [ ] `calculateWorkoutStats()`

### Screen Updates
- [ ] Refactorizar `train/index.tsx` para usar nuevos componentes
- [ ] Crear `train/pre-workout.tsx`
- [ ] Crear `train/summary.tsx`

### Dependencies
- [ ] `expo-haptics` (ya debería estar)
- [ ] `react-native-confetti-cannon` para celebración

### Haptics
- [ ] Vibración al completar set
- [ ] Vibración suave cada 30s en rest timer
- [ ] Vibración fuerte al terminar descanso
- [ ] Selection feedback en steppers

---

## 🎯 IMPACTO ESPERADO EN UX

| Antes | Después |
|-------|---------|
| "Terminé ejercicio" (boolean) | Registro detallado por set |
| Sin historial | "Semana pasada: 77.5kg x 10" |
| Sin descanso guiado | Timer con vibración + coach tips |
| Termina y ya | Summary con stats + GENESIS feedback |
| Sin sensación de logro | Confetti + streak + badges |

**El usuario pasa de "usar una app" a "tener un coach en el bolsillo".**

---

## 📦 DEPENDENCIAS A INSTALAR

```bash
npx expo install expo-haptics react-native-confetti-cannon
```

---

**Fin del documento. El Workout Player es donde GENESIS cobra vida.**
