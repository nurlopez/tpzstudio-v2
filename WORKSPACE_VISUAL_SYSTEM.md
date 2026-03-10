# TPZ Studio: Visual System

## Philosophy

The workspace feels like "where ideas are made." Not a gallery, not a landing page. Calm, intelligent, exploratory. Functional, not decorative.

---

## Color System

### Canvas Background: Paper Aesthetic

The canvas uses a warm paper background with grid pattern and vignette.

| Token | Value | Purpose |
|-------|-------|---------|
| `--paper-bg` | `#faf9f7` | Off-white paper base |
| `--paper-grid-color` | `rgba(0,0,0,0.08)` | Subtle grid lines |
| `--paper-grid-size` | `20px` | Grid spacing (responsive: 14-24px) |
| `--vignette-color` | `rgba(0,0,0,0.15)` | Edge darkening |

Grid is rendered via CSS gradients (horizontal + vertical lines + radial vignette). Responsive sizing: 14px (small mobile), 16px (mobile), 20px (default), 24px (1440px+).

### Paper Ink Tokens (text on paper background)

| Token | Value | Use |
|-------|-------|-----|
| `--paper-ink-primary` | `rgba(0,0,0,0.85)` | Main content |
| `--paper-ink-secondary` | `rgba(0,0,0,0.65)` | Supporting text |
| `--paper-ink-muted` | `rgba(0,0,0,0.45)` | Tertiary text |
| `--paper-ink-interactive` | `rgba(0,0,0,0.75)` | Links, clickable text |

### Dark Tokens (legacy, used by non-workspace routes)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-canvas` | `#0a0a0a` | Fallback/dark surface |
| `--bg-surface` | `#1a1a1a` | Panel/overlay backgrounds (dark routes) |
| `--ink-primary` | `rgba(248,248,248,0.95)` | Text on dark |
| `--ink-secondary` | `rgba(248,248,248,0.75)` | Supporting text on dark |
| `--ink-muted` | `rgba(248,248,248,0.5)` | Muted text on dark |

### Panel Styling

Panels use a clean white background (`#ffffff`) with black text. Enforced via `!important` rules in `globals.css` on `[data-workspace-panel]`.

### State Colors

| Token | Value | Use |
|-------|-------|-----|
| `--state-focused` | `rgba(255,255,255,0.15)` | Focused object |
| `--state-muted` | `rgba(255,255,255,0.4)` | Unfocused objects (opacity) |

### Accents

Functional only. `--accent-active`, `--accent-interactive`, `--accent-muted` for interactive feedback.

---

## Typography

### Fonts

| Font | Variable | Use |
|------|----------|-----|
| Poppins (300-700) | `--font-sans` | Body, UI elements |
| Lacquer | `--font-lacquer` | Object labels on hover, panel headings |

### Scale

| Token | Value |
|-------|-------|
| `--font-size-xs` | 12px |
| `--font-size-sm` | 14px |
| `--font-size-md` | 16px |
| `--font-size-lg` | 18px |
| `--font-size-xl` | 24px |
| `--font-size-2xl` | 32px |

Line heights: `--line-height-tight: 1.2`, `--line-height-normal: 1.5`, `--line-height-relaxed: 1.75`.

Headings use `var(--font-serif)` (Georgia fallback), weight 400, tight letter-spacing.

---

## Spacing

4px base unit.

| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-4xl` | 96px |

---

## Canvas Spatial Model

All objects fit within a single viewport (100vh). No scrolling.

- `calculateWorkspaceLayout()` computes a grid (cols x rows), sizes objects (100-160px), and applies seeded scatter within cells
- Positions are deterministic (same slugs = same layout across reloads)
- AABB overlap checking prevents collisions
- Object size adapts to viewport: min 100px, max 160px (120px on mobile)

---

## Object Visual Language

- Objects render Sanity-provided visuals (images/SVGs) or icon fallbacks
- Size controlled by `--object-size` CSS variable (set by layout calculator)
- Hover: grayscale CSS filter on image (`filter: grayscale(100%)`)
- Mobile: grayscale applied on focused state instead of hover
- Labels appear below object on hover/focus, use Lacquer font, transparent background
- No borders, no shadows, no background on objects

---

## Panel & Overlay Styling

| Surface | Background | Z-index | Width |
|---------|-----------|---------|-------|
| Canvas | Paper with grid | 0 | 100vw |
| Objects container | Transparent | 1 | 100vw |
| Panel | `#ffffff` | 1000 | 400px (desktop), 100vw (mobile) |
| Overlay | `#ffffff` | 2000 | 100vw |

Canvas dims to 0.4 opacity when panel/overlay is open (`[data-dimmed]` attribute).

---

## Visual Constraints

**Never use**: animated backgrounds, particle effects, glassmorphism, neumorphism, decorative gradients, portfolio grids on canvas.

**Always**: semantic tokens (never hardcode colors), consistent spacing scale, readable text (WCAG AA minimum).
