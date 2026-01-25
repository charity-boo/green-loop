"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // Assuming you've installed the Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Utility function for conditionally joining class names

export default function SchedulePickupPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [wasteType, setWasteType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<string | null>(null);

  const wasteOptions = [
    { value: "mixed", label: "Mixed Residential Waste" },
    { value: "recyclables", label: "Recyclables Only" },
    { value: "organic", label: "Organic/Compost" },
    { value: "bulk", label: "Bulk Item Pickup" },
  ];

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !wasteType) {
      setScheduleStatus("Please select both a date and a waste type.");
      return;
    }
    
    setLoading(true);
    setScheduleStatus(null);
    
    // --- START: Frontend Simulation ---
    
    // Simulate scheduling delay
    setTimeout(() => {
      setLoading(false);
      setScheduleStatus(`✅ Pickup scheduled for ${format(date, "PPP")} for ${wasteType.replace(/\b\w/g, l => l.toUpperCase())}.`);
      // Reset form state after successful "submission"
      setDate(undefined); 
      setWasteType("");
    }, 2000); 
    
    // --- END: Frontend Simulation ---
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-green-700">Smart Waste Pickup</CardTitle>
          <CardDescription>
            Select a date and waste type to schedule your next collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScheduleSubmit} className="space-y-6">
            
            {/* 1. Date Picker */}
            <div className="grid gap-2">
              <Label htmlFor="pickup-date">Choose Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    // You might want to disable past days here
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 2. Waste Type Selector */}
            <div className="grid gap-2">
              <Label htmlFor="waste-type">Waste Type</Label>
              <Select onValueChange={setWasteType} value={wasteType} name="waste-type">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select waste category..." />
                </SelectTrigger>
                <SelectContent>
                  {wasteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status/Error Message */}
            {scheduleStatus && (
              <div className={cn(
                "p-3 text-sm rounded-md text-center",
                scheduleStatus.startsWith("✅") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
              )}>
                {scheduleStatus}
              </div>
            )}

            {/* 3. Submit Button */}
            <Button
              type="submit"
              disabled={loading || !date || !wasteType}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scheduling...
                </div>
              ) : (
                "Confirm Pickup Schedule"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}