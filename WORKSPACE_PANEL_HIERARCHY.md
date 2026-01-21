# TPZ Studio: Panel Hierarchy System

## Core Principle

**Panels are depth, not navigation.**

Panels expand from the workspace to reveal more information. They are not pages. They are not destinations. They are layers of understanding that exist within the bounded workspace model.

If a panel feels like a page, the system has failed.

---

## 1. Panel Purpose

### What a Panel Is

**A panel is**:

- **An expansion of context**: Reveals more about an object without leaving the workspace
- **A focused view**: Dims the canvas to draw attention, but keeps workspace visible
- **A temporary layer**: Opens and closes, never replaces the canvas
- **A content container**: Holds structured information in a scannable format
- **A bridge to deeper content**: Links to projects, but doesn't become a project page
- **Part of the workspace**: Feels like it belongs to the same environment

**Visual metaphor**: Like opening a drawer on a desk. The drawer extends from the desk, reveals its contents, but the desk remains visible and accessible.

### What a Panel Is NOT

**A panel is NOT**:

- **A page**: Does not replace the workspace, does not feel like navigation
- **A modal**: Not a popup that blocks everything, canvas remains visible (dimmed)
- **A separate route**: Route reflects state, but panel is not a "page" in traditional sense
- **A dead end**: Always has a clear path back to canvas
- **A marketing section**: Not selling, showing capabilities
- **A portfolio grid**: Projects appear as links, not as a gallery
- **A blog**: Not a content feed, focused information only
- **A form container**: Contact panel is exception, but still feels like workspace expansion

**Visual metaphor**: NOT like clicking a link that takes you to a new page. NOT like opening a new window. NOT like a popup that covers everything.

---

## 2. Content Layers

### Layer 1: Immediate Context (Always Visible)

**What appears immediately when panel opens**:

- **Object title**: Clear, readable, matches object label
- **Short intent** (1-2 sentences): What this capability is, not what it does
- **Visual anchor** (if available): Single image or icon that represents the capability
- **Quick actions** (if applicable): Primary link or action (e.g., "View Projects", "Get in Touch")

**Purpose**: User understands what they're looking at within 2 seconds.

**Constraints**:

- No scrolling required to see this layer
- Maximum 100 words total
- Single visual element (if any)
- No lists, no grids, no complex layouts

**Example**:
```
Film & Social Media
Creating visual narratives that connect and engage.

[Single image: film reel or camera]

[Link: View Film Projects]
```

### Layer 2: Expanded Understanding (Scrollable)

**What appears below the fold**:

- **Description**: 2-4 paragraphs explaining the capability, approach, or process
- **Featured work** (if applicable): 2-4 project links with thumbnails and brief descriptions
- **Related capabilities** (if applicable): Links to other workspace objects that complement this one
- **Process overview** (if applicable): Brief explanation of how work happens (not a detailed process page)

**Purpose**: User can dive deeper if interested, but doesn't have to.

**Constraints**:

- Maximum 500 words total (description + featured work descriptions)
- Maximum 4 featured items (if more exist, link to archive)
- No long-form content (that belongs in project detail overlay)
- No testimonials (unless brief, 1-2 sentences max)
- No pricing or service packages (contact panel handles inquiries)

**Example**:
```
[Description: 2-3 paragraphs about film production approach]

Featured Work:

- Project A [thumbnail] [brief description] [link]
- Project B [thumbnail] [brief description] [link]

[Link: View All Film Projects]
```

### Layer 3: Deep Dive / Exit Points (Links Only)

**What appears as links, not content**:

- **Project archive link**: "View All [Category] Projects" → Opens project archive overlay
- **Related objects**: Links to other workspace objects (e.g., "Also see: Branding")
- **Contact link**: "Discuss a Project" → Opens contact panel
- **External links** (if applicable): Links to external resources, courses, etc.

**Purpose**: Clear paths to deeper content without expanding the panel itself.

**Constraints**:

- Links only, no inline content
- Maximum 3-4 links (don't overwhelm)
- Links are clearly labeled and scannable
- No "Learn More" generic links (be specific)

**What Layer 3 is NOT**:

- **NOT a project detail view**: Projects open in overlay, not in panel
- **NOT a nested panel**: No panels within panels
- **NOT a form**: Contact is separate panel, not embedded
- **NOT a blog feed**: No article listings

---

## 3. Rules Per Object Type

### Capability Objects (Film, Voiceovers, Branding, Courses, Strategy)

**Purpose**: Show what this capability is and how it's used.

**Layer 1 (Immediate)**:

- Object title
- Short intent (1 sentence: "What is this capability?")
- Optional: Single representative image
- Primary action: "View [Category] Projects" or "Learn More"

**Layer 2 (Expanded)**:

- Description: 2-4 paragraphs about the capability, approach, or philosophy
- Featured work: 2-4 project links (if projects exist)
- Process note: Brief mention of how work happens (1-2 sentences, not detailed)

**Layer 3 (Exit Points)**:

- "View All [Category] Projects" → Project archive overlay
- "Also see: [Related Object]" → Other workspace objects
- "Get in Touch" → Contact panel

**Content Limits**:

- Maximum 500 words total (Layer 1 + Layer 2)
- Maximum 4 featured projects (if more, link to archive)
- No case studies (those are project details)
- No testimonials (unless 1 sentence, very brief)
- No pricing or packages
- No detailed process documentation (that's project-level)

**What Must Never Appear**:

- Long-form articles or blog posts
- Multiple images in a gallery
- Video embeds (videos belong in project overlays)
- Forms or contact information (contact is separate)
- Social media feeds
- News or updates
- Portfolio grids (projects are links, not thumbnails)

### About / Studio Object

**Purpose**: Brief context about TPZ Studio, not a full "about page."

**Layer 1 (Immediate)**:

- "About TPZ Studio" or "The Studio"
- Short intent (1 sentence: "Who we are" or "What we do")
- Optional: Single image (studio, workspace, or representative visual)

**Layer 2 (Expanded)**:

- Brief description: 2-3 paragraphs about approach, philosophy, or background
- No featured work (that's in capability objects)
- No team bios (unless very brief, 1-2 sentences each)
- No history or timeline (too long-form)

**Layer 3 (Exit Points)**:

- Links to capability objects
- "View Projects" → Project archive
- "Get in Touch" → Contact panel

**Content Limits**:

- Maximum 300 words total
- No long-form biography
- No detailed history
- No team member profiles (unless very brief)
- No mission statements or values lists (integrate into description)

**What Must Never Appear**:

- Full "about us" page content
- Team member profiles with photos and bios
- Company history or timeline
- Awards or recognition lists
- Press or media mentions
- Detailed philosophy essays

**Note**: About content should feel like a brief introduction, not a corporate page. If more detail is needed, it belongs in a separate document or external link.

**Route Variants**:
- `/workspace/about` → English about panel
- `/workspace/sobre-mi` → Spanish about panel (current implementation)

### Contact Object

**Purpose**: Enable inquiry and connection, not a full contact page.

**Layer 1 (Immediate)**:

- "Get in Touch" or "Contact"
- Short intent (1 sentence: "How to reach us" or "Let's discuss a project")
- Optional: Single visual (envelope, message icon, or representative image)

**Layer 2 (Expanded)**:

- Contact form: Name, email, message, project type (if applicable)
- Contact information: Email, phone (if provided)
- Social links: Brief list of social media (if applicable)
- Response expectation: "We'll respond within [timeframe]"

**Layer 3 (Exit Points)**:

- Links to capability objects (if user wants to learn more first)
- "View Projects" → Project archive

**Content Limits**:

- Maximum 200 words (excluding form fields)
- Simple form only (name, email, message, optional project type)
- No detailed inquiry forms (keep it simple)
- No FAQ section (that's too much content)
- No office address or map (unless essential)

**What Must Never Appear**:

- Long contact forms with many fields
- FAQ sections
- Office locations or maps
- Business hours
- Multiple contact methods with explanations
- Testimonials or reviews
- Pricing information

**Note**: Contact panel should feel like a quick way to reach out, not a comprehensive contact page. Keep it minimal and focused.

### Projects / Work Archive Object

**Purpose**: Browse all projects, not a portfolio gallery.

**Layer 1 (Immediate)**:

- "Projects" or "Work"
- Short intent (1 sentence: "Explore completed work" or "View case studies")
- Optional: Single visual (folder, archive icon, or representative image)

**Layer 2 (Expanded)**:

- Project list: 6-12 project links with thumbnails and brief descriptions
- Filter options (if applicable): By category, type, or date (simple, not complex)
- Load more / pagination: If more than 12 projects, show "Load More" or pagination

**Layer 3 (Exit Points)**:

- Individual project links → Project detail overlay
- Links to capability objects (if user wants to see capability-specific projects)
- "Get in Touch" → Contact panel

**Content Limits**:

- Maximum 12 projects visible at once (if more, paginate or "Load More")
- Brief descriptions only (1-2 sentences per project)
- No project details (those are in overlay)
- No filtering UI complexity (simple category buttons, max 4-5 categories)

**What Must Never Appear**:

- Full project details (those are in overlay)
- Project grids with many thumbnails (6-12 max visible)
- Complex filtering or search UI
- Project categories as separate sections
- Featured vs. archive distinction (all projects are equal)
- Project metadata (dates, clients, etc.) in list view (save for detail)

**Note**: Project archive should feel like a curated list, not a gallery. Projects are links to detail views, not standalone content.

---

## 4. Limits

### Maximum Content Length

**Per Panel Type**:

- **Capability objects**: 500 words total (Layer 1 + Layer 2)
- **About/Studio**: 300 words total
- **Contact**: 200 words total (excluding form fields)
- **Projects archive**: 12 projects visible at once, 1-2 sentences per project

**Rationale**: Panels should be scannable in 30-60 seconds. If content requires more time, it belongs in an overlay or external link.

### When to Link Out Instead of Expand

**Link out when**:

- Content exceeds panel word limits
- Content requires its own context (project details, full case studies)
- Content is external (courses, external resources, social media)
- Content is long-form (articles, detailed process documentation)
- Content is interactive (forms, calculators, tools)

**Expand in panel when**:

- Content is brief and contextual (descriptions, featured work links)
- Content supports the capability overview (not standalone)
- Content is scannable (lists, brief descriptions)

**Rule**: If it feels like a "page," it should be a link (overlay or external), not panel content.

### What Panels Must Never Contain

**Never include**:

1. **Long-form articles or blog posts**: Too much content, belongs in overlay or external
2. **Video embeds**: Videos belong in project overlays, not panels
3. **Image galleries**: Multiple images in a grid (single image only, or link to gallery)
4. **Complex forms**: Contact form is exception, but keep it simple
5. **Testimonials or reviews**: Too marketing-focused, not workspace-appropriate
6. **Pricing or packages**: Not appropriate for workspace context
7. **Social media feeds**: External content, link out instead
8. **News or updates**: Not workspace content
9. **Team member profiles**: Too much detail, belongs in about overlay (if needed)
10. **Process documentation**: Detailed processes belong in project overlays
11. **Case studies**: Full case studies are project details, not panel content
12. **FAQ sections**: Too much content, link to external FAQ if needed
13. **Portfolio grids**: Projects are links, not thumbnails in a grid
14. **Nested navigation**: No menus, no sub-sections, no tabs
15. **Breadcrumbs**: Not needed, workspace context is always clear

**Rationale**: Panels are focused expansions, not comprehensive pages. If content doesn't fit the panel constraints, it belongs elsewhere.

---

## 5. Consistency Rules

### All Panels Feel Related

**Visual consistency**:

- Same panel width and positioning (desktop: side panel, mobile: full-screen)
- Same typography hierarchy (title, description, links)
- Same spacing rhythm (consistent padding, margins)
- Same close button placement and behavior
- Same scroll behavior (smooth, contained)

**Content consistency**:

- Same structure: Layer 1 (immediate) → Layer 2 (expanded) → Layer 3 (exit points)
- Same tone: Brief, focused, not marketing-heavy
- Same link style: Clear labels, consistent placement
- Same visual treatment: Single image (if any), consistent thumbnail sizes

**Interaction consistency**:

- Same open/close animation (slide in from side, or full-screen on mobile)
- Same dimming behavior (canvas dims when panel opens)
- Same close methods (close button, click outside, ESC key)
- Same scroll behavior (panel scrolls, canvas doesn't)

### No Panel Surprises the User

**Predictable behavior**:

- Panels always open the same way (slide in, same position)
- Panels always close the same way (slide out, return to canvas)
- Panel content always follows the same structure (Layer 1 → 2 → 3)
- Links always behave the same way (overlay opens, or external link)
- Close button always works the same way

**Predictable content**:

- Capability objects always show: title, intent, description, featured work, links
- Contact always shows: form, contact info, social links
- Projects archive always shows: list of projects with thumbnails and descriptions
- About always shows: brief description, links to capabilities

**Predictable limits**:

- Users know panels are brief (30-60 second read)
- Users know projects are links (not full content in panel)
- Users know contact is simple (form, not complex inquiry)
- Users know panels expand, not replace (canvas always visible)

**Rule**: If a user has to learn new behavior for a panel, the system has failed. All panels should feel familiar and predictable.

### Editorial Discipline

**Content editing rules**:

1. **Cut ruthlessly**: If content doesn't fit limits, cut it or move it
2. **Link, don't expand**: If content is long-form, link to overlay or external
3. **One idea per panel**: Each panel has one clear purpose
4. **Scannable, not readable**: Panels are for scanning, not deep reading
5. **Context, not content**: Panels provide context, detailed content is elsewhere

**Writing rules**:

- **Brief and direct**: No fluff, no marketing speak, no filler
- **Active voice**: "We create" not "We are creators of"
- **Specific, not generic**: "Film production" not "Creative solutions"
- **Clear links**: "View Film Projects" not "Learn More"
- **No jargon**: Use plain language, avoid industry terms unless necessary

**Visual rules**:

- **One image maximum**: Single visual anchor, not galleries
- **Consistent thumbnails**: Same size, same treatment for project links
- **No decoration**: Visuals support content, don't decorate
- **Clear hierarchy**: Title → Description → Links, obvious visual flow

**Rule**: Every word, every image, every link must serve the panel's purpose. If it doesn't, remove it.

---

## 6. Panel Depth System

### Depth Levels

**Level 0: Canvas**

- All objects visible
- No panels open
- Full workspace context

**Level 1: Panel Open**

- One panel expanded
- Canvas dimmed but visible
- Focus on panel content
- Other objects remain visible (dimmed)

**Level 2: Overlay Open**

- Project detail or about overlay
- Canvas very dimmed (almost hidden)
- Focus on overlay content
- Panel may remain open (if overlay opened from panel)

**Level 3: External Link**

- User leaves workspace
- External resource or course
- Workspace context lost (by design)

### Depth Rules

**Maximum depth**: Level 2 (overlay). Level 3 (external) is exit, not depth.

**No nested panels**: Panels don't open from panels. Links from panels open overlays or external resources.

**No panel stacking**: Only one panel open at a time. Opening a new panel closes the previous one.

**Overlay from panel**: Overlays can open from panels (e.g., project detail from capability panel), but panel remains open (dimmed) to maintain context.

**Return path**: Every depth level has a clear return path to canvas (close button, ESC key, click outside).

### Content Rhythm

**Panel rhythm**:

1. **Open**: Panel slides in, canvas dims (0.3s animation)
2. **Scan**: User scans Layer 1 (immediate context) - 2-5 seconds
3. **Expand**: User scrolls to Layer 2 (expanded understanding) - 10-30 seconds
4. **Exit**: User clicks link to overlay or closes panel - returns to canvas

**Overlay rhythm**:

1. **Open**: Overlay fades in, canvas very dims (0.3s animation)
2. **Engage**: User reads/view project detail - 1-5 minutes
3. **Exit**: User closes overlay - returns to panel (if opened from panel) or canvas

**Canvas rhythm**:

1. **Explore**: User hovers objects, sees labels - 5-10 seconds
2. **Focus**: User clicks object, panel opens - transitions to panel rhythm
3. **Return**: User closes panel, returns to canvas - 0.3s animation

**Rule**: Each depth level has its own rhythm. Panels are quick (30-60 seconds), overlays are longer (1-5 minutes), canvas is persistent.

---

## 7. Failure Modes (What Breaks the System)

### If Panels Feel Like Pages

**Symptoms**:

- User feels like they've "navigated away" from workspace
- User doesn't remember they're still in the workspace
- User expects browser back button to work like page navigation
- Panel feels like a separate destination

**Causes**:

- Panel content is too long (exceeds limits)
- Panel structure is too complex (nested sections, tabs)
- Panel doesn't maintain workspace context (canvas not visible, no dimming)
- Panel animation is too dramatic (feels like page transition)

**Fix**:

- Reduce content to fit limits
- Simplify panel structure (Layer 1 → 2 → 3 only)
- Ensure canvas remains visible (dimmed, not hidden)
- Use subtle animations (slide in, not fade to black)

### If Content Feels Disconnected

**Symptoms**:

- User doesn't understand how panel relates to object
- User doesn't know where they are in the workspace
- Links feel random, not contextual
- Panel content doesn't match object purpose

**Causes**:

- Panel content doesn't follow object type rules
- Links are generic ("Learn More") not specific
- Panel structure is inconsistent across objects
- No clear connection between object and panel content

**Fix**:

- Follow object type rules strictly
- Use specific link labels ("View Film Projects" not "Learn More")
- Maintain consistent panel structure
- Ensure panel title matches object label

### If Panels Feel Overwhelming

**Symptoms**:

- User doesn't know where to start reading
- User scrolls endlessly without finding what they need
- User feels like there's too much information
- User closes panel without reading

**Causes**:

- Content exceeds word limits
- No clear hierarchy (Layer 1 → 2 → 3)
- Too many links or options
- Visual clutter (multiple images, complex layouts)

**Fix**:

- Enforce word limits strictly
- Maintain clear layer structure
- Limit links to 3-4 maximum
- Use single image, simple layout

### If Panels Feel Inconsistent

**Symptoms**:

- User has to learn new behavior for each panel
- Panel structure changes between objects
- Links behave differently in different panels
- Visual treatment varies between panels

**Causes**:

- Not following consistency rules
- Different content structures for different objects
- Inconsistent link behavior
- Inconsistent visual styling

**Fix**:

- Apply consistency rules to all panels
- Use same structure for all capability objects
- Standardize link behavior
- Use same visual treatment across panels

---

## 8. Success Criteria

### A Successful Panel System

**Users should**:

- Understand they're still in the workspace when panel opens
- Scan panel content in 30-60 seconds
- Know where to find deeper content (links to overlays)
- Feel like panels expand from objects, not replace them
- Predict panel behavior based on previous experience

**Panels should**:

- Feel like part of the workspace, not separate pages
- Provide context quickly (Layer 1 visible immediately)
- Offer depth without overwhelming (Layer 2 scrollable)
- Link to deeper content clearly (Layer 3 exit points)
- Maintain workspace context (canvas visible, dimmed)

**The system should**:

- Be consistent across all object types
- Enforce limits strictly (word counts, content types)
- Provide clear return paths (close button, ESC, click outside)
- Feel predictable (same behavior, same structure)
- Support the workspace metaphor (depth, not navigation)

### Test Questions

**Ask yourself**:

1. Does this panel feel like a page? (If yes, simplify)
2. Can I scan this panel in 30-60 seconds? (If no, cut content)
3. Does this panel maintain workspace context? (If no, ensure canvas visible)
4. Are links specific and clear? (If no, rewrite labels)
5. Does this panel follow the object type rules? (If no, restructure)
6. Would a user be surprised by this panel? (If yes, make it consistent)
7. Does this panel feel like it belongs in the workspace? (If no, reconsider content)

**If all answers are correct, the panel system is working.**

---

## Summary

**Panel Hierarchy Principles**:

1. **Panels are depth, not navigation**: Expand from workspace, don't replace it
2. **Three layers**: Immediate context → Expanded understanding → Exit points
3. **Strict limits**: Word counts, content types, link counts enforced
4. **Consistent structure**: All panels follow same pattern
5. **Editorial discipline**: Cut ruthlessly, link don't expand, one idea per panel

**Panel Purpose**:

- Show what a capability is (capability objects)
- Provide brief context (about/studio)
- Enable quick contact (contact)
- Browse work (projects archive)

**Panel Constraints**:

- Maximum 500 words (capability), 300 words (about), 200 words (contact)
- Maximum 12 projects visible (archive)
- Single image only (no galleries)
- Links only for deeper content (no nested panels)

**Success Metric**:

- If panels feel like pages → system has failed
- If panels feel like workspace expansion → system is working

---

*This system defines information hierarchy, not visual design. Visual implementation follows the visual system document. This document defines what content appears where, when, and why.*