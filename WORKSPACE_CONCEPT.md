# TPZ Studio: Creative Workspace Concept

## 1. Conceptual Overview

The website is a **Creative Workspace**—a single, persistent canvas that functions as both a portfolio and an active studio environment. Instead of navigating through discrete pages, users enter a digital workspace where TPZ Studio's capabilities are represented as physical objects: tools, artifacts, and materials arranged on a creative desk. This metaphor fits TPZ Studio because the studio itself is multidisciplinary and adaptive—it doesn't produce one type of work, but rather shifts between film, voice, branding, education, and strategy depending on the project. The workspace makes this versatility tangible: you see the tools available, you understand the environment, and you interact with it as you would a real creative space. The homepage is not a landing page; it is the workspace itself, and all content lives within or expands from this central canvas.

---

## 2. Workspace Anatomy

### Canvas

The canvas is a single, full-viewport surface that serves as the primary container. It has no traditional header, footer, or navigation bars. The canvas feels like:

- **A desk surface**: Subtle texture, depth, and lighting that suggests a physical plane
- **A studio floor**: Clean but not sterile, with ambient space that allows objects to breathe
- **A whiteboard**: Infinite potential, but with intentional constraints that prevent chaos

The canvas background is minimal: either a very subtle gradient, a soft paper texture, or a muted solid color. It does not compete with the objects. The canvas has depth—objects can appear to sit on it, cast subtle shadows, and respond to cursor proximity.

### Objects

Objects are interactive elements that represent TPZ Studio's capabilities. Each object is:

- **Distinct**: Visually unique but part of a cohesive visual language
- **Positioned intentionally**: Not in a grid, but arranged organically as if placed on a desk
- **Scalable**: Objects can be small (ambient presence) or large (focused state)
- **Layered**: Objects can overlap slightly, creating depth and hierarchy

Objects are not icons or buttons. They are representations: a camera object represents film production, a waveform represents voiceovers, a blueprint represents branding, etc. Objects have subtle animation (breathing, slight rotation, or gentle movement) to indicate they are alive and interactive.

### Background

The background is the canvas surface itself. It may include:

- **Subtle environmental cues**: Soft light sources, gentle shadows, ambient noise (optional audio)
- **Depth layers**: Objects can appear closer or farther, creating a sense of space
- **Negative space**: Large areas of emptiness that allow focus

The background does not scroll. The canvas is fixed; objects move, expand, or reveal content within the same viewport.

### UI Chrome

There is minimal UI chrome. Essential elements only:

- **Workspace title/logo**: Small, positioned in a corner (top-left or top-right), always visible but unobtrusive
- **Close/back controls**: Appear contextually when an object is expanded or a panel is open
- **Contact access**: A small, persistent element (perhaps a small card or icon) that doesn't compete with workspace objects

No traditional navigation menu. No footer. No breadcrumbs. The workspace is self-explanatory through its objects and interactions.

---

## 3. Object System

### Object: Camera / Film Reel

**Represents**: Film production, social media content, video work

**Visual**: A camera or film reel object, positioned on the canvas. Subtle film strip detail or lens reflection.

**Hover behavior**:

- Slight scale increase (1.1x)
- Gentle rotation or tilt
- Brief text label appears: "Film & Social Media"
- Subtle glow or highlight

**Click behavior**:

- Object expands into a focused view
- A panel slides in from the side or overlays the canvas
- Panel shows: service description, featured projects in this category, case studies, process overview
- Background canvas dims slightly to focus attention

**Content mapping**: Maps to Sanity `service` documents with category "film" or "video", and `project` documents with matching categories.

---

### Object: Waveform / Speaker

**Represents**: Voiceovers, audio production, narration

**Visual**: A waveform visualization or stylized speaker/microphone. Could be animated (subtle wave motion).

**Hover behavior**:

- Waveform animates more actively
- Label: "Voiceovers"
- Slight pulse or audio-visual feedback

**Click behavior**:

- Expands to show voiceover service details
- Audio samples can play inline
- Portfolio of voice work (if applicable)
- Process and collaboration details

**Content mapping**: Maps to `service` documents for voiceovers, and any `project` documents that include voice work.

---

### Object: Blueprint / Grid / Compass

**Represents**: Branding, identity design, façade design, offline + online brand systems

**Visual**: A blueprint or technical drawing aesthetic, or a grid system with geometric shapes. Clean, architectural feel.

**Hover behavior**:

- Grid lines become more visible
- Label: "Branding & Design"
- Subtle construction/architectural animation

**Click behavior**:

- Expands to show branding service details
- Visual examples of brand work (logos, identities, applications)
- Process: strategy → design → implementation
- Links to specific brand projects

**Content mapping**: Maps to `service` documents for branding, and `project` documents tagged with branding categories.

---

### Object: Book / Timeline / Calendar

**Represents**: Courses, education, workshops (online + offline)

**Visual**: An open book, a timeline, or a calendar/planner aesthetic. Educational but not academic.

**Hover behavior**:

- Pages might flip subtly
- Label: "Courses & Education"
- Gentle scholarly animation

**Click behavior**:

- Expands to show course offerings
- Online vs. offline distinction
- Course descriptions, schedules, registration
- Testimonials or student work (if applicable)

**Content mapping**: Maps to `service` documents for courses, and potentially a future `course` document type in Sanity.

---

### Object: Sticky Notes / Sketch / Lightbulb

**Represents**: Creative strategy, brainstorming, conceptual work, consulting

**Visual**: A cluster of sticky notes, a sketch pad, or a lightbulb with thought bubbles. More organic, less structured than other objects.

**Hover behavior**:

- Notes shuffle or lift slightly
- Label: "Strategy & Consulting"
- Playful, creative animation

**Click behavior**:

- Expands to show strategy service details
- Process: discovery → ideation → execution
- Case studies of strategic work
- Collaboration approach

**Content mapping**: Maps to `service` documents for strategy, and `project` documents that emphasize strategic thinking.

---

### Object: Project Archive / Portfolio Stack

**Represents**: All projects, case studies, work history

**Visual**: A stack of project cards, a folder, or a film canister collection. Suggests accumulation and curation.

**Hover behavior**:

- Stack shifts or cards fan out slightly
- Label: "Projects"
- Preview of project count or featured items

**Click behavior**:

- Expands to show project grid or list
- Filterable by category, type, or date
- Each project can be opened in detail view
- Projects link back to relevant service objects

**Content mapping**: Maps to all `project` documents, with filtering by categories and featured status.

---

### Object: Contact Card / Envelope

**Represents**: Contact, collaboration, inquiry

**Visual**: A small card, envelope, or business card object. Always accessible but not dominant.

**Hover behavior**:

- Slight lift or flip
- Label: "Get in Touch"

**Click behavior**:

- Expands to contact form or contact details
- Social links
- Inquiry options (project type, timeline, etc.)

**Content mapping**: Maps to `contactPage` document from Sanity, including email, phone, and social media links.

---

## 4. Navigation Logic

### Entry Point

Users land directly on the workspace canvas. No splash screen, no loading animation beyond a brief fade-in. The workspace objects appear with a subtle stagger animation (0.1s delays between objects) to create a sense of discovery without being slow.

### Object Interaction

**Hover**: Objects respond immediately with scale, label, and subtle animation. No delay.

**Click**:

- Object expands in place or transforms into a focused view
- A panel or overlay appears with detailed content
- Canvas background dims (opacity: 0.3–0.5)
- Other objects remain visible but fade slightly (opacity: 0.4–0.6)

**Close/Back**:

- A close button appears in the expanded view (top-right or integrated into the panel)
- Clicking outside the panel also closes it
- ESC key closes any open panel
- Closing returns to the workspace canvas with all objects at full opacity

### Deep Navigation

**Within an object's expanded view**:

- If a project is clicked from within a service object, the project opens in a detail view
- Project detail view can be a full-screen overlay or a side panel
- Projects can link to other related objects (e.g., a film project might link to the Camera object)

**Breadcrumb logic** (conceptual, not visual):

- Workspace → Service Object → Project Detail
- Users can always return to workspace by closing panels or clicking the workspace title/logo

### Mobile Adaptation

**Canvas becomes a vertical stack**:

- Objects are arranged vertically instead of organically
- Objects are larger and more touch-friendly
- Hover states become tap states
- Expanded views become full-screen overlays (not side panels)
- Swipe gestures can navigate between expanded views
- Close button is always accessible (top-left or swipe down)

**Touch interactions**:

- Tap object to expand
- Swipe left/right to navigate between related content
- Swipe down or tap outside to close
- Pinch or double-tap to return to workspace

### Return to Workspace

**Always accessible**:

- Workspace title/logo is always clickable and returns to canvas
- Close button on any panel returns to workspace
- ESC key returns to workspace
- After a period of inactivity (optional), workspace can auto-return to canvas

**State persistence**:

- URL updates to reflect current view (e.g., `/workspace/film`, `/workspace/projects/example-slug`)
- Browser back/forward works naturally
- Direct URLs to specific objects or projects load with that object expanded

---

## 5. Content Mapping Strategy

### Sanity Content → Workspace Objects

**Service Documents** → **Objects**

Each `service` document in Sanity maps to a workspace object. The mapping is determined by:

- Service `icon` field (camera → Camera object, music → Waveform object, etc.)
- Service `title` or a new `workspaceObject` field that explicitly assigns the object type
- Service `order` field determines object positioning on canvas (though positioning can also be manual/curated)

**Service content structure**:

- `title` → Object label on hover
- `shortDescription` → Brief text in expanded panel header
- `body` → Full description in expanded panel
- `coverImage` → Visual element in expanded panel
- `cta` → Action button in expanded panel

---

### Project Documents → Object Connections

**Projects link to objects in two ways**:

1. **Via service categories**: Projects with categories that match a service (e.g., "film", "video") appear within that service object's expanded view.

2. **Via Project Archive object**: All projects appear in the Project Archive object, filterable and browsable.

**Project content structure**:

- `title` → Project name in listings and detail views
- `excerpt` → Preview text in project cards
- `coverImage` → Visual thumbnail in listings
- `video` → Primary media in project detail view
- `categories` → Filtering and object association
- `credits` → Displayed in project detail view
- `body` → Full project description in detail view
- `featured` → Can appear in service object expanded views as "featured work"

---

### Home Page Content → Workspace Canvas

**Current home page fields map to workspace elements**:

- `hero.headline` → Optional workspace title or subtitle (subtle, not dominant)
- `hero.background` → Canvas background (image or video can be the workspace surface)
- `introText.body` → Can appear as a small text element on canvas (like a note or manifesto card)
- `filosofia.body` → Can be another canvas element (a philosophy card or note)
- `services.items` → Determines which service objects appear on canvas
- `featuredProjects.items` → Can appear as previews within relevant service objects or in Project Archive

**Note**: The traditional "sections" of the home page are dissolved. Content becomes ambient elements on the canvas or appears within object expanded views.

---

### Contact Page → Contact Object

**Contact document maps to Contact object**:

- `title` → Contact panel header
- `introText` → Text in contact panel
- `phone` → Displayed in contact panel
- `email` → Displayed in contact panel
- `socialMedia` → Social links in contact panel

---

### About Page → Workspace Element

**About content can appear as**:

- A small card or note on the canvas (always visible or toggleable)
- An expandable object (if about content is substantial)
- Integrated into the workspace title/logo area (click logo to reveal about)

**About content structure** (from `aboutPage` schema, if it exists):

- Maps to a canvas element that reveals TPZ Studio's story, approach, or philosophy
- Can be a persistent small element or an expandable object

---

### Content Layers

**Layer 1: Canvas (Workspace)

- Objects visible
- Ambient content (intro text, philosophy) as small elements
- Background and environment

**Layer 2: Object Expanded (Service/Archive)

- Service details
- Project listings within service
- Related content

**Layer 3: Project Detail

- Full project view
- Media (video, images)
- Description, credits, categories
- Links to related services/projects

**Layer 4: Contact/About

- Contact form or details
- About information
- Can overlay any layer

---

### Future Content Integration

**New content types can plug into the system**:

- **Blog posts**: Could appear as a new object (notebook, journal) or within relevant service objects
- **Testimonials**: Can appear within service expanded views or as ambient canvas elements
- **Case studies**: Can be separate documents that link to both services and projects
- **Courses**: If courses become a separate content type, they map to the Book/Timeline object

**The workspace is extensible**: New objects can be added to the canvas, old objects can be hidden and new content types can map to existing or new objects without breaking the interaction model.

---

## Design Principles

1. **Container first, content later**: The workspace structure is defined independently of content. Content plugs into objects, not the reverse.

2. **No dead ends**: Every view has a clear path back to the workspace canvas.

3. **Progressive disclosure**: Information reveals in layers: canvas → object → detail.

4. **Spatial memory**: Objects maintain their positions. Users build a mental map of the workspace.

5. **Minimal chrome**: UI elements appear only when needed. The workspace itself is the interface.

6. **Touch-friendly**: All interactions work on mobile with appropriate adaptations.

7. **Performance-conscious**: Objects load progressively. Canvas appears first, objects animate in, content loads on demand.

---

## Next Steps (Implementation)

Once this concept is approved:

1. **Technical architecture**: Define React/Next.js component structure, state management, routing strategy
2. **Visual design**: Create object designs, canvas styling, animation specifications
3. **Content migration**: Map existing Sanity content to workspace objects
4. **Interaction prototyping**: Build clickable prototype of object interactions
5. **Responsive design**: Define mobile breakpoints and touch interactions
6. **Performance optimization**: Lazy loading, image optimization, animation performance

---

*This document defines the interaction model and content strategy. Implementation details will follow in subsequent phases.*
