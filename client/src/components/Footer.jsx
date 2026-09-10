import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-slate-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-amber-500/40 p-2 flex items-center justify-center">
                <img src="/photos/logo.png" alt="Shivaji Library" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">SHIVAJI LIBRARY</span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Focus Today, Success Tomorrow
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Your Space. Your Time. Your Success. An 80-seater modern, distraction-free study sanctuary designed for competitive exams and focused learning in West Delhi.
            </p>
            <p className="text-xs font-semibold text-amber-400">
              &quot;A Quiet Place to Achieve More&quot;
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-medium">
              <li>
                <Link to="/" className="hover:text-amber-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-amber-400 transition">Reference Book Catalog</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-amber-400 transition">Reserve Your Seat (Plans)</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">Facilities & Rules</Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-amber-400 transition">Map & Metro Directions</Link>
              </li>
              <li>
                <Link to="/member/login" className="hover:text-amber-400 transition">Member Self-Service Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Plans */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Official Membership Plans
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex justify-between font-bold">
                  <span>Half Day Reserve Seat</span>
                  <span className="text-amber-400">₹800/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Perfect for focused half-day sessions</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-amber-500/40">
                <div className="flex justify-between font-bold">
                  <span>Full Day Reserve Seat</span>
                  <span className="text-amber-400">₹1,200/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Study all day, every day</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex justify-between font-bold">
                  <span>Full Day with Locker</span>
                  <span className="text-amber-400">₹1,800/mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Your seat. Your things. Always secure</p>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Visit or Contact
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed text-slate-300">
                  Plot no -FC4 (near gurudwara) Mehta Chowk, Shivaji Enclave, Tagore Garden Extension, New Delhi - 110027
                </address>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>05:00 AM – 11:30 PM (7 Days Open)</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:9319880227" className="font-bold text-amber-400 hover:underline text-sm">
                  +91 9319880227
                </a>
              </div>
              <div className="pt-2">
                <a
                  href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 transition"
                >
                  <span>Open on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Shivaji Library. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>80-Seater Capacity</span>
            <span>Air Conditioned</span>
            <span>Wi-Fi & Lockers</span>
            <Link to="/admin/login" className="hover:text-amber-400">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;