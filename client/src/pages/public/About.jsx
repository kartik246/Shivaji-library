import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Heart, Award, CheckCircle, MapPin, Users, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Mission Intro */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Our Story & Mission</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Where Ambitions Meet Peaceful Focus
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Founded with a singular vision: to eliminate every distraction standing between hardworking students, scholars, and their dreams.
        </p>
      </div>

      {/* 2. Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            A Haven for Dedicated Learners in Shivaji Enclave
          </h2>
          <p>
            Preparing for national competitive exams such as UPSC Civil Services, State PSCs, JEE, NEET, CA, and Banking requires hundreds of hours of deep, uninterrupted concentration. In a bustling city like Delhi, finding a peaceful, climate-controlled, and well-equipped place to study can make all the difference.
          </p>
          <p>
            <strong>Shivaji Library</strong> was established in Tagore Garden Extension to offer an uncompromising standard of study infrastructure: comfortable ergonomic seating, flicker-free reading lights, personal power sockets at each desk, high-speed fiber internet, and a sacred atmosphere of silence.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
            >
              <span>Join Shivaji Library Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500&q=80"
            alt="Library interior books"
            className="rounded-2xl shadow-sm object-cover h-60 w-full"
          />
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80"
            alt="Quiet study area"
            className="rounded-2xl shadow-sm object-cover h-60 w-full mt-6"
          />
        </div>
      </div>

      {/* 3. Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Absolute Silence</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Strict pin-drop silence rules enforced in all reading halls to safeguard your mental momentum.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Student First</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Affordable monthly, quarterly, and yearly passes with no hidden fees or locked-in annual contracts.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Dedicated Community</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Surround yourself with like-minded peers who are putting in the hours every single day.
          </p>
        </div>
      </div>

      {/* 4. Code of Conduct */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
        <h3 className="text-2xl font-bold">Library Rules & Reading Hall Etiquette</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            <span>Mobile phones must remain on silent or flight mode at all times inside the reading hall.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            <span>Phone calls and discussions are strictly reserved for the outdoor discussion terrace.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            <span>Please keep your allocated desk clean and dispose of water bottles or paper in designated bins.</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            <span>Membership cards must be verified upon entrance at the reception biometric/manual register.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
