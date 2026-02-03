# Auditoría del proyecto — NGX GENESIS

Fecha: 2026-02-03

## Resumen ejecutivo (dónde estamos parados)

El proyecto ya tiene una base sólida para una app fitness premium: routing con Expo Router, design system (glassmorphism violeta/mint), módulos principales (Home “Tu Día”, Progress, Train/Workout Player, Nutrition, Mindfulness, Chat, Camera) y Supabase como backend.

Actualización: ya se corrigieron los P0 más urgentes de auth bypass, fechas locales y logging de sets. Queda pendiente terminar de activar lint (instalar deps y actualizar lockfile).

Reportes relacionados:

- Seguridad: `security_best_practices_report.md`

---

## Estado actual (evidencia rápida)

- TypeScript strict OK: `npm run typecheck` pasó (sin errores).
- Linting: config añadida, pero requiere instalar deps y actualizar lockfile.
- Config Expo: `app.json:10` tiene `newArchEnabled: false` (contrasta con documentación interna que menciona New Architecture).

---

## Findings priorizados

### P0 (bloqueadores / alto impacto inmediato)

**P0-001 — Bypass de auth/hidratación habilitado**

- **Estado:** **Resuelto** (ahora requiere `__DEV__` + `EXPO_PUBLIC_DEV_BYPASS=true`).
- **Evidencia:** `app/_layout.tsx:64`, `app/_layout.tsx:85`.

**P0-002 — Fechas en UTC para “daily tracking”**

- **Estado:** **Resuelto** (helpers de fecha local y week start local).
- **Evidencia:** `services/api/base.ts:82`, `services/api/coach.ts:125`, `services/api/checkin.ts:36`, `stores/progress.ts:170`.

**P0-003 — Logging de sets puede fallar silenciosamente**

- **Estado:** **Resuelto** (ahora lanza error si no hay log y la UI muestra el error).
- **Evidencia:** `stores/workout.ts:100`.

**P0-004 — Linting no disponible**

- **Estado:** **Parcial** (config y deps añadidas; falta instalar + lockfile).
- **Evidencia:** `package.json:11`, `package.json:47`, `.eslintrc.cjs:1`.

### P1 (alto impacto UX/consistencia)

**P1-001 — Permisos de micrófono solicitados al montar Camera**

- **Evidencia:** `app/(tabs)/camera/index.tsx:80`.
- **Impacto UX:** “permission surprise”, fricción y potencial rechazo (usuarios no entienden por qué pide mic al abrir cámara si solo quieren foto/scan).
- **Acción recomendada:** pedir mic solo al entrar en modo FORM o al iniciar grabación; mostrar rationale.

**P1-002 — Coach notes en Chat usando location incorrecta**

- **Evidencia:** `app/(tabs)/chat/index.tsx:60` usa `useCoachNotesByLocation('home')`.
- **Impacto:** notas aparecen/contabilizan mal; ruido en “GENESIS chat”.
- **Acción recomendada:** soportar location `chat` y filtrar adecuadamente.

**P1-003 — Inconsistencia de idioma (ES/EN)**

- **Evidencia:** onboarding y auth tienen copy en inglés (`app/(onboarding)/index.tsx:14`, `app/(auth)/login.tsx:82`).
- **Impacto:** percepción “no terminado” + fricción en mercado hispanohablante.
- **Acción recomendada:** decidir idioma base + preparar i18n (aunque sea simple al inicio).

**P1-004 — Persistencia de “dismiss” y hábitos**

- **Evidencia:** Home “mindDismissed” es estado local (`app/(tabs)/index.tsx:43`).
- **Impacto:** tarjetas que el usuario “dismiss” pueden reaparecer; rompe sensación de control.
- **Acción recomendada:** persistir “dismiss por día” (store + fecha local).

### P2 (mejoras estructurales / mantenibilidad)

**P2-001 — Duplicación de backgrounds/gradients por pantalla**

- **Impacto:** cambios visuales cuestan más; riesgo de inconsistencias.
- **Acción recomendada:** extraer `ScreenBackground` (gradient + glow) y parametrizar.

**P2-002 — Typed Routes vs `as any`**

- **Evidencia:** `app/(tabs)/index.tsx:130`.
- **Impacto:** perdemos beneficios de typed routes; aumentan bugs de navegación.
- **Acción recomendada:** centralizar rutas (const) y evitar “server-driven route strings”.

---

## UI/UX — mejores prácticas para apps fitness (recomendaciones aplicadas al proyecto)

1) **“Tu Día” debe ser ultra accionable:** 1 CTA dominante (Entrenar / Registrar comida / Sesión mindfulness) + progreso visible. Ya va en buen camino con el Home Hub.
2) **Loops de hábito (streaks) confiables:** arreglar P0-002 es clave antes de gamificación (si falla 1 vez, el usuario deja de confiar).
3) **Fricción mínima en logging:** cámara/scan y quick add deben funcionar sin pedir permisos innecesarios (P1-001).
4) **Feedback inmediato y estados claros:** preferir skeletons/empty states consistentes (ya existen componentes `EmptyState`, `LoadingState`, `ErrorState`).
5) **Consistencia de lenguaje y tono:** escoger ES (o ES+EN) y alinear onboarding/auth/chat.
6) **Accesibilidad:** touch targets (ya hay `touchTarget.min`), labels para icon buttons y lectura de estados (especialmente en cámara, tab bar, quick actions).
