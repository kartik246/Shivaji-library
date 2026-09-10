export const PLAN_CONFIG = {
  monthly: {
    name: "Monthly Pass",
    durationDays: 30,
    price: 800,
    description: "Full access for 30 days. Perfect for short-term focused exam prep.",
  },
  quarterly: {
    name: "Quarterly Pass",
    durationDays: 90,
    price: 2200,
    description: "Full access for 3 months. Save ₹200 on regular monthly fees.",
  },
  yearly: {
    name: "Annual Membership",
    durationDays: 365,
    price: 8000,
    description: "365 days uninterrupted study access. Best value with reserved perks.",
  },
};

export const getPlanDurationDays = (plan) => {
  return PLAN_CONFIG[plan]?.durationDays || 30;
};

export const getPlanPrice = (plan) => {
  return PLAN_CONFIG[plan]?.price || 800;
};

export const calculateRenewalPeriod = (currentEndDate, plan) => {
  const days = getPlanDurationDays(plan);
  const now = new Date();
  
  // Whichever is later: today's date or current membershipEndDate
  // So early renewals don't lose paid time!
  const baseDate = currentEndDate && new Date(currentEndDate) > now 
    ? new Date(currentEndDate) 
    : now;

  const newEndDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    periodStart: baseDate,
    periodEnd: newEndDate,
  };
};
