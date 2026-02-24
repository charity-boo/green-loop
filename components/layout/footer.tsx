"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Smartphone, Mail, MapPin } from "lucide-react";

const FooterComponent = () => {
  return (
    <footer className="bg-green-950 text-white border-t border-green-900/50">
      {/* --- Top Bar: Branding & Newsletter --- */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.png" alt="Green Loop Logo" width={40} height={40} className="rounded-full shadow-lg" />
          <div>
            <p className="font-black text-lg tracking-tight">Green Loop</p>
            <p className="text-xs text-green-400 font-bold uppercase tracking-widest">Ndagani Smart Waste</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto max-w-sm">
          <input
            type="email"
            placeholder="Subscribe for green tips"
            className="flex-grow rounded-l-xl p-3 text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 hover:bg-green-700 px-6 rounded-r-xl font-black text-xs text-white uppercase transition-all">
            Join
          </button>
        </div>
      </div>

      <hr className="border-white/5 mx-auto max-w-7xl" />

      {/* --- Links Section --- */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
        {/* Column 1: Explore */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-green-500">Explore</h4>
          <ul className="space-y-3 font-medium text-gray-400">
            <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
            <li><Link href="/about-us" className="hover:text-white transition-colors">About Mission</Link></li>
            <li><Link href="/community" className="hover:text-white transition-colors">Community Hub</Link></li>
            <li><Link href="/learning-hub/guides" className="hover:text-white transition-colors">Recycling Guides</Link></li>
          </ul>
        </div>

        {/* Column 2: Support */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-green-500">Support</h4>
          <ul className="space-y-3 font-medium text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/faqs" className="hover:text-white transition-colors">Help Center / FAQ</Link></li>
            <li><Link href="/report" className="hover:text-white transition-colors">Report an Issue</Link></li>
            <li><Link href="/service-areas" className="hover:text-white transition-colors">Service Areas</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-green-500">Get In Touch</h4>
          <ul className="space-y-4 font-medium text-gray-400">
            <li className="flex items-start gap-3">
              <Smartphone className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Hotline: 0800 123 456</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>hello@greenloop.co.ke</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>Ndagani, Chuka, Kenya</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Socials */}
        <div>
          <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-green-500">Connect</h4>
          <div className="flex gap-4">
            {[
              { icon: Facebook, url: '#facebook' },
              { icon: Instagram, url: '#instagram' },
              { icon: Twitter, url: '#twitter' },
              { icon: Linkedin, url: '#linkedin' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all transform hover:-translate-y-1"
              >
                <s.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="bg-black/20 py-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <p>&copy; {new Date().getFullYear()} Green Loop Ndagani. Built for the Future.</p>
          <div className="flex gap-6">
            <Link href="#privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
