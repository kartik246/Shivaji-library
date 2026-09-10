import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Clock, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">Shivaji Library</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A serene, premium study and reading space in Tagore Garden Extension, New Delhi. Designed for civil service aspirants, college scholars, competitive exam candidates, and avid readers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Air Conditioned • High-Speed Wi-Fi • Power Sockets
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-blue-400 transition">Book Showcase & Catalog</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition">Membership Plans & Registration</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">About Shivaji Library</Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-blue-400 transition">Location & Directions</Link>
              </li>
              <li>
                <Link to="/member/login" className="hover:text-blue-400 transition">Member Self-Service Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings & Plans */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Timings & Plans</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">Library Hours</p>
                  <p className="text-xs">Monday – Sunday (7 Days Open)</p>
                  <p className="text-xs text-slate-300">7:00 AM – 10:00 PM</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <p className="font-medium text-slate-200">Membership Passes:</p>
                <p>• Monthly Pass: <span className="text-white font-bold">₹800</span></p>
                <p>• Quarterly Pass: <span className="text-white font-bold">₹2,200</span></p>
                <p>• Annual Pass: <span className="text-white font-bold">₹8,000</span></p>
              </div>
            </div>
          </div>

          {/* Col 4: Location (Source of Truth) */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Location (Delhi)</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <address className="not-italic text-xs leading-relaxed text-slate-300">
                  Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027
                </address>
              </div>
              <div>
                <a
                  href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 transition"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>contact@shivajilibrary.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shivaji Library. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/location" className="hover:text-slate-400">Directions</Link>
            <Link to="/register" className="hover:text-slate-400">Join Library</Link>
            <Link to="/admin/login" className="hover:text-slate-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
