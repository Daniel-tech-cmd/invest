import User from "../../../../models/user";
import { connectToDB } from "@/app/utils/database";

export const POST = async (req, { params }) => {
  await connectToDB();
  const { id: adminId } = await params;

  try {
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { userId } = await req.json();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    let totalToReturn = 0;

    for (let i = 0; i < user.activeDeposit.length; i++) {
      const deposit = user.activeDeposit[i];
      if (!deposit.stopped) continue;
      if (deposit.balanceFixed) continue;
      if (deposit.balanceDeductedAmount > 0) continue;

      const reinvestedAmount = (user.deposit || [])
        .filter(
          (d) =>
            d.plan === deposit.plan &&
            (d.method === "reinvestment" || d.method === "promo reinvestment"),
        )
        .reduce((sum, d) => sum + (d.amount || 0), 0);

      if (reinvestedAmount > 0) {
        deposit.balanceFixed = true;
        totalToReturn += reinvestedAmount;
      }
    }

    if (totalToReturn === 0) {
      return new Response(
        JSON.stringify({ error: "This user is not affected" }),
        { status: 400 },
      );
    }

    user.balance = (user.balance || 0) + totalToReturn;
    await user.save();

    return new Response(
      JSON.stringify({ fixed: true, amountAdded: totalToReturn, newBalance: user.balance }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Fix balance error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
