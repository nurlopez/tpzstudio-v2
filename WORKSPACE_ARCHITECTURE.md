# TPZ Studio: Next.js Architecture

## Core Principle

**This site is state-based, not page-based.**

Routes exist for deep-linking and browser navigation, but the workspace canvas is the persistent container. Objects, panels, and overlays are views that mount/unmount within the workspace, not separate pages. The workspace never unmounts during normal navigation.

---

## 1. High-Level App Structure

### Root Layout (`/app/layout.tsx`)

**Responsibility**: Global app shell, fonts, metadata, providers.

**Contains**:

- HTML structure
- Global CSS imports
- Font definitions
- Metadata configuration
- Providers (if needed: theme, analytics, etc.)
- **NO workspace-specific logic**
- **NO Header/Footer components** (workspace has its own chrome)

**Does NOT contain**:

- Workspace components
- Navigation menus
- Page-specific layouts

### Workspace Layout (`/app/workspace/layout.tsx`)

**Responsibility**: Persistent workspace container that wraps all workspace routes.

**Contains**:

- `<WorkspaceRoot />` component (persistent)
- Workspace providers/context
- Global workspace state initialization
- Workspace-level event handlers (keyboard, resize)

**Key behavior**: This layout **never unmounts** when navigating between workspace routes. It persists across:

- `/workspace` (canvas home)
- `/workspace/[objectSlug]` (object expanded)
- `/workspace/projects/[slug]` (project detail)
- `/workspace/contact` (contact panel)

### Directory Structure

```
/app
├── layout.tsx                    # Root: fonts, metadata, global providers
├── globals.css                   # Global styles
├── workspace/                    # Workspace routes (all share workspace layout)
│   ├── layout.tsx               # Workspace layout: persistent container
│   ├── page.tsx                 # Canvas home: /workspace
│   ├── [objectSlug]/
│   │   └── page.tsx             # Object expanded: /workspace/film, /workspace/voiceovers
│   ├── projects/
│   │   ├── page.tsx             # Project archive: /workspace/projects
│   │   └── [slug]/
│   │       └── page.tsx         # Project detail: /workspace/projects/example-slug
│   └── contact/
│       └── page.tsx             # Contact panel: /workspace/contact
├── _workspace/                   # Workspace-specific components (not routes)
│   ├── WorkspaceRoot.tsx        # Main workspace container
│   ├── Canvas.tsx               # Canvas surface
│   ├── WorkspaceObject.tsx      # Individual object component
│   ├── Panel.tsx                # Expandable panel component
│   ├── Overlay.tsx              # Full-screen overlay (projects, etc.)
│   ├── Dock.tsx                 # Optional: persistent UI elements (logo, contact hint)
│   └── hooks/
│       ├── useWorkspaceState.ts  # Workspace state hook
│       ├── useObjectFocus.ts    # Object focus/interaction hook
│       ├── usePanel.ts          # Panel open/close state hook
│       └── useWorkspaceRoute.ts # Route-to-state synchronization
├── _components/                  # Shared components (if any remain)
└── api/                          # API routes (if needed)
```

### What Never Unmounts

1. **`<WorkspaceRoot />`**: The main container that holds the canvas and manages workspace state
2. **`<Canvas />`**: The canvas surface itself (background, ambient elements)
3. **Workspace objects in default state**: Objects remain mounted but may change opacity/scale based on focus
4. **Workspace state context**: Global workspace state provider

### What Mounts/Unmounts

1. **Panels**: Mount when object is expanded, unmount when closed
2. **Overlays**: Mount for project details, unmount when closed
3. **Route-specific content**: Fetched per route, but displayed within persistent workspace

---

## 2. Routing Strategy (State > Pages)

### Route Structure

**Primary routes**:

- `/` → Redirects to `/workspace` (or serves workspace directly)
- `/workspace` → Canvas home (all objects visible, no panel open)
- `/workspace/[objectSlug]` → Object expanded (panel open for that object)
  - Examples: `/workspace/film`, `/workspace/voiceovers`, `/workspace/branding`
- `/workspace/projects` → Project archive expanded (overlay or panel)
- `/workspace/projects/[slug]` → Project detail (overlay)
- `/workspace/contact` → Contact panel open

**Route-to-state mapping**:

- Route determines which object is focused/expanded
- Route determines which panel/overlay is visible
- Route does NOT determine if workspace exists (it always does)

### Deep-Linking Without Breaking Immersion

**Strategy**: URL reflects state, but workspace persists.

**Implementation**:

1. User lands on `/workspace/film`
2. Workspace mounts with canvas visible
3. Route indicates "film object should be expanded"
4. `<WorkspaceRoot />` reads route, sets workspace state to `{ focusedObject: 'film', panelOpen: true }`
5. Film object animates to focused state, panel slides in
6. Canvas remains visible (dimmed) in background
7. User feels they're still "in the workspace"

**Key principle**: The route is a **state descriptor**, not a page identifier.

### Browser Navigation (Back/Forward)

**Behavior**:

- Browser back/forward changes the route
- Route change triggers workspace state update
- Workspace state update triggers panel/overlay mount/unmount
- Canvas always remains visible
- Objects transition smoothly between states

**Example flow**:

1. User on `/workspace` (canvas home)
2. Clicks film object → navigates to `/workspace/film` → panel opens
3. Clicks project in panel → navigates to `/workspace/projects/example` → overlay opens
4. User clicks browser back → route changes to `/workspace/film` → overlay closes, panel remains
5. User clicks browser back again → route changes to `/workspace` → panel closes, canvas home

**Implementation**: Use Next.js `useRouter` and `usePathname` to sync route with workspace state. State changes trigger UI transitions, not page reloads.

### Direct URL Access

**Behavior**:

- User visits `/workspace/projects/example-slug` directly
- Workspace mounts
- Route indicates project detail should be open
- Workspace state initializes to `{ overlayOpen: true, overlayType: 'project', overlaySlug: 'example-slug' }`
- Canvas renders with objects visible (dimmed)
- Project overlay mounts and displays project content
- User can close overlay to return to canvas home (`/workspace`)

**Key**: Direct URLs work, but workspace always mounts first, then state syncs to route.

---

## 3. Workspace State Model

### Global Workspace State

**Location**: React Context (`WorkspaceStateContext`) provided by `<WorkspaceRoot />`

**State shape**:

```typescript
interface WorkspaceState {
  // Canvas state
  canvasReady: boolean
  objectsLoaded: boolean
  
  // Focus state
  focusedObject: string | null        // 'film' | 'voiceovers' | 'branding' | etc.
  hoveredObject: string | null
  
  // Panel state
  panelOpen: boolean
  panelType: 'service' | 'archive' | 'contact' | null
  panelSlug: string | null
  
  // Overlay state
  overlayOpen: boolean
  overlayType: 'project' | 'about' | null
  overlaySlug: string | null
  
  // Mobile state
  isMobile: boolean
  touchEnabled: boolean
  
  // Ambient elements
  ambientElementsVisible: boolean
}
```

**Access**: Via `useWorkspaceState()` hook

**Updates**: Via `useWorkspaceActions()` hook (setters, toggles)

### Local Object State

**Location**: Each `<WorkspaceObject />` manages its own local state

**State shape**:

```typescript
interface ObjectState {
  isHovered: boolean
  isFocused: boolean
  isExpanded: boolean
  animationPhase: 'idle' | 'hovering' | 'expanding' | 'expanded'
}
```

**Access**: Internal to component, not shared globally

**Why local**: Object interactions are isolated. Only focus state (which object is focused) is global.

### Panel / Focus State

**Location**: Managed by `<Panel />` component and synced with global workspace state

**State shape**:

```typescript
interface PanelState {
  isOpen: boolean
  isAnimating: boolean
  contentLoaded: boolean
  panelDirection: 'left' | 'right' | 'bottom' | 'fullscreen'  // Based on mobile/desktop
}
```

**Sync**: Panel state syncs with global `workspaceState.panelOpen` and `workspaceState.focusedObject`

### Mobile vs Desktop State

**Detection**: `useWorkspaceState()` includes `isMobile` and `touchEnabled` flags

**Source**:

- Initial: `window.matchMedia` or user agent (SSR-safe)
- Updates: Resize listener in `<WorkspaceRoot />`

**Usage**:

- Layout decisions: Desktop uses side panels, mobile uses full-screen overlays
- Interaction decisions: Desktop uses hover, mobile uses tap
- Animation decisions: Desktop uses subtle animations, mobile uses larger gestures

### What Does NOT Belong in Global State

1. **Object positions**: Managed by CSS or component props (can be static or from Sanity)
2. **Object visual styles**: Managed by CSS classes/styled-components
3. **Content data**: Fetched per route, passed as props (not in global state)
4. **Animation values**: Managed by animation library state (Framer Motion, etc.)
5. **Form state**: Local to contact panel component
6. **Scroll position**: Not applicable (canvas doesn't scroll)

### State Management Libraries

**Decision**: React Context + hooks (no Redux, Zustand, etc. initially)

**Rationale**:

- Workspace state is app-scoped but not complex enough for external state management
- Context provides clean API via hooks
- Can migrate to Zustand later if state grows complex
- Keeps dependencies minimal

**If state grows**: Consider Zustand for better performance and DevTools, but keep the same state shape.

---

## 4. Core Component Responsibilities

### `<WorkspaceRoot />`

**Location**: `/app/_workspace/WorkspaceRoot.tsx`

**Responsibility**: Top-level workspace container and state provider.

**Does**:

- Provides `WorkspaceStateContext`
- Manages global workspace state
- Handles route synchronization (reads route, updates state)
- Handles keyboard events (ESC to close panels)
- Handles resize events (mobile detection)
- Renders `<Canvas />` and conditionally renders `<Panel />` / `<Overlay />`
- Manages workspace-level animations/transitions

**Does NOT**:

- Render individual objects (delegates to `<Canvas />`)
- Fetch content (receives data as props or children fetch their own)
- Handle object interactions (delegates to `<WorkspaceObject />`)
- Style objects (delegates to components)

**Props**: None (or minimal config). State comes from context, data comes from route/page.

### `<Canvas />`

**Location**: `/app/_workspace/Canvas.tsx`

**Responsibility**: Canvas surface and object container.

**Does**:

- Renders canvas background (image, video, or solid color)
- Renders all `<WorkspaceObject />` components
- Manages object positioning (via CSS Grid, absolute positioning, or layout library)
- Handles canvas-level interactions (click outside to close panels)
- Applies canvas-level effects (dimming when panel open)

**Does NOT**:

- Manage object state (objects manage themselves)
- Fetch object data (receives objects array as prop)
- Handle object clicks (delegates to objects)
- Render panels/overlays (delegates to `<WorkspaceRoot />`)

**Props**:

- `objects: WorkspaceObject[]` - Array of object data
- `background?: BackgroundConfig` - Background image/video config
- `ambientElements?: AmbientElement[]` - Optional canvas elements (intro text, philosophy card)

### `<WorkspaceObject />`

**Location**: `/app/_workspace/WorkspaceObject.tsx`

**Responsibility**: Individual interactive object.

**Does**:

- Renders object visual (SVG, image, or custom component)
- Manages local hover/focus state
- Handles click → navigates to object route
- Applies object-level animations (hover, focus, idle)
- Displays object label on hover
- Responds to global focus state (opacity, scale changes)

**Does NOT**:

- Fetch object content (receives data as prop)
- Render panel content (panel is separate component)
- Manage panel state (delegates to workspace state)
- Handle deep navigation (delegates to Next.js router)

**Props**:

- `slug: string` - Object identifier
- `type: ObjectType` - Object type (determines visual)
- `position: { x: number, y: number }` - Canvas position
- `data?: ServiceData` - Optional service data for label/description
- `isFocused: boolean` - From global state
- `onClick: () => void` - Navigation handler

### `<Panel />`

**Location**: `/app/_workspace/Panel.tsx`

**Responsibility**: Expandable side panel for service/archive/contact content.

**Does**:

- Renders panel container (slide-in animation)
- Renders panel content (service details, project list, contact form)
- Handles panel open/close animations
- Manages panel scroll (if content overflows)
- Renders close button
- Handles click-outside-to-close (delegates to canvas)

**Does NOT**:

- Fetch panel content (receives as prop or children)
- Manage panel state (reads from global state)
- Handle object interactions (objects are separate)
- Render project details (delegates to `<Overlay />`)

**Props**:

- `isOpen: boolean` - From global state
- `type: 'service' | 'archive' | 'contact'` - Panel type
- `slug?: string` - Object/project slug
- `children: ReactNode` - Panel content (fetched by page component)
- `onClose: () => void` - Close handler (updates route)

**Variants**:

- Desktop: Side panel (left or right)
- Mobile: Full-screen overlay

### `<Overlay />`

**Location**: `/app/_workspace/Overlay.tsx`

**Responsibility**: Full-screen overlay for project details or other deep content.

**Does**:

- Renders full-screen overlay container
- Renders overlay content (project media, description, credits)
- Handles overlay open/close animations
- Manages overlay scroll
- Renders close button
- Handles ESC key (delegates to `<WorkspaceRoot />`)

**Does NOT**:

- Fetch overlay content (receives as prop or children)
- Manage overlay state (reads from global state)
- Handle navigation (delegates to router)

**Props**:

- `isOpen: boolean` - From global state
- `type: 'project' | 'about'` - Overlay type
- `slug?: string` - Project slug
- `children: ReactNode` - Overlay content (fetched by page component)
- `onClose: () => void` - Close handler (updates route)

### `<Dock />` (Optional)

**Location**: `/app/_workspace/Dock.tsx`

**Responsibility**: Persistent UI chrome (logo, contact hint, etc.).

**Does**:

- Renders workspace logo/title (always visible)
- Renders contact hint (small, unobtrusive)
- Handles logo click → navigates to `/workspace`
- Positions itself (top-left or top-right)

**Does NOT**:

- Manage workspace state
- Render navigation menu
- Handle object interactions

**Props**: Minimal or none (uses global state for visibility)

---

## 5. Sanity Integration (Deferred, but Planned)

### Content-to-Object Mapping

**Service Documents → Objects**:

- Sanity `service` documents fetched at build time (SSG) or runtime (ISR)
- Each service maps to a workspace object via:
  - `service.icon` field → object type (camera → 'film', music → 'voiceovers')
  - `service.slug` → object slug (used in routes)
  - `service.order` → object position on canvas (or manual positioning)

**Project Documents → Object Connections**:

- Projects fetched per route (when project detail opens) or at build time (for archive)
- Projects link to objects via `project.categories` matching service categories
- Featured projects appear in service object panels

**Home Page Content → Canvas**:

- `homePage.hero.background` → canvas background
- `homePage.services.items` → determines which objects appear
- `homePage.introText` → ambient canvas element
- `homePage.filosofia` → ambient canvas element

### Data Fetching Strategy

**Build Time (SSG)**:

- Workspace object metadata (which objects exist, their positions)
- Canvas background configuration
- Ambient elements content

**Runtime (ISR or Client)**:

- Service panel content (fetched when panel opens)
- Project detail content (fetched when overlay opens)
- Project archive list (fetched when archive panel opens)

**Rationale**: Canvas loads fast (SSG), detailed content loads on demand (better performance, fresher data).

### Sanity Preview Mode

**Challenge**: Sanity preview mode typically requires page-level preview handling.

**Solution**:

- Preview mode works at route level (`/workspace/[objectSlug]` can be preview-enabled)
- Workspace state syncs with preview route
- Preview content renders in panel/overlay without breaking workspace
- Canvas remains visible (preview is just content, not structure)

**Implementation**: Use Next.js preview API routes, pass preview tokens to Sanity client, fetch draft content when in preview mode.

### Content Structure in Components

**Pattern**: Page components fetch data, pass to workspace components.

**Example**:

```typescript
// /app/workspace/[objectSlug]/page.tsx
export default async function ObjectPage({ params }) {
  const service = await fetchService(params.objectSlug)
  return <Panel type="service" slug={params.objectSlug}>{service}</Panel>
}
```

**Workspace components receive data as props or children, they don't fetch directly.**

---

## 6. Mobile Architecture Adaptation

### Same Architecture, Different Layout

**Key principle**: The same component hierarchy and state model work on mobile. Only layout and interaction patterns change.

### Layout Changes

**Desktop**:

- Canvas: Full viewport, objects positioned organically
- Panel: Side panel (slides from left/right), canvas visible (dimmed) behind
- Overlay: Full-screen but canvas objects still visible (very dimmed)

**Mobile**:

- Canvas: Full viewport, objects stacked vertically
- Panel: Full-screen overlay (canvas hidden), swipe to close
- Overlay: Full-screen overlay (canvas hidden), swipe to close

**Implementation**: `<Panel />` and `<Overlay />` use CSS media queries or conditional rendering based on `workspaceState.isMobile` to switch between side-panel and full-screen variants.

### Interaction Changes

**Desktop**:

- Hover: Objects respond to mouse hover
- Click: Objects expand, panels slide in
- Keyboard: ESC closes panels

**Mobile**:

- Hover: Not applicable (no hover state)
- Tap: Objects expand, full-screen panel opens
- Swipe: Swipe down/left to close panels
- Keyboard: ESC still works (if virtual keyboard allows)

**Implementation**: `<WorkspaceObject />` uses `workspaceState.touchEnabled` to disable hover effects on mobile. Touch handlers added for swipe gestures.

### State Model (Unchanged)

**Mobile uses the same state model**:

- `focusedObject`, `panelOpen`, `overlayOpen` work identically
- Only visual representation and interaction methods change
- State transitions are the same (object click → panel open)

### Component Responsibilities (Unchanged)

**All components keep the same responsibilities**:

- `<WorkspaceRoot />` still manages state
- `<Canvas />` still renders objects (just different layout)
- `<WorkspaceObject />` still handles interactions (just touch instead of hover)
- `<Panel />` still renders content (just full-screen instead of side)

**Only styling and interaction handlers adapt, not component structure.**

### Performance Considerations

**Mobile optimizations**:

- Objects load progressively (viewport-based)
- Images lazy load
- Animations use `will-change` and `transform` (GPU-accelerated)
- Panel content loads on demand (not all at once)

**Same optimizations apply to desktop, but mobile has stricter constraints.**

---

## Architecture Principles

1. **Workspace is persistent**: Never unmounts during navigation
2. **State drives UI**: Route reflects state, state drives rendering
3. **Components are focused**: Each component has a single, clear responsibility
4. **Data flows down**: Page components fetch, workspace components render
5. **Mobile is first-class**: Same architecture, different presentation
6. **Extensible**: New objects, panels, overlays can be added without refactoring
7. **Performance-conscious**: Load on demand, optimize for mobile

---

## Implementation Phases

### Phase 1: Core Structure

- Create workspace layout and routes
- Implement `<WorkspaceRoot />` and `<Canvas />`
- Set up workspace state context
- Basic route-to-state synchronization

### Phase 2: Objects

- Implement `<WorkspaceObject />`
- Create object types (film, voiceovers, etc.)
- Object positioning and basic interactions
- Hover/click handlers

### Phase 3: Panels & Overlays

- Implement `<Panel />` and `<Overlay />`
- Panel/overlay animations
- Close handlers and route updates
- Mobile adaptations

### Phase 4: Sanity Integration

- Map Sanity content to objects
- Fetch service/project data
- Render content in panels/overlays
- Preview mode support

### Phase 5: Polish

- Animations and transitions
- Performance optimization
- Mobile touch gestures
- Accessibility

---

*This architecture supports the Creative Workspace concept while remaining scalable, maintainable, and performant. The workspace metaphor is preserved in code structure, not just visual design.*
