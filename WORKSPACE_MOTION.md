# TPZ Studio: Motion System

## Principle

Motion explains state changes, focus, and intent. It is not decoration. Every animation must answer: "Why did this move?"

---

## Duration Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--motion-fast` | 150ms | Hover feedback, label appear/disappear |
| `--motion-standard` | 300ms | Canvas dimming, focus transitions |
| `--motion-slow` | 400ms | Panel slide, FAB entrance |
| `--motion-slower` | 500ms | Initial load, major state changes |

Never exceed 800ms for any single transition.

## Easing Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ease-out` | `cubic-bezier(0.22,1,0.36,1)` | Entrances (panel open, object appear) |
| `--ease-in` | `cubic-bezier(0.4,0,1,1)` | Exits (panel close) |
| `--ease-in-out` | `cubic-bezier(0.4,0,0.2,1)` | Transforms (scale, focus) |

---

## Object Animations (Framer Motion)

### Entrance

Objects fly in from a seeded random direction with stagger:
- Delay: `1.0s + index * 0.12s` (after logo + greeting)
- Duration: 0.6s, ease `[0.22, 1, 0.36, 1]`
- From: `opacity: 0, scale: 0.85, x/y: 30-50px offset` (angle seeded by slug)

### Idle Float

After entrance, each object floats vertically in a continuous loop:
- Duration: 2.5-3.5s (seeded per slug)
- Distance: 3-6px (seeded per slug)
- Ease: `easeInOut`, `repeat: Infinity`

### Hover (Desktop)

Handled by CSS on `[data-workspace-object]`:
- Scale: `1.0 -> 1.1` (300ms, ease-in-out)
- Image: `grayscale(100%)` filter (300ms)
- Label: `opacity 0 -> 1` (150ms, ease-out)

### Focus/Tap

- Focused object: `scale(1.05)`, opacity 1
- Muted objects: `opacity: var(--state-muted)` (0.4)
- All via CSS data-state attributes

---

## Canvas Transitions

| Event | What Moves | Timing |
|-------|-----------|--------|
| Panel opens | Canvas dims to 0.3-0.4 opacity | 300ms ease-out |
| Panel closes | Canvas brightens to 1.0 | 300ms ease-out |
| Object focus | Focused scales to 1.05, others fade to 0.4 | 300ms ease-in-out |

---

## Panel Animation

- Desktop: fixed right, `transform: translateX(0)` (already in position, no slide animation currently)
- Mobile: full-screen, same positioning
- Close: `transition: transform var(--motion-slow) var(--ease-out)`

## Overlay Animation

- Appears full-screen, `transition: opacity var(--motion-slow) var(--ease-out)`

---

## Greeting Animation

Word-by-word reveal on canvas:
- Each word: `opacity 0 -> 0.6`, `y: 10px -> 0`
- Duration: 0.4s per word
- Delay: `0.5s + index * 0.1s`
- Ease: `[0.22, 1, 0.36, 1]`

---

## FAB Animations

### Button Entrance

```css
@keyframes fab-enter {
  from { opacity: 0; transform: scale(0.8) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
```
Duration: `var(--motion-slow)`, ease-out.

### Drawer Entrance

```css
@keyframes fab-drawer-enter {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```
Mobile: slides up from `translateY(100%)`.

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

FAB buttons and drawers also reset to `opacity: 1; transform: none`.

---

## What Must NOT Animate

- Canvas background (static; only opacity changes)
- Object positions (fixed after layout calculation)
- Text content (containers animate, not text)
- Z-index values
- Layout shifts (no reflow during interactions)
