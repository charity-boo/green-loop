"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, ClockIcon } from "lucide-react"; // Assuming Lucide Icons
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth"; // To potentially auto-fill address

interface PickupDetailsFormProps {
  initialPickupDetails: {
    address: string;
    date: Date | undefined;
    timeSlot: string;
    instructions: string;
  };
  onSubmit: (details: { address: string; date: Date | undefined; timeSlot: string; instructions: string }) => void;
  onPrev: () => void;
}

const timeSlots = [
  { value: "morning", label: "Morning (9 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (1 PM - 4 PM)" },
  { value: "evening", label: "Evening (5 PM - 8 PM)" },
];

export default function PickupDetailsForm({ initialPickupDetails, onSubmit, onPrev }: PickupDetailsFormProps) {
  const { user, status } = useAuth();
  const [address, setAddress] = useState(initialPickupDetails.address);
  const [date, setDate] = useState<Date | undefined>(initialPickupDetails.date);
  const [timeSlot, setTimeSlot] = useState(initialPickupDetails.timeSlot);
  const [instructions, setInstructions] = useState(initialPickupDetails.instructions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && user && !address) {
      setAddress(`123 Green Way, Eco City, GL 88888`);
    }
  }, [user, status, address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !date || !timeSlot) {
      setError("Please fill in all pickup details.");
      return;
    }
    setError(null);
    onSubmit({ address, date, timeSlot, instructions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Pickup Address
            </Label>
            <div className="group relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600 text-gray-400">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <Input
                id="address"
                type="text"
                placeholder="Enter pickup address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-12 pr-4 py-6 bg-white border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-400 ml-4 font-medium italic">Auto-filled from your profile</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-date" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Choose Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-4 pr-4 py-6 justify-start text-left font-medium border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all",
                    !date ? "text-gray-400" : "text-gray-900 border-green-500/20 bg-green-50/20"
                  )}
                >
                  <CalendarIcon className={cn("mr-3 h-5 w-5", date ? "text-green-600" : "text-gray-400")} />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(day) => day < new Date() || day < new Date("1900-01-01")}
                  className="p-4"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-slot" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Time Slot
            </Label>
            <Select onValueChange={setTimeSlot} value={timeSlot} name="time-slot">
              <SelectTrigger className={cn(
                "w-full pl-4 pr-4 py-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-medium text-left",
                timeSlot ? "text-gray-900 border-green-500/20 bg-green-50/20" : "text-gray-400"
              )}>
                <div className="flex items-center gap-3">
                  <ClockIcon className={cn("h-5 w-5", timeSlot ? "text-green-600" : "text-gray-400")} />
                  <SelectValue placeholder="Preferred time window" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                {timeSlots.map((slot) => (
                  <SelectItem
                    key={slot.value}
                    value={slot.value}
                    className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700 font-medium"
                  >
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 h-full flex flex-col">
            <Label htmlFor="instructions" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              Additional Instructions
            </Label>
            <Textarea
              id="instructions"
              placeholder="e.g., 'Gate code is 1234' or 'Items are behind the blue bin.'"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="flex-1 min-h-[150px] p-5 bg-white border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-gray-900 font-medium placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-pulse flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="w-full sm:w-auto text-gray-400 hover:text-gray-600 font-semibold"
        >
          Back to Waste Type
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 px-10 py-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95"
        >
          Review Pickup
        </Button>
      </div>
    </form>
  );
}
