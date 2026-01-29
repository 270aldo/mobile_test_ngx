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
- **Supabase** for backend (auth + PostgreSQL, 17 migrations)
- **expo-secure-store** for token storage (never AsyncStorage for auth)
- **react-native-reanimated 4** for animations
- **react-native-gesture-handler** for gestures
- **expo-av / expo-video** for media playback
- **lucide-react-native** for icons
- **expo-blur / expo-linear-gradient** for glassmorphism effects
- **react-native-svg** for vector graphics
- **react-native-confetti-cannon** for celebration animations

## Architecture

### Routing (expo-router)

```
app/
├── (auth)/                    # Login/register (unauthenticated)
├── (tabs)/                    # Tab navigation
│   ├── _layout.tsx            # Tab bar config (BlurView, FAB, hidden routes)
│   ├── index.tsx              # Home — Daily Hub "Tu Dia"
│   ├── progress/              # 4 views: Season, Week, Metrics, Photos
│   ├── camera/                # Central camera (FAB) — SCAN, FORM, PHOTO modes
│   ├── chat/                  # GENESIS chat + Coach Notes
│   ├── profile/               # User profile
│   ├── train/                 # Workout (hidden, accessed from Home)
│   ├── nourish/               # Nutrition dashboard (hidden, accessed from Home)
│   ├── mind/                  # Mindfulness sessions (hidden, accessed from Home)
│   └── video/                 # Video Hub (hidden, accessed programmatically)
├── (onboarding)/              # 14-step onboarding
├── (modals)/                  # Modal presentations
├── mindfulness/
│   └── visualization.tsx      # Legacy visualization route
└── nutrition/
    ├── index.tsx              # Nutrition dashboard (alt route)
    ├── log.tsx                # Food logging (search, camera, barcode)
    └── supplements.tsx        # Supplement tracking
```

**Navigation:** 5 visible tabs: Home, Progress, Camera (center FAB), Chat, Profile. Hidden tab routes (`href: null`): train, nourish, mind, video — accessed via `router.push()` from Home Hub or other screens.

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
| `auth.ts` | Authentication, session, user. Selectors: `useUser()`, `useSession()`, `useIsAuthenticated()`, `useIsHydrated()`, `useAuthLoading()`. Resets all dependent stores on sign-out. |
| `profile.ts` | User profile data. Selectors: `useProfile()`, `useSubscription()`, `useOnboardingCompleted()` |
| `season.ts` | Active season (12 weeks, 3 phases). Selectors: `useActiveSeason()`, `useTodayWorkout()`, `useSeasonProgress()` |
| `workout.ts` | Active workout state, exercise tracking. Selectors: `useCurrentWorkout()`, `useWorkoutInProgress()` |
| `chat.ts` | Chat messages, GENESIS responses. Selectors: `useMessages()`, `useUnreadCount()`, `useHasUnread()` |
| `progress.ts` | Check-ins, streaks, badges, coach notes. Selectors: `useTodayCheckin()`, `useStreaks()`, `useBadges()` |
| `nutrition.ts` | Daily meals and macro targets with Supabase persistence. Optimistic updates. Selectors: `useNutritionMeals()`, `useNutritionTargets()`, `useNutritionTotals()`, `useNutritionLoading()` |
| `mindfulness.ts` | Session tracking and history with Supabase persistence. Selectors: `useHasCompletedMindfulnessToday()`, `useTodayMindfulnessSessions()`, `useMindfulnessHistory()` |

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
| `GlassCard` | blur(12) container, variants: default, mint, ngx, hero |
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
| `OptimizedImage` | Performance-optimized image component |
| `VideoBackground` | Video background for immersive screens |

### Component Modules

```
components/
├── ui/              # Base design system (14 components)
├── home/            # Daily Hub: DailyHubHeader, FitnessCard, NutritionCard, MindCard, QuickStats, QuickAccess
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
├── api/             # Supabase API clients
│   ├── base.ts      # Shared utilities: ApiError, handleQueryResult, getTodayDate
│   ├── profile.ts   # User profile CRUD
│   ├── season.ts    # Season management
│   ├── workout.ts   # Workout endpoints
│   ├── chat.ts      # Chat messages + realtime
│   ├── checkin.ts   # Daily check-in endpoints
│   ├── coach.ts     # Coach assignments + streaks (workout, checkin, hydration, mindfulness)
│   ├── nutrition.ts # Food logs CRUD + macro targets (upsert)
│   ├── mindfulness.ts # Session recording + history
│   └── index.ts     # Re-exports all services
└── elevenlabs.ts    # ElevenLabs TTS (placeholder for GENESIS voice)
```

### Season Model

12-week training seasons with 3 phases:
- Phase 1 (Weeks 1-4): Adaptation
- Phase 2 (Weeks 5-8): Development
- Phase 3 (Weeks 9-12): Peak/Deload

At season end: Renew, Maintenance, Pause, or Graduate.

### Supabase Schema (17 migrations)

Tables: `profiles`, `subscriptions`, `coach_assignments`, `seasons`, `workouts`, `exercise_blocks`, `workout_logs`, `set_logs`, `checkins`, `messages`, `coach_notes`, `badges`, `streaks`, `food_logs`, `nutrition_targets`, `mindfulness_sessions` + trigger function for `updated_at`.

All tables use UUID primary keys, RLS policies on `auth.uid() = user_id`, and `updated_at` triggers. The `nutrition_targets` table has a `UNIQUE(user_id)` constraint for upsert. The `streaks` table supports types: `workout`, `checkin`, `hydration`, `mindfulness`.

### Hooks

```
hooks/
├── index.ts           # Re-exports
├── useAppData.ts      # Fetches all store data on mount (profile, season, progress, chat, nutrition, mindfulness)
└── useCoachNotes.ts   # Coach note filtering by location + dismiss logic
```

`useAppData()` is called from the Home Hub and fetches data from all stores via `getState()` to avoid stale closures. `useRefreshData()` returns a memoized function for pull-to-refresh.

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

- **Auth system** — Supabase auth with SecureStore, route guards, store reset on sign-out
- **Design system** — Glassmorphism components, dark-first, violet/mint palette (14 base UI components)
- **Navigation** — 5 visible tabs + 4 hidden tab routes (train, nourish, mind, video), central camera FAB
- **Home Hub** — "Tu Dia" with FitnessCard, NutritionCard, MindCard (auto-hides after completion), QuickStats, QuickAccess, Coach Notes
- **Season model** — 12-week seasons with Zustand store and progress tracking
- **Workout module** — RestTimer, SetLogger, WorkoutSummary, integrated with Home Hub
- **Progress** — 4 selectable views: Season, Week, Metrics, Photos
- **Nutrition (persisted)** — Dashboard with MacroRing, MacroBar, MealCards; food log with search/camera/barcode; supplements. Supabase persistence via `food_logs` and `nutrition_targets` tables. Optimistic updates with background sync.
- **Mindfulness (persisted)** — 4 configurable sessions (Morning, Focus, Calm, Sleep) with VisualizationPlayer. Supabase persistence via `mindfulness_sessions` table. Auto-records on complete/skip. Streak tracking.
- **Chat** — GENESIS messages + Coach Notes with WhatsApp CTA, combined timeline
- **Camera** — 3 modes (SCAN, FORM, PHOTO) with mode-specific overlays, controls, recording timer
- **Video ecosystem** — ExerciseDemo (15-30s loops), MicroLesson (60-90s), CoachVideo (coach messages)
- **Services** — 9 API services (profile, season, workout, chat, checkin, coach, nutrition, mindfulness) + ElevenLabs placeholder
- **Data loading** — `useAppData()` hook fetches all stores on mount; `useRefreshData()` for pull-to-refresh

### Pending / Next Steps

- **Onboarding flow** — 14-step onboarding screens with data collection
- **Remaining Supabase connections** — Season, workout, progress stores still use mock/partial data
- **GENESIS AI integration** — LLM-powered workout programming and chat responses
- **ElevenLabs integration** — Real voice synthesis for visualization sessions
- **Camera permissions** — Actual expo-camera integration (currently placeholder UI)
- **Push notifications** — Workout reminders, coach note alerts
- **Food recognition AI** — Camera-based food scanning with macro estimation
- **Form check analysis** — Video-based technique analysis
- **WhatsApp deep linking** — Coach communication CTA
- **Offline support** — Cache workouts and content for offline use
- **Pull-to-refresh** — Connect `useRefreshData()` to ScrollView RefreshControl
- **Error UI** — Surface `useNutritionError()` / `useMindfulnessError()` via toast or ErrorState
- **Onboarding nutrition seed** — Auto-create personalized macro targets from profile data
