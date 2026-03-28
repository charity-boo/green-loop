"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

export function PasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/50/50 border-b border-border p-8">
                <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Security Settings</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                    Manage your account security and authentication methods.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700">
                    <Shield className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wide">Password updates require a recent login for security.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword" title="Current Password" />
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                className="pl-11 pr-10 h-12 rounded-2xl border-border"
                                placeholder="Current Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" title="New Password" />
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                className="pl-11 pr-10 h-12 rounded-2xl border-border"
                                placeholder="New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" title="Confirm Password" />
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className="pl-11 pr-10 h-12 rounded-2xl border-border"
                                placeholder="Confirm New Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 bg-background">
                <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-[0.98]">
                    Update Security Credentials
                </Button>
            </CardFooter>
        </Card>
    );
}
