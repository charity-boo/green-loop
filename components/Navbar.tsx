"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import RegisterDialog from "./RegisterDialog"; // ✅ Ensure this file exists

const GreenLoopNavBar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 font-sans">
      {/* --- Top Bar --- */}
      <div className="bg-green-800 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end space-x-6">
          <Link href="#green-tips" className="hover:text-yellow-400 transition-colors">
            Green Tips
          </Link>
          <Link href="#community-stories" className="hover:text-yellow-400 transition-colors">
            Community Stories
          </Link>
          <Link href="#events" className="hover:text-yellow-400 transition-colors">
            Events & Drives
          </Link>
          <Link href="#challenges" className="hover:text-yellow-400 transition-colors">
            Challenges
          </Link>
          <Link href="#partnerships" className="hover:text-yellow-400 transition-colors">
            Partnerships
          </Link>
          <Link href="#faqs" className="hover:text-yellow-400 transition-colors">
            FAQs
          </Link>
          <div className="border-l border-white/50 pl-6 flex items-center">
            <span className="font-bold">Hotline: 0800 123 456</span>
          </div>
        </div>
      </div>

      {/* --- Main Navbar --- */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* ✅ Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Green Loop Logo"
                width={50}
                height={50}
                className="rounded-full shadow-md"
              />
              <span className="text-green-900 font-bold text-lg">Green Loop</span>
            </div>

            {/* ✅ Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-green-700 font-medium transition">
                Home
              </Link>

              {/* About Us Dropdown (No changes needed, already comprehensive) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center text-gray-700 hover:text-green-700">
                    About Us
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border rounded-md p-1">
                  <DropdownMenuItem asChild>
                    <Link href="/about-us">Who We Are</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/service-areas" className="hover:text-green-600">Service Areas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                  <Link href="/about-us/methodology">Methodology</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about-us/technology-innovation">Technology & Innovation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about-us/patnerships">Partnerships</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about-us/safety-compliance">Safety & Compliance</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Learning Hub Dropdown (Updated Links) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-green-700">
                    Learning Hub
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border rounded-md p-1">
                  <DropdownMenuItem asChild>
                    <Link href="/learning-hub/guides">Recycling Guides</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learning-hub/videos">Educational Videos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learning-hub/waste-types">Waste Classification</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/learning-hub/faqs">FAQs</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Join the Movement Dropdown (Updated Links) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-green-700">
                    Join the Movement
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg border rounded-md p-1">
                  <DropdownMenuItem asChild>
                    <Link href="/community/volunteer">Volunteer</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/community/sponsorship">Sponsor a Project</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/community/careers">Careers at Green Loop</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/community/partnerships">Partnerships</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/contact" className="text-gray-700 hover:text-green-700 font-medium transition">
                Contact Us
              </Link>

              {/* ✅ Register Button */}
              <div className="ml-4">
                <RegisterDialog />
              </div>
            </div>

            {/* ✅ Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-gray-700 hover:text-green-700"
              >
                {isMobileOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Mobile Dropdown Menu (Updated for consistency) */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
            <div className="flex flex-col p-4 space-y-3">
              <Link href="/" onClick={() => setIsMobileOpen(false)} className="text-gray-700 hover:text-green-700">
                Home
              </Link>

              {/* Mobile About Us Links */}
              <div className="flex flex-col space-y-1 border-b pb-2">
                <span className="text-green-700 font-bold">About Us</span>
                <Link href="/about-us" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Who We Are</Link>
                <Link href="/service-areas" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Service Areas</Link>
                <Link href="/about-us/methodology" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Methodology</Link>
                <Link href="/about-us/technology-innovation" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Technology & Innovation</Link>
                <Link href="/about-us/patnerships" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Partnerships</Link>
                <Link href="/about-us/safety-compliance" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Safety & Compliance</Link>
              </div>
              
              {/* Mobile Learning Hub Links */}
              <div className="flex flex-col space-y-1 border-b pb-2">
                <span className="text-green-700 font-bold">Learning Hub</span>
                <Link href="/learning-hub/guides" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Recycling Guides</Link>
                <Link href="/learning-hub/videos" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Educational Videos</Link>
                <Link href="/learning-hub/waste-types" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Waste Classification</Link>
                <Link href="/learning-hub/faqs" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">FAQs</Link>
              </div>

              {/* Mobile Join the Movement Links */}
              <div className="flex flex-col space-y-1 border-b pb-2">
                <span className="text-green-700 font-bold">Join the Movement</span>
                <Link href="/community/volunteer" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Volunteer</Link>
                <Link href="/community/sponsorship" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Sponsor a Project</Link>
                <Link href="/community/careers" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Careers at Green Loop</Link>
                <Link href="/community/partnerships" onClick={() => setIsMobileOpen(false)} className="text-gray-600 hover:text-green-700 pl-4">Partnerships</Link>
              </div>

              <Link href="/contact" onClick={() => setIsMobileOpen(false)} className="text-gray-700 hover:text-green-700">
                Contact Us
              </Link>

              <div className="w-full pt-2">
                <RegisterDialog />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GreenLoopNavBar;