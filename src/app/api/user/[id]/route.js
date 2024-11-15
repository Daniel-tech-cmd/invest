import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const GET = async (request, { params }) => {
  const id = params.id;
  try {
    await connectToDB();
    const user = await User.findById(id);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PATCH = async (request, { params }) => {
  const data = await request.json();
  const { balance, plan } = data; // Extract balance and plan from the request
  const id = params.id;

  try {
    await connectToDB();
    const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Check if balance is changing and if a plan is provided
    const isBalanceChanging = balance !== undefined && balance !== user.balance;

    if (isBalanceChanging && plan && balance !== 0) {
      const planName = plan;
      const amount = balance - user.balance; // Calculate balance difference
      user.balance = balance;
      // Check if the user already has the specified plan in user.plans
      const existingPlan = user.plans.find((p) => p.planName === planName);
      if (existingPlan) {
        console.log("here");
        existingPlan.amount += Number(balance);
        existingPlan.hasDeposit = true;
        await user.save();
      } else {
        user.plans.push({
          planName,
          amount: balance,
          hasDeposit: true,
        });
      }

      // Update active deposit for the plan
      const activeDeposit = user.activeDeposit.find(
        (dep) => dep.plan === planName
      );
      if (activeDeposit) {
        activeDeposit.amount += Number(balance);
        activeDeposit.date = Date.now();
        await user.save();
      } else {
        user.activeDeposit.push({
          date: Date.now(),
          amount: balance,
          plan: planName,
        });
        console.log(user.activeDeposit);
        await user.save();
      }
    }

    // Update user balance and other fields
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
