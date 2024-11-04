import User from "../../models/user";
import cron from "node-cron";
import { connectToDB } from "@/app/utils/database";
export const maxDuration = 60;
export const GET = async (request) => {
  try {
    await connectToDB();
    const user = await User.find({}).sort({ createdAt: -1 });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
const calculateProfit = (planName, amount) => {
  const plans = [
    {
      planName: "Basic Plan",
      planDescription: "Plan 1",
      amountRange: "$100.00 - $499.00",
      dailyProfit: 4.6,
      hasDeposit: false,
    },
    {
      planName: "Standard Plan",
      planDescription: "Plan 2",
      amountRange: "$500.00 - $4999.00",
      dailyProfit: 6.8,
      hasDeposit: false,
    },
    {
      planName: "Advanced Plan",
      planDescription: "Plan 3",
      amountRange: "$5000.00 - $9999.00",
      dailyProfit: 7.7,
      hasDeposit: false,
    },
    {
      planName: "Silver Plan",
      planDescription: "Plan 4",
      amountRange: "$10000.00 - $19999.00",
      dailyProfit: 8.4,
      hasDeposit: false,
    },
    {
      planName: "Gold Plan",
      planDescription: "Plan 5",
      amountRange: "$20000.00 - ∞",
      dailyProfit: 9.2,
      hasDeposit: false,
    },
  ];
  const plan = plans.find((p) => p.planName === planName);
  if (!plan) return 0;

  const dailyProfitPercent = plan.dailyProfit;
  return (amount * dailyProfitPercent) / 100;
};

const checkprofit = async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      let totalProfit = 0;

      if (user.plans && user.plans.length > 0) {
        for (const plan of user.plans) {
          const { planName, amount } = plan;

          const profit = calculateProfit(planName, amount);

          // Add calculated profit to the total profit
          totalProfit += profit;
        }

        // Update the user's profit and balance in the database
        user.profit = (user.profit || 0) + totalProfit;
        user.balance = (user.balance || 0) + totalProfit;

        // Persist updated user data
        await user.save();
      }
    }
  } catch (error) {}
};
