import cron from "node-cron";
import Member from "../models/Member.js";
import { sendRenewalReminderEmail } from "../utils/emailService.js";

export const runDailyStatusCheck = async () => {
  console.log("⏰ Running scheduled membership expiry and status check...");
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  let expiredCount = 0;
  let expiringCount = 0;
  let emailsSent = 0;

  try {
    // 1. Check expired memberships
    const expiredMembers = await Member.find({
      status: { $in: ["active", "expiring"] },
      membershipEndDate: { $lt: now },
    });

    for (const member of expiredMembers) {
      member.status = "expired";
      await member.save();
      expiredCount++;
    }

    // 2. Check expiring soon memberships (within next 7 days)
    const expiringMembers = await Member.find({
      status: "active",
      membershipEndDate: { $gte: now, $lte: sevenDaysFromNow },
    });

    for (const member of expiringMembers) {
      member.status = "expiring";

      // Check if reminder was sent within the last 24 hours
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const shouldSendEmail = !member.lastReminderSentAt || member.lastReminderSentAt < oneDayAgo;

      if (shouldSendEmail) {
        const daysLeft = Math.max(1, Math.ceil((new Date(member.membershipEndDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        await sendRenewalReminderEmail(member, daysLeft);
        member.lastReminderSentAt = now;
        emailsSent++;
      }

      await member.save();
      expiringCount++;
    }

    console.log(`✅ Expiry check completed: ${expiredCount} expired, ${expiringCount} expiring soon, ${emailsSent} reminder emails sent.`);
    return {
      success: true,
      expiredCount,
      expiringCount,
      emailsSent,
    };
  } catch (err) {
    console.error("❌ Error in membership status check:", err.message);
    return { success: false, error: err.message };
  }
};

export const initCronJobs = () => {
  // Run every day at 01:00 AM server time
  cron.schedule("0 1 * * *", async () => {
    await runDailyStatusCheck();
  });
  console.log("⏱️ Daily renewal reminder cron job scheduled (01:00 AM).");
};
