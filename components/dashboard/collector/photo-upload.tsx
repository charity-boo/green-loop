'use client';

import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Image as ImageIcon, CheckCircle2, Loader2, X, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
    jobId: string;
    type: 'before' | 'after';
    onUploadComplete: (url: string) => void;
    label: string;
}

export function PhotoUpload({ jobId, type, onUploadComplete, label }: PhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        uploadFile(file);
    };

    const uploadFile = (file: File) => {
        if (!storage) {
            console.error("Storage not initialized");
            return;
        }

        setUploading(true);
        setProgress(0);

        const storageRef = ref(storage, `collections/${jobId}/${type}_${Date.now()}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error) => {
                console.error('Upload failed:', error);
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setUploadedUrl(downloadURL);
                setUploading(false);
                onUploadComplete(downloadURL);
            }
        );
    };

    const reset = () => {
        setPreview(null);
        setUploadedUrl(null);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em]">{label}</label>
                {uploadedUrl && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-[#10b981] rounded-full text-[10px] font-black tracking-widest"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        SECURED
                    </motion.div>
                )}
            </div>

            <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="hidden"
                    disabled={uploading}
                />

                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.button
                            key="capture"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full aspect-video rounded-3xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                        >
                            <div className="p-5 bg-emerald-500/20 rounded-full group-hover:scale-110 transition-transform relative z-10 text-[#10b981]">
                                <Camera className="w-10 h-10" />
                            </div>
                            <span className="text-[#10b981] font-black text-sm uppercase tracking-widest relative z-10 italic">Capture Visual Proof</span>
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                        </motion.button>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-800/20 shadow-2xl"
                        >
                            <Image
                                src={preview}
                                alt={label}
                                fill
                                className="object-cover"
                            />

                            {uploading && (
                                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-10">
                                    <div className="relative mb-6">
                                        <Loader2 className="w-12 h-12 text-[#10b981] animate-spin" />
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-[#10b981] blur-2xl rounded-full"
                                        />
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            className="h-full bg-[#10b981]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] tabular-nums">SYNCING DATA {Math.round(progress)}%</p>
                                </div>
                            )}

                            {!uploading && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <button
                                        onClick={reset}
                                        className="flex items-center gap-3 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Discard & Retake
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
