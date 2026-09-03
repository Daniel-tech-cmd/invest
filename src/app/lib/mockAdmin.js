// The logged-in admin's own account — separate from the investor mockUser,
// carrying the notification queue (pending deposit/withdrawal requests) that
// drives the /admin dashboard and /admin/management review page.

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export const mockAdmin = {
  username: "admin_grove",
  fullName: "GoldGroveco Admin",
  email: "admin@goldgroveco.com",
  accountId: "GGC-000001",
  role: "admin", // "admin" and "master admin" are both treated as full admin
  gender: "Male",
  createdAt: daysAgo(420),

  notifications: [
    {
      id: "note_1",
      type: "deposit",
      userId: "u_7",
      username: "lena_m",
      email: "lena.m@example.com",
      amount: 900,
      method: "USDT",
      plan: "Standard Plan",
      status: "pending",
      date: daysAgo(0),
      hasReceipt: true,
    },
    {
      id: "note_2",
      type: "deposit",
      userId: "u_8",
      username: "sam_r",
      email: "sam.r@example.com",
      amount: 1500,
      method: "BTC",
      plan: "Basic Plan",
      status: "pending",
      date: daysAgo(1),
      hasReceipt: true,
    },
    {
      id: "note_3",
      type: "withdrawal",
      userId: "u_6",
      username: "chidi_o",
      email: "chidi.o@example.com",
      amount: 600,
      method: "BTC",
      wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      status: "pending",
      date: daysAgo(0),
    },
    {
      id: "note_4",
      type: "withdrawal",
      userId: "u_4",
      username: "priya_s",
      email: "priya.s@example.com",
      amount: 2000,
      method: "USDT",
      wallet: "TXn9k2FqZ8mR4dP1vC7yB3xW6sL0uAq4kQ2",
      note: "Please process before Friday",
      status: "pending",
      date: daysAgo(2),
    },
  ],
};
