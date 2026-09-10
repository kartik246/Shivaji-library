import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Shield, LogOut, Menu, X, Clock, MapPin, Sparkles } from 'lucide-react';

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
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Tagore Garden Extension, New Delhi 110027
            </span>
            <span className="flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Open 7 Days: 7:00 AM – 10:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-300 font-medium">⚡ High-Speed Wi-Fi & AC Study Desks</span>
            <Link to="/admin/login" className="hover:text-white transition flex items-center gap-1 text-[11px] text-slate-400">
              <Shield className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight block group-hover:text-blue-600 transition">
                Shivaji Library
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase -mt-1 block">
                Study Space & Library
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/books') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Book Catalog
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/location"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/location') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Location & Timings
            </Link>

            {/* Admin specific tabs if logged in */}
            {role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 ml-2 rounded-md text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/members"
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition`}
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-semibold transition"
                >
                  <User className="w-4 h-4" />
                  <span>My Portal</span>
                  {user?.status && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 uppercase">
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
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-3.5 py-2 transition"
                >
                  Member Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  Join Library
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
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/books"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Book Catalog
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              to="/location"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Location & Timings
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {role === 'member' ? (
              <>
                <Link
                  to="/member/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium"
                >
                  My Member Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-600 font-medium"
                >
                  Log Out
                </button>
              </>
            ) : role === 'admin' ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/members"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-slate-100 text-slate-800 font-medium"
                >
                  Manage Members
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-600 font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white font-medium shadow"
                >
                  Join Shivaji Library
                </Link>
                <Link
                  to="/member/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-slate-100 text-slate-800 font-medium"
                >
                  Member Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs text-slate-500 font-medium"
                >
                  Admin Portal Login
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
