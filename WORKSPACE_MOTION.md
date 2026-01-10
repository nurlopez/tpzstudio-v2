# TPZ Studio: Motion & Interaction System

## Core Principle

**Motion is not decoration. Motion explains state changes, focus, and intent.**

Every animation must answer: "Why did this move?"

The Creative Workspace is a persistent, spatial environment. Motion should reinforce this metaphor: objects exist in space, they respond to attention, and they reveal content through expansion, not replacement.

---

## 1. Motion Philosophy

### Overall Feel

**Calm, intentional, slightly weighted.**

The workspace feels like a real creative environment where objects have physical presence. Motion is:

- **Purposeful**: Every movement has a reason
- **Restrained**: Not bouncy or playful for its own sake
- **Smooth**: No jarring transitions or sudden stops
- **Spatial**: Objects move through space, not just fade in/out

### Speed Ranges

**Fast**: 150-200ms

- Immediate feedback (hover states, button clicks)
- Micro-interactions that need to feel instant

**Standard**: 300-400ms

- Object focus transitions
- Panel slide-ins
- Most state changes

**Slow**: 500-700ms

- Initial workspace load
- Major state transitions (canvas → focused)
- Overlay appearances

**Never exceed 800ms** for any single transition. If something needs to feel slower, use staging (multiple shorter animations in sequence).

### Easing Philosophy

**Ease-out for entrances** (objects appearing, panels opening)

- Objects feel like they're settling into place
- Slight deceleration suggests weight and presence

**Ease-in for exits** (panels closing, objects deactivating)

- Quick departure, no lingering
- Clean removal from focus

**Ease-in-out for transforms** (object scale, focus changes)

- Smooth, natural feeling
- No harsh acceleration or deceleration

**Linear for progress/loading** (if needed)

- Predictable, not distracting

**No bounce, no elastic, no spring** unless explicitly needed for a specific interaction (which should be rare).

### When Motion is Suppressed

1. **User preference**: Respect `prefers-reduced-motion`
   - All animations become instant or very fast (50-100ms)
   - Spatial relationships remain, but transitions are immediate

2. **Performance**: On low-end devices or slow connections
   - Reduce animation complexity, not duration
   - Keep timing consistent, simplify transforms

3. **Rapid interactions**: If user is clicking/tapping rapidly
   - Skip intermediate animations
   - Go directly to final state

4. **Initial load**: First paint should be fast
   - Objects can appear with minimal animation
   - Stagger can be reduced or eliminated on slow connections

---

## 2. Workspace Transitions

### Initial Workspace Load

**Sequence**:

1. Canvas background appears immediately (no animation)
2. Objects appear with a subtle stagger (100ms delay between each)
3. Each object fades in + slight scale (from 0.95 to 1.0)
4. Total duration: ~400ms per object, but staggered so all appear within 800ms

**Why**: Objects feel like they're being placed on the workspace, not just appearing. The stagger creates a sense of discovery without being slow.

**If reduced motion**: All objects appear simultaneously, instant or 50ms fade.

### Route → State Transitions

**When route changes** (e.g., `/workspace` → `/workspace/film`):

1. **Canvas dims** (300ms ease-out)
   - Opacity goes from 1.0 to 0.3-0.5
   - Objects fade proportionally (unfocused objects fade more)

2. **Focused object scales slightly** (300ms ease-in-out)
   - From 1.0 to 1.05
   - Reinforces which object is active

3. **Panel slides in** (400ms ease-out)
   - From off-screen (right side on desktop)
   - Canvas remains visible behind it

**Why**: The workspace persists, but focus shifts. The dimming and scaling make it clear what's happening without hiding the workspace.

**If reduced motion**: All transitions happen simultaneously in 100ms.

### Returning to Canvas State

**When closing panel/overlay** (e.g., `/workspace/film` → `/workspace`):

1. **Panel slides out** (300ms ease-in)
   - Quick departure

2. **Canvas brightens** (400ms ease-out)
   - Opacity returns to 1.0
   - Objects return to full opacity

3. **Focused object returns to normal scale** (300ms ease-in-out)
   - From 1.05 to 1.0

**Why**: Quick exit, smooth return. The workspace "wakes up" as focus returns.

**If reduced motion**: Instant (50ms).

---

## 3. Object Interactions

### WorkspaceObject: Hover Behavior (Desktop)

**On mouse enter**:

- **Scale**: 1.0 → 1.1 (200ms ease-out)
- **Label appears**: Fade in from opacity 0 → 1 (150ms ease-out, starts 50ms after hover)
- **Slight lift**: Optional subtle translateY (-2px) for depth (200ms ease-out)

**On mouse leave**:

- **Scale**: 1.1 → 1.0 (200ms ease-in)
- **Label disappears**: Fade out (100ms ease-in)
- **Return to position**: TranslateY back to 0 (200ms ease-in)

**Why**: Objects respond to attention. The scale and label make it clear the object is interactive. The slight lift adds depth without being distracting.

**Never**:

- Rotate on hover
- Change color dramatically
- Animate other objects on hover (only the hovered object responds)

### WorkspaceObject: Tap Behavior (Mobile)

**On tap**:

- **Immediate scale**: 1.0 → 0.95 (100ms ease-in)
- **Release**: 0.95 → 1.0 (150ms ease-out)
- **Then**: Navigate to object route (panel opens)

**Why**: Provides tactile feedback. The quick press/release mimics physical interaction. No hover state on mobile (touch devices don't have hover).

**Never**:

- Long press animations (not needed)
- Double-tap gestures (not part of the model)

### WorkspaceObject: Focus / Activation Motion

**When object becomes focused** (via route or click):

1. **Scale**: 1.0 → 1.05 (300ms ease-in-out)
2. **Opacity**: Remains at 1.0 (no change)
3. **Other objects fade**: 1.0 → 0.4 (300ms ease-out)
4. **Label persists**: If label was visible, it remains

**Why**: Focused object is emphasized, others recede. The scale change is subtle but clear. Other objects remain visible (workspace metaphor) but clearly secondary.

**Timing**: All happen simultaneously (300ms total).

### WorkspaceObject: Deactivation Motion

**When object loses focus**:

1. **Scale**: 1.05 → 1.0 (300ms ease-in-out)
2. **Opacity**: Returns to 1.0 (300ms ease-out, if it was faded)

**Why**: Smooth return to normal state. No jarring snap back.

**Timing**: 300ms, simultaneous with canvas brightening.

---

## 4. Panel & Overlay Behavior

### Panel: How Panels Appear

**Desktop (side panel)**:

- **Slide in from right**: TranslateX from 100% to 0 (400ms ease-out)
- **Canvas dims simultaneously**: Opacity 1.0 → 0.3 (300ms ease-out)
- **Panel content fades in**: Opacity 0 → 1 (starts 200ms after panel starts, 300ms duration)

**Why**: Panel feels like it's sliding over the workspace, not replacing it. The content fade prevents jarring text appearance.

**Mobile (full-screen panel)**:

- **Slide up from bottom**: TranslateY from 100% to 0 (400ms ease-out)
- **Canvas hidden**: Opacity 1.0 → 0 (300ms ease-out, faster than desktop)
- **Panel content fades in**: Opacity 0 → 1 (starts 200ms after panel starts, 300ms duration)

**Why**: Mobile panels feel like sheets sliding up. Canvas is hidden (not dimmed) because screen space is limited.

### Panel: Spatial Relationship to Objects

**Desktop**:

- Panel slides over canvas
- Canvas objects remain visible (dimmed) behind panel
- Focused object remains at 1.05 scale behind panel
- Panel does not push objects or canvas

**Mobile**:

- Panel covers entire screen
- Canvas is hidden (opacity 0)
- Objects are not visible behind panel

**Why**: Desktop maintains workspace context. Mobile prioritizes content.

### Panel: Z-Index & Layering Logic

**Layer order (bottom to top)**:

1. Canvas background (z-index: 0)
2. Canvas objects (z-index: 10)
3. Dimmed canvas overlay (z-index: 20, if needed for click handling)
4. Panel (z-index: 1000)
5. Overlay (z-index: 2000)

**Why**: Clear stacking. Panel is above canvas, overlay is above panel. No z-index conflicts.

### Panel: Dismiss Rules

**Desktop**:

- **Click outside panel** (on dimmed canvas): Panel closes (300ms slide out)
- **Close button**: Panel closes (300ms slide out)
- **ESC key**: Panel closes (300ms slide out)
- **Route change**: Panel closes (300ms slide out)

**Mobile**:

- **Swipe down**: Panel closes (400ms slide down)
- **Close button**: Panel closes (400ms slide down)
- **ESC key**: Panel closes (400ms slide down)
- **Route change**: Panel closes (400ms slide down)

**Why**: Multiple ways to dismiss, all consistent. Swipe on mobile feels natural.

**Never**:

- Auto-dismiss after time
- Dismiss on scroll (panels can scroll internally)

### Overlay: How Overlays Appear

**Desktop & Mobile** (same behavior):

- **Fade in**: Opacity 0 → 1 (400ms ease-out)
- **Slight scale**: 0.98 → 1.0 (400ms ease-out, very subtle)
- **Canvas dims**: Opacity 1.0 → 0.1 (400ms ease-out, darker than panel)

**Why**: Overlay feels like it's appearing over everything. The slight scale prevents a flat fade. Canvas is very dim (almost black) to focus attention.

### Overlay: Dismiss Rules

**Desktop & Mobile**:

- **Close button**: Overlay closes (300ms fade out)
- **ESC key**: Overlay closes (300ms fade out)
- **Click outside overlay** (on dimmed canvas): Overlay closes (300ms fade out)
- **Route change**: Overlay closes (300ms fade out)

**Why**: Consistent with panel dismiss, but overlay uses fade (not slide) because it's full-screen.

**Never**:

- Swipe to dismiss overlay (overlays contain important content, shouldn't be accidentally dismissed)

---

## 5. Mobile Interaction Model

### Gesture Mapping

**Tap**:

- **Single tap on object**: Activates object (opens panel)
- **Single tap on panel content**: Normal interaction (links, buttons)
- **No double-tap**: Not used

**Swipe**:

- **Swipe down on panel**: Dismisses panel
- **Swipe left/right**: Not used (reserved for future navigation if needed)
- **Swipe on overlay**: Not used (overlays don't swipe to dismiss)

**Long press**: Not used (not part of the model)

**Pinch**: Not used (canvas doesn't zoom)

**Why**: Simple, predictable gestures. Swipe down feels natural for dismissing panels.

### How Focus Replaces Hover

**Desktop**: Hover provides preview (scale, label)
**Mobile**: No hover, so:

- **Tap provides immediate feedback**: Quick scale down/up (100ms press, 150ms release)
- **Label appears on focus**: When object is tapped and panel opens, label is visible in panel header
- **No hover preview**: Objects don't respond to touch until tapped

**Why**: Mobile doesn't have hover, so feedback comes from tap. The press/release animation provides immediate tactile response.

### How Panels Behave on Small Screens

**Layout**:

- **Full-screen**: Panel covers entire viewport
- **No side-by-side**: Canvas is hidden when panel is open
- **Vertical scroll**: Panel content scrolls vertically if needed

**Interactions**:

- **Swipe down to dismiss**: Natural gesture
- **Close button always visible**: Top-left or top-right, always accessible
- **No drag to dismiss**: Panel slides up/down, but not draggable (keeps it simple)

**Transitions**:

- **Slide up from bottom**: 400ms ease-out
- **Slide down to dismiss**: 400ms ease-in
- **Canvas fades out/in**: 300ms simultaneous with panel

**Why**: Mobile prioritizes content. Full-screen panels maximize space. Swipe down is intuitive.

**Breakpoint**: Mobile behavior applies below 768px width.

---

## 6. Motion Constraints

### What Must Never Animate

1. **Canvas background**: Static (image/video plays, but background container doesn't animate)
2. **Dock/logo**: Static position, no animations (always visible, not distracting)
3. **Text content**: Text doesn't animate in/out (only containers animate)
4. **Images in content**: Images load normally, no special animations
5. **Scroll position**: Panels/overlays don't auto-scroll
6. **Object positions**: Objects don't move around canvas (positions are fixed)
7. **Z-index changes**: No animated z-index (only static z-index values)

**Why**: These elements should be stable. Animation should only affect interactive elements and state changes.

### What Animates Only Once

1. **Initial workspace load**: Objects appear once on first load
2. **Canvas ready state**: Canvas marks itself as ready once (no animation, just state)
3. **Object mount**: Objects don't re-animate when workspace state changes (they're already mounted)

**Why**: Initial load can have a nice entrance, but subsequent state changes shouldn't re-trigger entrance animations.

### Accessibility Considerations

**Reduced Motion** (`prefers-reduced-motion: reduce`):

1. **All animations become instant or very fast** (50-100ms)
2. **Staggers are removed**: Objects appear simultaneously
3. **Transforms are simplified**: Scale/translate still happen, but faster
4. **Spatial relationships remain**: Objects still have positions, but transitions are immediate

**Implementation**:

- Use CSS `@media (prefers-reduced-motion: reduce)` or JavaScript detection
- Apply instant transitions or very short durations
- Keep functionality identical, just faster

**Why**: Some users are sensitive to motion. Respect their preferences while maintaining functionality.

**Keyboard Navigation**:

- **Tab through objects**: Focus ring appears (browser default, no custom animation)
- **Enter/Space on object**: Activates object (same as click)
- **ESC closes panels/overlays**: Works as defined above

**Why**: Keyboard users need clear focus indicators. Browser defaults are sufficient.

**Screen Readers**:

- **No animation affects screen reader announcements**
- **State changes are announced**: When panel opens, screen reader announces content
- **Focus management**: Focus moves to panel/overlay when they open

**Why**: Screen readers don't need animations, they need clear state announcements.

---

## Implementation Guidance

### Animation Library (Future)

**Assumed**: Framer Motion may be used later.

**Patterns to support**:

- Stagger animations (object entrance)
- Layout animations (if objects need to reflow)
- Gesture detection (swipe on mobile)
- Reduced motion detection

**But**: This document defines behavior, not implementation. Any animation library that can achieve these timings and easings is acceptable.

### Performance Considerations

**GPU-accelerated properties**:

- `transform` (scale, translate)
- `opacity`

**Avoid animating**:

- `width`, `height`, `top`, `left` (use transform instead)
- `background-color` (if possible, use opacity overlay)

**Why**: GPU-accelerated properties are smoother and more performant.

### Timing Consistency

**Use consistent durations**:

- Fast: 150-200ms
- Standard: 300-400ms
- Slow: 500-700ms

**Don't mix**: If one panel uses 300ms, all panels should use 300ms (unless there's a specific reason).

**Why**: Consistency creates a cohesive feel. Users learn the timing and it feels predictable.

---

## Motion Checklist

Before implementing any animation, ask:

1. **Why is this moving?** (State change, user action, focus shift?)
2. **Does it reinforce the workspace metaphor?** (Objects in space, persistent canvas?)
3. **Is it consistent with other animations?** (Same timing, easing, feel?)
4. **Does it respect reduced motion?** (Will it work for users who prefer less motion?)
5. **Is it performant?** (GPU-accelerated, not blocking main thread?)

If the answer to any of these is "no" or "unsure", simplify or remove the animation.

---

## Summary

**Motion in the Creative Workspace**:

- Explains state changes
- Reinforces spatial relationships
- Provides feedback without distraction
- Respects user preferences
- Feels calm and intentional

**Motion is not**:

- Decoration
- Entertainment
- A way to show off
- Random or arbitrary

Every animation serves the workspace metaphor and improves understanding, not just aesthetics.

---

*This document defines the motion language. Implementation details (CSS, Framer Motion, etc.) will follow in subsequent phases.*
