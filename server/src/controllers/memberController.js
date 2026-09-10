import Member from "../models/Member.js";
import Payment from "../models/Payment.js";
import { PLAN_CONFIG, calculateRenewalPeriod } from "../config/plans.js";
import { sendPaymentReceiptEmail } from "../utils/emailService.js";

// GET /api/member/me
export const getMemberProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.user.id).select("-passwordHash");
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    return res.status(200).json({ success: true, member });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching profile.", error: err.message });
  }
};

// PUT /api/member/me
export const updateMemberProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const member = await Member.findById(req.user.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    if (name) member.name = name.trim();
    if (phone) member.phone = phone.trim();
    if (address) member.address = address.trim();

    await member.save();

    const sanitized = member.toObject();
    delete sanitized.passwordHash;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      member: sanitized,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error updating profile.", error: err.message });
  }
};

// GET /api/member/payments
export const getMemberPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ memberId: req.user.id }).sort({ paidOn: -1 });
    return res.status(200).json({ success: true, payments });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error fetching payments.", error: err.message });
  }
};

// POST /api/member/renew
export const renewMembership = async (req, res) => {
  try {
    const { plan: selectedPlan, method = "online", transactionId } = req.body;
    const member = await Member.findById(req.user.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }

    const planToApply = selectedPlan && PLAN_CONFIG[selectedPlan] ? selectedPlan : member.plan;
    const feeAmount = PLAN_CONFIG[planToApply].price;

    // Core business logic: extend from whichever is later — today's date or current membershipEndDate
    const { periodStart, periodEnd } = calculateRenewalPeriod(member.membershipEndDate, planToApply);

    member.plan = planToApply;
    member.feeAmount = feeAmount;
    member.membershipEndDate = periodEnd;
    member.status = "active";
    await member.save();

    const payment = await Payment.create({
      memberId: member._id,
      amount: feeAmount,
      paidOn: new Date(),
      method: method || "online",
      periodStart,
      periodEnd,
      transactionId: transactionId || `SHIVAJI-${Date.now().toString().slice(-6)}`,
      notes: `Online renewal for ${planToApply} pass`,
    });

    // Send receipt email
    sendPaymentReceiptEmail(member, payment).catch((err) =>
      console.warn("Could not dispatch receipt email:", err.message)
    );

    const sanitizedMember = member.toObject();
    delete sanitizedMember.passwordHash;

    return res.status(200).json({
      success: true,
      message: `Membership successfully renewed! Valid until ${new Date(periodEnd).toLocaleDateString("en-IN")}.`,
      member: sanitizedMember,
      payment,
    });
  } catch (err) {
    console.error("Renewal error:", err);
    return res.status(500).json({ success: false, message: "Error processing renewal.", error: err.message });
  }
};

// POST /api/member/create-payment-order (Razorpay or simulated order)
export const createPaymentOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const member = await Member.findById(req.user.id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found." });

    const targetPlan = plan && PLAN_CONFIG[plan] ? plan : member.plan;
    const amount = PLAN_CONFIG[targetPlan].price;

    // Check if Razorpay keys are configured
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const Razorpay = (await import("razorpay")).default;
      const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // amount in paise
        currency: "INR",
        receipt: `rcpt_${member._id.toString().slice(-6)}_${Date.now().toString().slice(-4)}`,
        notes: {
          memberId: member._id.toString(),
          plan: targetPlan,
        },
      };

      const order = await razorpayInstance.orders.create(options);
      return res.status(200).json({
        success: true,
        isRazorpay: true,
        keyId: process.env.RAZORPAY_KEY_ID,
        order,
        plan: targetPlan,
        amount,
      });
    }

    // Fallback test mode order
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    return res.status(200).json({
      success: true,
      isRazorpay: false,
      order: mockOrder,
      plan: targetPlan,
      amount,
      message: "Test Payment Mode active",
    });
  } catch (err) {
    console.error("Payment order error:", err);
    return res.status(500).json({ success: false, message: "Could not create payment order.", error: err.message });
  }
};
