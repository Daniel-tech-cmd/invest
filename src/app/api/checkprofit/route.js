import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import { resolvePlan } from "../../lib/plans";
import { getCustomPlansForUser } from "../../../lib/customPlansData";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HOUR_MS = 60 * 60 * 1000;

// The old app's version of this cron had zero auth and an unused node-cron
// import — nothing actually scheduled it, and anyone who found the URL could
// spam it to inflate every user's balance. A real external scheduler (e.g.
// Vercel Cron) sends `Authorization: Bearer <CRON_SECRET>`; a `?secret=` param
// is also accepted for manual/other-provider triggering.
function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectToDB();

  // Only users with at least one still-accruing deposit are worth loading.
  const users = await User.find({ "activeDeposit.stopped": false });

  let usersUpdated = 0;
  let depositsMatured = 0;
  let saveFailures = 0;

  for (const user of users) {
    let anyChange = false;
    const earnHistoryEntries = [];
    let customPlansForUser = null; // fetched lazily, at most once per user

    for (const deposit of user.activeDeposit) {
      if (deposit.stopped) continue;

      if (customPlansForUser === null) {
        customPlansForUser = await getCustomPlansForUser(user._id.toString());
      }
      const plan = resolvePlan(deposit.plan, customPlansForUser);
      if (!plan) continue; // plan no longer resolvable (e.g. a custom plan was deleted) — leave untouched

      const maturityTime = new Date(deposit.date).getTime() + plan.days * 24 * HOUR_MS;
      const now = Date.now();
      const lastAccrued = deposit.lastAccruedAt ? new Date(deposit.lastAccruedAt).getTime() : new Date(deposit.date).getTime();

      // Never accrue past the instant the plan actually matures — this run
      // might be the one that crosses that line mid-interval.
      const accrualEnd = Math.min(now, maturityTime);
      const hoursElapsed = Math.max(0, (accrualEnd - lastAccrued) / HOUR_MS);

      if (hoursElapsed > 0) {
        const hourlyRate = plan.rate / 24 / 100; // plan.rate is a daily percent
        const profit = Math.round(deposit.amount * hourlyRate * hoursElapsed * 100) / 100;
        if (profit > 0) {
          // Real-time profit is tracked here (and in earnHistory, for the
          // dashboard's "profit today" widget) — NOT added to user.balance
          // or user.profit yet. Crediting spendable balance for a still-
          // active, unmatured deposit is what let Reinvest double-spend
          // money that was simultaneously still locked inside this same
          // deposit. It's only realized into balance once, at maturity below.
          deposit.profit = (deposit.profit || 0) + profit;
          earnHistoryEntries.push({ amount: profit, plan: deposit.plan, depositAmount: deposit.amount, date: new Date() });
          anyChange = true;
        }
        deposit.lastAccruedAt = new Date(accrualEnd);
      }

      if (now >= maturityTime) {
        const accruedProfit = deposit.profit || 0;
        const reinvestedPrincipal = deposit.balanceDeductedAmount || 0;

        if (accruedProfit > 0) {
          user.balance = (user.balance || 0) + accruedProfit;
          user.profit = (user.profit || 0) + accruedProfit;
        }
        if (reinvestedPrincipal > 0) {
          user.balance = (user.balance || 0) + reinvestedPrincipal;
        }
        deposit.balanceDeductedAmount = 0;
        deposit.stopped = true;
        depositsMatured++;
        anyChange = true;
      }
    }

    if (earnHistoryEntries.length > 0) {
      user.earnHistory.push(...earnHistoryEntries);
    }

    if (anyChange) {
      try {
        await user.save();
        usersUpdated++;
      } catch (err) {
        // A concurrent admin action (approve/withdraw/etc.) on this exact
        // user between our read and save loses the optimistic-concurrency
        // check — skip them this cycle, they're caught up next run since
        // accrual is elapsed-time-based, not a fixed "one hour" assumption.
        console.error(`checkprofit: failed to save user ${user._id}:`, err.message);
        saveFailures++;
      }
    }
  }

  return Response.json({ ok: true, usersScanned: users.length, usersUpdated, depositsMatured, saveFailures });
}
