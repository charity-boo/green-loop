"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, RefreshCw, CheckCircle2, AlertCircle, MapPin, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ReportIssuePage = () => {
  // const router = useRouter();
  interface FormData {
    fullName: string;
    email: string;
    phone: string;
    issueType: string;
    location: string;
    dateTime: string;
    description: string;
    preferredContact: string;
    imageFile: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    issueType: '',
    location: '',
    dateTime: '',
    description: '',
    preferredContact: 'email',
    imageFile: null,
  });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.issueType) newErrors.issueType = 'Issue Type is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
    setFormData(prev => ({ ...prev, imageFile: null }));
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
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCapturedImage(null);
      setFormData((prev) => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmissionStatus({ type: 'error', message: 'Please fix the errors in the form.' });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus({ type: null, message: 'Submitting your report...' });
    setErrors({});

    try {
      // Create a payload. In a real app, you'd use FormData for file uploads.
      // Here we simulate with JSON for compatibility with the existing mock API.
      const payload = {
        ...formData,
        imageFile: capturedImage || (formData.imageFile ? formData.imageFile.name : null),
        capturedLive: !!capturedImage
      };

      const response = await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus({ type: 'success', message: `Report submitted! ID: ${result.reportId}` });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          issueType: '',
          location: '',
          dateTime: '',
          description: '',
          preferredContact: 'email',
          imageFile: null,
        });
        setCapturedImage(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 mb-4"
          >
            Report an Issue
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Help us build a cleaner future. Report collection issues or environmental violations instantly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden p-8 sm:p-12 relative"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Personal Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">1</span>
                <h3 className="text-2xl font-bold text-gray-800">Your Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-bold text-gray-700">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="h-12 border-gray-200 rounded-xl focus:ring-green-500/20"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="h-12 border-gray-200 rounded-xl focus:ring-green-500/20"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Step 2: Issue Details */}
            <section className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">2</span>
                <h3 className="text-2xl font-bold text-gray-800">Issue Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Issue Type</Label>
                  <Select
                    value={formData.issueType}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, issueType: val }))}
                  >
                    <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                      <SelectValue placeholder="What's happening?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waste-collection">Missed Waste Collection</SelectItem>
                      <SelectItem value="environmental-violation">Environmental Violation</SelectItem>
                      <SelectItem value="spillage">Spillage/Overflow</SelectItem>
                      <SelectItem value="general-feedback">General Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.issueType && <p className="text-red-500 text-xs mt-1">{errors.issueType}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">Location</Label>
                  <div className="relative">
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Address or landmark"
                      className="h-12 pl-10 border-gray-200 rounded-xl"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-bold text-gray-700">Detailed Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us more about the issue..."
                  rows={4}
                  className="border-gray-200 rounded-2xl resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </section>

            {/* Step 3: Evidence */}
            <section className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">3</span>
                <h3 className="text-2xl font-bold text-gray-800">Visual Evidence</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!capturedImage && !formData.imageFile && !isCameraOpen && (
                  <>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-200 rounded-3xl hover:bg-green-50 hover:border-green-300 transition-all group"
                    >
                      <Camera className="h-10 w-10 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-green-700">Capture Live Photo</span>
                      <span className="text-xs text-green-600/60 mt-1">Directly from camera</span>
                    </button>

                    <Label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 rounded-3xl hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"
                    >
                      <Upload className="h-10 w-10 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-blue-700">Upload from Gallery</span>
                      <span className="text-xs text-blue-600/60 mt-1">Max 5MB (JPG, PNG)</span>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </Label>
                  </>
                )}

                <AnimatePresence>
                  {isCameraOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="col-span-full relative rounded-3xl overflow-hidden bg-black aspect-video"
                    >
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 px-6">
                        <Button
                          type="button"
                          onClick={takePhoto}
                          className="rounded-full h-16 w-16 bg-white hover:bg-gray-100 flex items-center justify-center shadow-2xl"
                        >
                          <div className="h-12 w-12 rounded-full border-4 border-green-600"></div>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => { stopCamera(); setIsCameraOpen(false); }}
                          className="rounded-full h-16 w-16 p-0"
                        >
                          <X className="h-8 w-8 text-white" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(capturedImage || formData.imageFile) && (
                  <div className="col-span-full relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={capturedImage || (formData.imageFile ? URL.createObjectURL(formData.imageFile) : '')}
                      alt="Preview"
                      className="w-full max-h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-full px-6 flex items-center gap-2"
                        onClick={() => { setCapturedImage(null); setFormData(prev => ({ ...prev, imageFile: null })); }}
                      >
                        <Trash2 className="h-5 w-5" /> Remove & Retake
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-16 rounded-2xl text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl shadow-green-600/30 transition-all",
                  isSubmitting && "opacity-80 scale-[0.98]"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    Submitting Report...
                  </div>
                ) : (
                  "Finalize & Submit Report"
                )}
              </Button>

              <AnimatePresence>
                {submissionStatus.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className={cn(
                      "mt-6 p-4 rounded-xl flex items-center gap-3 border",
                      submissionStatus.type === 'success'
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    )}
                  >
                    {submissionStatus.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <p className="font-bold">{submissionStatus.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Green Loop Smart Systems &copy; 2026 | All reports are verified within 24 hours.
        </p>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ReportIssuePage;