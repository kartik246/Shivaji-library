import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    plan: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      required: [true, "Membership plan is required"],
    },
    feeAmount: {
      type: Number,
      required: [true, "Fee amount is required"],
      min: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    membershipEndDate: {
      type: Date,
      required: [true, "Membership end date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "expiring", "expired", "suspended"],
      default: "pending",
    },
    lastReminderSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful virtual to calculate remaining days
memberSchema.virtual("daysRemaining").get(function () {
  if (!this.membershipEndDate) return 0;
  const diffMs = new Date(this.membershipEndDate).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
});

memberSchema.set("toJSON", { virtuals: true });
memberSchema.set("toObject", { virtuals: true });

const Member = mongoose.model("Member", memberSchema);
export default Member;
