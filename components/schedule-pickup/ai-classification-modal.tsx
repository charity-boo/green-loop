"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon, UploadIcon, Cross1Icon, CheckIcon, ResetIcon } from "@radix-ui/react-icons";
import type { ClassificationResult } from "@/lib/ai/gemini";
import { useAuth } from "@/hooks/use-auth";
import { uploadImageAndGetURL } from "@/lib/storage/image-service";
import { classifyImageElement } from "@/lib/ai/classification-service";

interface AIClassificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (wasteType: string, aiSuggestedType: string, aiConfidence: number, aiPhotoUsed: boolean, disposalTips: string, imageUrl?: string) => void;
  onOverride: () => void;
}

/**
 * Converts a data URL to a Blob.
 */
function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export default function AIClassificationModal({ isOpen, onClose, onAccept, onOverride }: AIClassificationModalProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoTaken, setPhotoTaken] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<ClassificationResult | null>(null);
  const [mode, setMode] = useState<"choice" | "camera" | "preview" | "result">("choice");

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Prefer back camera on mobile
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setMode("camera");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions or use file upload.");
      setMode("choice");
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.8);
        setPhotoTaken(imageData);
        setMode("preview");
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoTaken(e.target?.result as string);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClassify = async () => {
    if (!photoTaken) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Try Gemini Cloud API first (Smartest)
      const res = await fetch('/api/waste/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: photoTaken }),
      });
      
      if (res.ok) {
        const result: ClassificationResult = await res.json();
        setAiSuggestion(result);
        setMode("result");
        return;
      }
      
      // If we're here, Gemini failed (429, 502, etc.)
      console.warn("Gemini classification failed, falling back to local AI...");
      
      // 2. Fallback to Local Browser-Based AI (Transformers.js)
      const localResult = await classifyImageElement(photoTaken);
      
      // Map local result to the expected Gemini-like structure
      setAiSuggestion({
        detectedItem: localResult.detectedItem,
        wasteCategory: localResult.wasteCategory,
        formValue: localResult.formValue as any,
        probability: localResult.probability,
        disposalTips: localResult.disposalTips,
        didYouKnow: localResult.didYouKnow
      });
      setMode("result");

    } catch (err: unknown) {
      console.error("All AI classification methods failed:", err);
      setError("AI classification failed. Please try again or select waste type manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (aiSuggestion && photoTaken) {
      setLoading(true);
      let imageUrl: string | undefined;

      try {
        if (user?.id) {
          const imageBlob = dataURLtoBlob(photoTaken);
          imageUrl = await uploadImageAndGetURL(imageBlob, user.id);
        }
        
        onAccept(
          aiSuggestion.formValue,
          aiSuggestion.wasteCategory,
          aiSuggestion.probability,
          selectedFile === null,
          aiSuggestion.disposalTips,
          imageUrl
        );
        handleCloseModal();
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Failed to upload the waste photo. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    stopCamera();
    setPhotoTaken(null);
    setSelectedFile(null);
    setAiSuggestion(null);
    setError(null);
    setMode("choice");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-black border-none sm:rounded-3xl">
        <DialogTitle className="sr-only">AI Waste Classifier</DialogTitle>
        <DialogDescription className="sr-only">Upload or take a photo of your waste to get an AI-powered classification and disposal tips.</DialogDescription>
        <div className="relative h-[600px] w-full flex flex-col">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-white font-bold text-lg">AI Waste Classifier</h3>
              <p className="text-gray-300 text-xs">Instantly identify waste types</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCloseModal} className="text-white hover:bg-white/20 rounded-full">
              <Cross1Icon className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
            {mode === "choice" && (
              <div className="flex flex-col gap-6 w-full px-8 animate-in fade-in zoom-in-95 duration-300">
                <Button
                  onClick={startCamera}
                  className="h-24 bg-green-600 hover:bg-green-500 rounded-2xl flex flex-col gap-2 shadow-xl shadow-green-900/20"
                >
                  <CameraIcon className="h-8 w-8" />
                  <span className="font-bold">Open Camera</span>
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-500">Or</span>
                  </div>
                </div>
                <Label
                  htmlFor="file-upload"
                  className="h-24 bg-gray-800 hover:bg-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer border border-gray-700 transition-colors shadow-xl"
                >
                  <UploadIcon className="h-8 w-8 text-green-500" />
                  <span className="font-bold text-white">Upload from Gallery</span>
                </Label>
                <Input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            )}

            {mode === "camera" && (
              <>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8">
                  <Button
                    variant="ghost"
                    onClick={() => setMode("choice")}
                    className="text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
                  >
                    <Cross1Icon className="h-6 w-6" />
                  </Button>
                  <button
                    onClick={takePhoto}
                    className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-90 transition-transform"
                  >
                    <div className="h-full w-full bg-white rounded-full group-hover:scale-95 transition-transform" />
                  </button>
                  <div className="h-12 w-12" /> {/* Spacer */}
                </div>
              </>
            )}

            {(mode === "preview" || mode === "result") && photoTaken && (
              <div className="absolute inset-0 w-full h-full">
                <Image src={photoTaken} alt="Preview" fill className="object-cover" />

                {loading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="relative h-20 w-20">
                      <div className="absolute inset-0 border-4 border-green-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin" />
                    </div>
                    <p className="mt-4 text-green-400 font-bold animate-pulse">Analyzing Waste...</p>
                  </div>
                )}

                {mode === "result" && aiSuggestion && !loading && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10 rounded-b-3xl overflow-y-auto max-h-[70%] animate-in slide-in-from-bottom-8 duration-500">
                    <div className="p-5 space-y-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40">
                          <CheckIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-green-400 text-[10px] uppercase tracking-widest font-bold">AI Identified</p>
                          <h4 className="text-white text-xl font-black leading-tight">{aiSuggestion.wasteCategory}</h4>
                          <p className="text-gray-400 text-xs mt-0.5">Detected: <span className="text-gray-300 capitalize">{aiSuggestion.detectedItem}</span> &middot; {Math.round(aiSuggestion.probability * 100)}% confidence</p>
                        </div>
                      </div>

                      {/* Disposal Tips */}
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-green-400 text-[10px] uppercase tracking-widest font-bold mb-2">♻️ How to Dispose</p>
                        <p className="text-gray-200 text-xs leading-relaxed">{aiSuggestion.disposalTips}</p>
                      </div>

                      {/* Did You Know */}
                      <div className="bg-green-900/30 rounded-xl p-4 border border-green-700/30">
                        <p className="text-green-400 text-[10px] uppercase tracking-widest font-bold mb-2">💡 Did You Know?</p>
                        <p className="text-green-100 text-xs leading-relaxed">{aiSuggestion.didYouKnow}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-1">
                        <Button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold h-12 rounded-xl">
                          Accept & Continue
                        </Button>
                        <Button onClick={onOverride} variant="outline" className="bg-transparent border-gray-700 text-gray-300 hover:bg-white/10 h-12 rounded-xl">
                          Manual
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer controls for Preview mode */}
          {mode === "preview" && !loading && (
            <div className="p-6 bg-gray-900 border-t border-gray-800 animate-in slide-in-from-bottom-full duration-300">
              <div className="flex gap-4">
                <Button
                  onClick={() => setMode(stream ? "camera" : "choice")}
                  variant="outline"
                  className="flex-1 bg-transparent border-gray-700 text-white hover:bg-white/10 h-14 rounded-2xl gap-2 font-bold"
                >
                  <ResetIcon className="h-5 w-5" /> Retake
                </Button>
                <Button
                  onClick={handleClassify}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white h-14 rounded-2xl gap-2 font-bold shadow-lg shadow-green-900/40"
                >
                  Analyze Photo
                </Button>
              </div>
            </div>
          )}

          {/* Footer controls for Result mode — actions are inside the result card */}
          {mode === "result" && !loading && (
            <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setMode("choice")}
                className="text-gray-500 hover:text-white gap-2 font-medium"
              >
                <ResetIcon className="h-4 w-4" /> Start Over
              </Button>
            </div>
          )}

          {error && (
            <div className="absolute top-20 left-4 right-4 bg-red-500/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-red-400/50 animate-in slide-in-from-top-4 duration-300 z-30 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Cross1Icon className="h-4 w-4 shrink-0 text-white" />
                </div>
                <span className="font-semibold">{error}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setError(null)}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs h-8 flex-1"
                >
                  Dismiss
                </Button>
                <Button 
                  size="sm" 
                  onClick={onOverride}
                  className="bg-white text-red-600 hover:bg-gray-100 border-none text-xs font-bold h-8 flex-1"
                >
                  Choose Manually
                </Button>
              </div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </DialogContent>
    </Dialog>
  );
}
