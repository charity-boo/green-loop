"use client";

import { useState } from "react";
import { parsePhoneNumber, getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

// Popular countries
const POPULAR_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'KE', 'UG', 'TZ', 'NG', 'ZA'];

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  KE: 'Kenya',
  UG: 'Uganda',
  TZ: 'Tanzania',
  NG: 'Nigeria',
  ZA: 'South Africa',
  IN: 'India',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  PH: 'Philippines',
  VN: 'Vietnam',
  TH: 'Thailand',
  MY: 'Malaysia',
  ID: 'Indonesia',
  SG: 'Singapore',
  AE: 'UAE',
  SA: 'Saudi Arabia',
};

export function PhoneInput({ onSubmit, loading = false, error }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState('KE'); // Default to Kenya
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      // Get calling code for selected country
      const callingCode = getCountryCallingCode(countryCode as any);
      const fullNumber = `+${callingCode}${phoneNumber}`;

      // Validate phone number
      const parsed = parsePhoneNumber(fullNumber);
      if (!parsed.isValid()) {
        setValidationError('Please enter a valid phone number');
        return;
      }

      // Submit the formatted phone number
      await onSubmit(parsed.format('E.164'));
    } catch (err) {
      setValidationError('Invalid phone number format');
      console.error('Phone validation error:', err);
    }
  };

  const callingCode = getCountryCallingCode(countryCode as any);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <div className="font-semibold text-xs text-gray-500 px-2 py-1">Popular</div>
            {POPULAR_COUNTRIES.map((code) => (
              <SelectItem key={code} value={code}>
                {COUNTRY_NAMES[code] || code} (+{getCountryCallingCode(code as any)})
              </SelectItem>
            ))}
            <div className="border-t my-1" />
            <div className="font-semibold text-xs text-gray-500 px-2 py-1">Other Countries</div>
            {getCountries()
              .filter(code => !POPULAR_COUNTRIES.includes(code))
              .map((code) => (
                <SelectItem key={code} value={code}>
                  {COUNTRY_NAMES[code] || code} (+{getCountryCallingCode(code as any)})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center justify-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium">
            +{callingCode}
          </div>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="712345678"
            required
            className="flex-1"
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter your phone number without the country code
        </p>
      </div>

      {(validationError || error) && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
          {validationError || error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !phoneNumber}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Code...
          </div>
        ) : (
          "Send Verification Code"
        )}
      </Button>
    </form>
  );
}
