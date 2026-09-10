import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendMailHelper = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();
  const from = process.env.EMAIL_FROM || "Shivaji Library <noreply@shivajilibrary.com>";

  if (!mailer) {
    console.log("--------------------------------------------------");
    console.log(`📨 [SIMULATED EMAIL] To: ${to}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📝 Content:\n${text || html}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const info = await mailer.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, info };
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

export const sendRegistrationEmail = async (member) => {
  const subject = `Welcome to Shivaji Library! Registration Received`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1e3a8a; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Shivaji Library</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Membership & Study Space</p>
      </div>
      <div style="padding: 24px;">
        <h2>Hello ${member.name},</h2>
        <p>Thank you for registering at <strong>Shivaji Library</strong>! We are excited to welcome you to our peaceful and productive study community.</p>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Plan Selected:</strong> ${member.plan.toUpperCase()}</p>
          <p style="margin: 4px 0;"><strong>Membership Fee:</strong> ₹${member.feeAmount}</p>
          <p style="margin: 4px 0;"><strong>Current Status:</strong> <span style="color: #ea580c; font-weight: bold;">Pending First Payment</span></p>
        </div>

        <p>Your account has been created. Once your first payment is confirmed online or at the library desk, your membership will become active.</p>

        <p style="margin-top: 24px;">
          <strong>Library Address:</strong><br/>
          Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027<br/>
          <a href="https://maps.app.goo.gl/7iusFAvcd2ZNShiL8" style="color: #2563eb;">View on Google Maps</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">Warm regards,<br/>Shivaji Library Administration Team</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: member.email,
    subject,
    html,
    text: `Hello ${member.name},\n\nThank you for registering at Shivaji Library! Your membership plan is ${member.plan} (₹${member.feeAmount}). Status is pending first payment.\n\nAddress: Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi 110027`,
  });
};

export const sendRenewalReminderEmail = async (member, daysLeft) => {
  const subject = `Reminder: Your Shivaji Library Membership Expires in ${daysLeft} Day${daysLeft === 1 ? "" : "s"}`;
  const expiryFormatted = new Date(member.membershipEndDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #b45309; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Shivaji Library Renewal Alert</h1>
      </div>
      <div style="padding: 24px;">
        <h2>Dear ${member.name},</h2>
        <p>This is a friendly reminder that your <strong>${member.plan}</strong> membership is due to expire soon.</p>
        
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Expiry Date:</strong> ${expiryFormatted}</p>
          <p style="margin: 4px 0;"><strong>Days Remaining:</strong> <span style="color: #b45309; font-weight: bold;">${daysLeft} days</span></p>
          <p style="margin: 4px 0;"><strong>Renewal Amount:</strong> ₹${member.feeAmount}</p>
        </div>

        <p>To avoid any interruption to your study slot and library facilities, please renew your membership promptly via the Member Portal or in person at the reception desk.</p>

        <p style="text-align: center; margin: 28px 0;">
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/member/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Renew Online Now</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">Shivaji Library | Tagore Garden Extension, New Delhi</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: member.email,
    subject,
    html,
    text: `Dear ${member.name},\n\nYour Shivaji Library membership expires on ${expiryFormatted} (${daysLeft} days left). Please renew online or at the reception desk.\n\nLogin to renew: ${process.env.CLIENT_URL || "http://localhost:5173"}/member/login`,
  });
};

export const sendPaymentReceiptEmail = async (member, payment) => {
  const subject = `Payment Receipt - Shivaji Library Membership (₹${payment.amount})`;
  const startFormatted = new Date(payment.periodStart).toLocaleDateString("en-IN");
  const endFormatted = new Date(payment.periodEnd).toLocaleDateString("en-IN");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #047857; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 24px;">Shivaji Library</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Payment Confirmation & Receipt</p>
      </div>
      <div style="padding: 24px;">
        <h2>Thank you, ${member.name}!</h2>
        <p>We have successfully received your membership fee payment. Your active period has been updated.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Transaction ID</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${payment.transactionId || "N/A"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Amount Paid</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #047857;">₹${payment.amount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Payment Method</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${payment.method}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Valid From</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${startFormatted}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Valid Until</td>
            <td style="padding: 8px 0; font-weight: bold; text-align: right;">${endFormatted}</td>
          </tr>
        </table>

        <p>Your membership status is now <span style="color: #047857; font-weight: bold;">ACTIVE</span>.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">Shivaji Library | Plot No. F-4, near Gurudwara, Mehta Chowk, Block FC, Shivaji Enclave, Tagore Garden Extension, New Delhi, Delhi 110027</p>
      </div>
    </div>
  `;

  return sendMailHelper({
    to: member.email,
    subject,
    html,
    text: `Payment Receipt: Received ₹${payment.amount} via ${payment.method}. Active period: ${startFormatted} to ${endFormatted}. Thank you!`,
  });
};
