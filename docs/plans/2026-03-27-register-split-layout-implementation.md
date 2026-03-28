# Modern Split-Layout Registration Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the registration page into a 50/50 split layout with a nature-themed visual on the left and a minimalist form on the right.

**Architecture:** Use a full-height Flexbox/Grid layout. The left side will be a fixed-position visual section on desktop, while the right side will be a scrollable form section.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide-react, Firebase Auth/Firestore.

---

### Task 1: Update Page Structure & Layout

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Step 1: Replace existing centered card with split layout structure**

```tsx
// Inside RegisterPage component return:
<div className="flex flex-col lg:flex-row min-h-screen bg-background">
  {/* Left Side: Visual Mission (Desktop only, hidden on mobile) */}
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
    <div 
      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
      style={{ backgroundImage: "url('/images/sustainablity.png')" }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="relative z-10 flex flex-col justify-end p-12 text-white">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">
        Join the Green Revolution
      </h1>
      <p className="text-xl text-gray-200 max-w-md">
        Manage your waste, earn rewards, and save the planet. Join Green Loop today.
      </p>
    </div>
  </div>

  {/* Right Side: Registration Form */}
  <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h2>
        <p className="mt-2 text-muted-foreground">
          Join Green Loop today and start managing your waste smarter.
        </p>
      </div>
      
      {/* Form goes here... */}
    </div>
  </div>
</div>
```

**Step 2: Verify Layout**

Run: `npm run dev` (manually check in browser)
Expected: A 50/50 split on desktop, full-width on mobile.

---

### Task 2: Refactor Form Elements to Minimalist Style

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Step 1: Update Input and Label styling**

```tsx
{/* Example for Name Input */}
<div className="space-y-2">
  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
  <Input
    id="name"
    type="text"
    required
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="John Doe"
    className="h-12 bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-green-600"
  />
</div>
```

**Step 2: Update Primary Button styling**

```tsx
<Button
  type="submit"
  disabled={loading}
  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
>
  {loading ? "Registering..." : "Register Account"}
</Button>
```

**Step 3: Verify Visuals**

Expected: Inputs look clean and modern with subtle green focus rings.

---

### Task 3: Restore & Test Registration Logic

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Step 1: Ensure all hooks (useAuth, useRouter) and state (name, email, etc.) are correctly wired to the new JSX**

**Step 2: Test User Registration flow**

1. Enter valid details for a regular USER.
2. Click "Register Account".
3. Verify redirection to `/dashboard`.

**Step 4: Test Collector Registration flow**

1. Select "Waste Collector" role.
2. Verify County and Region selectors appear and work.
3. Register and verify redirection to `/dashboard`.

---

### Task 4: Responsive Design Polishing

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Step 1: Add a smaller hero image for mobile screens**

```tsx
{/* Mobile Hero (visible only on small screens) */}
<div className="lg:hidden w-full h-48 relative">
  <div 
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/sustainablity.png')" }}
  />
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <h1 className="text-2xl font-bold text-white">Join Green Loop</h1>
  </div>
</div>
```

**Step 2: Verify Responsiveness**

Expected: On mobile, the hero image is at the top, followed by the form. On desktop, it's a 50/50 split.
