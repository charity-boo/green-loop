"use client";

import { useState } from 'react';
// Assuming Shadcn components are installed
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the structure for the report data
interface ReportData {
  issueType: string;
  description: string;
  locationDetails: string;
  photoFile: File | null;
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportData>({
    issueType: '',
    description: '',
    locationDetails: '',
    photoFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const issueTypes = [
    "Illegal Dumping",
    "Overflowing Public Bin",
    "Littering Hotspot",
    "Damaged Container",
    "Missed Collection",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReport({ ...report, [e.target.id]: e.target.value });
    setError(null);
    setSuccess(false);
  };
  
  const handleSelectChange = (value: string) => {
    setReport({ ...report, issueType: value });
    setError(null);
    setSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setReport({ ...report, photoFile: file });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!report.issueType || !report.description || !report.locationDetails) {
        setError("Please fill out all required fields.");
        setLoading(false);
        return;
    }
    
    // --- START: Replace this with your ACTUAL API/Firebase submission logic ---
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Report Submitted:", report);
    
    // Simulate success/failure
    const submissionSuccessful = true; // In a real app, this would be based on API response

    if (submissionSuccessful) {
        setSuccess(true);
        // Clear form after successful submission
        setReport({ issueType: '', description: '', locationDetails: '', photoFile: null });
    } else {
        setError("Failed to submit report. Please try again.");
    }

    // --- END: Submission Logic ---
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg shadow-2xl mt-12">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-800">
            🚨 Report a Waste Issue
          </CardTitle>
          <CardDescription>
            Help us keep our community clean. Your report enables quick action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md text-center">
              ✅ Report submitted successfully! Thank you for your help.
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Issue Type Selector */}
            <div className="grid gap-2">
              <Label htmlFor="issueType">Type of Issue*</Label>
              <Select onValueChange={handleSelectChange} value={report.issueType}>
                <SelectTrigger id="issueType">
                  <SelectValue placeholder="Select the issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Details */}
            <div className="grid gap-2">
              <Label htmlFor="locationDetails">Exact Location Details*</Label>
              <Input
                id="locationDetails"
                type="text"
                required
                value={report.locationDetails}
                onChange={handleInputChange}
                placeholder="e.g., Corner of Main St and School Rd, next to the bus stop"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Detailed Description*</Label>
              <Textarea
                id="description"
                required
                value={report.description}
                onChange={handleInputChange}
                placeholder="Describe the issue (e.g., large pile of debris, bin lid broken)"
                rows={4}
              />
            </div>

            {/* Photo Upload */}
            <div className="grid gap-2">
              <Label htmlFor="photoFile">Upload Photo (Optional)</Label>
              <Input
                id="photoFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {report.photoFile && (
                <p className="text-sm text-gray-500 mt-1">
                    Selected file: {report.photoFile.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700" 
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Report...
                </div>
              ) : (
                "Submit Report"
              )}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
                *Required fields
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}