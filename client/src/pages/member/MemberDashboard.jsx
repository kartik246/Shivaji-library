import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import {
  User,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Zap,
} from 'lucide-react';

const PLAN_RATES = {
  half_day: { name: 'Half Day Reserved', price: 800, days: 30 },
  full_day: { name: 'Full Day Reserved', price: 1300, days: 30 },
  full_day_locker: { name: 'Full Day + Locker', price: 1500, days: 30 },
  monthly: { name: 'Full Day Reserved', price: 1300, days: 30 },
};

const MemberDashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Renewal form state
  const [renewPlan, setRenewPlan] = useState(user?.plan || 'monthly');
  const [renewMethod, setRenewMethod] = useState('online');
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewMessage, setRenewMessage] = useState({ type: '', text: '' });

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, paymentsRes] = await Promise.all([
        api.get('/api/member/me'),
        api.get('/api/member/payments'),
      ]);

      if (profileRes.data.success) {
        setProfile(profileRes.data.member);
        updateUser(profileRes.data.member);
        setRenewPlan(profileRes.data.member.plan || 'monthly');
        setEditForm({
          name: profileRes.data.member.name,
          phone: profileRes.data.member.phone,
          address: profileRes.data.member.address,
        });
      }

      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.payments);
      }
    } catch (err) {
      console.error('Error fetching member data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRenew = async (e) => {
    e.preventDefault();
    setRenewLoading(true);
    setRenewMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/member/renew', {
        plan: renewPlan,
        method: renewMethod,
      });

      if (res.data.success) {
        setRenewMessage({ type: 'success', text: res.data.message });
        setProfile(res.data.member);
        updateUser(res.data.member);
        // Refresh payments list
        const payRes = await api.get('/api/member/payments');
        if (payRes.data.success) setPayments(payRes.data.payments);

        setTimeout(() => {
          setRenewModalOpen(false);
          setRenewMessage({ type: '', text: '' });
        }, 2000);
      }
    } catch (err) {
      setRenewMessage({
        type: 'error',
        text: err.response?.data?.message || 'Renewal failed. Please try again.',
      });
    } finally {
      setRenewLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const res = await api.put('/api/member/me', editForm);
      if (res.data.success) {
        setProfile(res.data.member);
        updateUser(res.data.member);
        setEditModalOpen(false);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const getDaysRemaining = (endDateStr) => {
    if (!endDateStr) return 0;
    const diffMs = new Date(endDateStr).getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const daysLeft = profile ? getDaysRemaining(profile.membershipEndDate) : 0;

  if (loading && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* 1. Header with Member Greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome, {profile?.name}
            </h1>
            <StatusBadge status={profile?.status} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Member ID: <span className="font-mono font-medium text-slate-700">{profile?._id}</span> • Registered on{' '}
            {new Date(profile?.joinDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => setRenewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Renew / Pay Pass</span>
          </button>
        </div>
      </div>

      {/* 2. Membership Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pass Validity Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Active Plan Pass
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-500/30 border border-blue-400/40 text-cyan-200 uppercase">
              {profile?.plan} pass
            </span>
          </div>

          <div>
            <p className="text-xs text-blue-200">Valid Until Date:</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {new Date(profile?.membershipEndDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="pt-3 border-t border-blue-800/80 flex justify-between items-center text-xs">
            <span className="text-blue-200">Days Remaining:</span>
            <span
              className={`font-extrabold text-sm px-2.5 py-0.5 rounded-md ${
                daysLeft > 7
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : daysLeft > 0
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-rose-500/30 text-rose-300'
              }`}
            >
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </span>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <User className="w-4 h-4 text-blue-600" />
            <span>Contact on Record</span>
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div>
              <span className="text-xs text-slate-400 block">Email:</span>
              <span className="font-semibold text-slate-900">{profile?.email}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Phone:</span>
              <span className="font-semibold text-slate-900">{profile?.phone}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Address:</span>
              <span className="text-xs font-medium text-slate-600 line-clamp-2">{profile?.address}</span>
            </div>
          </div>

          <button
            onClick={() => setEditModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 text-left pt-2 border-t border-slate-100"
          >
            Update Contact Info →
          </button>
        </div>

        {/* Library Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Study Space Hours</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p className="font-bold text-slate-900 text-sm">Open 7:00 AM – 10:00 PM</p>
            <p>Every day of the week, including Sundays and gazetted holidays.</p>
            <p className="text-[11px] text-slate-500 pt-1">
              Plot No. F-4, near Gurudwara, Mehta Chowk, Shivaji Enclave, Tagore Garden Ext.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs flex justify-between items-center">
            <span className="text-slate-500">WiFi SSID:</span>
            <span className="font-mono font-bold text-slate-800">Shivaji_Library_5G</span>
          </div>
        </div>
      </div>

      {/* 3. Payment History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Fee Payment History</h2>
            <p className="text-xs text-slate-500">Record of all fees received and renewal extensions</p>
          </div>
          <button
            onClick={() => setRenewModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            + Make a Renewal Payment
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <CreditCard className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No payment records found yet.</p>
            <p className="text-xs text-slate-500">
              Click &quot;Renew / Pay Pass&quot; to log your initial fee payment online.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Receipt / Txn ID</th>
                  <th className="py-3 px-4">Paid On</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Valid Period Covered</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.transactionId || p._id.slice(-8)}
                    </td>
                    <td className="py-3.5 px-4">
                      {new Date(p.paidOn).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700">₹{p.amount}</td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[11px] text-slate-600">
                      {p.method}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(p.periodStart).toLocaleDateString('en-IN')} →{' '}
                      {new Date(p.periodEnd).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RENEW MODAL */}
      {renewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setRenewModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Renew Membership Pass</h3>
              <p className="text-xs text-slate-500">
                Extend your study access. Early renewal preserves your remaining days!
              </p>
            </div>

            {renewMessage.text && (
              <div
                className={`mb-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  renewMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {renewMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{renewMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleRenew} className="space-y-5">
              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Pass Duration:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {Object.entries(PLAN_RATES).filter(([k]) => ['half_day', 'full_day', 'full_day_locker'].includes(k)).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRenewPlan(key)}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        renewPlan === key
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>{item.name.replace(' Pass', '')}</div>
                      <div className="text-sm font-extrabold mt-1">₹{item.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['online', 'upi', 'card'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRenewMethod(m)}
                      className={`p-2.5 rounded-xl border text-center font-semibold uppercase transition ${
                        renewMethod === m
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logic explanation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Shivaji Library Extension Policy:</p>
                <p>
                  Renewal begins from{' '}
                  <strong>
                    {new Date(profile?.membershipEndDate) > new Date()
                      ? `current expiry (${new Date(profile.membershipEndDate).toLocaleDateString('en-IN')})`
                      : `today (${new Date().toLocaleDateString('en-IN')})`}
                  </strong>
                  . You do not lose remaining paid days!
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                >
                  {renewLoading ? 'Processing...' : `Confirm & Pay ₹${PLAN_RATES[renewPlan].price}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Edit Contact Details</h3>
            <p className="text-xs text-slate-500 mb-4">Keep your phone and address updated with the desk team.</p>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <textarea
                  rows={2}
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
