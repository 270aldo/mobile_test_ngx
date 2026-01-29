# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NGX GENESIS HYBRID - Premium fitness app ($199-499/month) combining AI workout programming (GENESIS) with human coaching. Dark-first glassmorphism aesthetic with a "Tu Dia en 2 segundos" philosophy — the user opens the app and immediately knows what to do.

**Core Model:** GENESIS (AI) handles daily programming and motivation. A human coach provides personalized notes and adjustments. GENESIS acts as intermediary in-app; coach communication happens via WhatsApp.

## Commands

```bash
# Development
npx expo start --clear          # Start dev server (clears cache)
npm run start:mcp               # Start with MCP server (EXPO_UNSTABLE_MCP_SERVER=1)

# Type checking
npm run typecheck               # or: npx tsc --noEmit

# Linting
npm run lint                    # ESLint

# Platform-specific
npx expo run:ios                # iOS native build
npx expo run:android            # Android native build
npx expo start --web            # Web development
```

## Tech Stack

- **Expo SDK 54** with New Architecture enabled
- **React Native 0.81** + React 19
- **Expo Router 6** (file-based routing)
- **Zustand 5** for state management
- **Supabase** for backend (auth + PostgreSQL, 14 migrations)
- **expo-secure-store** for token storage (never AsyncStorage for auth)
- **react-native-reanimated 4** for animations
- **react-native-gesture-handler** for gestures
- **expo-av / expo-video** for media playback
- **lucide-react-native** for icons
- **expo-blur / expo-linear-gradient** for glassmorphism effects

## Architecture

### Routing (expo-router)

```
app/
├── (auth)/                    # Login/register (unauthenticated)
├── (tabs)/                    # Main 5-tab navigation
│   ├── index.tsx              # Home — Daily Hub "Tu Dia"
│   ├── camera/                # Central camera (FAB) — SCAN, FORM, PHOTO modes
│   ├── chat/                  # GENESIS chat + Coach Notes
│   ├── train/                 # Workout (accessed from Home Hub)
│   ├── progress/              # 4 views: Season, Week, Metrics, Photos
│   └── profile/               # User profile
├── (onboarding)/              # 14-step onboarding
├── (modals)/                  # Modal presentations
├── mindfulness/
│   └── visualization.tsx      # Morning visualization (5 min guided)
└── nutrition/
    ├── index.tsx              # Nutrition dashboard
    ├── log.tsx                # Food logging (search, camera, barcode)
    └── supplements.tsx        # Supplement tracking
```

**Navigation:** 5-tab bottom bar: Home, Progress, Camera (center FAB), Chat, Profile. Workout is NOT a tab — it's a module accessed from Home.

### State Management (Zustand)

**Critical pattern — always use selectors:**
```typescript
// Correct — prevents unnecessary re-renders
const isLoading = useAuthStore((s) => s.isLoading);
const user = useUser(); // exported selector hook

// Wrong — causes re-renders on every state change
const { isLoading } = useAuthStore();
```

**Stores:**
| Store | Purpose |
|-------|---------|
| `auth.ts` | Authentication, session, user. Selectors: `useUser()`, `useSession()`, `useIsAuthenticated()`, `useIsHydrated()`, `useAuthLoading()` |
| `season.ts` | Active season (12 weeks, 3 phases). Selectors: `useActiveSeason()`, `useTodayWorkout()`, `useSeasonProgress()` |
| `workout.ts` | Active workout state, exercise tracking |
| `chat.ts` | Chat messages, GENESIS responses |
| `progress.ts` | Progress tracking data |
| `profile.ts` | User profile data |

### Auth Flow

1. `app/_layout.tsx` calls `hydrate()` on mount
2. Supabase session restored from SecureStore
3. Auth state listener set up for changes
4. Route guards redirect based on auth/onboarding status

**Dev mode bypass active:** In `app/_layout.tsx`, auth is bypassed with `const isLoggedIn = true`. Re-enable by uncommenting the real auth checks.

### Design System

All tokens in `constants/theme.ts`:
- Primary: `#6D00FF` (violet/ngx), Secondary: `#00F5AA` (mint)
- Background: `#050505` (void), Warning: `#FFB347`
- Import: `import { colors, spacing, borderRadius, typography, layout } from '@/constants/theme'`

**Base UI components** (`components/ui/`):

| Component | Purpose |
|-----------|---------|
| `GlassCard` | blur(12) container, variants: default, mint, ngx |
| `Button` | 7 variants: primary, secondary, mint, chip, ghost, coach, danger |
| `Label` | 10px uppercase, letterSpacing: 3, color variants |
| `StatusPill` | Status badge (active, rest, completed, upcoming) |
| `PulseDot` | Animated dot (colors: ngx, mint, warning) |
| `Input` | Text input field |
| `CoachNoteCard` | Coach note display with mint accent |
| `StatCard` | Statistics display card |
| `ProgressRing` | Circular progress indicator |
| `EmptyState` | Empty state display |
| `ErrorState` | Error state display |
| `LoadingState` | Loading spinner |

### Component Modules

```
components/
├── ui/              # Base design system (14 components)
├── home/            # Daily Hub: DailyHubHeader, FitnessCard, NutritionCard, MindCard, QuickStats
├── workout/         # Player: RestTimer, SetLogger, WorkoutSummary
├── progress/        # Views: SeasonView, WeekView, MetricsView, PhotosView, ViewSelector
├── nutrition/       # Tracking: MacroRing, MacroBar, MealCard, SupplementCard
├── video/           # Media: ExerciseDemo, MicroLesson, CoachVideo
├── mindfulness/     # Sessions: VisualizationPlayer
├── chat/            # Messaging: CoachNoteMessage
└── camera/          # Capture: CameraModeOverlay, CameraControls
```

### Services

```
services/
├── api/             # REST API clients
│   ├── base.ts      # Base HTTP client with auth headers
│   ├── chat.ts      # Chat endpoints
│   ├── coach.ts     # Coach assignment endpoints
│   ├── profile.ts   # User profile endpoints
│   ├── season.ts    # Season management endpoints
│   ├── workout.ts   # Workout endpoints
│   └── checkin.ts   # Daily check-in endpoints
└── elevenlabs.ts    # ElevenLabs TTS (placeholder for GENESIS voice)
```

### Season Model

12-week training seasons with 3 phases:
- Phase 1 (Weeks 1-4): Adaptation
- Phase 2 (Weeks 5-8): Development
- Phase 3 (Weeks 9-12): Peak/Deload

At season end: Renew, Maintenance, Pause, or Graduate.

### Supabase Schema (14 migrations)

Tables: `profiles`, `subscriptions`, `coach_assignments`, `seasons`, `workouts`, `exercise_blocks`, `workout_logs`, `set_logs`, `checkins`, `messages`, `coach_notes`, `badges`, `streaks` + trigger function for `updated_at`.

### Path Aliases

Configured in `tsconfig.json`:
```typescript
import { colors } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { MacroRing } from '@/components/nutrition';
import { CoachNoteMessage } from '@/components/chat';
```

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Current State

### Implemented

- **Auth system** — Supabase auth with SecureStore, route guards
- **Design system** — Glassmorphism components, dark-first, violet/mint palette
- **Navigation** — 5-tab bar with central camera FAB, route groups
- **Home Hub** — "Tu Dia" with FitnessCard, NutritionCard, MindCard, QuickStats, Coach Notes
- **Season model** — 12-week seasons with Zustand store and progress tracking
- **Workout module** — RestTimer, SetLogger, WorkoutSummary, integrated with Home Hub
- **Progress** — 4 selectable views: Season, Week, Metrics, Photos
- **Nutrition** — Dashboard with MacroRing, MacroBar, MealCards; food log with search/camera/barcode; supplements with Coach Verified badges
- **Chat** — GENESIS messages + Coach Notes with WhatsApp CTA, combined timeline
- **Camera** — 3 modes (SCAN, FORM, PHOTO) with mode-specific overlays, controls, recording timer
- **Mindfulness** — Morning visualization player with 5 phases, breathing animation (Reanimated)
- **Video ecosystem** — ExerciseDemo (15-30s loops), MicroLesson (60-90s), CoachVideo (coach messages)
- **Services** — REST API layer, ElevenLabs placeholder

### Pending / Next Steps

- **Onboarding flow** — 14-step onboarding screens with data collection
- **Real Supabase data** — Connect UI to live database (currently using mock data)
- **GENESIS AI integration** — LLM-powered workout programming and chat responses
- **ElevenLabs integration** — Real voice synthesis for visualization sessions
- **Camera permissions** — Actual expo-camera integration (currently placeholder UI)
- **Push notifications** — Workout reminders, coach note alerts
- **Food recognition AI** — Camera-based food scanning with macro estimation
- **Form check analysis** — Video-based technique analysis
- **WhatsApp deep linking** — Coach communication CTA
- **Offline support** — Cache workouts and content for offline use
