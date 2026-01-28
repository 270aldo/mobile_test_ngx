# 📋 SESSION HANDOFF - 27 Enero 2026

> **Para Claude Code** - Contexto de sesión de trabajo con Cowork

---

## 🎯 OBJETIVO DE LA SESIÓN

Elevar la UI/UX de la app NGX GENESIS de MVP a premium, implementando:
1. Infraestructura visual (imágenes optimizadas, videos de fondo)
2. Componentes del Workout Player (SetLogger, RestTimer, Summary)
3. Sistema de assets organizado

---

## ✅ LO QUE SE COMPLETÓ

### FASE A: Assets & Estructura

**Creado:**
- Estructura de carpetas para assets:
  ```
  assets/images/
  ├── hero/           ← Para 6 hero images de workouts
  ├── avatars/        ← Para GENESIS + coaches
  ├── empty-states/   ← Para estados vacíos
  ├── badges/         ← Para achievements
  ├── exercises/      ← Para demos de ejercicios
  └── onboarding/     ← Para flujo de onboarding
  ```

**Documentos creados:**
- `NANO_BANANA_PROMPTS.md` - 20 prompts para generar assets en Gemini
- `GEMINI_CLI_MASTER_PROMPT.md` - Prompt maestro para guiar la generación

### FASE B: Infraestructura Visual

**Nuevos componentes:**

1. **`components/ui/OptimizedImage.tsx`**
   - Usa `expo-image` con blurhash placeholders
   - Soporta overlays: `'none' | 'gradient' | 'dark' | 'vignette'`
   - Priority loading para hero images
   - Props: `source`, `overlay`, `overlayOpacity`, `priority`, `placeholder`

2. **`components/ui/VideoBackground.tsx`**
   - Usa `expo-av` para videos de fondo
   - Overlays: `'none' | 'gradient' | 'dark' | 'violet'`
   - Auto-loop, muted by default
   - Props: `source`, `overlay`, `isPlaying`, `children`

3. **`utils/assets.ts`**
   - Helper `getHeroImage(workoutType)` - retorna imagen por tipo de workout
   - Helper `getGenesisAvatar()` - retorna avatar de GENESIS
   - Helper `getBlurhash(type)` - retorna blurhash por tipo de contenido
   - Fallbacks a assets existentes mientras no hay imágenes reales
   - Types: `WorkoutType`, `EmptyStateType`, `BadgeType`

**Componentes actualizados:**

4. **`components/ui/GlassCard.tsx`** - MEJORADO
   - Ahora usa `OptimizedImage` en lugar de `Image` plain
   - Nuevas props: `backgroundOverlay`, `backgroundOverlayOpacity`, `onPress`, `disabled`
   - Soporta ser clickeable (wraps con Pressable si hay onPress)

5. **`components/ui/index.ts`** - ACTUALIZADO
   - Exporta nuevos componentes: `OptimizedImage`, `VideoBackground`
   - Exporta types: `OverlayType`, `VideoOverlayType`

### FASE C: Workout Player Components

**Nuevos componentes en `components/workout/`:**

1. **`SetLogger.tsx`** - Modal para registrar sets
   - Input de peso con stepper (±2.5kg)
   - Input de reps con stepper
   - Selector de RPE (6-10) con descripción
   - Referencia a último peso usado
   - Haptic feedback en todas las interacciones
   - Opción "No completé este set" para sets fallidos

2. **`RestTimer.tsx`** - Timer de descanso entre sets
   - Countdown circular animado con SVG
   - Progress ring que se llena
   - Haptic cada 30 segundos + al completar
   - Animación de pulso cuando quedan <10 segundos
   - Botones "+30 seg" y "Saltar"
   - Muestra coach tips y siguiente ejercicio

3. **`WorkoutSummary.tsx`** - Pantalla post-workout
   - Confetti animation al completar
   - Grid de stats (sets, kcal, volumen, tiempo)
   - Selector de mood (1-5 emojis)
   - Input de notas opcional
   - Muestra feedback de GENESIS (placeholder)
   - Badge de racha si aplica
   - Indicador de PRs logrados

4. **`index.ts`** - Exports del módulo
   - Exporta: `SetLogger`, `RestTimer`, `WorkoutSummary`
   - Types: `SetLogData`, `WorkoutStats`, `WorkoutSummaryData`

### Dependencias Instaladas

```bash
npm install expo-av expo-haptics react-native-confetti-cannon
```

---

## 📁 ARCHIVOS CREADOS/MODIFICADOS

```
mobile-app_ngx_test/
├── NANO_BANANA_PROMPTS.md              ← NUEVO (prompts para assets)
├── GEMINI_CLI_MASTER_PROMPT.md         ← NUEVO (prompt maestro)
├── SESSION_HANDOFF_JAN27.md            ← NUEVO (este archivo)
│
├── assets/
│   └── images/
│       ├── hero/                       ← NUEVO (vacío, para hero images)
│       ├── avatars/                    ← NUEVO (vacío)
│       ├── empty-states/               ← NUEVO (vacío)
│       ├── badges/                     ← NUEVO (vacío)
│       ├── exercises/                  ← NUEVO (vacío)
│       └── onboarding/                 ← NUEVO (vacío)
│
├── components/
│   ├── ui/
│   │   ├── OptimizedImage.tsx          ← NUEVO
│   │   ├── VideoBackground.tsx         ← NUEVO
│   │   ├── GlassCard.tsx               ← MODIFICADO (usa OptimizedImage)
│   │   └── index.ts                    ← MODIFICADO (nuevos exports)
│   │
│   └── workout/                        ← NUEVO directorio
│       ├── SetLogger.tsx               ← NUEVO
│       ├── RestTimer.tsx               ← NUEVO
│       ├── WorkoutSummary.tsx          ← NUEVO
│       └── index.ts                    ← NUEVO
│
└── utils/
    └── assets.ts                       ← NUEVO
```

---

## 🔧 CÓMO USAR LOS NUEVOS COMPONENTES

### OptimizedImage

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  source={require('@/assets/images/hero/hero_upper_push.jpg')}
  style={{ width: '100%', height: 200 }}
  overlay="gradient"
  overlayOpacity={0.6}
  priority="high"
/>
```

### GlassCard con imagen de fondo

```tsx
import { GlassCard } from '@/components/ui';
import { getHeroImage } from '@/utils/assets';

<GlassCard
  backgroundImage={getHeroImage('upper_push')}
  backgroundOverlay="gradient"
  onPress={() => navigation.navigate('workout')}
>
  <Text>Upper Body Push</Text>
</GlassCard>
```

### Workout Components

```tsx
import { SetLogger, RestTimer, WorkoutSummary } from '@/components/workout';

// SetLogger
<SetLogger
  visible={showSetLogger}
  onClose={() => setShowSetLogger(false)}
  onSave={(data) => handleSaveSet(data)}
  exerciseName="Bench Press"
  setNumber={2}
  totalSets={4}
  lastWeight={77.5}
  targetReps="8-10"
  recommendedRpe={8}
/>

// RestTimer
<RestTimer
  visible={isResting}
  duration={90}
  onComplete={() => setIsResting(false)}
  onSkip={() => setIsResting(false)}
  onExtend={(sec) => console.log(`Extended by ${sec}s`)}
  coachNote="Mantén las escápulas retraídas"
  nextExercise="Incline DB Press"
/>

// WorkoutSummary
<WorkoutSummary
  workoutTitle="Upper Body Power"
  duration={47}
  stats={{
    totalSets: 24,
    totalReps: 186,
    totalVolume: 6800,
    estimatedCalories: 320,
    prsSet: 2,
  }}
  onSave={(data) => handleSaveWorkout(data)}
  onClose={() => navigation.navigate('home')}
  genesisFeedback="Gran sesión. Tu volumen de pecho aumentó 12%..."
  streakCount={4}
/>
```

---

## 🎯 PRÓXIMOS PASOS

### Inmediatos (para Claude Code):

1. **Integrar SetLogger en `train/index.tsx`**
   - Reemplazar el logging actual de ejercicios
   - Mostrar SetLogger al tocar "Registrar Set"
   - Conectar con el store para guardar datos

2. **Integrar RestTimer**
   - Mostrar automáticamente después de cada set
   - Excepto en el último set del ejercicio

3. **Crear flujo de WorkoutSummary**
   - Mostrar al completar todos los ejercicios
   - Guardar mood y notas en Supabase

4. **Actualizar workout store**
   - Agregar: `activeSetIndex`, `activeExerciseIndex`
   - Agregar: `restTimerSeconds`, `isResting`
   - Agregar: `logSetWithDetails()` action

### Cuando estén los assets:

5. **Actualizar `utils/assets.ts`**
   - Descomentar los requires cuando existan las imágenes
   - Ejemplo:
     ```typescript
     // Cambiar:
     upper_push: null,
     // Por:
     upper_push: require('@/assets/images/hero/hero_upper_push.jpg'),
     ```

6. **Actualizar Home screen**
   - Usar `getHeroImage()` en las tarjetas de workout
   - El GlassCard ya soporta `backgroundImage`

---

## 📊 ESTADO DEL PROYECTO

| Área | Estado | Notas |
|------|--------|-------|
| Componentes UI base | ✅ Completo | GlassCard, Button, etc. |
| Componentes media | ✅ Completo | OptimizedImage, VideoBackground |
| Workout Player UI | ✅ Completo | SetLogger, RestTimer, Summary |
| Assets visuales | ⏳ Pendiente | Prompts listos, falta generar |
| Integración Train | ⏳ Pendiente | Siguiente paso |
| Store updates | ⏳ Pendiente | Siguiente paso |

---

## 🔗 DOCUMENTOS DE REFERENCIA

- `PHASE2_WORKOUT_PLAYER.md` - Spec completa del Workout Player
- `VISUAL_ASSETS_SPEC.md` - Spec de assets (si existe)
- `NANO_BANANA_PROMPTS.md` - Prompts para generar assets
- `EXECUTION_STRATEGY.md` - Estrategia de trabajo paralelo

---

## ⚠️ NOTAS IMPORTANTES

1. **TypeScript compila sin errores** - Verificado con `npx tsc --noEmit`

2. **Fallbacks activos** - `utils/assets.ts` usa imágenes existentes como fallback:
   - `ngx_gym_lift.png` para ejercicios de empuje
   - `ngx_pullup.png` para ejercicios de tirón
   - `ngx_recovery_light.png` para recovery

3. **Haptics instalado** - `expo-haptics` listo para usar en toda la app

4. **Confetti instalado** - `react-native-confetti-cannon` para celebraciones

---

**Sesión completada: 27 Enero 2026**
**Próxima tarea: Integrar componentes en Train screen**
