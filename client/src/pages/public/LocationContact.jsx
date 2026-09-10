import React, { useState } from 'react';
import api from '../../services/api';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

const LocationContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: '' });

    try {
      const res = await api.post('/api/contact', formData);
      if (res.data.success) {
        setStatus({
          loading: false,
          success: true,
          message: res.data.message || 'Thank you! Your inquiry has been sent to our desk team.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message: err.response?.data?.message || 'Failed to submit inquiry. Please try again or call us.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">Location & Inquiries</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Visit Us or Get in Touch</h1>
        <p className="text-slate-600 text-sm">
          We are centrally located in Tagore Garden Extension, West Delhi, easily accessible by Metro and bus networks.
        </p>
      </div>

      {/* Main Grid: Details + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Shivaji Library Contact Details
            </h2>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Physical Address</p>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027
                </p>
                <a
                  href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operating Timings</p>
                <p className="text-sm font-bold text-slate-900">7:00 AM – 10:00 PM</p>
                <p className="text-xs text-slate-500">Open 7 days a week, including Sundays and public holidays.</p>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reception Helpline</p>
                <p className="text-sm font-bold text-slate-900">+91 98765 43210</p>
                <p className="text-xs text-slate-500">Call during library operational hours</p>
              </div>
            </div>

            {/* Transit Advice */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase">Transit Directions:</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>Delhi Metro:</strong> Nearest station is <em>Tagore Garden (Blue Line)</em> or <em>Rajouri Garden (Blue & Pink Interchange)</em>, ~5-7 minutes via e-rickshaw.<br />
                • <strong>Landmark:</strong> Directly adjacent to Mehta Chowk Gurudwara in Block FC, Shivaji Enclave.
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Map + Inquiry Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-72 sm:h-80 relative bg-slate-100">
            <iframe
              title="Shivaji Library Map Embed"
              src="https://maps.google.com/maps?q=Plot+No.+F-4,+near+Gurudwara,+Mehta+Chowk,+Block+FC,+Shivaji+Enclave,+Tagore+Garden+Extension,+New+Delhi,+Delhi+110027&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Schedule a Visit</h3>

            {status.success === true && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{status.message}</span>
              </div>
            )}

            {status.success === false && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Question *</label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ask about slot timings, seat availability, or request a tour..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{status.loading ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationContact;
