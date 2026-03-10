# TPZ Studio: Workspace Concept

## Overview

The website is a **Creative Workspace** -- a persistent canvas where TPZ Studio's capabilities are represented as interactive objects. Instead of navigating pages, users explore a spatial environment. The workspace makes the studio's versatility tangible: film, voice, branding, education, and strategy are visible as objects on a creative surface.

The homepage **is** the workspace. All content lives within or expands from this canvas.

---

## Workspace Anatomy

### Canvas

A full-viewport paper surface with subtle grid pattern and vignette. Minimal, warm, professional. Objects sit on it. No header, no footer, no navigation bars.

### Objects

Interactive elements representing capabilities. Each object:
- Has a Sanity-provided visual (isometric/pseudo-3D image) or icon fallback
- Is positioned deterministically via grid-based layout with seeded scatter
- Shows a label (Lacquer font) on hover/focus
- Floats gently when idle (subtle vertical motion)
- Responds to hover (grayscale filter, scale) and click (opens panel)

Current object types: `film`, `voiceovers`, `branding`, `courses`, `strategy`, `projects`.

### Greeting

A CMS-editable text displayed at top-center of canvas. Words reveal sequentially with fade-in animation.

### Dock

Persistent logo/title in top-left corner. Always visible, unobtrusive.

### Floating Action Buttons (FAB)

Bottom-right vertical stack with three buttons:
- **Contact**: Opens drawer with form (Sanity-sourced recipient), phone, social links
- **About**: Opens drawer with image, PortableText body, CTA that switches to contact
- **Audio**: Play/pause background audio (only shown if audio URL exists in Sanity)

FABs are always accessible regardless of workspace state (panels, overlays).

---

## Object Types & Content

| Object | Represents | Click Behavior |
|--------|-----------|---------------|
| Film | Film production, social media content | Opens service panel |
| Voiceovers | Audio production, narration | Opens service panel |
| Branding | Identity design, brand systems | Opens service panel |
| Courses | Education, workshops | Opens service panel |
| Strategy | Creative strategy, consulting | Opens service panel |
| Projects | Work archive | Opens archive panel (`/proyectos`) |
| Blog | Blog/news | Navigates to `/blog` (traditional route) |

Contact and about are **not** canvas objects. They are handled by FAB drawers.

---

## Navigation Model

### Entry

Users land directly on the workspace canvas (`/`). Objects appear with staggered fly-in animation.

### Object Interaction

1. Hover: object scales, image goes grayscale, label appears
2. Click: focus set, panel opens, route updates to `/{slug}`
3. Canvas dims, other objects fade

### Deep Navigation

- Service panel shows related projects as links -> clicking opens overlay at `/proyectos/[slug]`
- Service panel shows related blog posts as links -> clicking navigates to `/blog/[slug]`
- Project archive panel lists projects -> clicking opens overlay

### Return

- Close button on panel/overlay
- Click dimmed canvas (panels only)
- ESC key
- All return to `/` (canvas home)
- Browser back/forward works via route-to-state sync

---

## Content Mapping (Sanity)

| Sanity Content | Workspace Element |
|---------------|-------------------|
| `workspaceObject` documents | Canvas objects (filtered by slug exclusion list) |
| `workspaceObject.visual` | Object image on canvas |
| `workspaceObject.description` | Panel body text |
| `workspaceObject.capabilities` | Related projects in panel |
| `workspaceObject.relatedPosts` | Related blog posts in panel |
| `contactPage` document | FAB contact drawer content |
| `aboutPage` document | FAB about drawer content |
| Homepage `greeting` field | Canvas greeting text |
| Audio file | FAB audio control |

---

## Design Principles

1. **Container first**: Workspace structure is independent of content
2. **No dead ends**: Every view has a path back to canvas
3. **Progressive disclosure**: Canvas -> panel -> overlay
4. **Spatial memory**: Objects maintain positions across reloads (deterministic layout)
5. **Minimal chrome**: The workspace itself is the interface
6. **Touch-friendly**: Same architecture, adapted presentation for mobile
