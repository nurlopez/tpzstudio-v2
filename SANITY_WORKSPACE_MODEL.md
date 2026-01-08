# TPZ Studio: Sanity Content System → Workspace Objects

## Core Principle

**Content should feel like materials on a creative desk, not website sections.**

Sanity is not a blog CMS. It is the inventory of the workspace.

Content in the workspace represents:

- **Artifacts**: Things that have been made (projects, experiments)
- **Tools**: Capabilities that can be used (workspace objects)
- **Experiments**: Work in progress, explorations, tests
- **Thoughts**: Notes, ideas, philosophy

Not "services" or "pages" or "sections."

---

## 1. Content Philosophy

### How TPZ Content is Thought Of

**Content as materials**:

- **Workspace Objects**: Tools on the desk (camera, waveform, blueprint, etc.)
- **Projects**: Completed work, artifacts that demonstrate capability
- **Experiments**: Explorations, work-in-progress, tests
- **Courses**: Educational materials, workshops, knowledge sharing
- **Notes**: Thoughts, philosophy, process documentation

**Why this avoids the "what do you do?" problem**:

- Traditional approach: "We offer services: film, voice, branding..."
- Workspace approach: "Here are the tools we use: camera, microphone, grid..."
- The tools imply capability without listing services
- Versatility is visible, not explained

### How Versatility is Expressed Structurally

**One object, many outputs**:

- A "camera" object (film capability) can link to:
  - Film projects
  - Social media content
  - Video experiments
  - Film-related courses

**Projects can appear under multiple objects**:

- A project might use film + branding + strategy
- It appears in all relevant object panels
- No duplication, just references

**New capabilities are additive**:

- Add a new workspace object
- Link existing projects to it
- No restructuring needed

**Why this works**:

- Structure reflects reality: TPZ does many things
- Content is organized by capability, not category
- Relationships are flexible, not rigid
- Growth is natural, not forced

---

## 2. Core Document Types

### workspaceObject

**Purpose**: Represents a capability or tool in the workspace.

**When it appears**:

- As an interactive object on the canvas
- In the workspace object list (for management)
- When focused/expanded (shows its panel)

**When it does NOT**:

- As a "service page"
- As a standalone route (objects are accessed via workspace routes)
- As marketing content

**Key characteristics**:

- Abstract enough to represent any capability
- Specific enough to be useful
- Links to projects, courses, experiments
- Has visual representation (object type)

### project

**Purpose**: Represents completed work, artifacts, case studies.

**When it appears**:

- In workspace object panels (when object is focused)
- In project archive (all projects)
- In project detail overlay
- As featured work in object panels

**When it does NOT**:

- As a standalone "portfolio page"
- As marketing material
- As a "service example"

**Key characteristics**:

- Can link to multiple workspace objects (film + branding, etc.)
- Has media (video, images)
- Has context (description, credits, process)
- Can be featured or archived

### experiment

**Purpose**: Work-in-progress, explorations, tests, process documentation.

**When it appears**:

- In workspace object panels (optional section)
- As process documentation
- In "behind the scenes" contexts

**When it does NOT**:

- As polished portfolio pieces
- As marketing content
- As primary workspace content (optional)

**Key characteristics**:

- Can be private or public
- Links to workspace objects
- Shows process, not just results
- Can be updated over time

### course

**Purpose**: Educational content, workshops, knowledge sharing.

**When it appears**:

- In workspace object panels (if object has courses)
- In course listings
- In course detail views

**When it does NOT**:

- As a "services" section
- As marketing material

**Key characteristics**:

- Links to workspace objects (which capability does it teach?)
- Has schedule, format (online/offline)
- Has content, materials
- Can be upcoming, active, or archived

### note

**Purpose**: Thoughts, philosophy, process notes, manifesto.

**When it appears**:

- As ambient elements on canvas (intro text, philosophy)
- In workspace object panels (optional)
- As standalone content (if needed)

**When it does NOT**:

- As marketing copy
- As "about us" page content

**Key characteristics**:

- Short, focused thoughts
- Can appear on canvas or in panels
- Not tied to specific objects (or can be)
- Supports the workspace metaphor

### globalSettings

**Purpose**: Site-wide settings, workspace configuration.

**When it appears**:

- Canvas background configuration
- Workspace title/logo
- Contact information
- Social links
- CTA settings

**When it does NOT**:

- As content
- As editable by content editors (admin only)

**Key characteristics**:

- Single document (singleton)
- Controls workspace appearance
- Not part of content workflow

---

## 3. Workspace Object Model (Critical)

### workspaceObject Schema

**Purpose**: The single most important model. Represents a capability or tool in the workspace.

**Why this model exists**:

- Abstracts away "services" or "what we do"
- Represents capabilities as tools
- Flexible enough for any discipline
- Links to all related content

**How it stays abstract but useful**:

- `objectType` determines visual representation
- `capabilities` links to specific projects/courses
- `shortIntent` explains purpose without marketing copy
- Structure is consistent, content is flexible

### Fields

**title** (string, required)

- Name of the capability (e.g., "Film & Social Media")
- Appears as object label on hover
- Not marketing copy, just identification

**slug** (slug, required)

- URL identifier (e.g., "film", "voiceovers", "branding")
- Used in workspace routes (`/workspace/film`)
- Must be unique

**objectType** (string, required)

- Determines visual representation
- Options: `camera`, `waveform`, `blueprint`, `book`, `lightbulb`, `stack`, `envelope`
- Maps to object visual in front-end
- Not user-editable (developer-defined)

**shortIntent** (text, 1-2 lines, optional)

- Brief explanation of what this capability is
- Not marketing copy
- Example: "Film production for social media and digital content"
- Appears in object panel header

**capabilities** (array of references, optional)

- Links to projects that demonstrate this capability
- Links to courses that teach this capability
- Links to experiments related to this capability
- Flexible: can link to any content type

**featuredCapabilities** (array of references, optional)

- Featured projects/courses to highlight in object panel
- Curated selection
- Appears prominently when object is focused

**visibility** (boolean, default: true)

- Whether object appears on canvas
- Allows hiding objects without deleting
- Useful for work-in-progress capabilities

**order** (number, optional)

- Determines object position on canvas
- Lower numbers appear first (or in specific positions)
- Can be manual or automatic

**position** (object, optional)

- Manual canvas positioning
- `x` and `y` coordinates (0-100, percentages)
- Overrides automatic positioning
- Useful for intentional arrangement

**coverImage** (image, optional)

- Visual representation in object panel
- Not required (object type provides default visual)
- Can be custom image if needed

**description** (block content, optional)

- Longer explanation of capability
- Appears in object panel
- Can include process, approach, philosophy
- Not marketing copy

**cta** (object, optional)

- Call-to-action for this object
- `label` and `url`
- Appears in object panel
- Optional (can use global CTA)

### Example workspaceObject

```json
{
  "title": "Film & Social Media",
  "slug": "film",
  "objectType": "camera",
  "shortIntent": "Film production for social media and digital content",
  "capabilities": [
    { "_ref": "project-1" },
    { "_ref": "project-2" },
    { "_ref": "course-film-basics" }
  ],
  "featuredCapabilities": [
    { "_ref": "project-1" }
  ],
  "visibility": true,
  "order": 1,
  "position": { "x": 20, "y": 30 },
  "description": "We create film content for social media platforms..."
}
```

---

## 4. Capability Mapping Strategy

### How One Object Maps to Many Outputs

**Flexible references**:

- `workspaceObject.capabilities` is an array of references
- Can reference: projects, courses, experiments
- No rigid structure, just relationships

**Example**:

- "Camera" object (film capability) links to:
  - 5 film projects
  - 2 social media projects
  - 1 film course
  - 3 experiments

**Why this works**:

- One object, many outputs
- No duplication
- Easy to add/remove links
- Content stays in one place, referenced many times

### How Film / Branding / Courses Coexist

**Separate but connected**:

- Each discipline has its own workspace object
- Objects can share projects (if project uses multiple disciplines)
- Objects can have their own courses
- No hierarchy, just relationships

**Example structure**:
```
workspaceObject: "Camera" (film)
  - capabilities: [film-project-1, film-project-2, film-course]

workspaceObject: "Blueprint" (branding)
  - capabilities: [branding-project-1, branding-project-2, branding-course]

workspaceObject: "Book" (courses)
  - capabilities: [film-course, branding-course, strategy-course]
```

**A project can appear in multiple objects**:

- `project-1` uses film + branding
- Appears in both "Camera" and "Blueprint" object panels
- Single source of truth, multiple references

### How a Project Appears Under Multiple Objects

**Project schema includes**:

- `relatedObjects` (array of references to workspaceObject)
- Project links to objects, not the other way around
- Or: Objects link to projects (current approach)

**Both approaches work**:

1. **Objects link to projects** (current):
   - Object panel shows projects it links to
   - Project detail can show "related objects"
   - Flexible, object-centric

2. **Projects link to objects** (alternative):
   - Project defines which objects it belongs to
   - Object panel queries projects that link to it
   - Flexible, project-centric

**Recommendation**: Use approach 1 (objects link to projects) because:

- Objects are the primary navigation
- Easier to curate what appears in object panels
- Objects control their own content

### Avoiding Duplication

**Single source of truth**:

- Projects exist once
- Referenced by multiple objects
- No copying or duplicating content

**References, not copies**:

- Use Sanity references
- Don't duplicate project data
- Update once, appears everywhere

**Example**:

- `project-1` is a film + branding project
- "Camera" object links to `project-1`
- "Blueprint" object links to `project-1`
- `project-1` exists once, appears in both panels

---

## 5. Editorial Workflow

### How TPZ Adds New Content

**Adding a new project**:

1. Create `project` document
2. Add media, description, credits
3. Link to relevant `workspaceObject` documents (via object's capabilities field)
4. Mark as featured if needed
5. Publish

**Adding a new capability**:

1. Create `workspaceObject` document
2. Set `objectType` (developer-defined, but editor selects)
3. Add `title`, `slug`, `shortIntent`
4. Link to existing projects/courses (via capabilities)
5. Set visibility, order, position
6. Publish

**Adding a new course**:

1. Create `course` document
2. Add course details, schedule, content
3. Link to relevant `workspaceObject` (via object's capabilities)
4. Publish

### How Non-Devs Understand What They're Editing

**Clear labels and descriptions**:

- Field labels explain purpose
- Help text provides context
- Examples show expected format

**Visual organization**:

- Group related fields
- Use tabs/sections if needed
- Show previews when possible

**Workflow guidance**:

- "This object appears on the workspace canvas"
- "This project appears in object panels"
- "This course links to workspace objects"

**Avoid technical jargon**:

- "Workspace object" not "service document"
- "Capability" not "content type"
- "Link to project" not "reference document"

### How Preview Works Conceptually

**Workspace preview**:

- Preview shows workspace canvas
- Objects appear as they will on site
- Clicking object opens panel preview
- Shows how content appears in context

**Panel preview**:

- Shows object panel with content
- Displays linked projects, courses
- Shows how content flows
- Updates in real-time

**Project preview**:

- Shows project detail overlay
- Displays media, description
- Shows related objects
- Updates in real-time

**Why preview matters**:

- Content editors see context
- Understand how content appears
- Can adjust before publishing
- Reduces back-and-forth

---

## 6. Front-End Consumption Strategy

### What the Workspace Loads Initially

**Build time (SSG)**:

- All `workspaceObject` documents (which objects exist)
- Object metadata (title, slug, objectType, position)
- Canvas background configuration (from globalSettings)
- Ambient elements (notes, philosophy)

**Why SSG**:

- Fast initial load
- Workspace structure is stable
- Objects don't change frequently
- SEO-friendly

**Data structure**:

```typescript
{
  objects: WorkspaceObject[],
  background: BackgroundConfig,
  ambientElements: AmbientElement[]
}
```

### What Loads on Object Focus

**Runtime (ISR or client-side)**:

- Object panel content (description, capabilities)
- Featured projects (preview data)
- Course listings (if object has courses)
- Related content

**Why runtime**:

- Content may change frequently
- Only load when needed
- Better performance
- Fresher data

**Data structure**:
```typescript
{
  object: WorkspaceObject,
  featuredProjects: ProjectPreview[],
  courses: CoursePreview[],
  capabilities: CapabilityPreview[]
}
```

### What is Lazy-Loaded

**Project detail**:

- Full project data (when overlay opens)
- Media (images, videos)
- Full description, credits
- Related objects

**Why lazy-load**:

- Project detail is deep content
- Only needed when user opens overlay
- Reduces initial bundle size
- Better performance

**Course detail**:

- Full course content
- Schedule, materials
- Registration info

**Why lazy-load**:

- Course detail is deep content
- Only needed when user navigates to it
- Reduces initial bundle size

### What is Cached

**Workspace structure**:

- Object list, positions
- Canvas configuration
- Cached at build time, revalidated periodically

**Object panel content**:

- Cached per object
- Revalidated on-demand or periodically
- ISR (Incremental Static Regeneration)

**Project detail**:

- Cached per project
- Revalidated on-demand
- ISR or client-side cache

**Why cache**:

- Faster subsequent loads
- Reduced Sanity API calls
- Better performance
- Cost-effective

---

## 7. Future-Proofing

### How New Disciplines Can Be Added

**Add new workspace object**:

1. Create `workspaceObject` document
2. Set `objectType` (may need new type, but structure stays same)
3. Link to existing projects/courses
4. Set position, visibility
5. Publish

**No schema changes needed**:

- `workspaceObject` schema is flexible
- New `objectType` values are just strings
- Front-end handles new types
- No migration needed

**Example**:

- TPZ starts doing "3D animation"
- Create `workspaceObject` with `objectType: "cube"` (or new type)
- Link to 3D projects
- Appears on canvas immediately

### How the System Avoids Refactors

**Abstract schemas**:

- `workspaceObject` doesn't specify "film" or "branding"
- It's a generic capability model
- New disciplines fit existing structure

**Flexible references**:

- Objects link to projects, not specific project types
- Projects can be anything
- No rigid taxonomies

**Extensible fields**:

- Optional fields can be added
- New content types can be added
- Existing content doesn't break

**Example**:

- Add `experiment` document type
- `workspaceObject.capabilities` can reference experiments
- No changes to existing objects or projects
- System grows naturally

### How "We Do Something New" Fits Naturally

**Additive, not restructuring**:

- New capability = new workspace object
- Link to existing projects if relevant
- Or create new projects
- No "where does this go?" question

**Example workflow**:

1. TPZ starts offering "podcast production"
2. Create `workspaceObject`: "Podcast Production" (`objectType: "microphone"`)
3. Link to existing audio projects if relevant
4. Create new podcast projects
5. Object appears on canvas
6. Content flows naturally

**Why this works**:

- Structure is capability-based, not category-based
- New capabilities are just new objects
- No restructuring of existing content
- Growth is natural

---

## Schema Implementation Notes

### workspaceObject Schema Structure

```typescript
{
  name: 'workspaceObject',
  title: 'Workspace Object',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', required: true },
    { name: 'slug', type: 'slug', required: true },
    { name: 'objectType', type: 'string', required: true, options: { list: [...] } },
    { name: 'shortIntent', type: 'text', rows: 2 },
    { name: 'capabilities', type: 'array', of: [{ type: 'reference', to: [...] }] },
    { name: 'featuredCapabilities', type: 'array', of: [{ type: 'reference', to: [...] }] },
    { name: 'visibility', type: 'boolean', initialValue: true },
    { name: 'order', type: 'number' },
    { name: 'position', type: 'object', fields: [{ name: 'x', type: 'number' }, { name: 'y', type: 'number' }] },
    { name: 'coverImage', type: 'image' },
    { name: 'description', type: 'array', of: [{ type: 'block' }] },
    { name: 'cta', type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'url', type: 'url' }] }
  ]
}
```

### Project Schema Updates

**Add `relatedObjects` field** (optional, for reverse lookup):

```typescript
{
  name: 'relatedObjects',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'workspaceObject' }] }],
  description: 'Workspace objects this project relates to (optional, objects can also link to projects)'
}
```

**Keep existing fields**:

- title, slug, coverImage, excerpt, video, categories, credits, body, featured

**Categories can map to objects**:

- `project.categories` can include object slugs
- Front-end can use this for filtering
- But primary relationship is via object capabilities

---

## Summary

**Content Philosophy**:

- Content = materials on a creative desk
- Not "services" or "pages"
- Versatility is structural, not explained

**Core Models**:

- `workspaceObject`: Capabilities as tools
- `project`: Artifacts, completed work
- `course`: Educational content
- `experiment`: Work-in-progress
- `note`: Thoughts, philosophy
- `globalSettings`: Workspace configuration

**Key Strategy**:

- Objects link to projects (flexible references)
- Projects can appear under multiple objects
- No duplication, single source of truth
- Growth is additive, not restructuring

**Future-Proof**:

- New disciplines = new workspace objects
- No schema changes needed
- System grows naturally
- No "where does this go?" questions

**Editorial Workflow**:

- Clear labels and descriptions
- Visual organization
- Preview in context
- Non-technical friendly

**Front-End Strategy**:

- SSG for workspace structure
- Runtime for panel content
- Lazy-load for deep content
- Cache for performance

---

*This document defines the content model. Sanity schema implementation will follow, ensuring it matches this specification.*
