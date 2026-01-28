# NGX GENESIS - VISUAL ASSETS SPECIFICATION

> **Para generar con Gemin CLI + Nano Banana Pro**

---

## 🎯 FILOSOFÍA VISUAL NGX

**No somos una app de fitness genérica.** Somos Performance & Longevity para profesionales 30-60 años.

### Estética Objetivo:
- **Oscuro premium** (como las referencias)
- **Atletas reales** (no stock photos genéricas)
- **Iluminación cinematográfica** (rim light, luz lateral dramática)
- **Movimiento implícito** (no poses estáticas)
- **Edad correcta** (30-50 años, no modelos de 22)
- **Ambiente gym premium** (no CrossFit boxes ni home gym)

### Paleta para fotos:
- Fondos muy oscuros (#050505 a #1a1a1a)
- Highlights en violeta/magenta (nuestro #6D00FF)
- Acentos de luz cyan/mint (#00F5AA)
- Skin tones naturales, no oversaturados

---

## 📱 ASSETS POR PANTALLA

### 1. HOME SCREEN

#### Hero Card Background (Misión del Día)
**Dimensiones:** 358 x 200px @3x (1074 x 600px)
**Formato:** PNG con transparencia o JPG oscuro

**Variantes necesarias (6 total):**

| ID | Descripción | Prompt para Nano Banana |
|----|-------------|------------------------|
| `hero_upper_push` | Upper body - pushing | "Cinematic photo of fit 40-year-old man doing bench press, dramatic side lighting, dark gym background, violet rim light accent, motion blur on bar, premium fitness aesthetic" |
| `hero_upper_pull` | Upper body - pulling | "Athletic 35-year-old woman doing cable row, back muscles engaged, dark moody gym, cyan highlight on equipment, professional lighting" |
| `hero_lower_squat` | Lower body - squat | "Powerful squat position, 45-year-old male athlete, barbell on shoulders, dark background with single spotlight, purple gel light" |
| `hero_lower_deadlift` | Lower body - deadlift | "Deadlift lockout position, fit professional woman 40s, dramatic lighting, weights visible, dark premium gym" |
| `hero_full_body` | Full body workout | "Athletic man doing clean and jerk, explosive movement, dark background, motion captured, violet and cyan accent lights" |
| `hero_conditioning` | Cardio/Conditioning | "Intense rowing machine workout, sweat visible, dramatic lighting, 35-year-old fit professional, dark gym aesthetic" |

**Tratamiento post:**
- Overlay gradient: `linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.8) 100%)`
- Debe permitir texto blanco legible encima

---

#### Stat Cards Icons (Métricas del día)
**Dimensiones:** 48 x 48px @3x (144 x 144px)
**Formato:** PNG con transparencia

| ID | Icono | Estilo |
|----|-------|--------|
| `icon_calories` | Llama/fuego | Gradiente naranja, estilo glass |
| `icon_sleep` | Luna | Gradiente azul/violeta |
| `icon_water` | Gota | Gradiente cyan/mint |
| `icon_steps` | Pisadas | Gradiente blanco/chrome |

**Nota:** Ya tienes estos de lucide-react, pero versiones custom con glass effect serían más premium.

---

### 2. TRAIN SCREEN (Workout Player)

#### Exercise Demo Videos/GIFs
**Dimensiones:** 390 x 300px @3x (1170 x 900px)
**Formato:** MP4 (loop, sin audio) o GIF de alta calidad

**Biblioteca inicial (20 ejercicios core):**

**Upper Push:**
| ID | Ejercicio | Descripción del video |
|----|-----------|----------------------|
| `ex_bench_press` | Bench Press | Side angle, full ROM, slow tempo |
| `ex_overhead_press` | Overhead Press | Front 3/4 angle, standing |
| `ex_incline_db` | Incline DB Press | Focus on chest stretch |
| `ex_dips` | Dips | Parallel bars, controlled descent |

**Upper Pull:**
| ID | Ejercicio | Descripción |
|----|-----------|-------------|
| `ex_pull_up` | Pull-up | Front view, full extension to chin over bar |
| `ex_barbell_row` | Barbell Row | Side angle, back engagement visible |
| `ex_cable_row` | Cable Row | Seated, squeeze at contraction |
| `ex_face_pull` | Face Pull | Rear delts focus |

**Lower:**
| ID | Ejercicio | Descripción |
|----|-----------|-------------|
| `ex_squat` | Back Squat | Side angle, depth visible |
| `ex_deadlift` | Deadlift | Convention, lockout visible |
| `ex_rdl` | Romanian DL | Hip hinge emphasis |
| `ex_leg_press` | Leg Press | Machine, full ROM |
| `ex_lunges` | Walking Lunges | Dynamic movement |
| `ex_leg_curl` | Leg Curl | Hamstring isolation |

**Core & Accessories:**
| ID | Ejercicio | Descripción |
|----|-----------|-------------|
| `ex_plank` | Plank | Side view, proper alignment |
| `ex_cable_crunch` | Cable Crunch | Kneeling, contraction focus |
| `ex_lateral_raise` | Lateral Raise | Shoulder isolation |
| `ex_bicep_curl` | Bicep Curl | Strict form, EZ bar or DB |
| `ex_tricep_pushdown` | Tricep Pushdown | Cable, lockout |
| `ex_calf_raise` | Calf Raise | Standing, full ROM |

**Especificaciones de video:**
- Duración: 3-5 segundos (loop perfecto)
- Frame rate: 30fps
- Fondo: Negro sólido o gym muy oscuro
- Iluminación: Key light lateral + fill suave
- Atleta: Forma perfecta, no necesariamente el más musculoso
- Velocidad: Tempo controlado (no explosivo a menos que sea el punto)

---

#### Rest Timer Background
**Dimensiones:** Fullscreen 390 x 844px @3x
**Formato:** Video loop o imagen estática

**Prompt:**
"Abstract dark background with subtle purple particle effects, floating light orbs, cinematic depth of field, meditation/rest aesthetic, ultra dark with hints of violet glow"

---

### 3. PROGRESS SCREEN

#### Body Progress Silhouette
**Dimensiones:** 300 x 400px @3x
**Formato:** SVG o PNG

**Variantes:**
- Silueta masculina (front, back)
- Silueta femenina (front, back)
- Con zonas highlight para músculos trabajados

---

#### Achievement Badges
**Dimensiones:** 80 x 80px @3x (240 x 240px)
**Formato:** PNG con transparencia

| Badge | Diseño |
|-------|--------|
| `badge_first_workout` | Estrella dorada con "1" |
| `badge_week_streak` | Llama con número |
| `badge_month_complete` | Corona/laurel |
| `badge_season_complete` | Trofeo violeta NGX |
| `badge_pr_set` | Rayo/lightning bolt |
| `badge_consistency` | Calendario con checkmarks |

**Estilo:** 3D-ish con sombras sutiles, glass effect, colores NGX

---

### 4. CHAT SCREEN (GENESIS)

#### GENESIS Avatar
**Dimensiones:** 48 x 48px @3x (144 x 144px)
**Formato:** PNG o animated GIF

**Concepto:**
- Hexágono (ya es nuestro símbolo)
- Efecto de glow pulsante violeta
- Versión estática y versión "pensando" (animated)

**Prompt para variante:**
"Futuristic AI assistant icon, hexagonal shape, glowing violet edges, dark center with subtle circuit pattern, premium tech aesthetic, suitable for chat avatar"

---

#### Coach Avatar (para HYBRID)
**Dimensiones:** 48 x 48px @3x
**Formato:** PNG

**Concepto:**
- Foto circular de "coach" (puede ser generada)
- Borde mint/cyan
- Look profesional pero approachable

**Prompt:**
"Professional fitness coach portrait, 40-year-old athletic man/woman, friendly confident expression, dark neutral background, headshot style, premium quality"

---

### 5. ONBOARDING SCREENS

#### Onboarding Illustrations
**Dimensiones:** 300 x 300px @3x
**Formato:** PNG con transparencia

| Screen | Concepto |
|--------|----------|
| `onboard_1_welcome` | GENESIS logo con glow effect |
| `onboard_2_goals` | Target/bullseye con violeta |
| `onboard_3_assessment` | Clipboard/checklist stylized |
| `onboard_4_plan` | Calendar con workout icons |
| `onboard_5_coach` | Silhouette con GENESIS + human |
| `onboard_6_ready` | Rocket/launch stylized NGX |

**Estilo:** Flat con depth, glass morphism touches, violeta como color primario

---

### 6. EMPTY STATES

**Dimensiones:** 200 x 200px @3x
**Formato:** PNG o Lottie animation

| State | Ilustración |
|-------|-------------|
| `empty_workouts` | Mancuerna con "?" |
| `empty_messages` | Chat bubble vacío |
| `empty_progress` | Gráfica plana subiendo |
| `empty_coach_notes` | Nota con smiley |

---

## 🎬 VIDEOS DE FONDO (OPCIONAL PREMIUM)

Para un efecto ultra-premium como los mejores apps:

### Ambient Background Videos
**Uso:** Fondo sutil en login, splash, o secciones hero
**Duración:** 10-15 segundos, loop perfecto
**Resolución:** 1080p, heavily compressed

| ID | Descripción |
|----|-------------|
| `bg_gym_ambient` | Slow pan de gym premium vacío, luces moody |
| `bg_weights_rack` | Close-up de pesas, rack focus shift |
| `bg_abstract_particles` | Partículas violeta flotando en oscuridad |

---

## 📁 ESTRUCTURA DE CARPETAS

```
assets/
├── images/
│   ├── hero/
│   │   ├── hero_upper_push.jpg
│   │   ├── hero_upper_pull.jpg
│   │   └── ...
│   ├── exercises/
│   │   ├── ex_bench_press.gif (o .mp4)
│   │   ├── ex_squat.gif
│   │   └── ...
│   ├── badges/
│   │   ├── badge_first_workout.png
│   │   └── ...
│   ├── onboarding/
│   │   └── ...
│   ├── empty-states/
│   │   └── ...
│   └── avatars/
│       ├── genesis_avatar.png
│       ├── genesis_avatar_thinking.gif
│       └── coach_avatar.png
├── videos/
│   ├── bg_gym_ambient.mp4
│   └── rest_timer_bg.mp4
└── icons/
    ├── icon_calories.png
    └── ...
```

---

## 🔧 IMPLEMENTACIÓN EN CÓDIGO

### Image Component con Fallback
```typescript
// components/ui/OptimizedImage.tsx
import { Image } from 'expo-image';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaesEfQofj[azf6fQfQfQfQfQfQfQfQfQ';

export function OptimizedImage({ source, style, ...props }) {
  return (
    <Image
      source={source}
      style={style}
      placeholder={blurhash}
      contentFit="cover"
      transition={300}
      {...props}
    />
  );
}
```

### Video Background Component
```typescript
// components/ui/VideoBackground.tsx
import { Video, ResizeMode } from 'expo-av';

export function VideoBackground({ source, children, style }) {
  return (
    <View style={[styles.container, style]}>
      <Video
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      {children}
    </View>
  );
}
```

### Hero Card con Imagen de Fondo
```typescript
// Actualizar GlassCard para soportar backgroundImage mejor
<GlassCard
  variant="hero"
  backgroundImage={getHeroImage(todayWorkout.type)}
  backgroundOverlay="gradient" // nuevo prop
>
  {/* contenido */}
</GlassCard>
```

---

## 🎯 PRIORIDAD DE GENERACIÓN

### Fase 1 (MVP Visual) - 15 assets
1. ✅ 6 Hero backgrounds para Home
2. ✅ GENESIS avatar (estático)
3. ✅ 6 Empty states
4. ✅ 2 Coach avatars (M/F)

### Fase 2 (Workout Player) - 25 assets
1. 20 Exercise videos/GIFs
2. Rest timer background
3. 4 Workout type thumbnails

### Fase 3 (Polish) - 20 assets
1. 10 Achievement badges
2. 6 Onboarding illustrations
3. 4 Custom stat icons
4. Ambient background videos

---

## 💡 PROMPTS LISTOS PARA NANO BANANA

### Hero Image - Upper Body Push
```
Cinematic fitness photograph of athletic 40-year-old man performing barbell bench press in premium dark gym. Dramatic side lighting with violet/purple rim light accent on the right side. Motion blur on the moving barbell. Sweat visible. Dark moody atmosphere, blacks crushed. Professional sports photography style. 16:9 aspect ratio.
```

### Hero Image - Lower Body
```
Powerful back squat position, fit 45-year-old male professional athlete, heavy barbell across shoulders, dark gym background with single dramatic spotlight from above. Purple and cyan gel light accents. Intensity in expression. Cinematic depth of field. Premium fitness aesthetic.
```

### Exercise Demo - Clean Background
```
Professional fitness demonstration video frame. Athletic trainer performing [EXERCISE NAME] with perfect form. Pure black background. Single key light from 45 degrees. Clean, educational style. Focus on muscle engagement and proper technique. Studio quality.
```

### GENESIS Avatar
```
Futuristic AI assistant avatar icon. Hexagonal geometric shape. Glowing violet/purple (#6D00FF) edges with inner glow effect. Dark center with subtle digital circuit pattern. Premium tech aesthetic. Suitable for 48x48 pixel app avatar. Clean edges, high contrast.
```

### Badge - First Workout
```
3D achievement badge icon for fitness app. Golden star with number "1" in center. Subtle glass morphism effect. Dark background optimized. Celebratory but elegant. 80x80 pixels, suitable for mobile app. Premium quality render.
```

---

## ✅ CHECKLIST DE ASSETS

### Inmediatos (para próximo sprint)
- [ ] hero_upper_push.jpg
- [ ] hero_upper_pull.jpg
- [ ] hero_lower_squat.jpg
- [ ] hero_lower_deadlift.jpg
- [ ] hero_full_body.jpg
- [ ] hero_conditioning.jpg
- [ ] genesis_avatar.png
- [ ] empty_workouts.png
- [ ] empty_messages.png

### Workout Player
- [ ] ex_bench_press.mp4
- [ ] ex_squat.mp4
- [ ] ex_deadlift.mp4
- [ ] ex_pull_up.mp4
- [ ] (16 más del listado)

---

**Este documento está listo para usar con Gemini Clay + Nano Banana. Los prompts están optimizados para consistencia visual NGX.**
