# TPZ Studio: Interaction System

## Principle

Motion reinforces orientation, not impression. If an interaction draws attention to itself, the system has failed.

---

## Object Interactions

### Hover (Desktop Only)

- Object scales up ~10% (CSS `data-state="hovered"`)
- Image turns grayscale (`filter: grayscale(100%)`)
- Label fades in below object (Lacquer font, 150ms)
- Only one object hovered at a time
- Hover does not trigger navigation

### Click/Tap

- **Desktop**: Immediate -- sets focus, opens panel, pushes route
- **Mobile (touch)**: 1500ms delay between focus animation and panel open
- Blog objects navigate to `/blog` instead of opening a panel

### Focus State

When an object is focused (panel open):
- Focused object: `scale(1.05)`, full opacity
- Other objects: reduced opacity (`--state-muted: 0.4`)
- Canvas dims (`opacity: 0.3-0.4`)
- On mobile, focused object gets grayscale filter (same as desktop hover)

### Object States (CSS data attributes)

| `data-state` | Condition | Visual |
|--------------|-----------|--------|
| `default` | No focus active | `opacity: 1` |
| `hovered` | Mouse over (desktop) | `scale(1.1)`, grayscale |
| `focused` | This object's panel is open | `scale(1.05)` |
| `muted` | Another object is focused | `opacity: 0.4` |

---

## Panel Interactions

### Open

Triggered by: object click, route change to `/{slug}` or `/proyectos`.

- Panel appears fixed right (400px desktop, full-screen mobile)
- Canvas dims simultaneously
- Service panels fetch content from `/api/workspace-object/[slug]`
- Archive and about panels receive children

### Close

Triggered by: close button, click on dimmed canvas, ESC key, route change to `/`.

- `closePanel()` clears `panelOpen`, `panelType`, `panelSlug`, and `focusedObject`
- Router pushes `/`

### Scroll

Panel content scrolls internally. Canvas does not scroll.

---

## Overlay Interactions

### Open

Triggered by: route change to `/proyectos/[slug]`.

- Full-screen overlay (z-index 2000) with white background
- Canvas dims heavily

### Close

Triggered by: close button, ESC key, route change.

- `closeOverlay()` clears overlay state
- Router pushes `/`

---

## FAB Interactions

### Buttons

Three FAB buttons stacked vertically in bottom-right corner:

| Button | Action |
|--------|--------|
| Envelope (contact) | Toggles contact drawer |
| Person (about) | Toggles about drawer |
| Play/Pause (audio) | Toggles background audio (only appears if audio URL exists in Sanity) |

### Contact Drawer

- Fetches data from `/api/fab-content/contact`
- Contains: intro text, contact form (name/email/message), phone, social links
- Form submits to `/api/contact/send` (Sanity-sourced recipient)
- Success state: confirmation message with "send another" option

### About Drawer

- Fetches data from `/api/fab-content/about`
- Contains: image, PortableText body, CTA button
- CTA calls `onSwitchToContact()` to switch drawer to contact

### Drawer Behavior

- Only one drawer open at a time (toggling one closes the other)
- Close via drawer close button or re-clicking the FAB button
- Desktop: positioned as floating card above FAB stack
- Mobile: bottom-sheet style (slides up from bottom)

---

## Keyboard Navigation

| Key | Context | Action |
|-----|---------|--------|
| ESC | Overlay open | Close overlay, go back or push `/` |
| ESC | Panel open | Close panel, push `/` |
| Tab | Objects | Move focus between objects |
| Enter/Space | Focused object | Activate (same as click) |

---

## Mobile Adaptation

| Concern | Desktop | Mobile |
|---------|---------|--------|
| Hover | Scale + grayscale + label | Not available |
| Focus feedback | Via hover preview | Grayscale filter on tap |
| Panel | 400px side panel | Full-screen |
| Object click | Immediate | 1500ms delay for focus animation |
| FAB drawer | Floating card | Bottom sheet |
| Object touch targets | Standard | Larger padding (`--space-sm`) |

Mobile breakpoint: `max-width: 768px`.

---

## Reduced Motion

All animations become instant (0.01ms). Spatial relationships preserved. FAB buttons/drawers appear without animation.
