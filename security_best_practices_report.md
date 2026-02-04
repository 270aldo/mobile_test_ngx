# Security Best Practices Report — NGX GENESIS

Fecha: 2026-02-04

## Alcance

- App mobile (Expo + React Native + TypeScript)
- Auth + data layer (Supabase)
- Rutas (expo-router) + stores (Zustand)

> Nota: No existe una guía específica de seguridad “React Native / Expo” dentro de las referencias del skill; este reporte aplica buenas prácticas generales para TS/JS + apps cliente y se apoya en patrones típicos de Expo/Supabase.

## Resumen ejecutivo

La base de seguridad está bien encaminada: uso de `expo-secure-store` para sesión en nativo, `detectSessionInUrl: false`, y una arquitectura de stores razonable.  
Los riesgos más relevantes hoy son:

1) Varias operaciones a Supabase filtradas solo por `id` (dependen 100% de RLS). Es aceptable si RLS está perfecta, pero es frágil: conviene defensa en profundidad.

---

## Findings

### Crítico

**S-001 — Bypass de autenticación habilitado**

- **Estado:** **Resuelto** (ahora requiere `__DEV__` + `EXPO_PUBLIC_DEV_BYPASS=true`).
- **Evidencia:** `app/_layout.tsx:64`, `app/_layout.tsx:85`.

### Alto

**S-002 — Operaciones Supabase sin “defense-in-depth” (solo por `id`)**

- **Impacto:** si alguna política RLS se configura mal o queda temporalmente deshabilitada, podría permitir lectura/escritura cross-user por IDs.
- **Evidencia (ejemplos):**
  - `services/api/workout.ts:53` (`updateWorkoutStatus` actualiza por `id`).
  - `services/api/workout.ts:70` (`startWorkout` actualiza + crea logs).
  - `services/api/nutrition.ts:59` (`removeFoodLog` borra por `id`).
  - `services/api/coach.ts:65` (`dismissCoachNote` actualiza por `id`).
- **Recomendación:** donde sea posible, incluir también `.eq('user_id', userId)` (o filtrar por owner/foreign key) y/o mover mutaciones sensibles a RPCs con `auth.uid()` server-side.

**S-003 — Tokens en web usando `localStorage`**

- **Impacto:** en Expo Web, un XSS podría robar tokens si se guardan en `localStorage`.
- **Evidencia:** `lib/supabase.ts:17` (adapter web usa `localStorage`).
- **Recomendación:** si el target web es importante, evaluar alternativas (cookies seguras, hardening CSP, reducir superficie XSS) o deshabilitar web si no es parte del producto. Para mobile nativo, el uso de SecureStore está bien.

### Medio

**S-004 — Navegación controlada por datos (CTA de coach note) sin validación**

- **Estado:** **Resuelto** (allowlist de rutas internas).
- **Evidencia:** `constants/routes.ts:1`, `app/(tabs)/index.tsx:65`.

**S-005 — Logging de texto del usuario (riesgo de fuga por logs)**

- **Impacto:** contenido del usuario podría terminar en logs (debug builds, herramientas de observabilidad) sin redacción.
- **Evidencia:** `services/elevenlabs.ts:67` y `services/elevenlabs.ts:87` loguean substrings de texto.
- **Recomendación:** centralizar logging (niveles + redacción) y deshabilitar/limitar logs en builds de producción.

### Bajo

**S-006 — Manejo de errores y hardening general**

- **Evidencia/ejemplos:**
  - `app/_layout.tsx:9` llama `SplashScreen.preventAutoHideAsync()` sin `.catch()` (no es crítico, pero reduce ruido de errores en edge cases).
  - `lib/supabase.ts:6` usa non-null assertions en env vars: si falta config, crash temprano.
- **Recomendación:** agregar “fail fast” con mensaje claro o pantalla de configuración/diagnóstico para entornos dev/staging.
