export const PLAN_CONFIG = {
  half_day: {
    id: "half_day",
    name: "Half Day Reserved",
    durationDays: 30,
    price: 800,
    subtitle: "Perfect for focused half-day sessions",
    description: "Reserved study desk for morning or evening shift. Pin-drop silence and high-speed Wi-Fi.",
  },
  full_day: {
    id: "full_day",
    name: "Full Day Reserved",
    durationDays: 30,
    price: 1300,
    subtitle: "Study all day, every day",
    description: "100% reserved desk with numbered cubicle. Full day uninterrupted access.",
    popular: true,
  },
  full_day_locker: {
    id: "full_day_locker",
    name: "Full Day Reserved + Locker",
    durationDays: 30,
    price: 1500,
    subtitle: "Your seat. Your things. Always secure",
    description: "Full day reserved study cubicle plus private key-locked wooden locker for heavy books and laptop.",
  },
  // Backward compatibility
  monthly: {
    id: "monthly",
    name: "Full Day Reserved",
    durationDays: 30,
    price: 1300,
    subtitle: "Study all day, every day",
    description: "Full day uninterrupted study desk for 30 days.",
  },
  quarterly: {
    id: "quarterly",
    name: "Full Day Reserved (Quarterly)",
    durationDays: 90,
    price: 3400,
    subtitle: "3-Month Pass",
    description: "Full access for 3 months.",
  },
  yearly: {
    id: "yearly",
    name: "Annual Reserved Pass",
    durationDays: 365,
    price: 13000,
    subtitle: "Annual Full Access",
    description: "Complete 365 days reserved study cubicle.",
  },
};

export const getPlanDurationDays = (plan) => {
  return PLAN_CONFIG[plan]?.durationDays || 30;
};

export const getPlanPrice = (plan) => {
  return PLAN_CONFIG[plan]?.price || 1300;
};

export const calculateRenewalPeriod = (currentEndDate, plan) => {
  const days = getPlanDurationDays(plan);
  const now = new Date();

  // Whichever is later: today or current expiry date
  const baseDate = currentEndDate && new Date(currentEndDate) > now ? new Date(currentEndDate) : now;
  const newEndDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    periodStart: baseDate,
    periodEnd: newEndDate,
  };
};