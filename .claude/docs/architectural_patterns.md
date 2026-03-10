# Architectural Patterns

Patterns observed across multiple files in this codebase.

---

## 1. State-Driven Routing Pattern

Routes describe application state rather than serving as page identifiers. The workspace container persists; only panels/overlays mount/unmount.

**Implementation**:
- `app/workspace/layout.tsx:18-25` — Persistent layout wrapping all workspace routes
- `_workspace/hooks/useWorkspaceRoute.ts:45-85` — Route parsing → state actions
- `_workspace/WorkspaceProvider.tsx:65-95` — State shape and actions

**Route → State Mapping**:
```
/workspace           → closePanel(), setFocusedObject(null)
/workspace/[slug]    → openPanel('service', slug), setFocusedObject(slug)
/workspace/projects  → openPanel('archive')
/workspace/contact   → openPanel('contact')
```

**Key Principle**: Navigation changes state, state drives rendering. The workspace component tree remains mounted.

---

## 2. React Context State Management

Single context provides both state and actions via a custom hook. No external state libraries.

**Implementation**:
- `_workspace/WorkspaceProvider.tsx:12-35` — State interface
- `_workspace/WorkspaceProvider.tsx:45-95` — Provider with useCallback actions
- `_workspace/WorkspaceProvider.tsx:145-155` — useWorkspace hook export

**Usage Pattern** (appears in multiple components):
```typescript
const { state, actions } = useWorkspace()
// Read: state.focusedObject, state.panelOpen, state.isMobile
// Write: actions.setFocusedObject(slug), actions.openPanel(type, slug)
```

**Consumers**:
- `_workspace/WorkspaceRoot.tsx` — Orchestration
- `_workspace/Canvas.tsx` — Object state determination
- `_workspace/Panel.tsx` — Panel visibility
- `_workspace/WorkspaceObject.tsx` — Focus/hover states
- `_workspace/hooks/useWorkspaceRoute.ts` — Route sync

---

## 3. Three-Layer Data Fetching

Different fetch strategies for different data freshness requirements.

### Layer 1: Build Time (SSG)

Static data fetched during build, passed to client as props.

**Implementation**:
- `_workspace/lib/getWorkspaceObjects.ts:41-112` — Fetches all objects
- `app/workspace/layout.tsx` — Calls getWorkspaceObjects, passes to WorkspaceRoot

**Pattern**: Async Server Component → lib function → Sanity client

### Layer 2: API Routes (Runtime)

Client components fetch via internal API routes to avoid CORS and hide credentials.

**Implementation**:
- `app/api/workspace-object/[slug]/route.ts` — GET handler
- `_workspace/lib/getWorkspaceObject.ts:30-42` — Client-side fetch wrapper

**Pattern**: Client useEffect → fetch('/api/...') → API route → Sanity client

### Layer 3: Direct Sanity (Server Only)

GROQ queries executed server-side only.

**Implementation**:
- `sanity/lib/queries.ts` — Query definitions
- `sanity/lib/queries/workspaceObjects.ts:11-35` — Workspace-specific queries

---

## 4. Graceful Degradation with Fallbacks

All data fetching includes fallback behavior for resilience.

**Implementation**:
- `_workspace/lib/getWorkspaceObjects.ts:115-180` — Mock data fallback
- `_workspace/lib/getWorkspaceObject.ts:45-50` — Return null on error
- `_workspace/Canvas.tsx` — Handles empty object arrays

**Pattern**:
```typescript
try {
  const data = await sanityClient.fetch(query)
  return data
} catch (error) {
  console.error('[Component] Fetch failed:', error)
  return fallbackData // or null
}
```

**Appears in**: getWorkspaceObjects, getWorkspaceObject, API routes

---

## 5. Responsive Component Adaptation

Same components render differently based on `state.isMobile` flag.

**Implementation**:
- `_workspace/WorkspaceProvider.tsx:46-63` — Mobile detection via matchMedia
- `_workspace/Panel.tsx` — Side panel (desktop) vs full-screen (mobile)
- `_workspace/Overlay.tsx` — Consistent full-screen but different close gestures

**Detection Pattern**:
```typescript
useEffect(() => {
  const checkMobile = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    setState(prev => ({ ...prev, isMobile }))
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])
```

**CSS Complement**: `globals.css:207-222` — Media queries for object sizing

---

## 6. Deterministic Positioning with Seeded Random

Object positions appear random but are deterministic based on slug, ensuring consistency across renders.

**Implementation**:
- `_workspace/lib/calculateOptimalLayout.ts` — Seeded random generator
- `_workspace/lib/generateObjectPositions.ts` — Position generation
- `_workspace/lib/clampObjectPosition.ts` — Viewport bounds enforcement

**Pattern**:
```typescript
function seededRandom(seed: string): () => number {
  let hash = hashString(seed)
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}
// Usage: seededRandom(object.slug)() → consistent 0-1 value
```

**Benefit**: Same positions on every render without storing coordinates.

---

## 7. CSS-First Interaction Pattern

Prefer CSS for hover/focus states, reserve JavaScript for complex animations.

**Implementation**:
- `globals.css:250-300` — CSS hover states with data attributes
- `globals.css:250-286` — SVG filter color transformation on hover
- `_components/Motion.tsx` — Framer Motion only for entrance animations

**CSS Pattern** (data attribute selectors):
```css
[data-workspace-object][data-state="hovered"] {
  transform: scale(1.1);
}
[data-workspace-object][data-state="hovered"] [data-workspace-object-visual] img {
  filter: brightness(0) saturate(100%) invert(24%) /* ... */;
}
```

**JavaScript Pattern** (viewport-triggered only):
```typescript
// _components/Motion.tsx
<motion.div
  initial={{ opacity: 0, y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
/>
```

**Documented in**: `CLIENT_COMPONENT_BEST_PRACTICES.md`

---

## 8. Portable Text Rendering

Rich text from Sanity rendered via @portabletext/react with custom components.

**Implementation**:
- `_workspace/Panel.tsx` — PortableText import and usage
- Component mapping for custom block types

**Pattern**:
```typescript
import { PortableText } from '@portabletext/react'

<PortableText
  value={content.description}
  components={{
    // Custom renderers if needed
  }}
/>
```

**Styling**: `globals.css:907-985` — `.portable-text-content` class

---

## 9. Type-Safe Content Modeling

Explicit interfaces for all Sanity document shapes with strict typing.

**Implementation**:
- `_workspace/types.ts` — Core workspace types
- `_workspace/lib/getWorkspaceObject.ts:8-22` — Content response types
- `sanity/lib/queries/workspaceObjects.ts` — Query return types

**Pattern**:
```typescript
// Define expected shape
interface WorkspaceObjectData {
  id: string
  slug: string
  type: ObjectType  // Union type: 'film' | 'voiceovers' | ...
  title: string
  position?: { x: number; y: number }
  visual?: WorkspaceObjectVisual
}

// Type the query result
const objects: WorkspaceObjectData[] = await client.fetch(query)
```

---

## 10. Keyboard Event Handling at Container Level

Global keyboard shortcuts handled by root container, not individual components.

**Implementation**:
- `_workspace/WorkspaceRoot.tsx:45-60` — ESC key handler
- Prevents event bubbling issues and duplicate handlers

**Pattern**:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (state.overlayOpen) actions.closeOverlay()
      else if (state.panelOpen) actions.closePanel()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [state.overlayOpen, state.panelOpen])
```

---

## Summary Table

| Pattern | Primary Files | Purpose |
|---------|---------------|---------|
| State-Driven Routing | `useWorkspaceRoute.ts`, `WorkspaceProvider.tsx` | Routes as state descriptors |
| Context State | `WorkspaceProvider.tsx` | Centralized state management |
| Three-Layer Fetch | `getWorkspaceObjects.ts`, `route.ts` | Appropriate fetch per use case |
| Graceful Fallbacks | `getWorkspaceObjects.ts` | Resilience to failures |
| Responsive Adaptation | `WorkspaceProvider.tsx`, `Panel.tsx` | Mobile-aware rendering |
| Seeded Positioning | `calculateOptimalLayout.ts` | Deterministic "random" |
| CSS-First Interactions | `globals.css` | Performance, reduced JS |
| Portable Text | `Panel.tsx` | Rich text rendering |
| Type-Safe Content | `types.ts` | Sanity ↔ TypeScript alignment |
| Container Keyboard | `WorkspaceRoot.tsx` | Global shortcut handling |
