"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, MapPin, 
  Trash2, X, ArrowRight, ArrowLeft, AlertTriangle, Info, 
  ShieldCheck, EyeOff, Wind, Droplets, Plus, Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

const ISSUE_TYPES = [
  { id: 'waste-collection', label: 'Missed Waste Collection', icon: Trash2, description: 'Waste was not picked up as scheduled.' },
  { id: 'environmental-violation', label: 'Environmental Violation', icon: ShieldCheck, description: 'Illegal dumping or pollution observed.' },
  { id: 'spillage', label: 'Spillage/Overflow', icon: Droplets, description: 'Waste bins are overflowing or leaking.' },
  { id: 'pollution', label: 'Air/Noise Pollution', icon: Wind, description: 'Excessive smoke or noise levels.' },
  { id: 'general-feedback', label: 'General Feedback', icon: Info, description: 'Suggestions or general observations.' },
  { id: 'other', label: 'Other Issue', icon: Plus, description: 'Anything else we should know about.' },
];

const STEPS = ['Category', 'Details', 'Evidence', 'Contact'];

const ReportIssuePage = () => {
  interface FormData {
    fullName: string;
    email: string;
    phone: string;
    issueType: string;
    priority: 'low' | 'medium' | 'high';
    location: string;
    description: string;
    isAnonymous: boolean;
    images: string[]; // Store base64 or URLs
    imageFiles: File[];
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    issueType: '',
    priority: 'medium',
    location: '',
    description: '',
    isAnonymous: false,
    images: [],
    imageFiles: [],
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.issueType) newErrors.issueType = 'Please select an issue type.';
    } else if (step === 1) {
      if (!formData.location) newErrors.location = 'Location is required.';
      if (!formData.description) newErrors.description = 'Description is required.';
    } else if (step === 3) {
      if (!formData.isAnonymous) {
        if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
        if (!formData.email) newErrors.email = 'Email is required.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, location: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        
        try {
          // Attempt reverse geocoding if possible, or just keep coordinates
          // For now, we'll stick to coordinates
        } catch (err) {
          console.error("Geocoding error:", err);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setErrors(prev => ({ ...prev, location: 'Could not detect your location. Please enter manually.' }));
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setSubmissionStatus({ type: 'error', message: 'Could not access camera. Please check permissions.' });
      setIsCameraOpen(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }, [stream]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, images: [...prev.images, imageData] }));
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageFiles = [...formData.imageFiles, ...filesArray];
      
      // Convert files to URLs for preview
      const newImageURLs = filesArray.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImageURLs],
        imageFiles: newImageFiles
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const newImageFiles = [...prev.imageFiles];
      newImages.splice(index, 1);
      if (index < prev.imageFiles.length) {
        newImageFiles.splice(index, 1);
      }
      return { ...prev, images: newImages, imageFiles: newImageFiles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmissionStatus({ type: null, message: 'Submitting your report...' });

    try {
      const payload = {
        fullName: formData.isAnonymous ? 'Anonymous' : formData.fullName,
        email: formData.isAnonymous ? 'anonymous@greenloop.com' : formData.email,
        phone: formData.phone,
        issueType: formData.issueType,
        location: formData.location,
        dateTime: new Date().toISOString(),
        description: `[Priority: ${formData.priority.toUpperCase()}] ${formData.description}`,
        preferredContact: 'email',
        // In a real app, you would upload files to storage first
        // Here we send the first image or a placeholder
        imageFile: formData.images.length > 0 ? formData.images[0] : null,
      };

      const response = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus({ type: 'success', message: `Report submitted! ID: ${result.reportId}` });
        // Reset or redirect
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setSubmissionStatus({ type: 'error', message: result.message || 'Submission failed.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ISSUE_TYPES.map((type) => (
                <Card 
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all border-2 group hover:shadow-md",
                    formData.issueType === type.id 
                      ? "border-green-500 bg-green-50/50" 
                      : "border-gray-100 hover:border-green-200"
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, issueType: type.id }))}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      formData.issueType === type.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600"
                    )}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{type.label}</h4>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.issueType && <p className="text-red-500 text-sm">{errors.issueType}</p>}

            <div className="space-y-4 pt-4 border-t">
              <Label className="text-sm font-bold text-gray-700">How urgent is this?</Label>
              <div className="flex gap-4">
                {['low', 'medium', 'high'].map((p) => (
                  <Badge
                    key={p}
                    variant={formData.priority === p ? (p === 'high' ? 'destructive' : 'success') : 'outline'}
                    className={cn(
                      "px-6 py-2 cursor-pointer capitalize text-sm transition-all",
                      formData.priority === p ? "scale-105" : "opacity-60 hover:opacity-100"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, priority: p as 'low' | 'medium' | 'high' }))}
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700 flex justify-between">
                Location
                <button 
                  type="button" 
                  onClick={detectLocation}
                  disabled={isDetectingLocation}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs"
                >
                  {isDetectingLocation ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
                  Detect my location
                </button>
              </Label>
              <div className="relative">
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter address or coordinates..."
                  className="h-12 pl-10 rounded-xl"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700">What happened?</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the issue in detail..."
                rows={6}
                className="rounded-2xl resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={startCamera}
                className="h-32 flex flex-col gap-2 rounded-2xl border-dashed border-2 hover:bg-green-50 hover:border-green-300"
              >
                <Camera className="h-8 w-8 text-green-600" />
                <span>Take Photo</span>
              </Button>
              <Label
                htmlFor="multi-upload"
                className="h-32 flex flex-col items-center justify-center gap-2 rounded-2xl border-dashed border-2 border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <Upload className="h-8 w-8 text-blue-600" />
                <span>Upload Photos</span>
                <Input id="multi-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>

            <AnimatePresence>
              {isCameraOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] shadow-2xl"
                >
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6">
                    <Button
                      type="button"
                      onClick={takePhoto}
                      className="rounded-full h-16 w-16 bg-white hover:bg-gray-100 flex items-center justify-center"
                    >
                      <div className="h-12 w-12 rounded-full border-4 border-green-600"></div>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={stopCamera}
                      className="rounded-full h-16 w-16 p-0"
                    >
                      <X className="h-8 w-8 text-white" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border shadow-sm">
                    <Image 
                      src={img} 
                      alt={`Preview ${idx}`} 
                      fill 
                      className="object-cover" 
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Checkbox 
                id="anonymous" 
                checked={formData.isAnonymous} 
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: !!checked }))}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="anonymous"
                  className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  Report Anonymously <EyeOff className="h-4 w-4 text-gray-500" />
                </label>
                <p className="text-xs text-muted-foreground">
                  Your identity will not be shared with anyone.
                </p>
              </div>
            </div>

            <AnimatePresence>
              {!formData.isAnonymous && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Full Name</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your name"
                      className="h-12 rounded-xl"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="h-12 rounded-xl"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700">Phone Number (Optional)</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254..."
                      className="h-12 rounded-xl"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                By submitting, you agree that the information provided is accurate. 
                Reports are usually verified and acted upon within 24-48 hours.
              </p>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/50 backdrop-blur px-4 py-1.5 rounded-full border border-green-200 text-green-700 text-sm font-bold mb-6 shadow-sm"
          >
            <AlertTriangle className="h-4 w-4" /> Community Reporting System
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Report an <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Issue</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            {currentStep === 0 && "What kind of issue did you observe?"}
            {currentStep === 1 && "Tell us where and what happened."}
            {currentStep === 2 && "Visual evidence helps us act faster."}
            {currentStep === 3 && "Final details before submission."}
          </motion.p>
        </div>

        {/* Progress */}
        <div className="mb-10 space-y-4 px-2">
          <div className="flex justify-between text-xs font-black uppercase tracking-wider text-gray-400">
            {STEPS.map((step, idx) => (
              <span key={step} className={cn(idx <= currentStep ? "text-green-600" : "")}>{step}</span>
            ))}
          </div>
          <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-1.5" />
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2.5rem] overflow-hidden p-8 sm:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

          <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col">
            <div className="flex-grow">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="pt-10 flex gap-4">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="h-14 px-8 rounded-2xl font-bold border-2"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" /> Back
                </Button>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-grow h-14 rounded-2xl text-lg font-black bg-gray-900 hover:bg-black text-white shadow-xl transition-all"
                >
                  Continue <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-grow h-14 rounded-2xl text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl shadow-green-600/20 transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 animate-spin" /> Submitting...
                    </div>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              )}
            </div>

            <AnimatePresence>
              {submissionStatus.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "mt-8 p-4 rounded-2xl flex items-center gap-3 border shadow-sm",
                    submissionStatus.type === 'success' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                  )}
                >
                  {submissionStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <p className="font-bold text-sm">{submissionStatus.message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-gray-400 text-sm">
            Need immediate assistance? Call <span className="text-gray-900 font-bold">0800 123 456</span>
          </p>
          <div className="flex justify-center gap-6">
            <span className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck className="h-3 w-3" /> Secure Transmission
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <EyeOff className="h-3 w-3" /> Privacy Guaranteed
            </span>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReportIssuePage;