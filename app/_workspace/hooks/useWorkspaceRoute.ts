'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useWorkspace } from '../WorkspaceProvider'

/**
 * useWorkspaceRoute
 * 
 * Route-to-state synchronization hook.
 * 
 * Responsibilities:
 * - Reads current route
 * - Updates workspace state based on route
 * - Handles deep-linking to objects/panels/overlays
 * 
 * Route patterns:
 * - /workspace → canvas home (no panel/overlay)
 * - /workspace/[objectSlug] → object expanded (panel open)
 * - /workspace/projects → project archive (panel open)
 * - /workspace/projects/[slug] → project detail (overlay open)
 * - /workspace/contact → contact panel (panel open)
 */
export function useWorkspaceRoute() {
  const pathname = usePathname()
  const { state, actions } = useWorkspace()
  const lastPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // Prevent re-running for the same pathname
    if (lastPathnameRef.current === pathname) {
      return
    }
    lastPathnameRef.current = pathname

    // Parse route and update workspace state
    if (pathname === '/workspace') {
      // Canvas home - close all panels/overlays
      if (state.panelOpen) actions.closePanel()
      if (state.overlayOpen) actions.closeOverlay()
      if (state.focusedObject !== null) actions.setFocusedObject(null)
    } else if (pathname.startsWith('/workspace/projects/')) {
      // Project detail - open overlay
      const slug = pathname.split('/workspace/projects/')[1]
      if (state.overlaySlug !== slug || !state.overlayOpen || state.overlayType !== 'project') {
        actions.openOverlay('project', slug)
      }
    } else if (pathname === '/workspace/projects') {
      // Project archive - open panel
      if (!state.panelOpen || state.panelType !== 'archive') {
        actions.openPanel('archive')
      }
    } else if (pathname === '/workspace/contact') {
      // Contact - open panel
      if (!state.panelOpen || state.panelType !== 'contact') {
        actions.openPanel('contact')
      }
    } else if (pathname.startsWith('/workspace/')) {
      // Object expanded - open panel for object
      const slug = pathname.split('/workspace/')[1]
      if (state.panelSlug !== slug || !state.panelOpen || state.panelType !== 'service') {
        actions.setFocusedObject(slug)
        actions.openPanel('service', slug)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, actions])
}
