"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/auth-provider";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { uploadImageAndGetURL } from "@/lib/storage/image-service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Upload, X, Check, Loader2, User } from "lucide-react";
import Image from "next/image";

export function ProfilePhotoSection() {
    const { user } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<"choice" | "camera" | "preview">("choice");
    const [loading, setLoading] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = async () => {
        setMode("camera");
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Could not access camera. Please check permissions.");
            setMode("choice");
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    }, [stream]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg");
                setCapturedImage(dataUrl);
                setMode("preview");
                stopCamera();
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result as string);
                setMode("preview");
            };
            reader.readAsDataURL(file);
        }
    };

    const savePhoto = async () => {
        if (!capturedImage || !user) return;
        setLoading(true);
        setError(null);

        try {
            // Convert dataURL to Blob
            const response = await fetch(capturedImage);
            const blob = await response.blob();

            // Upload to Firebase Storage
            const path = `users/${user.uid}/profile_${Date.now()}.jpg`;
            const photoURL = await uploadImageAndGetURL(blob, user.uid, undefined, path);

            // Update Auth Profile
            await updateProfile(user, { photoURL });

            // Update Firestore Profile
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { photoURL });

            // Force token refresh to update server-side session
            await user.getIdToken(true);

            // Wait a brief moment for the cookie to be set by onIdTokenChanged
            await new Promise(resolve => setTimeout(resolve, 500));

            setIsOpen(false);
            setMode("choice");
            setCapturedImage(null);

            // Refresh the page to get updated server-side session data
            router.refresh();
        } catch (err) {
            console.error("Save error:", err);
            setError("Failed to save photo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            stopCamera();
            setMode("choice");
            setCapturedImage(null);
            setError(null);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-emerald-100 bg-emerald-50 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 duration-300">
                    {user?.photoURL ? (
                        <Image
                            src={user.photoURL}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="h-16 w-16 text-emerald-200" />
                    )}
                </div>
                <Dialog open={isOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg border-2 border-white bg-card hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                        >
                            <Camera className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card border-0 shadow-2xl rounded-3xl overflow-hidden">
                        <DialogHeader className="p-6 pb-0">
                            <DialogTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Update Photo</DialogTitle>
                            <DialogDescription className="text-muted-foreground font-medium">Choose a method to update your profile picture.</DialogDescription>
                        </DialogHeader>

                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                                    <X className="h-4 w-4" /> {error}
                                </div>
                            )}

                            {mode === "choice" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-3xl border-2 border-dashed border-border hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <Upload className="h-7 w-7 text-slate-400 group-hover:text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-black text-foreground uppercase tracking-widest">Upload</span>
                                    </button>
                                    <button
                                        onClick={startCamera}
                                        className="flex flex-col items-center justify-center gap-3 p-8 rounded-3xl border-2 border-dashed border-border hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                            <Camera className="h-7 w-7 text-slate-400 group-hover:text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-black text-foreground uppercase tracking-widest">Camera</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            )}

                            {mode === "camera" && (
                                <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border-4 border-border shadow-inner">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                                        <Button
                                            onClick={() => { stopCamera(); setMode("choice"); }}
                                            variant="secondary"
                                            className="rounded-full bg-card/20 backdrop-blur-md text-white border-white/30 hover:bg-card/30"
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            onClick={capturePhoto}
                                            className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 border-4 border-white"
                                        >
                                            <div className="h-6 w-6 rounded-full border-2 border-white" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {mode === "preview" && capturedImage && (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative h-64 w-64 rounded-3xl overflow-hidden border-4 border-border shadow-2xl">
                                        <Image
                                            src={capturedImage}
                                            alt="Captured"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex gap-4 w-full">
                                        <Button
                                            onClick={() => { 
                                                setCapturedImage(null); 
                                                if (mode === 'camera') {
                                                    startCamera();
                                                } else {
                                                    setMode("choice");
                                                }
                                            }}
                                            variant="outline"
                                            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs border-border hover:bg-muted/50"
                                            disabled={loading}
                                        >
                                            Retake
                                        </Button>
                                        <Button
                                            onClick={savePhoto}
                                            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
                                            {loading ? "Saving..." : "Use Photo"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <canvas ref={canvasRef} className="hidden" />
                    </DialogContent>
                </Dialog>
            </div>
            <p className="text-sm font-bold text-foreground">{user?.displayName || "Profile Photo"}</p>
        </div>
    );
}
