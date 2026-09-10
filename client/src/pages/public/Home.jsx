import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  Clock,
  MapPin,
  Wifi,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Coffee,
  VolumeX,
  ExternalLink,
} from 'lucide-react';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await api.get('/api/books');
        if (res.data.success) {
          setFeaturedBooks(res.data.books.slice(0, 4));
        }
      } catch (e) {
        console.warn('Could not load books for homepage:', e.message);
      } finally {
        setLoadingBooks(false);
      }
    };
    loadBooks();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Now Open in Tagore Garden Extension, New Delhi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Unlock Deep Focus at <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                  Shivaji Library
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A modern, distraction-free study sanctuary crafted for civil services, medical, engineering, and competitive exam aspirants. Individual cubicles, high-speed Wi-Fi, air conditioning, and a curated book collection.
              </p>

              {/* Badges / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <VolumeX className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Pin-Drop Silence</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Open 7:00 AM – 10:00 PM</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                  <Wifi className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>High-Speed Wi-Fi</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>Book Your Study Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/location"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 transition inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Find On Map</span>
                </Link>
              </div>
            </div>

            {/* Right Images / Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                    alt="Shivaji Library quiet reading cubicles"
                    className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-widest">
                      Tagore Garden Extension
                    </span>
                    <h3 className="text-xl font-bold text-white">Dedicated Study Cubicles</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Equipped with personal power socket, LED reading light, and ergonomic backrest seating.
                    </p>
                  </div>
                </div>

                {/* Floating Micro Card */}
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Passes From ₹800/Month</p>
                    <p className="text-[11px] text-slate-500">Flexible monthly, quarterly & yearly plans</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Photo Gallery & Facility Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Atmosphere & Amenities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            A Purpose-Built Environment for Peak Productivity
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Every inch of Shivaji Library is engineered to reduce fatigue and encourage long, uninterrupted study hours.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Individual Power Ports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every desk has dedicated electrical sockets to keep your laptop, tablet, and mobile charged non-stop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">High-Speed Fiber Wi-Fi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ultra-reliable fiber internet with dual backup connections for seamless online lectures and mock test taking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Cool AC & Air Purified</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full climate control with fresh air circulation and clean RO drinking water available throughout the day.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Discussion & Break Area</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Separate zone for taking phone calls, having quick lunch or refreshments, without disturbing reading zones.
            </p>
          </div>
        </div>

        {/* Gallery Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="group relative rounded-2xl overflow-hidden shadow-sm h-64 border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
              alt="Shivaji Library quiet reading hall"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-sm font-semibold">Quiet Reading Hall</span>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden shadow-sm h-64 border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80"
              alt="Reference book stacks"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-sm font-semibold">Extensive Reference Collection</span>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden shadow-sm h-64 border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=600&q=80"
              alt="Personal study desks"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-sm font-semibold">Individual Desk Spaces</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Membership Plans Section */}
      <section className="bg-slate-100 py-16 lg:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Simple, Affordable Membership Plans
            </h2>
            <p className="text-slate-600 text-sm">
              All plans include complete access to study desks, Wi-Fi, air conditioning, and reference book collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Monthly */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Flexible</span>
                <h3 className="text-2xl font-bold text-slate-900">Monthly Pass</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹800</span>
                  <span className="text-xs text-slate-500">/ 30 days</span>
                </div>
                <p className="text-xs text-slate-600">Ideal for short-term focused preparation or trial periods.</p>
                <ul className="space-y-2.5 pt-4 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>7:00 AM – 10:00 PM Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>High-Speed Wi-Fi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Power socket & RO Water</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register?plan=monthly"
                className="mt-8 block text-center py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
              >
                Join with Monthly
              </Link>
            </div>

            {/* Quarterly - Most Popular */}
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl relative flex flex-col justify-between transform md:-translate-y-2 border-2 border-blue-400/50">
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow">
                Most Popular Choice
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Quarterly Saving</span>
                <h3 className="text-2xl font-bold text-white">Quarterly Pass</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹2,200</span>
                  <span className="text-xs text-blue-200">/ 90 days</span>
                </div>
                <p className="text-xs text-blue-100">Save ₹200 on regular monthly renewal fees.</p>
                <ul className="space-y-2.5 pt-4 text-xs text-blue-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Full 90 days uninterrupted access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Preferred desk allocation option</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Reference book borrowing rights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>Automated renewal expiry alerts</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register?plan=quarterly"
                className="mt-8 block text-center py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg transition"
              >
                Join with Quarterly
              </Link>
            </div>

            {/* Annual */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Best Value</span>
                <h3 className="text-2xl font-bold text-slate-900">Annual Pass</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹8,000</span>
                  <span className="text-xs text-slate-500">/ 365 days</span>
                </div>
                <p className="text-xs text-slate-600">Save ₹1,600 per year. Fixed desk reservation available.</p>
                <ul className="space-y-2.5 pt-4 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full 365 days access guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fixed locker & desk preference</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Highest cost savings for UPSC/JEE candidates</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register?plan=yearly"
                className="mt-8 block text-center py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
              >
                Join with Annual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Book Collection Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Book Showcase</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured In Our Reading Room</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Browse our curated reference titles available for in-library reading and study.
            </p>
          </div>
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingBooks ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={book.coverImageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        book.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {book.available ? 'In Library' : 'Reference Only'}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[11px] font-semibold text-blue-600 block uppercase tracking-wider">
                    {book.genre}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-slate-500">By {book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Location Section with Embedded Map (Source of Truth) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Location Info */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Find Us in Delhi</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-4">
                Visit Shivaji Library
              </h2>
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-slate-900">Exact Location Address:</p>
                    <p className="mt-1 leading-relaxed text-xs sm:text-sm text-slate-700">
                      Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-slate-900">Operational Hours:</p>
                    <p className="text-xs sm:text-sm text-slate-700">7:00 AM – 10:00 PM (Monday through Sunday, 7 Days Open)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span>Navigate on Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition"
              >
                Register as Member
              </Link>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-7 h-80 sm:h-96 lg:h-auto min-h-[350px] relative bg-slate-200">
            <iframe
              title="Shivaji Library Location Map"
              src="https://maps.google.com/maps?q=Plot+No.+F-4,+near+Gurudwara,+Mehta+Chowk,+Block+FC,+Shivaji+Enclave,+Tagore+Garden+Extension,+New+Delhi,+Delhi+110027&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
