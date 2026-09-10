import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Coffee,
  ExternalLink,
  Phone,
  Lock,
  Calendar,
  Users,
  Eye,
  Camera,
  X,
} from 'lucide-react';

const GALLERY_PHOTOS = [
  {
    url: '/photos/hall1.jpeg',
    title: 'Main 80-Seater Reading Hall',
    desc: 'Spacious, air-conditioned hall with numbered personal study cubicles and ambient lighting.',
  },
  {
    url: '/photos/hall2.jpeg',
    title: 'Quiet Study Aisle & Numbered Desks',
    desc: 'Wide corridors, polished marble floors, and comfortable high-back revolving chairs.',
  },
  {
    url: '/photos/hall3.jpeg',
    title: 'Individual Cubicles with Private Lockers',
    desc: 'Numbered desks 12, 13, 14, 15, 16... with dedicated key lockers right above your seat.',
  },
  {
    url: '/photos/amenities.jpeg',
    title: 'Blue Star RO Water & Hot Tea/Coffee Station',
    desc: 'Clean pantry equipped with chilled RO water dispenser and hot beverage machine.',
  },
];

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
      {/* 1. Official Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-stone-900 text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.12),transparent_65%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Shivaji Enclave, Tagore Garden Extension • New Delhi</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black border border-amber-500/40 p-1.5 shadow-md flex items-center justify-center">
                    <img src="/photos/real-logo.jpeg" alt="Shivaji Library Official Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-400 tracking-widest uppercase">
                      SHIVAJI LIBRARY
                    </span>
                    <p className="text-[11px] text-slate-400 uppercase font-semibold">
                      Focus Today, Success Tomorrow
                    </p>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
                  YOUR SPACE. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                    YOUR TIME.
                  </span> <br />
                  YOUR SUCCESS.
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                <strong>A quiet place to achieve more.</strong> An 80-seater modern study sanctuary equipped with individual numbered cubicles, comfortable revolving chairs, key lockers, high-speed fiber Wi-Fi, and 100% peaceful silence.
              </p>

              {/* Key Facility Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-sm">
                  <Users className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">80-Seater Capacity</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-sm">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Personal Key Lockers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">05:00 AM – 11:30 PM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to="/register"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>Choose Your Plan (From ₹800)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:9319880227"
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call 9319880227</span>
                </a>
              </div>
            </div>

            {/* Right Column: Actual Real Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div
                  onClick={() => setSelectedImage({ url: '/photos/hall1.jpeg', title: 'Shivaji Library Real Reading Hall' })}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group cursor-pointer"
                >
                  <img
                    src="/photos/hall1.jpeg"
                    alt="Shivaji Library Real Study Hall"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Actual Interior Photo • Shivaji Library</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Dedicated Study Hall</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Numbered cubicles, ergonomic black rolling chairs, air conditioning, and personal lockers.
                    </p>
                    <span className="mt-2 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Click to zoom photo
                    </span>
                  </div>
                </div>

                {/* Floating micro price card */}
                <div className="absolute -bottom-5 -left-5 bg-neutral-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-lg">
                    ₹
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-400">Half Day: ₹800 • Full Day: ₹1,500</p>
                    <p className="text-[11px] text-slate-400">Full Day + Locker: ₹1,800/Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real Photo Gallery of Shivaji Library */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-widest">
              <Camera className="w-4 h-4" />
              <span>Real Photo Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">
              Explore Our Actual Study Hall
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Photographed directly on-site at Plot No. FC-4, Mehta Chowk, Shivaji Enclave.
            </p>
          </div>
          <button
            onClick={() => setSelectedImage({ url: '/official-poster.png', title: 'Official Shivaji Library Poster' })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-extrabold hover:bg-amber-100 transition"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>View Official Brochure</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col"
            >
              <div className="relative h-60 bg-slate-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                    <Eye className="w-3.5 h-3.5" /> View Photo
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Official "CHOOSE YOUR PLAN" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold text-xs uppercase tracking-widest">
            <span>CHOOSE YOUR PLAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Official Membership Pricing
          </h2>
          <p className="text-slate-600 text-sm">
            Reserve your seat at Shivaji Library. All plans include air conditioning, high-speed fiber Wi-Fi, and pin-drop silence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Half Day */}
          <div className="bg-amber-50/50 rounded-3xl p-8 border-2 border-amber-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-800 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">₹800</span>
                  <span className="text-xs text-slate-500 font-bold">/ Month</span>
                </div>
                <div className="mt-3 inline-block px-3 py-1.5 rounded-xl bg-amber-400/30 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  HALF DAY RESERVE SEAT
                </div>
              </div>

              <p className="text-xs font-medium text-slate-600 italic">
                &ldquo;Perfect for focused half-day sessions&rdquo;
              </p>

              <ul className="space-y-2.5 pt-4 border-t border-amber-200/60 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Morning or Evening Shift Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-Speed Fiber Wi-Fi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Power Socket & Desk Light</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Air-Conditioned & RO Water</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register?plan=half_day"
              className="mt-8 block text-center py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Reserve Half Day Seat
            </Link>
          </div>

          {/* Plan 2: Full Day for a Month (Most Popular) */}
          <div className="bg-gradient-to-b from-neutral-900 to-black text-white rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-3 border-2 border-amber-500">
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 text-[11px] font-black uppercase px-4 py-1 rounded-full shadow">
              ★ Most Popular Choice
            </div>

            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">₹1500</span>
                  <span className="text-xs text-amber-300 font-bold">/ Month</span>
                </div>
                <div className="mt-3 inline-block px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider">
                  FULL DAY RESERVE SEAT FOR A MONTH
                </div>
              </div>

              <p className="text-xs font-semibold text-amber-200 italic">
                &ldquo;Study all day, every day&rdquo;
              </p>

              <ul className="space-y-2.5 pt-4 border-t border-neutral-800 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Full Day Reserved Seat (05:00 AM – 11:30 PM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fixed Numbered Study Cubicle</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Comfortable Ergonomic Revolving Chair</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>High-Speed Fiber Wi-Fi & Power Backup</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Separate Dining Area & Parking</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register?plan=full_day"
              className="mt-8 block text-center py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs uppercase tracking-wider shadow-lg transition"
            >
              Reserve Full Day Seat
            </Link>
          </div>

          {/* Plan 3: Full Day with Locker */}
          <div className="bg-amber-50/50 rounded-3xl p-8 border-2 border-amber-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-800 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">₹1800</span>
                  <span className="text-xs text-slate-500 font-bold">/ Month</span>
                </div>
                <div className="mt-3 inline-block px-3 py-1.5 rounded-xl bg-amber-400/30 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  FULL DAY RESERVE SEAT WITH LOCKER
                </div>
              </div>

              <p className="text-xs font-medium text-slate-600 italic">
                &ldquo;Your seat. Your things. Always secure&rdquo;
              </p>

              <ul className="space-y-2.5 pt-4 border-t border-amber-200/60 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Day Reserved Seat + Private Key Locker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Leave Heavy Books & Notes Safely Overnight</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Access (05:00 AM – 11:30 PM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ergonomic Rolling Chair & High-Speed Wi-Fi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CCTV Surveillance & Full Power Backup</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register?plan=full_day_locker"
              className="mt-8 block text-center py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Reserve Seat + Locker
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Location & Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-950 text-white rounded-3xl border border-neutral-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl">
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest">
                VISIT US TODAY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white">
                Shivaji Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Come for a free desk tour and feel the pin-drop silence before reserving your seat.
              </p>

              <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Address:</strong>
                    <span>Plot no -FC4 (near gurudwara) Mehta Chowk, Shivaji Enclave, Tagore Garden Extension, New Delhi - 110027</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Call / WhatsApp:</strong>
                    <a href="tel:9319880227" className="text-amber-300 hover:underline font-bold">
                      9319880227
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Timings:</strong>
                    <span>05:00 AM – 11:30 PM (7 Days a week)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 transition"
              >
                <span>Navigate via Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="tel:9319880227"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition border border-white/20"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 h-80 sm:h-96 lg:h-auto min-h-[360px] relative bg-neutral-900">
            <iframe
              title="Shivaji Library Location Map"
              src="https://maps.google.com/maps?q=Plot+No.+F-4,+near+Gurudwara,+Mehta+Chowk,+Block+FC,+Shivaji+Enclave,+Tagore+Garden+Extension,+New+Delhi,+Delhi+110027&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-700">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center font-bold hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="p-5 text-white">
              <h4 className="font-bold text-base">{selectedImage.title}</h4>
              {selectedImage.desc && <p className="text-xs text-slate-400 mt-1">{selectedImage.desc}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;