# PROMPT MAESTRO - CLAUDE CODE
## Infraestructura Visual para NGX GENESIS

---

## CONTEXTO

La app NGX GENESIS necesita soporte para imágenes y videos premium. Actualmente los componentes existen pero no están optimizados para:
- Background images en cards con overlays
- Video loops como fondos
- Exercise demo videos en el Workout Player
- Carga optimizada con blur placeholders

Los assets visuales están siendo generados en paralelo por Gemini CLI.

---

## PROMPT PARA CLAUDE CODE

```
Implementa la infraestructura visual premium para NGX GENESIS.

Lee VISUAL_ASSETS_SPEC.md para entender los assets que vendrán.
Lee PHASE2_WORKOUT_PLAYER.md para contexto del Workout Player.

## TAREAS

### 1. INSTALAR DEPENDENCIAS

```bash
npx expo install expo-image expo-av expo-video-thumbnails expo-blur
```

### 2. CREAR COMPONENTES DE MEDIA

#### components/ui/OptimizedImage.tsx
Imagen optimizada con:
- Blur placeholder mientras carga
- Fade-in transition
- Error fallback
- Soporte para local y remote

```typescript
import { Image, ImageProps } from 'expo-image';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: string | number; // URL string o require()
  fallback?: string | number;
  blurhash?: string;
}
```

#### components/ui/VideoBackground.tsx
Video loop silencioso para fondos:
- Auto-play, loop, muted
- Overlay gradient configurable
- Fallback a imagen si video falla
- Optimizado para batería (pausa cuando no visible)

```typescript
interface VideoBackgroundProps {
  source: string | number;
  posterSource?: string | number;
  overlayOpacity?: number;
  overlayGradient?: 'top' | 'bottom' | 'full';
  children?: React.ReactNode;
}
```

#### components/ui/ExerciseDemo.tsx
Para mostrar video/GIF del ejercicio:
- Aspect ratio 4:3
- Play/pause control
- Looping
- Speed control (0.5x, 1x)
- Fallback a imagen estática

```typescript
interface ExerciseDemoProps {
  exerciseId: string;
  exerciseName: string;
  videoSource?: string;
  imageSource?: string;
  showControls?: boolean;
}
```

### 3. ACTUALIZAR GlassCard

Modificar components/ui/GlassCard.tsx para mejor soporte de imágenes:

```typescript
interface GlassCardProps {
  // ... existing props

  // Nuevos props para background media
  backgroundImage?: string | number;
  backgroundVideo?: string | number;
  backgroundOverlay?: 'none' | 'light' | 'medium' | 'heavy' | 'gradient';
  backgroundBlur?: number; // 0-20
}
```

El overlay gradient debe ser:
- 'gradient': linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.85) 100%)
- 'heavy': rgba(5,5,5,0.7)
- 'medium': rgba(5,5,5,0.5)
- 'light': rgba(5,5,5,0.3)

### 4. CREAR ASSET MANAGER

Crear utils/assets.ts para centralizar rutas de assets:

```typescript
// Hero images por tipo de workout
export const heroImages = {
  upper_push: require('@/assets/images/hero/hero_upper_push.jpg'),
  upper_pull: require('@/assets/images/hero/hero_upper_pull.jpg'),
  lower_squat: require('@/assets/images/hero/hero_lower_squat.jpg'),
  lower_deadlift: require('@/assets/images/hero/hero_lower_deadlift.jpg'),
  full_body: require('@/assets/images/hero/hero_full_body.jpg'),
  conditioning: require('@/assets/images/hero/hero_conditioning.jpg'),
  // Fallback
  default: require('@/assets/images/hero/hero_default.jpg'),
} as const;

// Función helper para obtener hero por tipo de workout
export function getHeroImage(workoutType?: string): number {
  const typeMap: Record<string, keyof typeof heroImages> = {
    'strength': 'upper_push',
    'hypertrophy': 'upper_pull',
    'power': 'full_body',
    'conditioning': 'conditioning',
    // ... más mappings
  };

  const key = typeMap[workoutType || ''] || 'default';
  return heroImages[key] || heroImages.default;
}

// Exercise videos/images
export const exerciseMedia = {
  bench_press: {
    video: require('@/assets/videos/exercises/ex_bench_press.mp4'),
    image: require('@/assets/images/exercises/ex_bench_press.jpg'),
  },
  squat: {
    video: require('@/assets/videos/exercises/ex_squat.mp4'),
    image: require('@/assets/images/exercises/ex_squat.jpg'),
  },
  // ... más ejercicios
} as const;

export function getExerciseMedia(exerciseSlug: string) {
  return exerciseMedia[exerciseSlug] || null;
}

// Avatars
export const avatars = {
  genesis: require('@/assets/images/avatars/genesis_avatar.png'),
  genesis_thinking: require('@/assets/images/avatars/genesis_thinking.gif'),
  coach_male: require('@/assets/images/avatars/coach_male.jpg'),
  coach_female: require('@/assets/images/avatars/coach_female.jpg'),
} as const;

// Empty states
export const emptyStates = {
  workouts: require('@/assets/images/empty/empty_workouts.png'),
  messages: require('@/assets/images/empty/empty_messages.png'),
  progress: require('@/assets/images/empty/empty_progress.png'),
  coach_notes: require('@/assets/images/empty/empty_coach_notes.png'),
} as const;
```

### 5. CREAR ESTRUCTURA DE CARPETAS

```bash
mkdir -p assets/images/hero
mkdir -p assets/images/exercises
mkdir -p assets/images/avatars
mkdir -p assets/images/empty
mkdir -p assets/images/badges
mkdir -p assets/images/onboarding
mkdir -p assets/videos/exercises
mkdir -p assets/videos/backgrounds
```

### 6. CREAR PLACEHOLDERS

Mientras los assets reales llegan, crear placeholders:

```typescript
// assets/images/hero/hero_default.jpg
// Crear imagen placeholder 1074x600 color #0a0a0f con texto "NGX"

// O usar un servicio como placeholder:
// https://placehold.co/1074x600/0a0a0f/6D00FF?text=NGX+HERO
```

Crear un script que genere placeholders temporales:

```typescript
// scripts/generate-placeholders.ts
// Genera imágenes placeholder para desarrollo
```

### 7. ACTUALIZAR HOME SCREEN

Modificar app/(tabs)/index.tsx para usar las nuevas imágenes:

```typescript
import { getHeroImage } from '@/utils/assets';

// En el Hero Card:
<GlassCard
  variant="hero"
  backgroundImage={getHeroImage(todayWorkout?.type)}
  backgroundOverlay="gradient"
>
```

### 8. ACTUALIZAR WORKOUT PLAYER

Modificar app/(tabs)/train/index.tsx:

```typescript
import { ExerciseDemo } from '@/components/ui/ExerciseDemo';
import { getExerciseMedia } from '@/utils/assets';

// En la vista del ejercicio actual:
{currentExercise && (
  <ExerciseDemo
    exerciseId={currentExercise.id}
    exerciseName={currentExercise.exercise_name}
    videoSource={getExerciseMedia(currentExercise.slug)?.video}
    imageSource={getExerciseMedia(currentExercise.slug)?.image}
    showControls
  />
)}
```

### 9. ACTUALIZAR EMPTY STATE COMPONENT

Modificar components/ui/EmptyState.tsx para usar imágenes custom:

```typescript
import { emptyStates } from '@/utils/assets';
import { OptimizedImage } from './OptimizedImage';

// Reemplazar iconos por imágenes
<OptimizedImage
  source={emptyStates[type]}
  style={{ width: 200, height: 200 }}
/>
```

### 10. RE-EXPORTAR COMPONENTES

Actualizar components/ui/index.ts:

```typescript
export { OptimizedImage } from './OptimizedImage';
export { VideoBackground } from './VideoBackground';
export { ExerciseDemo } from './ExerciseDemo';
```

## REGLAS

- Usar expo-image, NO Image de react-native (mejor performance)
- Todos los videos deben ser opcionales con fallback a imagen
- Mantener aspectRatio consistente (16:9 para hero, 4:3 para exercises)
- Los placeholders deben funcionar sin assets reales
- Usar los design tokens de @/constants/theme
- TypeScript estricto en todos los componentes

## VERIFICACIÓN

Después de implementar, verificar:
1. `npm run typecheck` pasa sin errores
2. La app carga sin assets reales (usando placeholders)
3. GlassCard con backgroundImage muestra overlay correcto
4. ExerciseDemo muestra fallback cuando no hay video
```

---

## ARCHIVOS A MODIFICAR/CREAR

### Crear nuevos:
- components/ui/OptimizedImage.tsx
- components/ui/VideoBackground.tsx
- components/ui/ExerciseDemo.tsx
- utils/assets.ts
- Estructura de carpetas en assets/

### Modificar existentes:
- components/ui/GlassCard.tsx (agregar props de media)
- components/ui/EmptyState.tsx (usar imágenes)
- components/ui/index.ts (re-exports)
- app/(tabs)/index.tsx (usar getHeroImage)
- app/(tabs)/train/index.tsx (usar ExerciseDemo)

---

**Ejecutar en Claude Code con acceso al proyecto.**
