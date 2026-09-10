export const PLAN_CONFIG = {
  half_day: {
    id: "half_day",
    name: "Half Day Reserve Seat",
    durationDays: 30,
    price: 800,
    subtitle: "Perfect for focused half-day sessions",
    description: "Reserved study desk for morning or evening shift. Pin-drop silence and high-speed Wi-Fi.",
  },
  full_day: {
    id: "full_day",
    name: "Full Day Reserve Seat (Monthly)",
    durationDays: 30,
    price: 1500,
    subtitle: "Study all day, every day",
    description: "100% reserved desk with numbered cubicle. Full day uninterrupted access.",
    popular: true,
  },
  full_day_locker: {
    id: "full_day_locker",
    name: "Full Day Reserve Seat with Locker",
    durationDays: 30,
    price: 1800,
    subtitle: "Your seat. Your things. Always secure",
    description: "Full day reserved study cubicle plus private key-locked wooden locker for heavy books and laptop.",
  },
  // Backward compatibility
  monthly: {
    id: "monthly",
    name: "Full Day Reserve Seat",
    durationDays: 30,
    price: 1500,
    subtitle: "Study all day, every day",
    description: "Full day uninterrupted study desk for 30 days.",
  },
  quarterly: {
    id: "quarterly",
    name: "Full Day Seat with Locker",
    durationDays: 90,
    price: 4500,
    subtitle: "3-Month Pass with Locker",
    description: "Full access for 3 months with personal locker.",
  },
  yearly: {
    id: "yearly",
    name: "Annual Reserve Seat with Locker",
    durationDays: 365,
    price: 16000,
    subtitle: "Annual Full Access with Locker",
    description: "Complete 365 days reserved study cubicle and locker.",
  },
};

export const getPlanDurationDays = (plan) => {
  return PLAN_CONFIG[plan]?.durationDays || 30;
};

export const getPlanPrice = (plan) => {
  return PLAN_CONFIG[plan]?.price || 1500;
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