import Member from "../models/Member.js";
import Payment from "../models/Payment.js";
import { PLAN_CONFIG, calculateRenewalPeriod } from "../config/plans.js";
import { runDailyStatusCheck } from "../services/cronService.js";
import { sendPaymentReceiptEmail } from "../utils/emailService.js";

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: "active" });
    const expiringSoonMembers = await Member.countDocuments({ status: "expiring" });
    const expiredMembers = await Member.countDocuments({ status: "expired" });
    const pendingMembers = await Member.countDocuments({ status: "pending" });
    const suspendedMembers = await Member.countDocuments({ status: "suspended" });

    // Revenue this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const paymentsThisMonth = await Payment.find({ paidOn: { $gte: startOfMonth } });
    const revenueThisMonth = paymentsThisMonth.reduce((sum, p) => sum + (p.amount || 0), 0);

    const allPayments = await Payment.find();
    const totalRevenue = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Recent payments
    const recentPayments = await Payment.find()
      .populate("memberId", "name email phone plan")
      .sort({ paidOn: -1 })
      .limit(5);

    // Members expiring in next 7 days (live query)
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringMembersList = await Member.find({
      status: { $in: ["active", "expiring"] },
      membershipEndDate: { $gte: now, $lte: inSevenDays },
    })
      .select("name email phone plan membershipEndDate status")
      .sort({ membershipEndDate: 1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        expiringSoonMembers: expiringMembersList.length,
        expiredMembers,
        pendingMembers,
        suspendedMembers,
        revenueThisMonth,
        totalRevenue,
      },
      recentPayments,
      expiringMembersList,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ success: false, message: "Error loading stats.", error: err.message });
  }
};

// GET /api/admin/members?status=&search=&sort=
export const getMembers = async (req, res) => {
  try {
    const { status, search, sort = "joinDate_desc" } = req.query;

    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { address: regex }];
    }

    let sortOption = { joinDate: -1 };
    if (sort === "joinDate_asc") sortOption = { joinDate: 1 };
    else if (sort === "joinDate_desc") sortOption = { joinDate: -1 };
    else if (sort === "expiry_asc") sortOption = { membershipEndDate: 1 };
    else if (sort === "expiry_desc") sortOption = { membershipEndDate: -1 };
    else if (sort === "name_asc") sortOption = { name: 1 };

    const members = await Member.find(query).select("-passwordHash").sort(sortOption);

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (err) {
    console.error("Get members error:", err);
    return res.status(500).json({ success: false, message: "Error fetching members.", error: err.message });
  }
};

// GET /api/admin/members/:id
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select("-passwordHash");
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    const payments = await Payment.find({ memberId: member._id }).sort({ paidOn: -1 });

    return res.status(200).json({
      success: true,
      member,
      payments,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching member details.", error: err.message });
  }
};

// POST /api/admin/members/:id/payment (Manual fee entry, e.g., cash / upi / card)
export const recordMemberPayment = async (req, res) => {
  try {
    const { amount, method = "cash", notes, plan: chosenPlan } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    const planToUse = chosenPlan && PLAN_CONFIG[chosenPlan] ? chosenPlan : member.plan;
    const paymentAmount = amount ? Number(amount) : PLAN_CONFIG[planToUse].price;

    // Extend from whichever is later: today or their current end date
    const { periodStart, periodEnd } = calculateRenewalPeriod(member.membershipEndDate, planToUse);

    member.plan = planToUse;
    member.feeAmount = paymentAmount;
    member.membershipEndDate = periodEnd;
    member.status = "active";
    await member.save();

    const payment = await Payment.create({
      memberId: member._id,
      amount: paymentAmount,
      paidOn: new Date(),
      method: method || "cash",
      periodStart,
      periodEnd,
      transactionId: `REC-${Date.now().toString().slice(-6)}`,
      notes: notes || `Admin recorded payment via ${method}`,
    });

    // Send receipt email
    sendPaymentReceiptEmail(member, payment).catch((err) =>
      console.warn("Could not dispatch receipt email:", err.message)
    );

    const sanitized = member.toObject();
    delete sanitized.passwordHash;

    return res.status(200).json({
      success: true,
      message: `Payment of ₹${paymentAmount} recorded. Membership extended to ${new Date(periodEnd).toLocaleDateString("en-IN")}.`,
      member: sanitized,
      payment,
    });
  } catch (err) {
    console.error("Record payment error:", err);
    return res.status(500).json({ success: false, message: "Error recording payment.", error: err.message });
  }
};

// PATCH /api/admin/members/:id/status
export const updateMemberStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "active", "expiring", "expired", "suspended"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    member.status = status;
    await member.save();

    const sanitized = member.toObject();
    delete sanitized.passwordHash;

    return res.status(200).json({
      success: true,
      message: `Member status updated to "${status}".`,
      member: sanitized,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error updating member status.", error: err.message });
  }
};

// GET /api/admin/members/export (CSV)
export const exportMembersCSV = async (req, res) => {
  try {
    const members = await Member.find().select("-passwordHash").sort({ joinDate: -1 });

    const headers = [
      "Member ID",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Plan",
      "Fee Amount (INR)",
      "Status",
      "Join Date",
      "Membership End Date",
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = members.map((m) => [
      escapeCSV(m._id),
      escapeCSV(m.name),
      escapeCSV(m.email),
      escapeCSV(m.phone),
      escapeCSV(m.address),
      escapeCSV(m.plan),
      escapeCSV(m.feeAmount),
      escapeCSV(m.status),
      escapeCSV(new Date(m.joinDate).toISOString().split("T")[0]),
      escapeCSV(new Date(m.membershipEndDate).toISOString().split("T")[0]),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="shivaji_library_members.csv"');

    return res.status(200).send(csvContent);
  } catch (err) {
    console.error("Export CSV error:", err);
    return res.status(500).json({ success: false, message: "Error exporting CSV.", error: err.message });
  }
};

// POST /api/admin/trigger-reminders (Manual trigger for automated reminder cron)
export const triggerReminders = async (req, res) => {
  try {
    const result = await runDailyStatusCheck();
    return res.status(200).json({
      success: true,
      message: "Daily status check and reminder job triggered successfully.",
      result,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error triggering reminders.", error: err.message });
  }
};
