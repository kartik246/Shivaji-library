import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, LogOut, Menu, X, Clock, MapPin, Phone, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-neutral-950 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Plot no -FC4 (near gurudwara) Mehta Chowk, Tagore Garden Ext.
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              05:00 AM – 11:30 PM (7 Days Open)
            </span>
            <a href="tel:9319880227" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              +91 9319880227
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-medium tracking-wide">
              ★ Focus Today, Success Tomorrow
            </span>
            <Link to="/admin/login" className="hover:text-white transition flex items-center gap-1 text-[11px] text-slate-400">
              <Shield className="w-3 h-3" /> Staff Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Official Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-2 flex items-center justify-center shadow-md border border-amber-500/30 group-hover:scale-105 transition transform">
              <img src="/photos/logo.png" alt="Shivaji Library Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight block group-hover:text-amber-600 transition">
                  SHIVAJI LIBRARY
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 tracking-wider uppercase -mt-0.5 block">
                Focus Today, Success Tomorrow
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/') ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/books') ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
              }`}
            >
              Book Catalog
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/about') ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
              }`}
            >
              About & Facilities
            </Link>
            <Link
              to="/location"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/location') ? 'text-amber-600 bg-amber-50' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50'
              }`}
            >
              Location & Contact
            </Link>

            {role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-1.5 ml-2 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/members"
                  className="px-3 py-1.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition"
                >
                  Members
                </Link>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {role === 'member' && (
              <>
                <Link
                  to="/member/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs sm:text-sm font-bold transition"
                >
                  <User className="w-4 h-4 text-amber-700" />
                  <span>My Member Portal</span>
                  {user?.status && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 uppercase">
                      {user.status}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {role === 'admin' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                  ADMIN: {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            )}

            {!role && (
              <>
                <Link
                  to="/member/login"
                  className="text-xs sm:text-sm font-bold text-slate-700 hover:text-amber-600 px-3 py-2 transition"
                >
                  Member Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-100" />
                  Reserve Seat (From ₹800)
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-600"
            >
              Home
            </Link>
            <Link
              to="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-600"
            >
              Book Catalog
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-600"
            >
              About & Facilities
            </Link>
            <Link
              to="/location"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-600"
            >
              Location & Contact
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:9319880227"
              className="w-full text-center py-2.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call: 9319880227
            </a>
            {role === 'member' ? (
              <>
                <Link
                  to="/member/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-white font-bold"
                >
                  My Member Portal
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-600 font-bold text-xs"
                >
                  Log Out
                </button>
              </>
            ) : role === 'admin' ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-neutral-900 text-white font-bold"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-600 font-bold text-xs"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow"
                >
                  Reserve Seat (From ₹800)
                </Link>
                <Link
                  to="/member/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold"
                >
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;