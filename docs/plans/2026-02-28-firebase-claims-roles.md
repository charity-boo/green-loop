# Firebase Claims Role-Based Access Control

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix and strengthen role-based access control across the admin, collector, and user dashboards using Firebase custom claims.

**Architecture:** Firebase custom claims store `{ role: 'admin' | 'collector' | 'user' }` (lowercase). The server-side `getSession()` in `lib/auth.ts` verifies the Firebase ID token and reads this claim, but currently does NOT normalize the case — so `'admin'` never matches `'ADMIN'`. The fix normalizes claims to uppercase at the point of deserialization. The `middleware.ts` only checks token presence; it is upgraded to decode the JWT payload (without verification) to enforce role-based redirects at the edge.

**Tech Stack:** Next.js 14 App Router, Firebase Admin SDK, Firebase client SDK, TypeScript

---

## Background: What Already Works

- `lib/auth.ts` -> `getSession()` verifies Firebase ID token with Admin SDK and reads `decodedToken.role`
- `app/admin/layout.tsx` -> checks `session.user.role !== 'ADMIN'` (broken only because of case mismatch)
- `app/(website)/dashboard/layout.tsx` -> differentiates USER / COLLECTOR / ADMIN
- `context/auth-provider.tsx` -> reads claims from `idTokenResult.claims.role` and sets cookie
- `authorize()` in `lib/middleware/authorize.ts` -> checks role against array

## Root Cause

Firebase claims use **lowercase**: `{ role: 'admin' }`. App compares against **uppercase**: `'ADMIN'`.

In `lib/auth.ts:64`:
```
const resolvedRole = (decodedToken.role as Role) || 'USER';
// Runtime: 'admin' as Role => still 'admin', never matches 'ADMIN'
```

---

## Task 1: Normalize Role Case in getSession()

**Files:**
- Modify: `lib/auth.ts:64`

**Problem:** `decodedToken.role` is `'admin' | 'collector' | 'user'` (lowercase from Firebase). App expects uppercase `'ADMIN' | 'COLLECTOR' | 'USER'`.

**Step 1: Apply the fix**

In `lib/auth.ts`, change line 64 from:
```ts
const resolvedRole = (decodedToken.role as Role) || 'USER';
```
To:
```ts
const resolvedRole = (decodedToken.role?.toUpperCase() as Role) || 'USER';
```

**Step 2: Verify**

The existing log on lines 65-73 already prints `resolvedRole`. After this change, a user with `role: 'admin'` in Firebase claims should show `resolvedRole: 'ADMIN'` in server logs.

**Step 3: Commit**

```bash
git add lib/auth.ts
git commit -m "fix: normalize Firebase role claim to uppercase in getSession()

Firebase custom claims store role as lowercase ('admin', 'collector', 'user').
App Role type and all comparisons use uppercase ('ADMIN', 'COLLECTOR', 'USER').
Normalize with toUpperCase() at deserialization point.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Upgrade Middleware to Enforce Role-Based Route Protection

**Files:**
- Modify: `middleware.ts`

**Problem:** The middleware only checks if a `firebase-token` cookie exists. Anyone with any valid token can reach `/admin/*` until the layout renders and redirects. We can do better at the edge by decoding the JWT payload (base64) to extract the `role` claim without needing the Admin SDK.

> **Security note:** Decoding without verification is safe here because:
> 1. It is used only for routing UX (the real security check happens in layout and API handlers via `getSession()` with full Admin SDK verification)
> 2. Tampering with the JWT payload would break the signature and fail the Admin SDK check in `getSession()`

**Step 1: Add a JWT payload decoder utility**

Add a helper function at the top of `middleware.ts` that decodes the base64url-encoded payload from a JWT without verification:

```ts
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
```

Note: `atob` is available in the Next.js Edge runtime.

**Step 2: Replace the middleware body**

Replace the current `middleware` function with role-aware logic:

```ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("firebase-token")?.value;
  const { pathname } = request.nextUrl;

  console.log('[Middleware] Request:', pathname, '| Has token:', !!token);

  const isProtectedRoute = [
    "/dashboard",
    "/schedule-pickup",
    "/api/waste",
    "/api/admin",
    "/admin",
    "/api/collector",
  ].some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) return NextResponse.next();

  // No token at all -> redirect/401
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Decode (without verifying) to extract role for routing
  const claims = decodeJwtPayload(token);
  const role = (claims?.role as string | undefined)?.toUpperCase() ?? 'USER';

  console.log('[Middleware] Decoded role from token:', role, 'for path:', pathname);

  // Admin routes: require ADMIN
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (role !== 'ADMIN') {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Collector API routes: require COLLECTOR or ADMIN
  if (pathname.startsWith("/api/collector")) {
    if (role !== 'COLLECTOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}
```

**Step 3: Update the matcher to include collector routes**

```ts
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/schedule-pickup/:path*",
    "/schedule-pickup",
    "/api/waste/:path*",
    "/api/admin/:path*",
    "/api/collector/:path*",
    "/admin/:path*",
  ],
};
```

**Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: add role-based route protection in Edge middleware

Decode JWT payload (without verification) to extract Firebase role claim.
Admin routes (/admin/*, /api/admin/*) require ADMIN role.
Collector API routes (/api/collector/*) require COLLECTOR or ADMIN.
Real security enforcement remains in layout.tsx and API route handlers
via getSession() with full Firebase Admin SDK token verification.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Normalize Role in Auth Provider (Client-Side Consistency)

**Files:**
- Modify: `context/auth-provider.tsx:57`

**Problem:** The client-side `role` state is stored as lowercase (e.g., `'admin'`) because it comes directly from `idTokenResult.claims.role`. This inconsistency with the server-side uppercase convention could cause bugs in client-side role checks.

**Step 1: Uppercase the role in the auth provider**

In `context/auth-provider.tsx`, change the line that sets `role` from:
```ts
setRole(userRole || 'USER');
```
To:
```ts
setRole(userRole?.toUpperCase() || 'USER');
```

**Step 2: Commit**

```bash
git add context/auth-provider.tsx
git commit -m "fix: normalize Firebase role claim to uppercase in auth provider

Ensures client-side role state is uppercase ('ADMIN', 'COLLECTOR', 'USER')
matching server-side Role type convention.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Verify End-to-End with Manual Testing

**Checklist:**

1. **Admin user** (Firebase claim `{ role: 'admin' }`):
   - [ ] Can access `/admin/dashboard`
   - [ ] Is NOT redirected to `/`
   - [ ] `/api/admin/users` returns data (not 403)

2. **Collector user** (Firebase claim `{ role: 'collector' }`):
   - [ ] Accessing `/admin/dashboard` redirects to `/`
   - [ ] Can access `/dashboard` (collector view)
   - [ ] `/api/collector/tasks` returns data (not 403)

3. **Regular user** (Firebase claim `{ role: 'user' }` or no role):
   - [ ] Accessing `/admin/dashboard` redirects to `/`
   - [ ] Can access `/dashboard` (user view)
   - [ ] `/api/collector/tasks` returns 403

4. **Unauthenticated**:
   - [ ] Accessing `/admin/dashboard` redirects to `/auth/login`
   - [ ] `/api/admin/users` returns 401

---

## Summary of Changed Files

| File | Change |
|------|--------|
| `lib/auth.ts` | Add `.toUpperCase()` when reading `decodedToken.role` |
| `middleware.ts` | Add JWT payload decoder + role-based routing logic |
| `context/auth-provider.tsx` | Add `.toUpperCase()` when setting client role state |

