# Design System — Sistema de Atención Técnica

## Direction
- **Personality:** Precision Workshop & Technical Instrumentation (Taller de Servicio Técnico Multirubro).
- **Foundation:** Dark theme based on ESD Carbon (`#090B0E`) with Instrument Amber (`#F59E0B`) phosphor accents and Oscilloscope Emerald (`#10B981`) status indicators.
- **Depth Strategy:** Borders-only / low-contrast surface elevation (`rgba(255, 255, 255, 0.08)` / `#1E2532`), subtle 24px cutting mat grid pattern (`.grid-pattern`), zero generic neon glows or bloated drop-shadows.

---

## Tokens

### Spacing
- **Base Unit:** 4px
- **Scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Colors
- **Canvas / Background:** `#090B0E` (ESD Carbon - Tapete antiestático)
- **Surface 1 (Base):** `#0F1217` (Chassis Slate - Fondo de paneles)
- **Surface 2 (Card / Elevated):** `#11141A` / `#151922` (Tarjetas de especificación técnica)
- **Surface 3 (Inset / Active):** `#1A202C` / `#222938` (Controles, hover y fondos de input)
- **Borders:** `rgba(255, 255, 255, 0.08)` / `#1E2532` (Bordes de 1px a bajo contraste)
- **Primary Accent:** `#F59E0B` (Instrument Amber / Phosphor de multímetro)
- **Primary Active / Container:** `#D97706`
- **On-Primary:** `#000000` (Alto contraste negro sobre ámbar)
- **Success / Status Ready:** `#10B981` (Oscilloscope Emerald)
- **Text Primary:** `#F1F5F9`
- **Text Muted:** `#94A3B8`
- **Text Subtle / Metadata:** `#64748B`

### Typography
- **Primary Sans:** `Plus Jakarta Sans`, `Geist`, sans-serif (Cuerpo y títulos)
- **Monospace / Telemetry:** `JetBrains Mono`, monospace (Códigos de orden OT, métricas tabulares, especificaciones JSONB, tags de código)
- **Scale:**
  - `Display / Hero:` 32px–48px / 800 / tracking-tight
  - `H2 (Secciones):` 24px–32px / 800 / tracking-tight
  - `H3 (Tarjetas):` 16px–18px / 700
  - `Body:` 13px–15px / 400 / line-height 1.6
  - `Mono Data / OT Numbers:` 12px–14px / 600 / `tabular-nums`
  - `Micro Tag / Metadata:` 10px–11px / 600 / uppercase / tracking-widest

### Border Radius
- `Micro (Inputs / Badges):` 4px–6px (`rounded`, `rounded-md`)
- `Standard (Tarjetas / Contenedores):` 8px–12px (`rounded-lg`, `rounded-xl`)
- `Pills (Solo badges de estado):` 9999px (`rounded-full`)

---

## Patterns

### 1. Button Primary (Instrument Amber)
- **Height:** 36px–40px
- **Padding:** 8px 16px
- **Radius:** 6px (`rounded-md`)
- **Tokens:** `bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-semibold font-mono text-xs`
- **Usage:** Acciones principales (Auditar estado, Probar demo, Comenzar prueba).

### 2. Button Secondary / Outline
- **Height:** 36px–40px
- **Padding:** 8px 16px
- **Radius:** 6px (`rounded-md`)
- **Tokens:** `bg-[#141820] border border-white/[0.1] text-slate-200 hover:text-white hover:bg-[#1a202c] font-mono text-xs`
- **Usage:** Acciones secundarias (Ver panel en vivo, Ingresar al taller).

### 3. Segmented Hardware Switch (Mode Toggle)
- **Container:** `p-1 bg-[#141820] border border-white/[0.1] rounded-lg inline-flex gap-1`
- **Items:** `px-4 py-1.5 rounded text-xs font-mono font-semibold transition-all`
- **Active State:** `bg-amber-500 text-black shadow-sm`
- **Inactive State:** `text-slate-400 hover:text-white hover:bg-white/[0.03]`
- **Usage:** Alternador táctil entre "Modo Cliente" y "Dueño de Taller".

### 4. Precision Input (OT / Document Search)
- **Container:** `p-1.5 bg-[#12161f] border border-white/[0.12] rounded-lg flex gap-2 shadow-xl`
- **Prefix:** `font-mono text-xs text-slate-500` (ej: `OT#`)
- **Input Field:** `bg-[#090b0e] border border-white/[0.08] text-white rounded py-2.5 px-3 font-mono text-xs focus:border-amber-500/70`
- **Usage:** Búsqueda rápida de órdenes por DNI o código alfanumérico.

### 5. Technical Spec Card (Multirubro & Features)
- **Background:** `bg-[#11141a] hover:bg-[#151922]`
- **Border:** `border border-white/[0.08] hover:border-amber-500/30`
- **Radius:** 12px (`rounded-xl`)
- **Padding:** 20px–24px
- **Header:** Tag superior en JetBrains Mono con código (`RUBRO-01`) o categoría (`// ESPECIFICACIONES`).
- **Usage:** Grids de rubros técnicos y módulos del sistema.

### 6. Bklit UI Composable Telemetry Card
- **Background:** `bg-[#11141a] border border-white/[0.08] rounded-xl p-6`
- **Metric Hero:** `font-mono text-3xl font-bold text-white tracking-tight`
- **Sparkline / Bar Histogram:** Barras adaptables con `bg-amber-500/20 group-hover:bg-amber-500/40 rounded-t`, barra actual en `bg-amber-500` sólido con badge flotante `Hoy`.
- **Counters Grid:** Mini-cards interiores en `bg-[#151922] p-3 rounded-lg border border-white/[0.04]` con etiquetas en uppercase.

### 7. 80mm Thermal Ticket Component
- **Paper Body:** `bg-[#fafbfc] text-slate-900 border border-slate-300 rounded-lg p-5 font-mono text-xs`
- **Perforated Dividers:** `border-b border-dashed border-slate-400`
- **QR Code Container:** Bloque oscuro de 32x32px para lectura con cámara móvil.
- **Usage:** Previsualización fidedigna de comprobantes ESC/POS impresos en el mostrador del taller.
