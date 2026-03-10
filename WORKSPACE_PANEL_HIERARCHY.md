# TPZ Studio: Panel & Content Hierarchy

## Principle

Panels are depth, not navigation. They expand from the workspace to reveal information. If a panel feels like a page, the system has failed.

---

## Panel Types

| Type | Route | Content Source | Purpose |
|------|-------|---------------|---------|
| `service` | `/{objectSlug}` | `/api/workspace-object/[slug]` (client fetch) | Capability details |
| `archive` | `/proyectos` | Server-rendered children | Project listing |
| `contact` | (unused as panel) | -- | Contact is now FAB drawer |
| `about` | (unused as panel) | -- | About is now FAB drawer |

### Service Panel Content

Fetched via `getWorkspaceObject(slug)` which returns `WorkspaceObjectContent`:

| Field | Display |
|-------|---------|
| `visual` | 40x40 icon-sized image |
| `title` | Heading (Lacquer font, clamp 1.5-2rem) |
| `shortIntent` | 1-2 sentence intent statement |
| `description` | Portable text body paragraphs |
| `capabilities` | Related projects list (links to `/proyectos/[slug]`) |
| `showThumbnails` | Toggle: thumbnail+title+excerpt vs title-only links |
| `relatedPosts` | Related blog posts (links to `/blog/[slug]`) |

### Content Layers

1. **Immediate** (no scroll needed): visual + title + shortIntent
2. **Expanded** (scrollable): description + related projects + related posts
3. **Exit points** (links only): project detail overlays, blog posts

---

## FAB Drawers (Contact & About)

Contact and about are **not** panels. They are FAB drawers managed by `FloatingActionButtons`.

### Contact Drawer

- Fetches from `/api/fab-content/contact`
- Content: intro text, contact form (name/email/message), phone, social links
- Form submits to `/api/contact/send`
- All content sourced from Sanity

### About Drawer

- Fetches from `/api/fab-content/about`
- Content: image, PortableText body, CTA button
- CTA switches to contact drawer (via `onSwitchToContact` callback)

---

## Depth Levels

| Level | What | Canvas State |
|-------|------|-------------|
| 0 | Canvas home | Full opacity, all objects visible |
| 1 | Panel open | Dimmed (0.3-0.4 opacity) |
| 1 | FAB drawer open | Canvas unaffected (FAB overlays independently) |
| 2 | Overlay open | Heavily dimmed |

- No nested panels. Links from panels open overlays or external pages.
- Only one panel open at a time.
- Overlay can open from panel (e.g., project link in service panel).

---

## Panel Styling

- White background (`#ffffff`), black text
- Width: 400px desktop, 100vw mobile
- Fixed right, full height
- Close button: top-right, `x` character
- Padding: `var(--space-3xl) var(--space-xl)`
- Content scrolls internally

---

## Content Constraints

- **Service panels**: Keep scannable (30-60 seconds). Description + featured work + links.
- **Max projects shown**: Determined by Sanity data (no hard limit, but keeps to related items)
- **No video embeds** in panels (videos belong in project overlays)
- **No galleries** (single visual anchor only)
- **No nested navigation** (no tabs, no sub-sections)
- **Links are specific**: "Proyectos" not "Ver mas"

---

## Consistency Rules

All panels share:
- Same width, positioning, close behavior
- Same typography hierarchy (title -> description -> links)
- Same spacing rhythm
- Same open/close animation
- Same dimming behavior
