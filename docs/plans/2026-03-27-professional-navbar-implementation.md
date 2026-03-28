# Professional Innovator Navbar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing navbar into a high-end, professional interface with Mega Menus, Glassmorphism, and a clear "Schedule a Pickup" CTA.

**Architecture:** Component-based approach using specialized sub-components. Leveraging `framer-motion` for layout transitions and `lucide-react` for iconography.

**Tech Stack:** Next.js, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: Define Navigation Data & Icons

**Files:**
- Create: `lib/constants/navigation.ts`

**Step 1: Define the structured data for Mega Menus**
```typescript
import { BookOpen, Video, Layers, Users, MapPin, Leaf, Rocket, ShieldCheck, Briefcase, Handshake } from "lucide-react";

export const ABOUT_US_LINKS = [
  { title: "Who We Are", href: "/about-us", description: "Our mission, vision, and the team behind Green Loop.", icon: Users },
  { title: "Service Areas", href: "/service-areas", description: "Find out where we operate and our expansion plans.", icon: MapPin },
  { title: "Methodology", href: "/about-us/methodology", description: "How we approach sustainable waste management.", icon: Leaf },
  { title: "Tech & Innovation", href: "/about-us/technology-innovation", description: "AI and technology driving our green future.", icon: Rocket },
  { title: "Safety & Compliance", href: "/about-us/safety-compliance", description: "Our commitment to standards and safety.", icon: ShieldCheck },
  { title: "Partnerships", href: "/about-us/partnerships", description: "Collaborating for a cleaner planet.", icon: Handshake },
];

export const LEARNING_HUB_LINKS = [
  { title: "Recycling Guides", href: "/learning-hub/guides", description: "Expert tips for better waste sorting.", icon: BookOpen },
  { title: "Educational Videos", href: "/learning-hub/videos", description: "Watch and learn about sustainability.", icon: Video },
  { title: "Waste Classification", href: "/learning-hub/waste-types", description: "Learn how to identify different waste types.", icon: Layers },
];

export const JOIN_MOVEMENT_LINKS = [
  { title: "Volunteer", href: "/community/volunteer", description: "Join our hands-on green initiatives.", icon: Users },
  { title: "Sponsor a Project", href: "/community/sponsorship", description: "Support local environmental impact.", icon: Handshake },
  { title: "Careers", href: "/community/careers", description: "Build your career with Green Loop.", icon: Briefcase },
];
```

**Step 2: Commit**
```bash
# Since git was not found, we will skip git commands for now or assume environment fix.
```

---

### Task 2: Create the MegaMenu Component

**Files:**
- Create: `components/layout/mega-menu.tsx`

**Step 1: Implement MegaMenu with Framer Motion**
(Code provided in previous turn)

---

### Task 3: Refactor Navbar with Glassmorphism & Logic

**Files:**
- Modify: `components/layout/navbar.tsx`

**Step 1: Add Scroll Listening & Glassmorphism styles**
**Step 2: Replace Dropdowns with MegaMenu components**
**Step 3: Add the "Schedule a Pickup" CTA**

---

### Task 4: Responsive Mobile Drawer

**Files:**
- Modify: `components/layout/navbar.tsx`

---

### Task 5: Verification

**Steps:**
1. Check dark mode.
2. Verify z-index.
3. Test responsiveness.
