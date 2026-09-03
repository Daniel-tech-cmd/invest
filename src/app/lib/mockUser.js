// Dynamic mock data standing in for the real API response, shaped to match
// the actual GoldGroveco User schema (balance, activeDeposit[], deposit[],
// withdraw[], profit, referralBonus, etc.) so swapping in a real fetch later
// is a drop-in replacement rather than a rewrite.

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export const mockUser = {
  id: "u_1", // matches the admin-side record in lib/mockUsers.js — same person
  username: "amara_o",
  fullName: "Amara O.",
  email: "amara@example.com",
  accountId: "GGC-482137",
  avatar: null,
  gender: "Female",
  createdAt: daysAgo(210),

  balance: 12480.65,
  totalDeposit: 15500,
  totalWithdraw: 3200,
  profit: 2680.65,
  referralBonus: 420,
  promoBonus: 0,
  pendingWithdrawals: 0,

  activereferrals: 6,
  referralCode: "amara_o",

  // People who signed up with Amara's referral link — "verified" means
  // they've made at least one approved deposit (the point at which the
  // referral bonus is actually paid out).
  referals: [
    { name: "jasmine_k", id: "a1b2c3d4", verified: true },
    { name: "marcus_t", id: "e5f6g7h8", verified: true },
    { name: "priya_s", id: "i9j0k1l2", verified: true },
    { name: "dwayne_f", id: "m3n4o5p6", verified: true },
    { name: "chidi_o", id: "q7r8s9t0", verified: true },
    { name: "lena_m", id: "u1v2w3x4", verified: true },
    { name: "sam_r", id: "y5z6a7b8", verified: false },
    { name: "tosin_a", id: "c9d0e1f2", verified: false },
  ],

  // Payout wallets the user has saved on their profile — withdrawals can only
  // be sent to a coin that has an address set here. Left unset for coins the
  // user hasn't configured yet, matching the real profile/edit flow.
  usdtAccountId: "TXn9k2FqZ8mR4dP1vC7yB3xW6sL0uAq4kQ2",
  usdtNetwork: "TRC-20",
  bitcoinAccountId: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",

  activeDeposit: [
    {
      id: "ad_1",
      plan: "Standard Plan",
      amount: 5000,
      profit: 340.2,
      profitToday: 95,
      date: daysAgo(14),
      method: "USDT",
      stopped: false,
      withdrawn: false,
    },
    {
      id: "ad_2",
      plan: "Silver Plan",
      amount: 10000,
      profit: 812.4,
      profitToday: 310,
      date: daysAgo(35),
      method: "BTC",
      stopped: false,
      withdrawn: false,
    },
    {
      id: "ad_3",
      plan: "Basic Plan",
      amount: 500,
      profit: 61.05,
      profitToday: 0,
      date: daysAgo(32),
      method: "USDT",
      stopped: true,
      withdrawn: false,
    },
  ],

  deposit: [
    { id: "dep_1", amount: 5000, plan: "Standard Plan", method: "USDT", status: "approved", date: daysAgo(14) },
    { id: "dep_2", amount: 10000, plan: "Silver Plan", method: "BTC", status: "approved", date: daysAgo(35) },
    { id: "dep_3", amount: 500, plan: "Basic Plan", method: "USDT", status: "approved", date: daysAgo(32) },
    { id: "dep_4", amount: 2000, plan: "Advanced Plan", method: "ETH", status: "pending", date: daysAgo(0) },
  ],

  withdraw: [
    { id: "wd_1", amount: 3200, wallet: "TXn9...4kQ2", method: "USDT", status: "approved", date: daysAgo(60) },
  ],

  // Daily profit credits, one per active plan per day — the running ledger
  // behind the profit/profitToday numbers above.
  earnHistory: [
    { id: "earn_1", amount: 95, plan: "Standard Plan", depositAmount: 5000, date: daysAgo(0) },
    { id: "earn_2", amount: 310, plan: "Silver Plan", depositAmount: 10000, date: daysAgo(0) },
    { id: "earn_3", amount: 92, plan: "Standard Plan", depositAmount: 5000, date: daysAgo(1) },
    { id: "earn_4", amount: 305, plan: "Silver Plan", depositAmount: 10000, date: daysAgo(1) },
    { id: "earn_5", amount: 90, plan: "Standard Plan", depositAmount: 5000, date: daysAgo(2) },
    { id: "earn_6", amount: 298, plan: "Silver Plan", depositAmount: 10000, date: daysAgo(2) },
    { id: "earn_7", amount: 23, plan: "Basic Plan", depositAmount: 500, date: daysAgo(28) },
    { id: "earn_8", amount: 23, plan: "Basic Plan", depositAmount: 500, date: daysAgo(29) },
    { id: "earn_9", amount: 15.05, plan: "Basic Plan", depositAmount: 500, date: daysAgo(30) },
  ],
};

export function getMockUser() {
  // Placeholder for the eventual real fetch — kept async-shaped on purpose.
  return mockUser;
}
