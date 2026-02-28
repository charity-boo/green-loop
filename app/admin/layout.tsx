import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopNav } from '@/components/admin/TopNav';
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    console.log('[AdminLayout] Session check:', session
      ? { uid: session.user.id, email: session.user.email, role: session.user.role }
      : 'no session'
    );

    // Route Protection: Security before cosmetics
    if (!session) {
        console.log('[AdminLayout] No session → redirecting to /auth/login');
        redirect("/auth/login");
    }

    if (session.user.role !== 'ADMIN') {
        console.log('[AdminLayout] Role is not ADMIN (got:', session.user.role, ') → redirecting to /');
        redirect("/");
    }

    console.log('[AdminLayout] Access granted for ADMIN:', session.user.email);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar for Desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
