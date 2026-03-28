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

    if (!session) {
        redirect("/auth/login");
    }

    if (session.user.role !== 'ADMIN') {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
