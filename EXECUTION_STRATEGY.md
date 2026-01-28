# ESTRATEGIA DE EJECUCIÓN PARALELA
## Claude Code + Gemini CLI trabajando simultáneamente

---

## 🎯 OBJETIVO

Implementar la capa visual premium de NGX GENESIS en una sesión de trabajo paralelo:
- **Claude Code**: Infraestructura de código (componentes, utils, integración)
- **Gemini CLI**: Generación de assets visuales (imágenes, avatars, badges)

---

## ⏱️ TIMELINE (2-3 horas estimadas)

```
HORA 0:00 - 0:30
├── Claude Code: Instalar deps + crear estructura de carpetas
└── Gemini CLI: Generar BATCH 1 (6 hero images)

HORA 0:30 - 1:00
├── Claude Code: Crear OptimizedImage + VideoBackground components
└── Gemini CLI: Generar BATCH 2 (3 avatars)

HORA 1:00 - 1:30
├── Claude Code: Crear ExerciseDemo + actualizar GlassCard
└── Gemini CLI: Generar BATCH 3 (4 empty states)

HORA 1:30 - 2:00
├── Claude Code: Crear utils/assets.ts + integrar en Home
└── Gemini CLI: Generar BATCH 4 (6 badges)

HORA 2:00 - 2:30
├── Claude Code: Integrar en Train screen + verificar
└── Gemini CLI: Optimizar y copiar assets al proyecto

HORA 2:30 - 3:00
└── AMBOS: Testing visual completo
```

---

## 📋 CHECKLIST DE EJECUCIÓN

### TERMINAL 1: CLAUDE CODE

```bash
# Navegar al proyecto
cd /path/to/mobile-app_ngx_test

# Iniciar Claude Code
claude
```

**Prompt inicial:**
```
Lee PROMPT_CLAUDE_CODE_VISUAL_INFRA.md e implementa toda la infraestructura visual.

Empieza por:
1. Instalar dependencias (expo-image, expo-av, expo-blur)
2. Crear estructura de carpetas en assets/
3. Crear componentes en orden: OptimizedImage → VideoBackground → ExerciseDemo
4. Actualizar GlassCard con props de media
5. Crear utils/assets.ts
6. Integrar en Home y Train screens

Usa placeholders mientras los assets reales no existen.
```

### TERMINAL 2: GEMINI CLI

```bash
# Asegurarte que tienes Gemini CLI configurado
gemini --version

# O si usas el MCP de Nano Banana en Claude Desktop:
# Abrir nueva conversación con Gemini
```

**Prompt inicial:**
```
Lee PROMPT_GEMINI_CLI_ASSETS.md y genera los assets visuales para NGX GENESIS.

Usa Nano Banana Pro para cada imagen.

Empieza con BATCH 1 (Hero Images):
1. hero_upper_push.jpg
2. hero_upper_pull.jpg
3. hero_lower_squat.jpg
4. hero_lower_deadlift.jpg
5. hero_full_body.jpg
6. hero_conditioning.jpg

Guarda cada imagen con el nombre exacto especificado.
Después de cada batch, confirma antes de continuar al siguiente.
```

---

## 🔄 SINCRONIZACIÓN

### Punto de sync 1 (después de BATCH 1):
```
Gemini: "Hero images completadas, guardadas en assets/images/hero/"
Claude Code: "Componentes base listos, esperando assets para test visual"
→ Copiar hero images al proyecto
→ Claude Code: Verificar que cargan correctamente
```

### Punto de sync 2 (después de BATCH 2):
```
Gemini: "Avatars completados"
Claude Code: "utils/assets.ts listo con referencias"
→ Copiar avatars
→ Verificar en Chat screen placeholder
```

### Punto de sync 3 (después de BATCH 3+4):
```
Gemini: "Empty states y badges completados"
Claude Code: "EmptyState component actualizado"
→ Copiar remaining assets
→ Test visual completo
```

---

## 📁 DONDE COLOCAR LOS ASSETS

Gemini genera → Copiar a proyecto:

```bash
# Desde donde Gemini guarda los archivos:
cp ~/Downloads/hero_*.jpg /path/to/mobile-app_ngx_test/assets/images/hero/
cp ~/Downloads/genesis_avatar.png /path/to/mobile-app_ngx_test/assets/images/avatars/
cp ~/Downloads/coach_*.jpg /path/to/mobile-app_ngx_test/assets/images/avatars/
cp ~/Downloads/empty_*.png /path/to/mobile-app_ngx_test/assets/images/empty/
cp ~/Downloads/badge_*.png /path/to/mobile-app_ngx_test/assets/images/badges/
```

---

## ✅ VERIFICACIÓN FINAL

### Visual Check:
- [ ] Home screen muestra hero image con overlay correcto
- [ ] Texto es legible sobre las imágenes
- [ ] Empty states muestran ilustraciones custom
- [ ] GENESIS avatar aparece en Chat
- [ ] Badges se ven en Progress (si hay datos)

### Code Check:
```bash
npm run typecheck  # Sin errores
npm run lint       # Sin warnings críticos
npx expo start     # App carga sin crashes
```

### Performance Check:
- [ ] Imágenes cargan con blur placeholder
- [ ] No hay flash de contenido sin estilo
- [ ] Scroll es fluido en Home
- [ ] No hay memory warnings

---

## 🚨 TROUBLESHOOTING

### "Image not found"
```typescript
// Verificar que el require path es correcto
// En metro.config.js, verificar que assets están incluidos
```

### "Video won't play"
```typescript
// expo-av necesita configuración en app.json
// Verificar que el formato de video es compatible (mp4 h264)
```

### "Assets muy pesados"
```bash
# Optimizar con sharp
npx sharp-cli input.jpg -o output.jpg --quality 80 --resize 1074
```

### "Colores no coinciden"
```
# Verificar que Nano Banana está usando los hex correctos:
# Violeta: #6D00FF
# Mint: #00F5AA
# Si no, editar en post con cualquier editor de imagen
```

---

## 🎉 RESULTADO ESPERADO

Después de completar:

1. **Home Screen**: Hero card con imagen cinematográfica de fondo, overlay gradient, texto legible
2. **Train Screen**: Preparado para exercise demos (placeholder por ahora)
3. **Chat Screen**: GENESIS avatar visible
4. **Empty States**: Ilustraciones custom en lugar de iconos genéricos
5. **Infraestructura**: Componentes reutilizables para video/imagen en toda la app

---

## PRÓXIMOS PASOS (Después de esta sesión)

1. **Exercise Videos**: Grabar o comprar library de demos de ejercicios
2. **Onboarding Illustrations**: Generar las 6 ilustraciones
3. **Ambient Videos**: Crear loops de background para splash/login
4. **More Badges**: Completar los 10+ badges de gamification

---

**¡Manos a la obra! Ejecuta ambos prompts en paralelo.**
