"use client";

import React from "react";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe, Smartphone, Mail, MapPin, Award } from "lucide-react";

const FooterIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-green-800 w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white">
    {children}
  </div>
);

const FooterComponent = () => {
  return (
    <footer className="bg-green-900 text-white">
      {/* --- Top: Company Logo & Slogan --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
          <div className="mr-4">
            <img src="/images/logo.png" alt="Green Loop Logo" className="h-12 w-auto" />
          </div>
          <div>
            <p className="font-bold text-lg">Managing Waste, Protecting Tomorrow</p>
            <p className="text-sm text-green-200">Sustainable solutions for a cleaner planet</p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <p className="text-sm md:mr-2">Stay Updated:</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="rounded-l-md p-2 text-black"
            />
            <button className="bg-green-700 hover:bg-green-800 px-4 rounded-r-md font-semibold">
              Subscribe
            </button>
          </div>
          <p className="text-xs mt-1 md:mt-0">We respect your privacy.</p>
        </div>
      </div>

      <hr className="border-green-700" />

      {/* --- Navigation Links --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Column 1: Services */}
        <div>
          <h4 className="font-bold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#residential" className="hover:text-green-200">Residential Waste Collection</a></li>
            <li><a href="#commercial" className="hover:text-green-200">Commercial & Industrial Solutions</a></li>
            <li><a href="#recycling" className="hover:text-green-200">Recycling Programs</a></li>
            <li><a href="#special-waste" className="hover:text-green-200">Special Waste Disposal</a></li>
            <li><a href="#consulting" className="hover:text-green-200">Consulting</a></li>
          </ul>
        </div>

        {/* Column 2: About Us */}
        <div>
          <h4 className="font-bold mb-4">About Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#mission" className="hover:text-green-200">Our Mission</a></li>
            <li><a href="#team" className="hover:text-green-200">Our Team</a></li>
            <li><a href="#sustainability" className="hover:text-green-200">Sustainability Report</a></li>
            <li><a href="#careers" className="hover:text-green-200">Careers</a></li>
            <li><a href="#news" className="hover:text-green-200">News & Blog</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h4 className="font-bold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#faq" className="hover:text-green-200">FAQs</a></li>
            <li><a href="#guidelines" className="hover:text-green-200">Disposal Guidelines</a></li>
            <li><a href="#areas" className="hover:text-green-200">Service Areas</a></li>
            <li><a href="#portal" className="hover:text-green-200">Client Portal</a></li>
            <li><a href="#forms" className="hover:text-green-200">Download Forms</a></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center"><FooterIcon><Smartphone className="w-4 h-4" /></FooterIcon> USSD / Mobile App: *777#</li>
            <li className="flex items-center"><FooterIcon><Mail className="w-4 h-4" /></FooterIcon> Email: customercare@waste.co.ke</li>
            <li className="flex items-center"><FooterIcon><MapPin className="w-4 h-4" /></FooterIcon> Head Office: Kolobot Rd, Eco Plaza</li>
            <li className="flex items-center"><FooterIcon><Smartphone className="w-4 h-4" /></FooterIcon> National Contact: 77777</li>
          </ul>
        </div>

        {/* Column 5: Social Media */}
        <div>
          <h4 className="font-bold mb-4">Connect With Us</h4>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Facebook', icon: Facebook, url: '#facebook' },
              { name: 'Instagram', icon: Instagram, url: '#instagram' },
              { name: 'Twitter / X', icon: Twitter, url: '#twitter' },
              { name: 'LinkedIn', icon: Linkedin, url: '#linkedin' },
              { name: 'YouTube', icon: Youtube, url: '#youtube' },
              { name: 'TikTok', icon: Globe, url: '#tiktok' },
              { name: 'WhatsApp', icon: Smartphone, url: '#whatsapp' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                aria-label={s.name}
                className="flex items-center text-sm font-medium hover:text-yellow-300 transition-colors"
              >
                <s.icon className="w-5 h-5 mr-1" />
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-green-700" />

      {/* --- Bottom Bar: Centered --- */}
      <div className="bg-green-800 py-4 text-center text-xs flex flex-col items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Green Loop. All Rights Reserved.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#privacy" className="hover:text-green-200">Privacy Policy</a>
          <a href="#tos" className="hover:text-green-200">Terms of Service</a>
          <a href="#sitemap" className="hover:text-green-200">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
