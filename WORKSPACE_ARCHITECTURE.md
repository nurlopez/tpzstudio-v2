# TPZ Studio: Workspace Architecture

## Core Principle

**State-based, not page-based.** Routes describe state. The workspace canvas persists across navigation. Panels and overlays mount/unmount within it.

---

## Directory Structure

```text
/app
├── layout.tsx                    # Root: fonts (Poppins, Lacquer), metadata
├── globals.css                   # Design tokens, workspace CSS
├── (workspace)/                  # Route group: serves at /
│   ├── layout.tsx               # Persistent workspace container (never unmounts)
│   ├── page.tsx                 # Canvas home: /
│   ├── [objectSlug]/
│   │   └── page.tsx             # Object expanded: /film, /voiceovers, etc.
│   └── proyectos/
│       ├── page.tsx             # Project archive: /proyectos
│       └── [slug]/
│           └── page.tsx         # Project detail: /proyectos/[slug]
├── _workspace/                   # Workspace components (not routes)
│   ├── WorkspaceRoot.tsx        # Container: renders Canvas, Panel, Overlay, Dock, FAB
│   ├── WorkspaceProvider.tsx    # State provider (useWorkspace hook)
│   ├── Canvas.tsx               # Object rendering surface + greeting
│   ├── WorkspaceObject.tsx      # Individual interactive object
│   ├── Panel.tsx                # Side panel (service content, archive, etc.)
│   ├── Overlay.tsx              # Full-screen overlay (project detail)
│   ├── Dock.tsx                 # Persistent logo/title
│   ├── FloatingActionButtons/   # FAB system (contact, about, audio)
│   │   ├── index.tsx            # FAB container + audio control
│   │   ├── FABButton.tsx        # Individual button component
│   │   ├── FABDrawer.tsx        # Drawer container
│   │   └── FABDrawerContent.tsx # Contact form, about panel content
│   ├── types.ts                 # TypeScript types
│   ├── hooks/
│   │   └── useWorkspaceRoute.ts # Route-to-state synchronization
│   └── lib/
│       ├── calculateOptimalLayout.ts  # Grid-based layout with deterministic scatter
│       ├── generateObjectPositions.ts # Fallback position generation
│       ├── getWorkspaceObjects.ts     # Fetch all objects from Sanity (SSG)
│       ├── getWorkspaceObject.ts      # Fetch single object (client-side)
│       └── clampObjectPosition.ts     # Position clamping
├── _components/                  # Shared components (IconMap, etc.)
├── api/
│   ├── workspace-object/[slug]/ # Object data endpoint
│   ├── fab-content/             # FAB content endpoints (contact, about, audio)
│   └── contact/send/            # Contact form submission
│
│ # Non-workspace routes
├── blog/                        # /blog, /blog/[slug]
└── contacto/                    # /contacto (traditional contact page)
```

---

## Routing

### Route-to-State Mapping

| Route | State |
|-------|-------|
| `/` | Canvas home, nothing open |
| `/[objectSlug]` | `panelType: 'service'`, `panelSlug: slug` |
| `/proyectos` | `panelType: 'archive'` |
| `/proyectos/[slug]` | `overlayType: 'project'`, `overlaySlug: slug` |

Contact and about are **not routes** -- they are handled by FloatingActionButtons (FAB drawers).

### Slug Exclusions

`useWorkspaceRoute.ts` ignores these single-segment slugs (they are FAB-handled or traditional routes):
`contact`, `contacto`, `sobre-mi`, `sobre-tpzstudio`, `about`, `blog`

### What Never Unmounts

- `WorkspaceRoot` -- container for everything
- `Canvas` -- renders objects, greeting, paper background
- `WorkspaceProvider` -- global state context
- `Dock` -- logo
- `FloatingActionButtons` -- FAB buttons

### What Mounts/Unmounts

- `Panel` -- mounts when `state.panelOpen`
- `Overlay` -- mounts when `state.overlayOpen`

---

## State Model

### WorkspaceState

```typescript
interface WorkspaceState {
  canvasReady: boolean
  objectsLoaded: boolean
  focusedObject: string | null
  hoveredObject: string | null
  panelOpen: boolean
  panelType: PanelType | null      // 'service' | 'archive' | 'contact' | 'about'
  panelSlug: string | null
  overlayOpen: boolean
  overlayType: OverlayType | null   // 'project' | 'about'
  overlaySlug: string | null
  isMobile: boolean                 // window.matchMedia <= 768px
  touchEnabled: boolean             // ontouchstart or maxTouchPoints > 0
}
```

### WorkspaceActions

| Action | Effect |
|--------|--------|
| `setFocusedObject(slug)` | Sets which object is focused |
| `setHoveredObject(slug)` | Sets which object is hovered |
| `openPanel(type, slug?)` | Opens panel |
| `closePanel()` | Closes panel, clears focus |
| `openOverlay(type, slug?)` | Opens overlay |
| `closeOverlay()` | Closes overlay |
| `setCanvasReady(ready)` | Marks canvas ready |
| `setObjectsLoaded(loaded)` | Marks objects loaded |

Access via `useWorkspace()` hook, which returns `{ state, actions }`.

---

## Component Responsibilities

| Component | Does | Does NOT |
|-----------|------|----------|
| **WorkspaceRoot** | Renders Canvas, Panel, Overlay, Dock, FAB. Handles ESC key. Calls `useWorkspaceRoute()`. | Render objects. Fetch content. |
| **Canvas** | Renders objects via `WorkspaceObject`. Calculates layout. Shows greeting. Handles click-outside-to-close. | Manage object state. Render panels/overlays. |
| **WorkspaceObject** | Renders visual (image or icon fallback). Hover/focus states. Label on hover. Click handler. Entrance + idle float animation (Framer Motion). | Fetch content. Manage panel state. |
| **Panel** | Slides in from right (400px, full-screen on mobile). Fetches content via `getWorkspaceObject()` for service panels. Close button. | Manage global state. Fetch for non-service panels. |
| **Overlay** | Full-screen overlay for project details. | Fetch content. Manage state. |
| **Dock** | Renders logo. Always visible. | Manage state. |
| **FloatingActionButtons** | FAB buttons for contact, about, audio. Manages drawer open/close. | Route navigation. Global state changes. |

---

## Data Flow

1. **Build time**: `getWorkspaceObjects()` fetches from Sanity, filters out FAB slugs, generates positions
2. **Server render**: Objects passed to Canvas as props
3. **Client mount**: Layout calculated via `calculateWorkspaceLayout()` using viewport dimensions
4. **On object click**: Router pushes `/{slug}`, `useWorkspaceRoute` syncs state, Panel mounts and fetches via `/api/workspace-object/[slug]`
5. **FAB content**: Fetched client-side via `/api/fab-content/contact`, `/api/fab-content/about`, `/api/fab-content/audio`

---

## Mobile Adaptation

Same components, different presentation:

| Concern | Desktop | Mobile |
|---------|---------|--------|
| Panel | 400px side panel, canvas visible (dimmed) | Full-screen |
| Object click | Immediate panel open | 1500ms delay (for focus animation) |
| Hover | Scale + label + grayscale filter | No hover; focus state on tap |
| Layout | Larger objects, wider spacing | Smaller objects (min 100px), tighter spacing |
| FAB drawer | Fixed-position card | Bottom-sheet style |

Mobile breakpoint: 768px (CSS) / 640px (layout calculation).
