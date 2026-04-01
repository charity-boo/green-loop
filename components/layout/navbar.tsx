"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import RegisterDialog from "@/components/features/auth/register-dialog";
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";

const GreenLoopNavBar = () => {
  const router = useRouter();
  const { user, role, signOut } = useAuth();
  const isAdmin = role === "ADMIN";
  const isCollector = role === "COLLECTOR";
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // States for hover dropdowns
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 font-sans w-full transition-all">
      {/* --- Top Bar --- */}
      <div className="bg-green-800 text-white text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-end space-x-6">
          <Link href="/green-tips" className="hover:text-yellow-400 transition-colors">
            Green Tips
          </Link>
          <Link href="/community-stories" className="hover:text-yellow-400 transition-colors">
            Community Stories
          </Link>
          <Link href="/events-drives" className="hover:text-yellow-400 transition-colors">
            Events &amp; Drives
          </Link>
          <Link href="/challenges" className="hover:text-yellow-400 transition-colors">
            Challenges
          </Link>
        </div>
      </div>

      {/* --- Main Navbar (with professional glassmorphism) --- */}
      <div 
        className={cn(
          "transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-slate-200/50 dark:border-slate-800/50 py-2" 
            : "bg-white dark:bg-slate-950 border-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ✅ Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/images/logo.png"
                alt="Green Loop Logo"
                width={44}
                height={44}
                className="rounded-full shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="text-green-900 dark:text-green-400 font-extrabold text-xl tracking-tight">Green Loop</span>
            </Link>

            {/* ✅ Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                Home
              </Link>

              <Link href="/services" className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                Our Services
              </Link>

              <Link href="/about-us" className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                About Us
              </Link>

              <Link href="/learning-hub" className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                Learning Hub
              </Link>

              {/* Join the Movement Dropdown (Hover to open, Click to navigate) */}
              <div 
                className="relative"
                onMouseEnter={() => setJoinOpen(true)}
                onMouseLeave={() => setJoinOpen(false)}
              >
                <DropdownMenu open={joinOpen} onOpenChange={setJoinOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 focus-visible:ring-0"
                      onClick={() => router.push("/community")}
                    >
                      Join the Movement
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-56 bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-1 animate-in fade-in zoom-in duration-200"
                    onMouseEnter={() => setJoinOpen(true)}
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/community/volunteer" className="rounded-lg">Volunteer</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/community/sponsorship" className="rounded-lg">Sponsor a Project</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/community/careers" className="rounded-lg">Careers at Green Loop</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/community/partnerships" className="rounded-lg">Partnerships</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href="/contact" className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                Contact Us
              </Link>

              {isAdmin && (
                <Link href="/admin/dashboard" className="px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors border-l pl-4 border-slate-200 dark:border-slate-800">
                  Admin Panel
                </Link>
              )}

              {/* ✅ Auth Section */}
              <div className="ml-4 flex items-center gap-3 border-l pl-4 border-slate-200 dark:border-slate-800">
                <ThemeToggle />
                {user ? (
                  <ProfileDropdown variant={(role?.toLowerCase() as 'user' | 'admin' | 'collector') || 'user'} />
                ) : (
                  <RegisterDialog />
                )}
              </div>
            </div>

            {/* ✅ Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 rounded-lg transition-colors"
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

        {/* ✅ Mobile Dropdown Menu (Professional Glass Look) */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto">
            <div className="flex flex-col p-6 space-y-4">
              <Link href="/" onClick={() => setIsMobileOpen(false)} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Home
              </Link>

              <Link href="/services" onClick={() => setIsMobileOpen(false)} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Our Services
              </Link>

              <Link href="/about-us" onClick={() => setIsMobileOpen(false)} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                About Us
              </Link>

              <Link href="/learning-hub" onClick={() => setIsMobileOpen(false)} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Learning Hub
              </Link>

              <Link href="/contact" onClick={() => setIsMobileOpen(false)} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Contact Us
              </Link>

              <div className="w-full pt-4 border-t dark:border-slate-800 mt-2">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link 
                      href={isAdmin ? "/admin/dashboard" : isCollector ? "/dashboard/collector" : "/dashboard"} 
                      onClick={() => setIsMobileOpen(false)}
                      className="text-green-700 dark:text-green-400 font-bold"
                    >
                      {isAdmin ? "Go to Admin Dashboard" : isCollector ? "Go to Collector Dashboard" : "Go to Dashboard"}
                    </Link>
                    <Button variant="outline" onClick={() => { signOut(); setIsMobileOpen(false); }}>Sign Out</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <RegisterDialog />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default GreenLoopNavBar;
