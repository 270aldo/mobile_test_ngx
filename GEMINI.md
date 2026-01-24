# NGX GENESIS - Gemini Context

## Project Overview
**NGX GENESIS** is a premium hybrid fitness application combining AI-driven workout programming (GENESIS) with human coaching. The app features a high-end, futuristic "glassmorphism" aesthetic built with React Native and Expo.

### Tech Stack
*   **Framework:** Expo SDK 54 (Managed Workflow with Prebuild / New Architecture)
*   **Runtime:** React Native 0.81.5
*   **Language:** TypeScript 5.x
*   **Navigation:** Expo Router 6.x (File-based routing)
*   **State Management:** Zustand 5.x
*   **Backend:** Supabase (PostgreSQL + Auth)
*   **UI/Animation:** `react-native-reanimated`, `expo-blur`, `expo-linear-gradient`, `lucide-react-native`

## Architecture & Directory Structure

The project follows a standard Expo Router structure with feature-based organization for components.

```
/
├── app/                        # Expo Router pages & layouts
│   ├── _layout.tsx             # Root provider configuration
│   ├── (auth)/                 # Authentication routes (login, register)
│   ├── (tabs)/                 # Main app navigation (5-tab layout)
│   ├── (onboarding)/           # User onboarding flow
│   └── (modals)/               # Modal screens
├── components/
│   ├── ui/                     # Primitives (Button, GlassCard, Input)
│   └── features/               # Feature-specific components (chat, workout)
├── constants/
│   └── theme.ts                # Design system tokens (Colors, Typography)
├── lib/
│   └── supabase.ts             # Supabase client & SecureStore adapter
├── stores/
│   ├── auth.ts                 # Authentication state (Zustand)
│   └── index.ts                # Store exports
└── types/                      # Global TypeScript definitions
```

## Development Conventions

### 1. State Management (Zustand)
*   **Selectors are Mandatory:** Always use specific selectors to subscribe to store updates to prevent unnecessary re-renders.
    *   ✅ `const user = useAuthStore((s) => s.user);`
    *   ❌ `const { user } = useAuthStore();`
*   **Encapsulation:** Logic for complex actions (e.g., login, hydration) lives within the store actions, not components.

### 2. Styling & Design System
*   **Theme:** Use tokens from `@/constants/theme.ts`.
    *   **Colors:** `ngx` (Violet #6D00FF), `mint` (#00F5AA), `void` (#050505).
    *   **Typography:** All labels should be uppercase with wide tracking (`label` variant).
*   **Glassmorphism:** Use `GlassCard` or `expo-blur` with `expo-linear-gradient` overlays for the signature look.
*   **Icons:** Use `lucide-react-native` exclusively.

### 3. Routing (Expo Router)
*   **File-based:** Routes are defined by the file structure in `app/`.
*   **Layouts:** Use `_layout.tsx` for shared UI (headers, tab bars) and context providers.
*   **Groups:** Use parenthesis groups (e.g., `(auth)`, `(tabs)`) to organize routes without affecting the URL path.

### 4. Code Style
*   **Imports:** Use the `@/` alias for absolute imports from the project root.
*   **Naming:**
    *   Components & Stores: `PascalCase` (e.g., `GlassCard.tsx`, `useAuthStore`)
    *   Folders & Helpers: `kebab-case`
*   **Type Safety:** Strict TypeScript usage. No `any`.

## Key Commands

| Action | Command | Description |
|--------|---------|-------------|
| **Start Dev Server** | `npm start` | Starts Metro bundler (use `--clear` to reset cache) |
| **Run iOS** | `npm run ios` | Builds and runs on iOS Simulator/Device |
| **Run Android** | `npm run android` | Builds and runs on Android Emulator/Device |
| **Typecheck** | `npm run typecheck` | Runs TypeScript compiler validation |
| **Lint** | `npm run lint` | Runs ESLint |

## Supabase Integration
*   **Client:** Configured in `@/lib/supabase.ts`.
*   **Auth Storage:** Uses `expo-secure-store` adapter for persisting sessions on native devices.
*   **Environment:**
    *   `EXPO_PUBLIC_SUPABASE_URL`: Project URL
    *   `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Public API Key

## Upcoming Tasks (TODOs)
*   [ ] Implement 14-step Onboarding flow.
*   [ ] Connect "Train" tab to Supabase backend.
*   [ ] Implement "GENESIS" AI chat interface.
*   [ ] Set up Push Notifications.
