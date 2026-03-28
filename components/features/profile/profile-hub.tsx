"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountForm } from "./account-form";
import { PasswordForm } from "./password-form";
import { SettingsForm } from "./settings-form";
import { User, Shield, Settings as SettingsIcon } from "lucide-react";

export function ProfileHub() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTab = searchParams.get("tab") || "account";

    const handleTabChange = (value: string) => {
        router.push(`/profile?tab=${value}`);
    };

    return (
        <div className="space-y-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and security.</p>
            </div>

            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Account
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" /> Settings
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Security
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                    <AccountForm />
                </TabsContent>

                <TabsContent value="settings">
                    <SettingsForm />
                </TabsContent>
                
                <TabsContent value="security">
                    <PasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
