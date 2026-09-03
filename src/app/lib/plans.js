// Single source of truth for plan economics — sourced from the old app's
// real checkprofit cron logic (rate + duration), not guessed. Calculator.jsx
// and Plans.jsx on the homepage currently have their own separate copies of
// this same data with the old, wrong numbers — flagged as a follow-up, not
// fixed here since it's outside this change's scope.
export const PLANS = {
  "Basic Plan": { rate: 4.6, days: 5, min: 100 },
  "Standard Plan": { rate: 6.8, days: 7, min: 500 },
  "Advanced Plan": { rate: 7.7, days: 7, min: 5000 },
  "Silver Plan": { rate: 8.4, days: 7, min: 10000 },
  "Gold Plan": { rate: 9.2, days: 7, min: 20000 },
};

// Once a deposit exists it may reference an admin-defined custom plan (see
// lib/customPlansData.js) instead of one of the 5 standard ones — this looks
// up either so progress/maturity still compute correctly. customPlansList is
// the caller's own visible custom plans (public + their private), fetched
// server-side and passed down — this file can't reach the DB itself since
// it's imported from client components too.
export function resolvePlan(planName, customPlansList = []) {
  if (PLANS[planName]) return PLANS[planName];
  const custom = customPlansList.find((p) => p.name === planName);
  return custom ? { rate: custom.rate, days: custom.days, min: custom.min } : null;
}

export function planProgress(deposit, customPlansList = []) {
  const plan = resolvePlan(deposit.plan, customPlansList);
  if (!plan) return { pct: 0, daysElapsed: 0, daysTotal: 0, matured: !!deposit.stopped };
  const daysElapsed = Math.floor((Date.now() - new Date(deposit.date).getTime()) / 86400000);
  const pct = Math.min(100, Math.max(0, (daysElapsed / plan.days) * 100));
  return { pct, daysElapsed: Math.min(daysElapsed, plan.days), daysTotal: plan.days, matured: !!deposit.stopped || daysElapsed >= plan.days };
}
