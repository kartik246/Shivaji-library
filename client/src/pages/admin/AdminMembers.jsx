import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Eye,
  SlidersHorizontal,
  CheckCircle,
  AlertCircle,
  X,
  UserCheck,
  Ban,
  Clock,
  RefreshCw,
} from 'lucide-react';

const PLAN_RATES = {
  half_day: 800,
  full_day: 1300,
  full_day_locker: 1500,
  monthly: 1300,
  quarterly: 3400,
  yearly: 13000,
};

const AdminMembers = () => {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState('joinDate_desc');

  // Modals
  const [detailModal, setDetailModal] = useState({ open: false, member: null, payments: [], loading: false });
  const [paymentModal, setPaymentModal] = useState({ open: false, member: null, amount: 800, method: 'cash', plan: 'monthly', notes: '' });
  const [statusModal, setStatusModal] = useState({ open: false, member: null, newStatus: 'active' });

  const [actionNotice, setActionNotice] = useState({ type: '', text: '' });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());
      if (sort) params.append('sort', sort);

      const res = await api.get(`/api/admin/members?${params.toString()}`);
      if (res.data.success) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, sort]);

  // Check if a member ID was passed in query to open modal
  useEffect(() => {
    const targetId = searchParams.get('id');
    if (targetId && members.length > 0) {
      const target = members.find((m) => m._id === targetId);
      if (target) {
        openPaymentModal(target);
      }
    }
  }, [searchParams, members]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const openDetailModal = async (member) => {
    setDetailModal({ open: true, member, payments: [], loading: true });
    try {
      const res = await api.get(`/api/admin/members/${member._id}`);
      if (res.data.success) {
        setDetailModal({ open: true, member: res.data.member, payments: res.data.payments, loading: false });
      }
    } catch (err) {
      setDetailModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const openPaymentModal = (member) => {
    setPaymentModal({
      open: true,
      member,
      amount: PLAN_RATES[member.plan] || 800,
      method: 'cash',
      plan: member.plan || 'monthly',
      notes: '',
    });
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/admin/members/${paymentModal.member._id}/payment`, {
        amount: Number(paymentModal.amount),
        method: paymentModal.method,
        plan: paymentModal.plan,
        notes: paymentModal.notes,
      });

      if (res.data.success) {
        setActionNotice({ type: 'success', text: res.data.message });
        setPaymentModal({ open: false, member: null, amount: 800, method: 'cash', plan: 'monthly', notes: '' });
        fetchMembers();
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: err.response?.data?.message || 'Error recording payment.',
      });
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/api/admin/members/${statusModal.member._id}/status`, {
        status: statusModal.newStatus,
      });

      if (res.data.success) {
        setActionNotice({ type: 'success', text: res.data.message });
        setStatusModal({ open: false, member: null, newStatus: 'active' });
        fetchMembers();
      }
    } catch (err) {
      setActionNotice({
        type: 'error',
        text: err.response?.data?.message || 'Error updating status.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* 1. Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Member Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, record desk payments, or update membership status.
          </p>
        </div>
        <a
          href="/api/admin/members/export"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export All to CSV</span>
        </a>
      </div>

      {/* Action Notice Alert */}
      {actionNotice.text && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-in fade-in ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{actionNotice.text}</span>
          <button onClick={() => setActionNotice({ type: '', text: '' })} className="font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* 2. Search, Status Tabs, & Sort */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'active', 'expiring', 'expired', 'pending', 'suspended'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="joinDate_desc">Join Date (Newest First)</option>
              <option value="joinDate_asc">Join Date (Oldest First)</option>
              <option value="expiry_asc">Expiry Date (Expiring First)</option>
              <option value="expiry_desc">Expiry Date (Latest)</option>
              <option value="name_asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Member Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading members list...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2 text-xs">
            <p className="font-bold text-slate-700 text-base">No members matched your query.</p>
            <p>Try resetting filters or searching with different keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase font-semibold">
                  <th className="py-3 px-4">Member Name & Contact</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Join Date</th>
                  <th className="py-3 px-4">Valid End Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {members.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.email}</div>
                      <div className="text-[11px] text-slate-400">{m.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-bold text-slate-800">
                      <div>{m.plan}</div>
                      <div className="text-[10px] text-slate-400 font-normal">₹{m.feeAmount}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(m.joinDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {new Date(m.membershipEndDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => openDetailModal(m)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Member Profile & Payment History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Record Fee Payment */}
                        <button
                          onClick={() => openPaymentModal(m)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition flex items-center gap-1"
                          title="Record Cash or UPI Fee Received"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>+ Pay</span>
                        </button>

                        {/* Change Status */}
                        <button
                          onClick={() => setStatusModal({ open: true, member: m, newStatus: m.status })}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Update Status (e.g. Suspend or Activate)"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. MEMBER DETAIL MODAL */}
      {detailModal.open && detailModal.member && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDetailModal({ open: false, member: null, payments: [], loading: false })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-900">{detailModal.member.name}</h2>
              <StatusBadge status={detailModal.member.status} />
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl mb-6">
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="font-semibold text-slate-800">{detailModal.member.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="font-semibold text-slate-800">{detailModal.member.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Plan:</span>
                <span className="font-semibold uppercase text-slate-800">{detailModal.member.plan} (₹{detailModal.member.feeAmount})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Address:</span>
                <span className="font-medium text-slate-800">{detailModal.member.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Join Date:</span>
                <span className="font-semibold text-slate-800">{new Date(detailModal.member.joinDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current End Date:</span>
                <span className="font-bold text-indigo-700">{new Date(detailModal.member.membershipEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Payment History */}
            <h3 className="font-bold text-sm text-slate-900 mb-3">Payment Log History</h3>
            {detailModal.loading ? (
              <p className="text-xs text-slate-400">Loading payments...</p>
            ) : detailModal.payments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No payments recorded for this member yet.</p>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                    <tr>
                      <th className="p-3">Txn ID</th>
                      <th className="p-3">Paid Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Period Extended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detailModal.payments.map((p) => (
                      <tr key={p._id}>
                        <td className="p-3 font-mono font-bold text-slate-800">{p.transactionId}</td>
                        <td className="p-3">{new Date(p.paidOn).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 font-bold text-emerald-700">₹{p.amount}</td>
                        <td className="p-3 uppercase font-semibold text-[11px]">{p.method}</td>
                        <td className="p-3 text-slate-600">
                          {new Date(p.periodStart).toLocaleDateString('en-IN')} → {new Date(p.periodEnd).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. RECORD PAYMENT MODAL */}
      {paymentModal.open && paymentModal.member && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setPaymentModal({ ...paymentModal, open: false })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Record Fee Payment</h3>
            <p className="text-xs text-slate-500 mb-4">
              Recording payment for <strong>{paymentModal.member.name}</strong> extends their membership pass cycle.
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pass Plan Cycle</label>
                <select
                  value={paymentModal.plan}
                  onChange={(e) => {
                    const newPlan = e.target.value;
                    setPaymentModal({
                      ...paymentModal,
                      plan: newPlan,
                      amount: PLAN_RATES[newPlan] || 800,
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                >
                  <option value="half_day">Half Day Reserved (30 Days - ₹800)</option>
                  <option value="full_day">Full Day Reserved (30 Days - ₹1,300)</option>
                  <option value="full_day_locker">Full Day + Locker (30 Days - ₹1,500)</option>
                  <option value="monthly">Monthly Pass (Legacy - ₹1,300)</option>
                  <option value="quarterly">Quarterly Pass (Legacy - ₹3,400)</option>
                  <option value="yearly">Annual Pass (Legacy - ₹13,000)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentModal.amount}
                  onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['cash', 'upi', 'card', 'online'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentModal({ ...paymentModal, method: m })}
                      className={`py-2 rounded-lg border text-center font-bold uppercase transition ${
                        paymentModal.method === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Notes / Receipt Ref</label>
                <input
                  type="text"
                  placeholder="e.g. Received cash at reception by front desk"
                  value={paymentModal.notes}
                  onChange={(e) => setPaymentModal({ ...paymentModal, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ ...paymentModal, open: false })}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm"
                >
                  Confirm & Extend Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. STATUS CHANGE MODAL */}
      {statusModal.open && statusModal.member && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setStatusModal({ ...statusModal, open: false })}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Update Member Status</h3>
            <p className="text-xs text-slate-500 mb-4">
              Change status for <strong>{statusModal.member.name}</strong>:
            </p>

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Status</label>
                <select
                  value={statusModal.newStatus}
                  onChange={(e) => setStatusModal({ ...statusModal, newStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold uppercase"
                >
                  <option value="active">Active</option>
                  <option value="expiring">Expiring</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModal({ ...statusModal, open: false })}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
