import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Lock, Zap, Clock, ShieldCheck, CheckCircle2, ArrowRight, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-amber-600 font-black text-xs uppercase tracking-widest">
          YOUR SPACE. YOUR TIME. YOUR SUCCESS.
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
          About Shivaji Library
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          A quiet place to achieve more. Built for civil services, medical, engineering, CA, and competitive exam aspirants who need uninterrupted, pin-drop silence in West Delhi.
        </p>
      </div>

      {/* Real Photo & Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-500/40">
          <img
            src="/actual-interior.png"
            alt="Shivaji Library Interior Study Hall"
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
            80-Seater Air-Conditioned Study Facility
          </h2>
          <p>
            <strong>Shivaji Library</strong> is located at Plot No. FC-4, near Gurudwara, Mehta Chowk, Shivaji Enclave (Tagore Garden Extension). Designed with an 80-seat capacity, every desk is an individual numbered cubicle providing complete privacy from visual distractions.
          </p>
          <p>
            Equipped with comfortable ergonomic revolving chairs, personal desk power outlets, LED lamps, assignable wooden key lockers, and clean RO drinking water, Shivaji Library gives you everything you need to study for 10+ hours a day with zero fatigue.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-md transition"
            >
              Reserve Your Seat Now
            </Link>
            <a
              href="tel:9319880227"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call: 9319880227</span>
            </a>
          </div>
        </div>
      </div>

      {/* Official Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Individual Numbered Cubicles</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Numbered desk spaces with dividers to prevent visual distractions and promote deep cognitive focus.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Private Key Lockers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Assignable wooden lockers with keys. Keep your thick books, test papers, and laptop safe overnight.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">08:00 AM – 10:00 PM Timings</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Early morning to late night study hours, 7 days a week, 365 days a year with full power backup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;