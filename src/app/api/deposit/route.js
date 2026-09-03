import mongoose from "mongoose";
import { auth } from "../../../auth";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import Wallet from "../../../models/Wallet";
import { PLANS } from "../../lib/plans";
import { getPlanCatalogForUser } from "../../../lib/customPlansData";
import { uploadReceipt } from "../../../lib/cloudinary";
import sendEmail from "../../../lib/sendEmail";
import sendPush from "../../../lib/sendPush";
import { renderNotificationEmail } from "../../../lib/emailTemplates";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const { amount, plan, method, walletAddress, receipt } = await req.json();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return Response.json({ error: "Please enter a valid amount." }, { status: 400 });
    }

    // Validated against the same catalog the Deposit page itself uses — a
    // user with a private custom plan is checked against that, everyone
    // else against the 5 standard plans. The old endpoint trusted whatever
    // plan/amount the client sent with no server-side check at all.
    const catalog = await getPlanCatalogForUser(session.user.id, PLANS);
    const planInfo = catalog[plan];
    if (!planInfo) {
      return Response.json({ error: "That plan isn't available to you." }, { status: 400 });
    }
    if (numericAmount < planInfo.min) {
      return Response.json({ error: `Minimum for ${plan} is $${planInfo.min.toLocaleString()}.` }, { status: 400 });
    }

    await connectToDB();

    const wallet = await Wallet.findOne({ assetId: method });
    if (!wallet || wallet.address !== walletAddress) {
      return Response.json({ error: "Invalid payment method." }, { status: 400 });
    }

    if (!receipt) {
      return Response.json({ error: "Please upload a receipt of payment." }, { status: 400 });
    }

    let uploadedReceipt;
    try {
      uploadedReceipt = await uploadReceipt(receipt);
    } catch (err) {
      console.error(err);
      return Response.json({ error: "Could not upload receipt. Please try again." }, { status: 500 });
    }

    const depositId = new mongoose.Types.ObjectId();
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: {
          deposit: {
            _id: depositId,
            amount: numericAmount,
            plan,
            method,
            walletAddress,
            status: "pending",
            receipt: uploadedReceipt,
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    // Fire-and-forget — matches the old app: email delivery never blocks or
    // fails the deposit submission itself.
    sendEmail(
      updated.email,
      "Deposit Request Submitted",
      `Hello ${updated.username}, your deposit request of ${fmt(numericAmount)} via ${method} has been submitted and is pending review.`,
      renderNotificationEmail({
        heading: "Deposit Request Submitted",
        greeting: updated.username,
        message: "Thank you for your deposit request. We've received your submission and it's currently under review.",
        badgeText: "Pending Review",
        badgeColor: "#92400e",
        badgeBg: "#fef3c7",
        rows: [
          ["Amount", fmt(numericAmount), true],
          ["Payment Method", method],
          ["Investment Plan", plan],
          ["Status", "Pending"],
        ],
        noteText: "Your deposit will be reviewed shortly. Make sure your receipt is clear and matches the submitted amount.",
      }),
    ).catch((err) => console.error("Deposit request email failed:", err.message));

    sendPush(session.user.id, {
      title: "Deposit submitted",
      body: `Your ${fmt(numericAmount)} deposit is pending review.`,
      url: "/dashboard/transactions",
    }).catch((err) => console.error("Deposit request push failed:", err.message));

    return Response.json(
      { ok: true, deposit: { id: depositId, amount: numericAmount, plan, method, status: "pending" } },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
