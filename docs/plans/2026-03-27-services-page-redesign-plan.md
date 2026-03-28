# Services Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the "Our Services" page to be a clean, visual-first experience with immersive cards for core services.

**Architecture:** Use Framer Motion for animations and Tailwind CSS for a modern, responsive layout. Replace the existing bento-grid with a vertical stack of large, image-focused cards for desktop and mobile.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, Lucide Icons.

---

### Task 1: Clean Up Current Page

**Files:**
- Modify: `app/(website)/services/page.tsx`

**Step 1: Simplify Imports and Types**

Update imports to only keep necessary icons and components.
Remove `ServiceCardProps` and `ServiceCard` / `ProcessStep` components as they will be replaced.

```tsx
"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Building2,
  Recycle,
  ArrowRight,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// New Service Item Structure
const services = [
  {
    title: "Residential Collection",
    description: "Smart, on-demand waste pickup for modern households.",
    image: "/images/smart-waste-pickup.png",
    icon: Truck,
    link: "/schedule-pickup",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Commercial Waste",
    description: "Enterprise-grade solutions for hospitals, institutions, and businesses.",
    image: "/images/commercial-waste.png",
    icon: Building2,
    link: "/contact",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Material Recovery",
    description: "Community-focused circular economy and recycling hub.",
    image: "/images/community-engagement.png",
    icon: Recycle,
    link: "/learning-hub",
    color: "from-green-500 to-emerald-600"
  }
];
```

**Step 2: Remove Unnecessary Sections**

Clear out the `ServicesPage` function to prepare for the new layout.

**Step 3: Commit**

```bash
git add app/(website)/services/page.tsx
git commit -m "refactor: simplify services page structure and data"
```

---

### Task 2: Implement New Hero Section

**Files:**
- Modify: `app/(website)/services/page.tsx`

**Step 1: Write Hero Component**

```tsx
const Hero = () => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-white to-transparent -z-10" />
    <div className="max-w-7xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
          Smart solutions for a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
            cleaner tomorrow.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
          We blend intelligent logistics with deep sustainability to solve your waste challenges effortlessly.
        </p>
      </motion.div>
    </div>
  </section>
);
```

**Step 2: Commit**

```bash
git add app/(website)/services/page.tsx
git commit -m "feat: implement simplified hero section for services page"
```

---

### Task 3: Implement Visual Trio Cards

**Files:**
- Modify: `app/(website)/services/page.tsx`

**Step 1: Create ServiceCard Component**

```tsx
const VisualServiceCard = ({ service, index }: { service: any, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 mb-8 last:mb-0"
  >
    {/* Background Image */}
    <div className="absolute inset-0">
      <Image
        src={service.image}
        alt={service.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    </div>

    {/* Content Overlay */}
    <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20`}>
          <service.icon className="w-6 h-6" />
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{service.title}</h3>
      </div>
      
      <p className="text-lg md:text-xl text-white/80 max-w-xl mb-8 font-medium">
        {service.description}
      </p>

      <Link 
        href={service.link}
        className="inline-flex items-center gap-2 text-white font-bold text-lg group/link"
      >
        Explore Solution
        <span className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-emerald-600 transition-all">
          <ArrowUpRight className="w-5 h-5" />
        </span>
      </Link>
    </div>
  </motion.div>
);
```

**Step 2: Assemble Page**

```tsx
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Hero />
      
      <section className="pb-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 gap-8">
          {services.map((service, idx) => (
            <VisualServiceCard key={idx} service={service} index={idx} />
          ))}
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
            Need a custom solution?
          </h2>
          <p className="text-slate-400 text-lg mb-10 relative z-10 max-w-xl mx-auto">
            Our expert team is ready to design a waste management program tailored exactly to your organization's needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all relative z-10"
          >
            Contact Our Team
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/(website)/services/page.tsx
git commit -m "feat: implement visual service cards and simplified CTA"
```

---

### Task 4: Final Validation

**Step 1: Check Responsiveness**

Ensure cards stack correctly on mobile and text remains readable.

**Step 2: Verify Links**

Ensure all "Explore" and "Contact" links point to existing routes.

**Step 3: Build Test**

Run: `pnpm build`
Expected: SUCCESS

**Step 4: Commit**

```bash
git commit --allow-empty -m "vibe: services page redesign complete and verified"
```
