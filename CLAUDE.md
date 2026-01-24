# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NGX GENESIS HYBRID - Premium fitness app ($199-499/month) combining AI workout programming (GENESIS) with human coaching. Dark-first glassmorphism aesthetic.

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
- **Supabase** for backend (auth + PostgreSQL)
- **expo-secure-store** for token storage (never AsyncStorage for auth)

## Architecture

### Routing (expo-router)

Route groups in `app/`:
- `(auth)/` - Login/register screens (unauthenticated users)
- `(tabs)/` - Main 5-tab navigation (authenticated users)
- `(onboarding)/` - 14-step onboarding (authenticated, not completed)
- `(modals)/` - Modal presentations

Navigation guards in `app/_layout.tsx` use `Stack.Protected` with guards.

### State Management (Zustand)

**Critical pattern - always use selectors:**
```typescript
// ✅ Correct - prevents unnecessary re-renders
const isLoading = useAuthStore((s) => s.isLoading);
const user = useUser(); // exported selector hook

// ❌ Wrong - causes re-renders on every state change
const { isLoading } = useAuthStore();
```

Pre-built selector hooks in `stores/auth.ts`: `useUser()`, `useSession()`, `useIsAuthenticated()`, `useIsHydrated()`, `useAuthLoading()`

### Auth Flow

1. `app/_layout.tsx` calls `hydrate()` on mount
2. Supabase session restored from SecureStore
3. Auth state listener set up for changes
4. Route guards redirect based on auth/onboarding status

**Dev mode bypass active:** In `app/_layout.tsx`, auth is bypassed with `const isLoggedIn = true`. Re-enable by uncommenting the real auth checks.

### Design System

All tokens in `constants/theme.ts`:
- Primary: `#6D00FF` (violet), Secondary: `#00F5AA` (mint)
- Background: `#050505` (void)
- Import: `import { colors, spacing, borderRadius } from '@/constants/theme'`

UI components in `components/ui/`:
- `GlassCard` - blur(12) container with violet highlight
- `Button` - 7 variants: primary, secondary, mint, chip, ghost, coach, danger
- `Label` - 10px uppercase, letterSpacing: 3
- `StatusPill`, `PulseDot`, `Input`

### Path Aliases

Configured in `tsconfig.json`:
```typescript
import { colors } from '@/constants/theme';
import { GlassCard, Button } from '@/components/ui';
import { useAuthStore } from '@/stores';
```

## Environment Variables

Required in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Current State

**Implemented:** Auth system, design system, 5 tab screens (Home, Train, Chat, Progress, Profile), glassmorphism tab bar

**Pending:** Onboarding flow, real Supabase data, GENESIS AI integration, workout tracking, push notifications
