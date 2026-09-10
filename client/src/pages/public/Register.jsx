import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, ShieldCheck, AlertCircle, ArrowRight, Clock, Calendar, Lock } from 'lucide-react';

const PLAN_DATA = {
  half_day: {
    id: 'half_day',
    name: 'Half Day Reserve Seat',
    price: 800,
    days: 30,
    subtitle: 'Perfect for focused half-day sessions',
    icon: Clock,
  },
  full_day: {
    id: 'full_day',
    name: 'Full Day Reserve Seat (Monthly)',
    price: 1500,
    days: 30,
    subtitle: 'Study all day, every day',
    icon: Calendar,
    popular: true,
  },
  full_day_locker: {
    id: 'full_day_locker',
    name: 'Full Day Seat with Locker',
    price: 1800,
    days: 30,
    subtitle: 'Your seat. Your things. Always secure',
    icon: Lock,
  },
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, user, role } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    plan: 'full_day',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan && PLAN_DATA[urlPlan]) {
      setFormData((prev) => ({ ...prev, plan: urlPlan }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && role === 'member') {
      navigate('/member/dashboard');
    }
  }, [user, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        plan: formData.plan,
      });

      navigate('/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PLAN_DATA[formData.plan] || PLAN_DATA.full_day;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-black border border-amber-500/40 p-2.5 flex items-center justify-center mx-auto shadow-md">
          <img src="/logo.svg" alt="Shivaji Library" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
          Reserve Your Seat
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Shivaji Library • Plot no -FC4 (near gurudwara) Mehta Chowk, Shivaji Enclave
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection Cards */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
              1. Choose Official Study Plan *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {Object.entries(PLAN_DATA).map(([key, plan]) => {
                const isSelected = formData.plan === key;
                return (
                  <div
                    key={key}
                    onClick={() => setFormData({ ...formData, plan: key })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-xs text-slate-900 uppercase">
                          {plan.name}
                        </span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                      </div>
                      <p className="text-2xl font-black text-slate-900 mt-1">₹{plan.price}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">{plan.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Information */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              2. Member Details & Contact *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aman Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
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
                  placeholder="aman@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Shivaji Enclave, Tagore Garden Ext."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Security Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              3. Set Portal Password *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-bold text-amber-900">Seat Reservation Notice:</p>
              <p>
                Your account will be registered with status <strong className="text-amber-800">Pending</strong>. You can pay the membership fee of <strong>₹{selectedPlan.price}</strong> online or hand it over in cash/UPI directly at the library reception desk to activate your numbered desk pass.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              Already a member?{' '}
              <Link to="/member/login" className="text-amber-600 font-bold hover:underline">
                Sign in to Member Portal
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : `Reserve Seat (₹${selectedPlan.price})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;