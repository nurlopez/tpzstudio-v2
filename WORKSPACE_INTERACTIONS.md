# TPZ Studio: Micro-Interaction System

## Core Principle

**Motion reinforces orientation, not impression.**

Interactions explain where you are, what's happening, and what you can do. If an interaction draws attention to itself, the system has failed.

The workspace is bounded. Panels provide depth. Interactions must maintain spatial understanding without creating confusion or fatigue.

---

## 1. Interaction Principles

### Restraint

**What it means**: Only animate what needs to move. Everything else stays still.

**Rules**:

- Animate state changes, not decoration
- Animate user-initiated actions, not automatic behaviors
- Animate focus shifts, not ambient elements
- One thing moves at a time (unless simultaneous movement serves orientation)

**What this prevents**:

- Objects animating when they don't need to
- Background elements moving
- Text animating for no reason
- Multiple unrelated things moving simultaneously

**Test**: If you remove an animation, does the user lose understanding? If no, the animation is decoration and should be removed.

### Purpose

**What it means**: Every interaction answers a question.

**Questions interactions answer**:

- "What is interactive?" → Hover/tap feedback
- "What is focused?" → Scale, opacity changes
- "What is happening?" → Panel opening, canvas dimming
- "Where am I?" → Spatial relationships maintained
- "What can I do?" → Clear interactive elements

**Rules**:

- If an interaction doesn't answer a question, remove it
- If an interaction answers the wrong question, fix it
- If an interaction creates a new question, simplify it

**Test**: Can you explain why something moved in one sentence? If no, the interaction lacks purpose.

### Orientation

**What it means**: Users always know where they are in the workspace.

**Rules**:

- Canvas remains visible (dimmed, not hidden) when panels open
- Objects maintain their positions (they don't move, only fade/scale)
- Panels expand from workspace, don't replace it
- Overlays appear above, don't remove context
- Return paths are always clear (close button, ESC, click outside)

**What this prevents**:

- Users feeling lost or disoriented
- Spatial relationships breaking
- Context disappearing
- Dead ends or unclear navigation

**Test**: Can a user explain where they are after any interaction? If no, orientation is broken.

### Predictability

**What it means**: Same action always produces same result.

**Rules**:

- Hover always behaves the same way (desktop)
- Tap always behaves the same way (mobile)
- Panel open/close always behaves the same way
- Focus changes always behave the same way
- Timing is consistent (same durations for same actions)

**What this prevents**:

- Users learning new behaviors for each object
- Inconsistent timing creating confusion
- Different interactions for similar actions
- Surprises that break mental models

**Test**: If a user has to learn new behavior, the system has failed. All interactions should feel familiar.

---

## 2. Object Interactions

### Hover (Desktop Only)

**When**: Mouse cursor enters object bounds.

**What moves**:

- Object scales up (subtle, 5-10% increase)
- Object label appears (fade in)
- Optional: Slight vertical lift (2-4px) for depth

**What does NOT move**:

- Other objects (only hovered object responds)
- Canvas background
- Object positions (objects stay in place)
- Panel (if open, panel doesn't respond to object hover)

**Timing**: Fast (150-200ms). Immediate feedback, no delay.

**Purpose**: Answers "What is interactive?" and "What is this object?"

**Rules**:

- Only one object can be hovered at a time
- Hover state clears immediately on mouse leave
- Hover does not trigger navigation (click does)
- Hover is disabled on touch devices (no hover on mobile)

**Accessibility**: Keyboard focus provides same visual feedback as hover (scale, label).

### Focus / Tap (Mobile)

**When**: User taps object (mobile) or object becomes focused (desktop via keyboard/route).

**What moves**:

- Object scales down briefly (press feedback: 95% scale)
- Object returns to normal (release: 100% scale)
- Then: Panel opens (if tap) or object becomes focused (if keyboard/route)

**What does NOT move**:

- Other objects (until focus state changes)
- Canvas background
- Object positions

**Timing**: Very fast for press/release (100ms press, 150ms release). Then standard timing for panel open.

**Purpose**: Answers "Did my action register?" and "What is now focused?"

**Rules**:

- Tap provides immediate tactile feedback (scale down)
- Focus state persists until another object is focused or panel closes
- Focused object scales slightly (3-5% increase) to show it's active
- Other objects fade (40-60% opacity) but remain visible

**Accessibility**: Keyboard navigation (Tab) moves focus between objects. Enter/Space activates focused object.

### Active / Selected State

**When**: Object is currently focused (panel open for that object).

**What moves**:

- Focused object scales up slightly (3-5% increase)
- Other objects fade (40-60% opacity)
- Canvas dims (30-50% opacity)
- Panel opens (slides in)

**What does NOT move**:

- Object positions (objects stay in place)
- Canvas background (static, only opacity changes)
- Other panels (only one panel open at a time)

**Timing**: Standard (300-400ms). Smooth transition, not jarring.

**Purpose**: Answers "What is currently active?" and "What content is open?"

**Rules**:

- Only one object can be active at a time
- Active state persists until panel closes or another object is activated
- Active object remains visible and slightly elevated
- Other objects remain visible (dimmed) to maintain workspace context

**Accessibility**: Screen reader announces which object is active. Focus moves to panel when it opens.

---

## 3. Panel Interactions

### Open Behavior

**When**: User clicks/taps object, or route changes to object slug.

**What moves**:

- Panel slides in from side (desktop) or bottom (mobile)
- Canvas dims (opacity reduces to 30-50%)
- Focused object scales up (3-5% increase)
- Other objects fade (40-60% opacity)
- Panel content fades in (starts after panel begins sliding)

**What does NOT move**:

- Canvas background (static, only opacity changes)
- Object positions (objects stay in place)
- Other panels (only one panel open at a time)
- Panel content during slide (content fades in after panel arrives)

**Timing**: Standard (300-400ms). Smooth, not rushed or slow.

**Purpose**: Answers "What content is now available?" and "What object is this about?"

**Rules**:

- Panel always opens the same way (same direction, same timing)
- Canvas remains visible (dimmed, not hidden) on desktop
- Panel content appears after panel container (prevents text appearing mid-slide)
- Panel does not push or move objects (objects stay in place)

**Focus handoff**: Focus moves from object to panel when panel opens. First interactive element in panel receives focus (or panel container if no interactive elements).

### Close Behavior

**When**: User clicks close button, clicks outside panel, presses ESC, or route changes away.

**What moves**:

- Panel slides out (opposite direction of open)
- Canvas brightens (opacity returns to 100%)
- Focused object returns to normal scale (100%)
- Other objects return to full opacity (100%)
- Panel content fades out (before or during panel slide)

**What does NOT move**:

- Canvas background (static, only opacity changes)
- Object positions (objects stay in place)
- Other panels (only one panel can close at a time)

**Timing**: Standard (300-400ms). Quick but not jarring.

**Purpose**: Answers "Where am I returning to?" and "What is the workspace state?"

**Rules**:

- Panel always closes the same way (same direction, same timing)
- Canvas brightens simultaneously with panel closing
- Objects return to normal state simultaneously
- Close is reversible (user can reopen panel)

**Focus handoff**: Focus returns to previously focused object (if still visible) or first object in tab order when panel closes.

### Scroll Behavior

**When**: Panel content exceeds panel height.

**What moves**:

- Panel content scrolls (standard browser scroll)
- Panel container does not move (panel stays in place)
- Canvas does not move (canvas is static)

**What does NOT move**:

- Panel container (panel doesn't scroll, only content)
- Canvas background
- Objects (objects stay in place)
- Panel position (panel doesn't shift or move)

**Timing**: Native scroll (no animation, standard browser behavior).

**Purpose**: Answers "How do I see more content?" and "What content is available?"

**Rules**:

- Panel content scrolls independently of canvas
- Canvas does not scroll when panel is open (canvas is static)
- Scroll position persists if panel closes and reopens (optional, can reset)
- Scroll is smooth (native smooth scroll, not animated)

**Accessibility**: Keyboard navigation (Arrow keys, Page Up/Down) scrolls panel content. Focus remains within panel during scroll.

### Focus Handoff from Object → Panel

**When**: Panel opens after object click/tap.

**Sequence**:
1. User clicks/taps object
2. Object provides immediate feedback (scale down/up)
3. Panel begins opening (slide in)
4. Focus moves to panel (first interactive element or panel container)
5. Panel content loads and becomes interactive

**What moves**:

- Focus (from object to panel)
- Panel (slides in)
- Canvas (dims)

**What does NOT move**:

- Object positions
- Canvas background
- Focus during panel animation (focus moves after panel is open)

**Timing**: Focus moves after panel is fully open (400ms delay from panel start). Prevents focus jumping during animation.

**Purpose**: Answers "Where is my focus now?" and "What can I interact with?"

**Rules**:

- Focus moves automatically when panel opens
- Focus goes to first interactive element (link, button) or panel container
- Focus is visible (browser default focus ring, or custom focus indicator)
- Keyboard navigation works immediately in panel

**Accessibility**: Screen reader announces panel content when focus moves. Focus is clearly visible.

---

## 4. Overlay Interactions

### Entry Rules

**When**: User clicks link to project detail, or route changes to project slug.

**What moves**:

- Overlay fades in (opacity 0 → 100%)
- Canvas dims heavily (opacity reduces to 10-20%, almost black)
- Panel (if open) dims further (opacity reduces to 20-30%)
- Overlay content fades in (starts after overlay container)

**What does NOT move**:

- Canvas background (static, only opacity changes)
- Object positions (objects stay in place)
- Panel position (panel stays in place, just dims)
- Overlay position (overlay is centered, doesn't slide)

**Timing**: Standard (300-400ms). Smooth fade, not dramatic.

**Purpose**: Answers "What deep content is available?" and "What is the focus now?"

**Rules**:

- Overlay always opens the same way (fade in, same timing)
- Canvas is very dim (almost black) to focus attention on overlay
- Panel (if open) remains visible but dimmed (maintains context)
- Overlay content appears after overlay container (prevents text appearing mid-fade)

**Focus handoff**: Focus moves to overlay when it opens. First interactive element in overlay receives focus (or overlay container).

### Relationship to Panel

**When**: Overlay opens from panel (e.g., project link clicked in panel).

**What moves**:

- Overlay fades in
- Panel dims (but remains visible)
- Canvas dims heavily

**What does NOT move**:

- Panel position (panel stays in place)
- Panel content (panel doesn't scroll or move)
- Canvas background
- Object positions

**Timing**: Same as overlay entry (300-400ms).

**Purpose**: Answers "How does this relate to the panel?" and "Can I return to the panel?"

**Rules**:

- Panel remains visible (dimmed) when overlay opens from panel
- Panel provides context (user knows overlay came from panel)
- Closing overlay returns to panel (not canvas)
- Panel scroll position is preserved (if user was scrolling panel)

**Focus handoff**: Focus moves from panel link to overlay. Closing overlay returns focus to panel (or previously focused element).

### Return Path Clarity

**When**: User wants to close overlay.

**What moves**:

- Overlay fades out
- Canvas brightens (if returning to canvas)
- Panel brightens (if returning to panel)
- Focus returns to previous context

**What does NOT move**:

- Canvas background
- Object positions
- Panel position (if returning to panel)

**Timing**: Standard (300-400ms). Quick but not jarring.

**Purpose**: Answers "How do I go back?" and "Where will I return to?"

**Rules**:

- Close button is always visible (top-right corner)
- ESC key closes overlay
- Click outside overlay closes overlay (on dimmed canvas/panel)
- Return path is clear (returns to panel if opened from panel, canvas if opened from canvas)

**Focus handoff**: Focus returns to previously focused element (panel link, object, or first object in tab order).

**Accessibility**: Screen reader announces return context. Focus is clearly visible on return.

---

## 5. What Must NOT Animate

### Background Elements

**What**: Canvas background, workspace surface, ambient elements.

**Rule**: Background elements are static. Only opacity changes (dimming), no movement.

**Why**: Background provides stable foundation. Movement distracts from content.

**Exceptions**: None. Background never moves.

**Examples**:

- Canvas background image/video: Static (video plays, but container doesn't move)
- Workspace surface: Static
- Ambient elements (intro text, philosophy card): Static (unless user interacts with them)

### Layout Shifts

**What**: Object positions, panel positions, canvas layout.

**Rule**: Layout is fixed. Objects don't move to new positions. Panels don't shift. Canvas doesn't reflow.

**Why**: Layout shifts break spatial understanding. Users build mental maps of object positions.

**Exceptions**: None. Layout never shifts.

**Examples**:

- Objects don't rearrange when panel opens
- Objects don't move to accommodate panel
- Canvas doesn't resize or shift
- Panel doesn't push content or objects

### Content Reflow

**What**: Text wrapping, image sizing, content containers.

**Rule**: Content doesn't reflow during interactions. Content is stable during state changes.

**Why**: Content reflow is distracting and breaks reading flow. Content should be stable.

**Exceptions**: Content can reflow on initial load or resize, but not during interactions.

**Examples**:

- Text doesn't rewrap when panel opens
- Images don't resize during interactions
- Content containers don't change size during state changes
- Panel content doesn't shift when scrolling

### Decorative Motion

**What**: Animations that don't serve orientation or feedback.

**Rule**: No decorative animations. Every animation must answer a question.

**Why**: Decorative motion distracts from content and creates fatigue.

**Exceptions**: None. No decorative motion.

**Examples**:

- Objects don't "breathe" or pulse when idle
- Background doesn't have particle effects
- Text doesn't animate in for decoration
- Icons don't rotate or bounce
- No loading animations that don't indicate progress

### Automatic Behaviors

**What**: Animations that happen without user action.

**Rule**: Animations only happen in response to user actions or state changes. No automatic animations.

**Why**: Automatic animations are distracting and can cause motion sensitivity issues.

**Exceptions**: Initial load (objects appear once on first load) and state changes (route changes, data updates).

**Examples**:

- Objects don't animate when user isn't interacting
- Panels don't auto-open or auto-close
- Content doesn't auto-scroll
- No carousels or auto-advancing content
- No hover effects that trigger automatically

---

## 6. Accessibility Rules

### Reduced Motion

**When**: User has `prefers-reduced-motion: reduce` set.

**Rule**: All animations become instant or very fast (50-100ms). Spatial relationships remain, but transitions are immediate.

**What changes**:

- Object hover: Instant scale (50ms)
- Panel open/close: Instant (50ms)
- Overlay open/close: Instant (50ms)
- Focus changes: Instant (50ms)
- Staggers removed: Objects appear simultaneously

**What stays the same**:

- Spatial relationships (objects still have positions)
- Focus states (still visible, just instant)
- Interactive elements (still functional)
- Content structure (no changes to content)

**Implementation**: Use CSS `@media (prefers-reduced-motion: reduce)` or JavaScript detection. Apply instant transitions or very short durations.

**Why**: Some users are sensitive to motion. Respect preferences while maintaining functionality.

### Keyboard Navigation

**When**: User navigates with keyboard (Tab, Arrow keys, Enter, Space, ESC).

**Rule**: All interactions work with keyboard. Focus is always visible and clear.

**Object navigation**:

- Tab: Moves focus between objects
- Shift+Tab: Moves focus backward
- Enter/Space: Activates focused object (opens panel)
- Arrow keys: Can navigate between objects (optional, if implemented)

**Panel navigation**:

- Tab: Moves focus within panel (links, buttons, form fields)
- Shift+Tab: Moves focus backward
- ESC: Closes panel
- Arrow keys: Scrolls panel content (if focus is in scrollable area)

**Overlay navigation**:

- Tab: Moves focus within overlay
- Shift+Tab: Moves focus backward
- ESC: Closes overlay
- Arrow keys: Scrolls overlay content (if focus is in scrollable area)

**Focus indicators**:

- Browser default focus ring (visible, high contrast)
- Or custom focus indicator (if styled, must be clearly visible)
- Focus is never hidden or removed

**Why**: Keyboard users need clear focus indicators and predictable navigation. All interactions must work without mouse.

### Focus Management

**When**: State changes (panel opens, overlay opens, panel closes).

**Rule**: Focus moves appropriately with state changes. Focus is never lost or trapped.

**Panel open**:

- Focus moves from object to panel
- Focus goes to first interactive element (link, button) or panel container
- Focus is visible immediately (after panel animation completes)

**Panel close**:

- Focus returns to previously focused object (if still visible)
- Or focus goes to first object in tab order
- Focus is visible immediately

**Overlay open**:

- Focus moves from trigger (link, button) to overlay
- Focus goes to first interactive element or overlay container
- Focus is visible immediately (after overlay animation completes)

**Overlay close**:

- Focus returns to trigger element (if still visible)
- Or focus goes to previously focused element
- Focus is visible immediately

**Focus trapping** (if needed):

- Focus stays within panel/overlay when open
- Tab cycles within panel/overlay, doesn't escape
- ESC closes panel/overlay and releases focus trap

**Why**: Screen reader users and keyboard users rely on focus management. Focus must always be clear and predictable.

### Screen Reader Support

**When**: User uses screen reader.

**Rule**: All state changes are announced. Interactive elements are properly labeled.

**Object interactions**:

- Objects have accessible names (object title/label)
- Object state changes are announced (focused, muted)
- Object activation is announced (panel opens)

**Panel interactions**:

- Panel open is announced (panel title, content summary)
- Panel content is properly structured (headings, landmarks)
- Panel close is announced

**Overlay interactions**:

- Overlay open is announced (overlay title, content summary)
- Overlay content is properly structured
- Overlay close is announced

**Implementation**:

- Use semantic HTML (buttons, links, headings)
- Use ARIA labels where needed (aria-label, aria-labelledby)
- Use ARIA live regions for dynamic content (if needed)
- Use proper heading hierarchy
- Use landmarks (main, navigation, complementary)

**Why**: Screen reader users need clear announcements and proper structure. All content must be accessible.

---

## 7. Interaction Timing

### Speed Categories

**Instant** (0-50ms):

- Immediate feedback (button press, tap feedback)
- Reduced motion mode (all animations become instant)

**Fast** (150-200ms):

- Hover feedback (object scale, label appear)
- Tap feedback (press/release)
- Micro-interactions (immediate response needed)

**Standard** (300-400ms):

- Panel open/close
- Overlay open/close
- Focus changes
- Canvas dimming/brightening
- Most state transitions

**Slow** (500-700ms):

- Initial workspace load (object stagger)
- Major state transitions (if needed)
- Complex animations (if any)

**Never exceed 800ms** for any single transition. If something needs to feel slower, use staging (multiple shorter animations in sequence).

### Consistency Rules

**Same action, same timing**:

- All panel opens: 300-400ms
- All panel closes: 300-400ms
- All overlay opens: 300-400ms
- All overlay closes: 300-400ms
- All hover feedback: 150-200ms
- All tap feedback: 100ms press, 150ms release

**Why**: Consistency creates predictability. Users learn timing and it feels natural.

**Exceptions**: None. Timing must be consistent across all interactions of the same type.

### Staging (Multiple Animations)

**When**: Multiple things need to move simultaneously or in sequence.

**Rule**: Stage animations clearly. Don't animate everything at once unless it serves orientation.

**Panel open staging**:
1. Canvas dims (300ms, starts immediately)
2. Panel slides in (400ms, starts immediately)
3. Panel content fades in (300ms, starts 200ms after panel begins)

**Why**: Staging prevents visual chaos. Each animation has a clear purpose and timing.

**Rules**:

- Simultaneous animations: Only if they serve the same purpose (canvas dims + panel opens)
- Sequential animations: Clear sequence with delays (content fades after container)
- No overlapping unrelated animations: Don't animate multiple unrelated things at once

---

## 8. Failure Modes (What Breaks the System)

### If Interactions Draw Attention to Themselves

**Symptoms**:

- User notices the animation more than the content
- User comments on how "cool" an animation is
- Animation feels like a feature, not a utility
- User is distracted by motion

**Causes**:

- Animation is too dramatic (too much movement, too long)
- Animation is decorative (doesn't serve purpose)
- Animation is inconsistent (different timing, different behavior)
- Animation is unnecessary (doesn't answer a question)

**Fix**:

- Reduce animation intensity (less movement, shorter duration)
- Remove decorative animations
- Make animations consistent
- Remove unnecessary animations

**Test**: If you can't explain why something moved in one sentence, remove it.

### If Interactions Create Confusion

**Symptoms**:

- User doesn't understand what happened
- User doesn't know where they are
- User doesn't know what to do next
- User feels lost or disoriented

**Causes**:

- Animation doesn't maintain spatial relationships
- Focus is lost or unclear
- Return path is unclear
- Animation breaks mental model

**Fix**:

- Maintain spatial relationships (objects stay in place)
- Ensure focus is always clear
- Provide clear return paths
- Make animations reinforce mental model, not break it

**Test**: Can a user explain where they are after any interaction? If no, fix orientation.

### If Interactions Create Fatigue

**Symptoms**:

- User feels overwhelmed by motion
- User wants to disable animations
- User avoids interacting (too much movement)
- User experiences motion sickness

**Causes**:

- Too many things moving at once
- Animations are too long or too frequent
- No respect for reduced motion preference
- Decorative animations that don't stop

**Fix**:

- Reduce number of simultaneous animations
- Shorten animation durations
- Respect reduced motion preference
- Remove decorative animations

**Test**: Does the workspace feel calm? If no, reduce motion.

### If Interactions Feel Inconsistent

**Symptoms**:

- User has to learn new behavior for each interaction
- Same action produces different results
- Timing feels random
- Behavior changes between objects or panels

**Causes**:

- Different timing for same actions
- Different behavior for similar interactions
- Inconsistent focus management
- Inconsistent return paths

**Fix**:

- Standardize timing (same duration for same actions)
- Standardize behavior (same interaction, same result)
- Standardize focus management
- Standardize return paths

**Test**: If a user has to learn new behavior, the system has failed. All interactions should feel familiar.

---

## 9. Success Criteria

### A Successful Interaction System

**Users should**:

- Understand what is interactive (hover/tap feedback)
- Know what is focused (clear focus indicators)
- Understand what is happening (state changes are clear)
- Know where they are (spatial relationships maintained)
- Know what they can do (clear interactive elements)
- Feel calm and in control (no fatigue, no confusion)

**Interactions should**:

- Answer questions (purpose)
- Maintain orientation (spatial understanding)
- Feel predictable (consistent behavior)
- Respect preferences (reduced motion, keyboard navigation)
- Work for everyone (accessibility)

**The system should**:

- Be consistent (same action, same result)
- Be restrained (only animate what needs to move)
- Be purposeful (every animation answers a question)
- Be accessible (keyboard, screen reader, reduced motion)
- Feel calm (no fatigue, no distraction)

### Test Questions

**Ask yourself**:
1. Why did this move? (If you can't answer, remove it)
2. Does this maintain orientation? (If no, fix it)
3. Is this consistent? (If no, standardize it)
4. Does this respect preferences? (If no, add support)
5. Does this work for everyone? (If no, fix accessibility)
6. Does this feel calm? (If no, reduce motion)

**If all answers are correct, the interaction system is working.**

---

## Summary

**Interaction Principles**:
1. **Restraint**: Only animate what needs to move
2. **Purpose**: Every interaction answers a question
3. **Orientation**: Users always know where they are
4. **Predictability**: Same action, same result

**What Moves**:

- Objects (hover, focus, tap feedback)
- Panels (open, close, scroll)
- Overlays (open, close)
- Focus (moves with state changes)
- Canvas opacity (dimming, brightening)

**What Does NOT Move**:

- Background elements (static)
- Layout (no shifts)
- Content reflow (stable during interactions)
- Decorative motion (none)
- Automatic behaviors (none)

**Timing**:

- Instant: 0-50ms (immediate feedback, reduced motion)
- Fast: 150-200ms (hover, tap)
- Standard: 300-400ms (panels, overlays, focus)
- Slow: 500-700ms (initial load, major transitions)

**Accessibility**:

- Reduced motion: All animations become instant (50-100ms)
- Keyboard navigation: All interactions work with keyboard
- Focus management: Focus moves appropriately with state changes
- Screen reader support: All state changes are announced

**Success Metric**:

- If interactions draw attention to themselves → system has failed
- If interactions reinforce orientation → system is working

---

*This system defines behavioral rules, not visual design or animation implementation. Visual implementation follows the visual system document. Animation implementation follows the motion document. This document defines what moves, when, how much, and when nothing moves.*