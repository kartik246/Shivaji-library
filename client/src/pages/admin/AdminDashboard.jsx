import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  IndianRupee,
  BellRing,
  Download,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  BookOpen,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cronTriggerLoading, setCronTriggerLoading] = useState(false);
  const [cronNotice, setCronNotice] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTriggerReminders = async () => {
    setCronTriggerLoading(true);
    setCronNotice('');

    try {
      const res = await api.post('/api/admin/trigger-reminders');
      if (res.data.success) {
        const { expiredCount, expiringCount, emailsSent } = res.data.result || {};
        setCronNotice(
          `Checked memberships: ${expiredCount || 0} flagged expired, ${expiringCount || 0} expiring soon, ${emailsSent || 0} reminder emails dispatched.`
        );
        fetchStats(); // refresh counts
      }
    } catch (err) {
      setCronNotice('Failed to trigger reminder job: ' + (err.response?.data?.message || err.message));
    } finally {
      setCronTriggerLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/members/export', '_blank');
  };

  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentPayments = data?.recentPayments || [];
  const expiringMembersList = data?.expiringMembersList || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Admin Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Overview of members, upcoming expiry dates, revenue, and desk allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTriggerReminders}
            disabled={cronTriggerLoading}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold border border-amber-200 transition flex items-center gap-2 disabled:opacity-50"
            title="Run the automated expiry checker and email reminders right now"
          >
            <BellRing className="w-4 h-4 text-amber-600" />
            <span>{cronTriggerLoading ? 'Checking...' : 'Trigger Reminders Now'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Reminder Notification Banner */}
      {cronNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{cronNotice}</span>
          <button onClick={() => setCronNotice('')} className="text-amber-700 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Total Members */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.totalMembers || 0}</p>
          <p className="text-[11px] text-slate-500">Registered in system</p>
        </div>

        {/* Active Members */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{stats.activeMembers || 0}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Valid pass active</p>
        </div>

        {/* Expiring Soon (7 Days) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200 bg-amber-50/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider">Expiring (7 Days)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">
            {stats.expiringSoonMembers || 0}
          </p>
          <p className="text-[11px] text-amber-800 font-medium">Needs renewal follow-up</p>
        </div>

        {/* Expired Members */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Expired / Pending</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-700">
            {(stats.expiredMembers || 0) + (stats.pendingMembers || 0)}
          </p>
          <p className="text-[11px] text-slate-500">
            {stats.expiredMembers || 0} expired, {stats.pendingMembers || 0} pending
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Month Revenue</span>
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
            ₹{stats.revenueThisMonth?.toLocaleString('en-IN') || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            Total: ₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}
          </p>
        </div>
      </div>

      {/* 3. Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/members"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition group flex justify-between items-center"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Manage All Members →
            </h3>
            <p className="text-xs text-slate-500">Search, filter, record offline fee payments, or suspend</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/books"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition group flex justify-between items-center"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Book Catalog Manager →
            </h3>
            <p className="text-xs text-slate-500">Add, view, or remove books from the library collection</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </Link>

        <div
          onClick={handleExportCSV}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition group flex justify-between items-center cursor-pointer"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Download Member Roster →
            </h3>
            <p className="text-xs text-slate-500">Export complete list to spreadsheet compatible CSV</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Download className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Split Table: Expiring Members & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Expiring Members in Next 7 Days */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Members Expiring Within 7 Days</h2>
              <p className="text-xs text-slate-500">Send reminder or record renewal fee</p>
            </div>
            <Link to="/admin/members?status=expiring" className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>

          {expiringMembersList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No members are due for expiry in the next 7 days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {expiringMembersList.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-400">{m.phone}</div>
                      </td>
                      <td className="py-3 px-3 uppercase text-[11px] font-semibold">{m.plan}</td>
                      <td className="py-3 px-3 text-amber-700 font-semibold">
                        {new Date(m.membershipEndDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={m.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/admin/members?id=${m._id}`}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition text-[11px]"
                        >
                          Record Pay
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Payment Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Payment Receipts</h2>
              <p className="text-xs text-slate-500">Latest online & cash transactions</p>
            </div>
          </div>

          {recentPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No recent payments logged.</div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div
                  key={p._id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">
                      {p.memberId?.name || 'Member'}{' '}
                      <span className="text-[10px] text-slate-400 uppercase">({p.method})</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(p.paidOn).toLocaleDateString('en-IN')} • Txn: {p.transactionId}
                    </div>
                  </div>
                  <div className="font-extrabold text-sm text-emerald-700">₹{p.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
