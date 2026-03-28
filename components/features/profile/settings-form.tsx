"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-provider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Loader2, AlertCircle, Bell, Shield, Monitor, Scale } from "lucide-react";

interface UserSettings {
    // Notification Preferences
    notifications: {
        pickupReminders: boolean;
        rewardUpdates: boolean;
        eventAnnouncements: boolean;
        greenTips: boolean;
        communityUpdates: boolean;
        emailNotifications: boolean;
    };
    // Privacy
    privacy: {
        profileVisibility: "public" | "private" | "friends";
        showWasteStats: boolean;
        showRewards: boolean;
    };
    // Display
    display: {
        theme: "light" | "dark" | "system";
        compactView: boolean;
    };
    // Waste Tracking
    wasteTracking: {
        defaultUnit: "kg" | "lbs";
        weeklyReminders: boolean;
        monthlyReport: boolean;
    };
}

const DEFAULT_SETTINGS: UserSettings = {
    notifications: {
        pickupReminders: true,
        rewardUpdates: true,
        eventAnnouncements: true,
        greenTips: false,
        communityUpdates: false,
        emailNotifications: true,
    },
    privacy: {
        profileVisibility: "public",
        showWasteStats: true,
        showRewards: true,
    },
    display: {
        theme: "system",
        compactView: false,
    },
    wasteTracking: {
        defaultUnit: "kg",
        weeklyReminders: true,
        monthlyReport: true,
    },
};

export function SettingsForm() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;
        
        try {
            const settingsRef = doc(db, "userSettings", user.uid);
            const settingsDoc = await getDoc(settingsRef);
            
            if (settingsDoc.exists()) {
                setSettings({ ...DEFAULT_SETTINGS, ...settingsDoc.data() });
            }
        } catch (err) {
            console.error("Error loading settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const settingsRef = doc(db, "userSettings", user.uid);
            await setDoc(settingsRef, {
                ...settings,
                updatedAt: new Date().toISOString(),
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Save error:", err);
            setError("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-card">
                <CardContent className="p-8">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/50/50 border-b border-border p-8">
                <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">
                    Preferences & Settings
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                    Customize your Green Loop experience with notifications, privacy, and display options.
                </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
                {/* Notification Preferences */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-xl">
                            <Bell className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-foreground uppercase tracking-tight">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Manage how you receive updates</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pl-2">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Pickup Reminders</Label>
                                <p className="text-xs text-muted-foreground">Get notified before scheduled pickups</p>
                            </div>
                            <Switch
                                checked={settings.notifications.pickupReminders}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, pickupReminders: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Reward Updates</Label>
                                <p className="text-xs text-muted-foreground">Notifications about points and rewards</p>
                            </div>
                            <Switch
                                checked={settings.notifications.rewardUpdates}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, rewardUpdates: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Event Announcements</Label>
                                <p className="text-xs text-muted-foreground">Stay updated on community events</p>
                            </div>
                            <Switch
                                checked={settings.notifications.eventAnnouncements}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, eventAnnouncements: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Green Tips</Label>
                                <p className="text-xs text-muted-foreground">Receive eco-friendly tips and advice</p>
                            </div>
                            <Switch
                                checked={settings.notifications.greenTips}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, greenTips: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Community Updates</Label>
                                <p className="text-xs text-muted-foreground">News from your local community</p>
                            </div>
                            <Switch
                                checked={settings.notifications.communityUpdates}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, communityUpdates: checked }
                                    }))
                                }
                            />
                        </div>

                        <Separator className="my-2" />

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Email Notifications</Label>
                                <p className="text-xs text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Switch
                                checked={settings.notifications.emailNotifications}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        notifications: { ...prev.notifications, emailNotifications: checked }
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Privacy Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <Shield className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-foreground uppercase tracking-tight">Privacy</h3>
                            <p className="text-sm text-muted-foreground">Control your data visibility</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pl-2">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Profile Visibility</Label>
                            <Select 
                                value={settings.privacy.profileVisibility} 
                                onValueChange={(value: "public" | "private" | "friends") => setSettings(prev => ({ 
                                    ...prev, 
                                    privacy: { ...prev.privacy, profileVisibility: value }
                                }))}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public - Everyone can see</SelectItem>
                                    <SelectItem value="friends">Friends Only</SelectItem>
                                    <SelectItem value="private">Private - Only me</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Show Waste Statistics</Label>
                                <p className="text-xs text-muted-foreground">Display your recycling stats publicly</p>
                            </div>
                            <Switch
                                checked={settings.privacy.showWasteStats}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        privacy: { ...prev.privacy, showWasteStats: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Show Rewards</Label>
                                <p className="text-xs text-muted-foreground">Display your points and badges</p>
                            </div>
                            <Switch
                                checked={settings.privacy.showRewards}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        privacy: { ...prev.privacy, showRewards: checked }
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Display Preferences */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <Monitor className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-foreground uppercase tracking-tight">Display</h3>
                            <p className="text-sm text-muted-foreground">Customize your viewing experience</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pl-2">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Theme</Label>
                            <Select 
                                value={settings.display.theme} 
                                onValueChange={(value: "light" | "dark" | "system") => setSettings(prev => ({ 
                                    ...prev, 
                                    display: { ...prev.display, theme: value }
                                }))}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light Mode</SelectItem>
                                    <SelectItem value="dark">Dark Mode</SelectItem>
                                    <SelectItem value="system">System Default</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Compact View</Label>
                                <p className="text-xs text-muted-foreground">Use condensed layout for lists</p>
                            </div>
                            <Switch
                                checked={settings.display.compactView}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        display: { ...prev.display, compactView: checked }
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Waste Tracking Preferences */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-xl">
                            <Scale className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-foreground uppercase tracking-tight">Waste Tracking</h3>
                            <p className="text-sm text-muted-foreground">Configure tracking preferences</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pl-2">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Default Unit</Label>
                            <Select 
                                value={settings.wasteTracking.defaultUnit} 
                                onValueChange={(value: "kg" | "lbs") => setSettings(prev => ({ 
                                    ...prev, 
                                    wasteTracking: { ...prev.wasteTracking, defaultUnit: value }
                                }))}
                            >
                                <SelectTrigger className="h-12 rounded-2xl border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Weekly Reminders</Label>
                                <p className="text-xs text-muted-foreground">Get reminders to log waste data</p>
                            </div>
                            <Switch
                                checked={settings.wasteTracking.weeklyReminders}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        wasteTracking: { ...prev.wasteTracking, weeklyReminders: checked }
                                    }))
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50/50 hover:bg-muted/50 transition-colors">
                            <div className="space-y-0.5">
                                <Label className="font-bold text-slate-700">Monthly Report</Label>
                                <p className="text-xs text-muted-foreground">Receive monthly impact summary</p>
                            </div>
                            <Switch
                                checked={settings.wasteTracking.monthlyReport}
                                onCheckedChange={(checked) => 
                                    setSettings(prev => ({
                                        ...prev,
                                        wasteTracking: { ...prev.wasteTracking, monthlyReport: checked }
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" /> {error}
                    </div>
                )}
            </CardContent>
            
            <div className="p-8 pt-0 bg-background">
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : success ? (
                        <><Check className="h-5 w-5 mr-2" /> Saved Successfully</>
                    ) : (
                        "Save All Settings"
                    )}
                </Button>
            </div>
        </Card>
    );
}
