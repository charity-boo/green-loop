'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: string;
}

export function BookingModal({ isOpen, onClose, tier }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      propertyName: (form.elements.namedItem('hostel-name') as HTMLInputElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      contactPerson: (form.elements.namedItem('contact-person') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      tier,
    };

    try {
      const res = await fetch('/api/hostels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Booking failed. Please try again.');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black text-foreground">Request Received!</DialogTitle>
              <DialogDescription className="text-lg font-medium">
                We&apos;ve received your booking for the{" "}
                <span className="text-green-600 font-bold">{tier}</span> tier. Our team will
                contact you within 24 hours to finalise the setup.
              </DialogDescription>
            </div>
            <Button
              onClick={handleClose}
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 rounded-xl h-12"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-8 border-border shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 text-green-600 mb-2">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-3xl font-black text-foreground tracking-tight">
            Book {tier} Service
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium text-lg">
            Fill in the form below and our team will contact you within 24 hours to finalise setup.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hostel-name" className="text-sm font-bold text-slate-700">Property Name</Label>
              <Input id="hostel-name" placeholder="e.g. Sunset Gardens" required className="h-12 rounded-xl border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-bold text-slate-700">Location</Label>
              <Input id="location" placeholder="e.g. Ndagani" required className="h-12 rounded-xl border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-person" className="text-sm font-bold text-slate-700">Contact Person</Label>
            <Input id="contact-person" placeholder="Your full name" required className="h-12 rounded-xl border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
            <Input id="email" type="email" placeholder="manager@hostel.com" required className="h-12 rounded-xl border-border" />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter className="pt-4 gap-3 sm:gap-0">
            <Button type="button" variant="ghost" onClick={handleClose} className="rounded-xl h-12 font-bold text-muted-foreground">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-black px-8 flex-grow sm:flex-grow-0 shadow-lg shadow-green-200"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
