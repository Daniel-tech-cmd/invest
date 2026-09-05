import { Schema, model, models } from "mongoose";

// Field names throughout mirror src/app/lib/mockUser.js and mockUsers.js so
// swapping the dashboard/admin pages from mock data to real API responses is
// a drop-in replacement rather than a rewrite.

const activeDepositSchema = new Schema(
  {
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    profit: { type: Number, default: 0 },
    method: { type: String },
    date: { type: Date, default: Date.now },
    stopped: { type: Boolean, default: false },
    withdrawn: { type: Boolean, default: false },
    // How much of `amount` came from reinvesting balance (vs. a fresh
    // deposit) — tracked so it can be credited back if the plan matures
    // without ever being withdrawn. See lib/mockUsers.js getUnreturnedReinvestment.
    balanceDeductedAmount: { type: Number, default: 0 },
    balanceFixed: { type: Boolean, default: false },
    // Last time /api/checkprofit accrued profit into this deposit — lets the
    // cron compute profit from actual elapsed time instead of assuming
    // exactly one hour passed since the last run.
    lastAccruedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const depositSchema = new Schema(
  {
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    method: { type: String, required: true },
    // The system wallet address shown to the user at submission time — the
    // old app only saved the coin name, never the actual destination, so an
    // admin had nothing to cross-check the receipt against.
    walletAddress: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    receipt: { url: String, publicId: String },
  },
  { timestamps: true },
);

const withdrawSchema = new Schema(
  {
    amount: { type: Number, required: true },
    wallet: { type: String, required: true },
    method: { type: String, required: true },
    note: { type: String },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
    // Which balance this withdrawal draws from — referral commissions are
    // withdraw-only and never reinvestable, so this has to be tracked.
    source: { type: String, enum: ["standard", "promo", "referral"], default: "standard" },
    planId: { type: Schema.Types.ObjectId }, // the activeDeposit this paid out from, for "standard" withdrawals
  },
  { timestamps: true },
);

const earnHistorySchema = new Schema({
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  depositAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// Promo and referral bonus credits are plain $inc operations with no
// corresponding entry anywhere else — without this, the Transactions page
// (built only from deposit/withdraw/earnHistory) has no way to show that
// either one ever happened.
const bonusHistorySchema = new Schema({
  type: { type: String, enum: ["promo", "referral"], required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

// One entry per browser/device the user has enabled push notifications on —
// a user can have several (phone + laptop, etc.), each gets its own message.
const pushSubscriptionSchema = new Schema({
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const referralSchema = new Schema({
  username: { type: String, required: true },
  verified: { type: Boolean, default: false }, // true once they make an approved deposit
});

const UserSchema = new Schema(
  {
    accountId: { type: String, unique: true, required: true }, // short public id, e.g. "GGC-482137"
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: [/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username must be 4-20 alphanumeric characters"],
    },
    password: { type: String, required: true }, // bcrypt hash, never the raw value
    fullName: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    image: { type: String },
    number: { type: String },
    country: { type: String },

    role: { type: String, enum: ["user", "admin", "master admin"], default: "user" },
    verified: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    restrictionMessage: { type: String },

    balance: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    referralBonus: { type: Number, default: 0 },
    promoBonus: { type: Number, default: 0 },
    promoWithdrawDate: { type: Date },
    promoWithdrawAmount: { type: Number, default: 0 },
    minimumWithdrawal: { type: Number, default: 0 },

    referredby: { type: String, default: null }, // referrer's username, null = joined directly
    activereferrals: { type: Number, default: 0 }, // count of referrals with an approved deposit
    referals: [referralSchema],

    bitcoinAccountId: String,
    bitcoinNetwork: String,
    ethereumAccountId: String,
    ethereumNetwork: String,
    litecoinAccountId: String,
    litecoinNetwork: String,
    dogeAccountId: String,
    dogeNetwork: String,
    usdtAccountId: String,
    usdtNetwork: String,

    activeDeposit: [activeDepositSchema],
    deposit: [depositSchema],
    withdraw: [withdrawSchema],
    earnHistory: [earnHistorySchema],
    bonusHistory: [bonusHistorySchema],
    pushSubscriptions: [pushSubscriptionSchema],
  },
  { timestamps: true },
);

// Deliberately no `notifications` array here (the old schema pushed a
// notification onto every admin account per pending request, then had to
// clean it up everywhere on approve/decline — a fan-out-write pattern that
// was a real source of bugs). Admin "pending requests" views should instead
// query pending deposit/withdraw subdocuments directly, e.g.:
//   User.find({ "deposit.status": "pending" }, { username: 1, email: 1, "deposit.$": 1 })

const User = models.User || model("User", UserSchema);

export default User;
