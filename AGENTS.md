# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Expo Router screens and layouts (auth flow, tabs, modals, onboarding).
- `components/` holds reusable UI components; core primitives live in `components/ui/`.
- `constants/` includes the design system (`constants/theme.ts`).
- `lib/` provides integrations like Supabase (`lib/supabase.ts`).
- `stores/` contains Zustand state and selectors.
- `types/` defines shared TypeScript types.
- `assets/` houses static images/fonts, and `ios/` is the native iOS project.

## Build, Test, and Development Commands
- `npm run start` starts the Expo dev server.
- `npm run ios` and `npm run android` build and run native apps.
- `npm run web` runs the web target.
- `npm run start:mcp` starts Expo with the MCP server enabled.
- `npm run typecheck` runs `tsc --noEmit` in strict mode.
- `npm run lint` executes ESLint across the repo.

## Coding Style & Naming Conventions
- TypeScript + React Native; keep components in PascalCase and folders in kebab-case.
- Use the `@/` alias for project imports (configured in `tsconfig.json`).
- Follow the NGX design system in `constants/theme.ts` and reuse `components/ui`.
- Use Zustand selectors (`useStore((s) => s.value)`) to avoid re-render churn.
- Add `testID` props to interactive elements for future testing.

## Testing Guidelines
- No test runner is configured yet; rely on `npm run typecheck` and `npm run lint`.
- If adding tests, prefer `__tests__/` or `*.test.tsx` near the feature and document the runner you introduce.

## Commit & Pull Request Guidelines
- Git history currently has only an “Initial commit,” so there is no established pattern.
- Project docs recommend Conventional Commits (e.g., `feat:`, `fix:`, `refactor:`).
- PRs should include a concise summary, relevant screenshots for UI changes, and any linked issues.

## Security & Configuration Tips
- Environment variables live in `.env`; copy `.env.example` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Auth tokens must use `expo-secure-store` (see `lib/supabase.ts`).

## Additional Notes
- See `CLAUDE.md` for the full NGX design system, routing structure, and required patterns.
