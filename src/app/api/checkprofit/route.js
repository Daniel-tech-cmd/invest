import User from "../../models/user";
import cron from "node-cron";
import { connectToDB } from "@/app/utils/database";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
// export const GET = async (request) => {
//   try {
//     await connectToDB();
//     const user = await User.find({}).sort({ createdAt: -1 });

//     if (!user) {
//       return new Response(JSON.stringify({ error: "User not found" }), {
//         status: 404,
//       });
//     }

//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// };
const calculateProfit = (planName, amount) => {
  const plans = [
    {
      planName: "Basic Plan",
      planDescription: "Plan 1",
      amountRange: "$100.00 - $499.00",
      hourlyProfit: 4.6 / 24, // 0.1917% per hour
      hasDeposit: false,
      duration: 5,
    },
    {
      planName: "Standard Plan",
      planDescription: "Plan 2",
      amountRange: "$500.00 - $4999.00",
      hourlyProfit: 6.8 / 24, // 0.2833% per hour
      hasDeposit: false,
      duration: 7,
    },
    {
      planName: "Advanced Plan",
      planDescription: "Plan 3",
      amountRange: "$5000.00 - $9999.00",
      hourlyProfit: 7.7 / 24, // 0.3208% per hour
      hasDeposit: false,
      duration: 7,
    },
    {
      planName: "Silver Plan",
      planDescription: "Plan 4",
      amountRange: "$10000.00 - $19999.00",
      hourlyProfit: 8.4 / 24, // 0.35% per hour
      hasDeposit: false,
      duration: 7,
    },
    {
      planName: "Gold Plan",
      planDescription: "Plan 5",
      amountRange: "$20000.00 - ∞",
      hourlyProfit: 9.2 / 24, // 0.3833% per hour
      hasDeposit: false,
      duration: 7,
    },
  ];

  const plan = plans.find((p) => p.planName === planName);
  if (!plan) return 0;

  const hourlyProfitPercent = plan.hourlyProfit;
  return (amount * hourlyProfitPercent) / 100;
};

const getPlanDuration = (planName) => {
  const plans = [
    {
      planName: "Basic Plan",
      duration: 5,
    },
    {
      planName: "Standard Plan",
      duration: 7,
    },
    {
      planName: "Advanced Plan",
      duration: 7,
    },
    {
      planName: "Silver Plan",
      duration: 7,
    },
    {
      planName: "Gold Plan",
      duration: 7,
    },
  ];

  const plan = plans.find((p) => p.planName === planName);
  return plan ? plan.duration : 7; // Default to 7 days if plan not found
};

export const GET = async (request) => {
  try {
    await connectToDB();
    const users = await User.find({});

    for (const user of users) {
      let totalProfit = 0;
      const earnHistoryEntries = [];

      if (user.activeDeposit && user.activeDeposit.length > 0) {
        for (const deposit of user.activeDeposit) {
          const { plan, amount, date, stopped } = deposit;
          
          // Get the plan's specific duration
          const planDuration = getPlanDuration(plan);
          const planDurationInMillis = planDuration * 24 * 60 * 60 * 1000;
          
          const depositAge = Date.now() - new Date(date).getTime();

          if (depositAge >= planDurationInMillis) {
            // Mark deposits older than the plan's duration as stopped
            deposit.stopped = true;
          } else if (!stopped) {
            // Calculate profit only for active deposits within the plan's duration
            const profit = calculateProfit(plan, amount);
            totalProfit += profit;

            // Add entry to earning history
            earnHistoryEntries.push({
              amount: profit,
              plan: plan,
              depositAmount: amount,
              date: new Date(),
            });
          }
        }

        // Only update if there's profit to add
        if (totalProfit > 0) {
          // Update the user's profit and balance in the database
          user.profit = (user.profit || 0) + totalProfit;
          user.balance = (user.balance || 0) + totalProfit;

          // Add earning history entries
          if (!user.earnHistory) {
            user.earnHistory = [];
          }
          user.earnHistory.push(...earnHistoryEntries);

          // Persist updated user data
          await user.save();
        } else if (user.activeDeposit.some(d => d.stopped)) {
          // Save if any deposits were stopped (even if no profit)
          await user.save();
        }
      }
    }
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
