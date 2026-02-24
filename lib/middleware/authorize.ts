import { Role, AuthSession } from "@/lib/auth";

/**
 * Server-side authorization guard.
 */
export async function authorize(
    session: AuthSession | null,
    roles: Role[]
): Promise<void> {
    if (!session) throw new Error("Unauthorized");
    if (!roles.includes(session.user.role)) throw new Error("Forbidden");
}
