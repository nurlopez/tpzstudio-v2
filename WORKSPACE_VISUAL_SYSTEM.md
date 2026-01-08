# TPZ Studio: Visual Language & Design Tokens

## Core Principle

**The visual language should feel like: "This is where ideas are made."**

Not a gallery. Not a landing page. A workspace.

The visual system supports the Creative Workspace metaphor: objects exist in space, they respond to attention, and the environment feels productive, not performative.

---

## 1. Visual Philosophy

### Overall Tone

**Calm, intelligent, exploratory.**

The workspace should feel:

- **Productive**: Like a real creative environment where work happens
- **Focused**: Visual hierarchy guides attention without shouting
- **Spacious**: Room to think, not cluttered or cramped
- **Confident**: Restrained, not flashy or attention-seeking

### Emotional Goals

**What users should feel**:

- **Clarity**: "I understand what I can do here"
- **Curiosity**: "I want to explore these objects"
- **Focus**: "I can concentrate on what I'm looking at"
- **Calm**: "This doesn't feel rushed or overwhelming"

**What users should NOT feel**:

- Overwhelmed by choices
- Distracted by decoration
- Uncertain about what's interactive
- Pressured to engage

### What the Interface Should Not Feel Like

**Avoid**:

- **Gallery aesthetic**: Not a showcase, it's a workspace
- **Marketing page**: Not selling, it's showing capabilities
- **Portfolio grid**: Not a collection, it's an environment
- **Dashboard**: Not data-driven, it's capability-driven
- **App interface**: Not tool-focused, it's space-focused

**Instead**:

- **Studio floor**: Where work happens
- **Creative desk**: Tools arranged for use
- **Whiteboard**: Space for ideas
- **Workshop**: Functional, not decorative

---

## 2. Color System (Token-Level)

### Base Background Color Philosophy

**Primary mode: Dark workspace**

The canvas background should feel like:

- **A surface**: Not void, but a plane where objects sit
- **Neutral**: Doesn't compete with objects or content
- **Deep but not black**: Enough contrast for objects, not harsh
- **Subtle texture possible**: Paper, fabric, or matte surface feel

**Semantic tokens**:

- `--bg-canvas`: Primary workspace surface
- `--bg-canvas-dimmed`: Canvas when panel/overlay is open (reduced opacity)
- `--bg-surface`: Panel/overlay backgrounds
- `--bg-elevated`: Objects or elevated elements

### Accent Usage Rules

**Accents are functional, not decorative**:

- **Active states**: Which object is focused
- **Interactive feedback**: Hover, tap states
- **Status indicators**: If needed (loading, etc.)
- **Never**: Decorative highlights, random color pops, brand color everywhere

**Semantic tokens**:

- `--accent-active`: Focused object, active state
- `--accent-interactive`: Hover/tap feedback
- `--accent-muted`: Secondary interactive elements
- `--accent-critical`: Errors or warnings (if needed)

**Usage rule**: Accents should be subtle. If an accent color draws more attention than the content, it's too strong.

### States (Focus, Active, Muted)

**Focus state**:

- `--state-focused`: Object that has focus
- Clear but not dramatic
- Slightly elevated (scale, opacity, or subtle glow)
- Other objects fade but remain visible

**Active state**:

- `--state-active`: Currently interacting (hover, tap)
- Immediate feedback
- Doesn't persist after interaction

**Muted state**:

- `--state-muted`: Unfocused objects when another is focused
- Reduced opacity (0.4-0.6)
- Still visible, clearly secondary
- Not hidden or removed

**Disabled state** (if needed):

- `--state-disabled`: Non-interactive elements
- Very low opacity (0.2-0.3)
- Clear that interaction is not available

### Ink (Text) Colors

**Semantic tokens**:

- `--ink-primary`: Main content text (panel content, descriptions)
- `--ink-secondary`: Supporting text (labels, meta information)
- `--ink-muted`: Tertiary text (hints, captions)
- `--ink-inverse`: Text on dark backgrounds (if needed)
- `--ink-interactive`: Links, clickable text

**Hierarchy**:

- Primary: High contrast, readable
- Secondary: Medium contrast, still readable
- Muted: Lower contrast, clearly secondary
- Interactive: Distinct from primary, but not distracting

**Rule**: Text should always be readable. Never sacrifice readability for style.

### Border & Divider System

**Semantic tokens**:

- `--border-subtle`: Very light borders (object edges, subtle separation)
- `--border-visible`: Clear borders (panel edges, containers)
- `--border-strong`: Emphasis borders (focus states, if needed)
- `--divider`: Separators between content sections

**Philosophy**: Borders should separate, not decorate. Use sparingly. Most separation comes from spacing, not lines.

---

## 3. Typography System

### Typographic Roles (Not Font Names Yet)

**Workspace Labels**:

- Object titles on hover
- Small, clear, unobtrusive
- Short text only (1-3 words)
- Should not compete with objects

**Object Titles**:

- Names of capabilities/services
- Medium weight, readable
- Can appear in panels or as labels
- Clear hierarchy

**Panel Content**:

- Main body text in panels
- Comfortable reading size
- Good line height for readability
- Supports longer-form content

**Meta / UI Text**:

- Button labels, navigation hints
- Small but readable
- Functional, not decorative
- Clear and direct

**Headings** (in panels/overlays):

- Section titles within content
- Clear hierarchy (H1, H2, H3)
- Supports content structure
- Not overly large or dramatic

### Hierarchy Rules

**Size scale** (relative, not absolute):

- **XL**: Major headings (rare, only in overlays)
- **L**: Section headings (panel sections)
- **M**: Body text (default reading size)
- **S**: Supporting text (labels, meta)
- **XS**: UI text (buttons, hints)

**Weight scale**:

- **Regular**: Default body text
- **Medium**: Emphasis, headings
- **Bold**: Strong emphasis (rare, use sparingly)

**Rule**: Hierarchy should be clear but not dramatic. Don't use size or weight to shout.

### Line-Length Philosophy

**Reading content** (panels, overlays):

- **Optimal**: 60-75 characters per line
- **Maximum**: 90 characters
- **Minimum**: 45 characters (on mobile)

**Why**: Comfortable reading without eye strain. Too wide is hard to scan, too narrow feels cramped.

**Labels and short text**:

- No strict limit
- Natural width
- Don't force wrapping

**Rule**: Content should breathe. Don't stretch text to fill space unnecessarily.

### Typography Constraints

**Never**:

- Decorative fonts for body text
- Multiple font families competing
- Text that's too small to read comfortably
- Text that's too large (unless it's a deliberate statement)
- Fonts that feel trendy or dated

**Always**:

- Prioritize readability
- Maintain consistent hierarchy
- Support the workspace metaphor (functional, not decorative)

---

## 4. Spatial System

### Spacing Scale Logic

**Base unit**: 4px or 8px (to be determined, but consistent)

**Scale progression** (multiples of base):

- **XS**: 4-8px (tight spacing, within components)
- **S**: 12-16px (component padding, small gaps)
- **M**: 24-32px (section spacing, comfortable gaps)
- **L**: 48-64px (major sections, breathing room)
- **XL**: 96-128px (canvas-level spacing, object separation)

**Rule**: Use consistent multiples. Don't mix 13px, 17px, 23px randomly.

### Padding / Margin Rhythm

**Objects**:

- **Internal padding**: S (12-16px) if objects have internal content
- **External margin**: L (48-64px) between objects on canvas
- **Breathing room**: Objects should not feel cramped

**Panels**:

- **Internal padding**: M (24-32px) for content
- **Section spacing**: M (24-32px) between sections
- **Edge padding**: L (48px) from panel edges

**Overlays**:

- **Content padding**: L (48-64px) for main content
- **Section spacing**: M (24-32px) between sections
- **Max width**: Constrain content width for readability

**Rule**: More space is better than less. When in doubt, add more breathing room.

### Object Density Rules

**Canvas density**:

- **Not too sparse**: Objects should feel like a collection, not isolated
- **Not too dense**: Objects need room to breathe and be distinct
- **Organic arrangement**: Not a grid, but intentional positioning
- **Focus areas**: Some areas can be denser, others more open

**Rule**: Objects should feel placed, not scattered. Density supports the workspace metaphor.

### White Space Philosophy

**"Breathing room for thinking"**

**White space serves**:

- **Separation**: Objects are distinct
- **Focus**: Empty space draws attention to what matters
- **Calm**: Prevents visual overwhelm
- **Hierarchy**: More space = more importance

**Rule**: White space is not empty space. It's active design. Use it intentionally.

**Never**:

- Fill space just because it's there
- Cram content to avoid white space
- Use decoration to fill gaps

**Always**:

- Let important elements breathe
- Use white space to guide attention
- Trust that empty space is valuable

### Canvas Scrolling (Temporary Development Constraint)

**Current implementation**: Canvas container is scrollable to ensure all objects are reachable.

**Why**: Objects are positioned using percentage-based coordinates (10-90% bounds). To ensure objects at high Y positions (e.g., 90%) are fully visible, the container must be tall enough to accommodate them.

**Behavior**:
- Canvas container has `minHeight: 120vh` to ensure objects at maximum Y position are reachable
- Container scrolls vertically when content exceeds viewport
- Objects remain positioned at their assigned coordinates
- Scrolling is a temporary solution until proper layout system or pan/zoom is implemented

**Future**: Replace with proper spatial layout system or pan/zoom functionality that makes all objects accessible without scrolling.

---

## 5. Object Visual Language

### Shape Language

**Hybrid approach**: Soft but precise

**Characteristics**:

- **Slightly rounded corners**: Not sharp, not fully round
- **Geometric but organic**: Clear shapes, but not rigid
- **Consistent across objects**: All objects share the same shape language
- **Not too playful**: Serious enough for a workspace

**Rule**: Objects should feel touchable but not toy-like. They're tools, not decorations.

### Borders vs Surfaces

**Objects can be**:

- **Surface-based**: Solid fills with subtle borders
- **Border-based**: Outlines with transparent or subtle fills
- **Hybrid**: Both, depending on object type

**Consistency rule**: All objects should use the same approach (don't mix surface and border styles randomly).

**Border tokens**:

- `--object-border`: Subtle border (if border-based)
- `--object-surface`: Fill color (if surface-based)
- `--object-border-focused`: Border when focused (slightly stronger)

**Rule**: Objects should be clearly defined but not heavy. Borders/surfaces should support, not dominate.

### Depth Cues (Shadows, Elevation)

**Elevation levels** (conceptual):

- **Canvas level**: Objects at rest (no elevation)
- **Hover level**: Slight elevation (subtle shadow or lift)
- **Focus level**: More elevation (clearer shadow, more presence)

**Shadow philosophy**:

- **Subtle**: Shadows suggest depth, not drama
- **Soft**: Blurred, not hard edges
- **Minimal**: Just enough to feel elevated, not floating
- **Consistent**: Same shadow style across all objects

**Semantic tokens**:

- `--shadow-subtle`: Hover state elevation
- `--shadow-visible`: Focus state elevation
- `--shadow-strong`: Overlay elevation (if needed)

**Rule**: Depth should feel natural, not dramatic. Objects sit on the canvas, they don't float above it.

### How Objects Feel "Touchable"

**Without skeuomorphism**:

**Visual cues**:

- **Clear boundaries**: Objects are clearly defined
- **Hover feedback**: Immediate visual response
- **Scale on interaction**: Slight growth suggests interactivity
- **Consistent styling**: All objects feel interactive

**Not**:

- 3D effects
- Realistic materials (wood, metal, etc.)
- Drop shadows that suggest physical depth
- Bevels or embossed effects

**Rule**: Objects should feel interactive through clear design, not through fake materials.

---

## 6. Panel & Overlay Styling Rules

### Relationship to Canvas

**Desktop**:

- **Panel overlays canvas**: Slides over, doesn't replace
- **Canvas remains visible**: Dimmed but present
- **Clear separation**: Panel has distinct background, not transparent
- **Spatial relationship**: Panel feels like it's "on top" of canvas

**Mobile**:

- **Panel replaces canvas**: Full-screen, canvas hidden
- **No dimming needed**: Canvas is not visible
- **Clear transition**: Slide up/down, not fade

**Rule**: Panels should feel like they're part of the workspace, not separate pages.

### Contrast Level

**Panel background**:

- **Distinct from canvas**: Clear separation
- **Not too bright**: Shouldn't compete with content
- **Readable**: High enough contrast for text
- **Neutral**: Doesn't distract from content

**Semantic tokens**:

- `--surface-panel`: Panel background (distinct from canvas)
- `--surface-overlay`: Overlay background (even more distinct)

**Rule**: Contrast should separate, not distract. Content is primary, background is support.

### Containment vs Openness

**Panels**:

- **Contained**: Clear edges, defined space
- **Not floating**: Feels attached to viewport edge
- **Content constrained**: Max width for readability (desktop)
- **Scrollable**: Content can overflow, panel doesn't

**Overlays**:

- **More open**: Full-screen, less constrained
- **Content centered**: Max width, centered layout
- **Clear boundaries**: Still feels contained, not infinite

**Rule**: Containment should feel intentional, not restrictive. Space is defined, not cramped.

### How Focus is Visually Communicated

**When panel is open**:

- **Canvas dims**: Clear that panel has focus
- **Panel is bright**: High contrast, draws attention
- **Objects fade**: Unfocused objects recede
- **Focused object remains**: Slightly visible, maintains context

**When overlay is open**:

- **Canvas very dim**: Almost black, strong focus on overlay
- **Overlay is primary**: Full attention
- **Objects hidden**: Not visible behind overlay

**Rule**: Focus should be clear but not dramatic. Visual hierarchy guides attention naturally.

---

## 7. Light vs Dark Mode Strategy

### Primary Mode: Dark Workspace

**Dark mode is primary** because:

- **Workspace metaphor**: Creative spaces are often dim (studios, editing rooms)
- **Focus**: Dark backgrounds reduce eye strain during extended viewing
- **Object visibility**: Objects stand out more on dark backgrounds
- **Content focus**: Dark mode puts focus on content, not background

**Semantic approach**: All tokens should work in dark mode by default.

### Light Mode (If Implemented)

**If light mode exists**:

- **Secondary mode**: Not primary, but available
- **Same structure**: All tokens have light equivalents
- **Consistent feel**: Workspace metaphor holds in both modes
- **User choice**: Preference-based, not automatic

**Token strategy**:

- `--bg-canvas-light`: Light mode canvas
- `--ink-primary-light`: Light mode text
- All tokens should have light/dark variants

**Rule**: If light mode exists, it should feel like the same workspace, just different lighting. Not a different design.

### Workspace Identity Across Modes

**What stays consistent**:

- **Spatial relationships**: Objects, panels, layout
- **Interaction patterns**: Hover, focus, transitions
- **Typography hierarchy**: Same structure
- **Spacing system**: Same rhythm

**What changes**:

- **Background colors**: Light vs dark
- **Text colors**: Inverted contrast
- **Accent usage**: May need adjustment for contrast
- **Shadow intensity**: May need adjustment for visibility

**Rule**: The workspace should feel like the same place in both modes. Only the "lighting" changes, not the design.

---

## 8. Visual Constraints (Important)

### What Visual Tricks are Forbidden

**Never use**:

- **Gradients for decoration**: Only if they serve a purpose (subtle depth, etc.)
- **Drop shadows for drama**: Shadows suggest elevation, not decoration
- **Animated backgrounds**: Distracting, breaks focus
- **Particle effects**: Unnecessary, distracting
- **Glassmorphism**: Trendy, not timeless
- **Neumorphism**: Trendy, not timeless
- **Excessive blur**: Use sparingly, only for focus
- **Color overlays on images**: Unless they serve a purpose
- **Decorative borders**: Borders separate, not decorate
- **Random color pops**: Color should be functional

**Rule**: If a visual effect doesn't serve clarity, focus, or exploration, remove it.

### What Should Never be Decorative

**Functional elements**:

- **Buttons**: Clear, functional, not decorative
- **Borders**: Separate, not decorate
- **Shadows**: Suggest depth, not drama
- **Icons**: Clear, functional, not decorative
- **Labels**: Readable, not styled

**Content elements**:

- **Text**: Readable, not styled (except hierarchy)
- **Images**: Content, not decoration
- **Videos**: Content, not background decoration

**Rule**: Decoration distracts from function. The workspace is functional, not decorative.

### Where Restraint Matters Most

**Canvas**:

- **Minimal decoration**: Canvas should be neutral
- **No patterns**: Unless they serve a purpose
- **No gradients**: Unless subtle and purposeful
- **No textures**: Unless they reinforce the metaphor (paper, etc.)

**Objects**:

- **Consistent styling**: All objects share the same visual language
- **No special effects**: Objects are tools, not art pieces
- **No animations for decoration**: Only for interaction/state

**Panels**:

- **Content-first**: Panels support content, not themselves
- **No decorative headers**: Headers are functional
- **No decorative borders**: Borders separate, not decorate

**Rule**: Restraint creates focus. The most important restraint is on the canvas and objects—they should be calm, not competing for attention.

### Accessibility Constraints

**Color contrast**:

- **Text must be readable**: WCAG AA minimum (4.5:1 for normal text)
- **Interactive elements**: Clear contrast for visibility
- **Focus states**: High contrast, clearly visible

**Visual hierarchy**:

- **Not just color**: Don't rely on color alone for meaning
- **Size and weight**: Use multiple cues
- **Spacing**: Separation is visual, not just color

**Rule**: Visual design must be accessible. If it's not accessible, it's not good design.

---

## Implementation Guidance

### Token Naming Convention

**Semantic naming**:

- `--bg-*`: Backgrounds
- `--surface-*`: Surfaces (panels, objects)
- `--ink-*`: Text colors
- `--accent-*`: Accent colors
- `--border-*`: Borders
- `--shadow-*`: Shadows
- `--state-*`: State colors (focus, active, muted)

**Example tokens**:
```css
--bg-canvas: [to be defined]
--bg-canvas-dimmed: [to be defined]
--surface-panel: [to be defined]
--ink-primary: [to be defined]
--ink-muted: [to be defined]
--accent-active: [to be defined]
--state-focused: [to be defined]
--state-muted: [to be defined]
```

**Rule**: Tokens should be semantic, not descriptive of color. `--ink-primary` not `--color-gray-900`.

### Component Styling Rules

**When styling components**:

1. **Use tokens**: Never hardcode colors, use tokens
2. **Respect spacing scale**: Use defined spacing values
3. **Follow hierarchy**: Typography roles, not arbitrary sizes
4. **Maintain consistency**: Same patterns across components

**Rule**: Components should feel like they belong to the same system. Consistency is key.

### Visual System Checklist

Before implementing any visual element, ask:

1. **Does it reinforce the workspace metaphor?** (Not gallery, not landing page)
2. **Is it functional?** (Serves a purpose, not decoration)
3. **Is it consistent?** (Follows tokens, spacing, hierarchy)
4. **Is it accessible?** (Readable, clear contrast, not color-dependent)
5. **Will it age well?** (Not trendy, timeless approach)

If the answer to any is "no", simplify or remove.

---

## Summary

**Visual Language Principles**:

- **Calm, intelligent, exploratory**
- **Functional, not decorative**
- **Spacious, not cramped**
- **Consistent, not random**
- **Accessible, not exclusive**

**The workspace should feel like**:

- A place where ideas are made
- A creative environment
- A functional space
- A calm, focused workspace

**The workspace should NOT feel like**:

- A gallery
- A landing page
- A marketing site
- A trendy interface

**Every visual decision should support**:

- Clarity
- Focus
- Exploration

If it doesn't, remove it.

/**
SPATIAL MODEL (CURRENT — CONSTRAINED)

Workspace objects are scaled and positioned to fit
entirely within a single viewport (100vh).

- No scroll or pan
- Object size adapts (60–100px)
- Guarantees immediate reachability

This model prioritizes accessibility over scalability.
It may be revisited if object count grows.
 **/


---

*This document defines the visual language. Specific colors, fonts, and CSS implementation will follow in subsequent phases.*
