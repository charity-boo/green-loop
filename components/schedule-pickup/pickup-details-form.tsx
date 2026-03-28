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
import { CalendarIcon, MapPin, ClockIcon, Navigation } from "lucide-react"; // Assuming Lucide Icons
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth"; // To potentially auto-fill address
import { KENYA_COUNTIES, getSubRegionLabel } from "@/lib/constants/regions";

interface PickupDetailsFormProps {
  initialPickupDetails: {
    address: string;
    region: string;
    date: Date | undefined;
    timeSlot: string;
    instructions: string;
    latitude?: number;
    longitude?: number;
  };
  onSubmit: (details: { 
    address: string; 
    region: string; 
    date: Date | undefined; 
    timeSlot: string; 
    instructions: string;
    latitude?: number;
    longitude?: number;
  }) => void;
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
  const [county, setCounty] = useState(() => {
    // Derive the county from the initial region value if set
    if (!initialPickupDetails.region) return "";
    return KENYA_COUNTIES.find(c => c.subRegions.some(sr => sr.value === initialPickupDetails.region))?.value ?? "";
  });
  const [region, setRegion] = useState(initialPickupDetails.region);
  const [date, setDate] = useState<Date | undefined>(initialPickupDetails.date);
  const [timeSlot, setTimeSlot] = useState(initialPickupDetails.timeSlot);
  const [instructions, setInstructions] = useState(initialPickupDetails.instructions);
  const [latitude, setLatitude] = useState<number | undefined>(initialPickupDetails.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(initialPickupDetails.longitude);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && user && !address) {
      setAddress(`123 Green Way, Eco City, GL 88888`);
    }
  }, [user, status, address]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);

        try {
          // Reverse geocoding using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'GreenLoop-App'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            }
          } else {
            setAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Unable to retrieve your location. Please enter it manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !date || !timeSlot || !region) {
      setError("Please fill in all pickup details including region.");
      return;
    }
    setError(null);
    onSubmit({ address, region, date, timeSlot, instructions, latitude, longitude });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="address" className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Pickup Address
              </Label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors uppercase tracking-tight"
              >
                {isLocating ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-ping" />
                    Locating...
                  </span>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    Use Current Location
                  </>
                )}
              </button>
            </div>
            <div className="group relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600 text-gray-400">
                <MapPin className="h-5 w-5" />
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
            {latitude && longitude && !isLocating && (
              <p className="text-[10px] text-green-600 ml-4 font-bold flex items-center gap-1">
                <div className="w-1 h-1 bg-green-600 rounded-full" />
                GPS Coordinates Locked: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
            <p className="text-[10px] text-gray-400 ml-4 font-medium italic">Auto-filled from your profile</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="county" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
              County
            </Label>
            <Select onValueChange={(val) => { setCounty(val); setRegion(""); }} value={county} name="county">
              <SelectTrigger className={cn(
                "w-full pl-4 pr-4 py-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-medium text-left",
                county ? "text-gray-900 border-green-500/20 bg-green-50/20" : "text-gray-400"
              )}>
                <div className="flex items-center gap-3">
                  <MapPin className={cn("h-5 w-5", county ? "text-green-600" : "text-gray-400")} />
                  <SelectValue placeholder="Select county" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-64 overflow-y-auto">
                {KENYA_COUNTIES.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700 font-medium"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {county && (
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                Area / Sub-County
              </Label>
              <Select onValueChange={setRegion} value={region} name="region">
                <SelectTrigger className={cn(
                  "w-full pl-4 pr-4 py-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-medium text-left",
                  region ? "text-gray-900 border-green-500/20 bg-green-50/20" : "text-gray-400"
                )}>
                  <div className="flex items-center gap-3">
                    <MapPin className={cn("h-5 w-5", region ? "text-green-600" : "text-gray-400")} />
                    <SelectValue placeholder="Select area" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-64 overflow-y-auto">
                  {KENYA_COUNTIES.find(c => c.value === county)?.subRegions.map((sr) => (
                    <SelectItem
                      key={sr.value}
                      value={sr.value}
                      className="rounded-xl py-3 focus:bg-green-50 focus:text-green-700 font-medium"
                    >
                      {sr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-64 overflow-y-auto">
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
