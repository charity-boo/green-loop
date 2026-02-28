# Always-Expanded Sidebar Design

**Date:** 2026-02-27  
**Scope:** User and Collector dashboards

## Problem
The `SidebarNav` starts collapsed (64px, icons only). Text labels are hidden unless the user manually expands it via a toggle button.

## Decision
Make the sidebar always expanded at 240px with icons and labels always visible. Remove the collapse toggle entirely.

## Changes
- `components/dashboard/sidebar-nav.tsx`: Remove `useState`, toggle button, `ChevronLeft/ChevronRight`, and `AnimatePresence` wrappers. Render at fixed 240px always.
- `app/(website)/dashboard/layout.tsx`: Update `pl-16` → `pl-60` to match expanded sidebar width.
