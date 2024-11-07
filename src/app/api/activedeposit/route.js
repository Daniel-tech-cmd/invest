import { connectToDB } from "../../utils/database"; // Adjust the path as needed
import User from "../../models/user"; // Adjust the path as needed
export const dynamic = "force-dynamic";

export const GET = async (request) => {
  await connectToDB();

  try {
    // Fetch all users
    const users = await User.find();

    // Calculate the date threshold (5 days ago from now)
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    for (const user of users) {
      // Check if activeDeposit.date exists and is more than 5 days old
      if (user.activeDeposit.date && user.activeDeposit.date < fiveDaysAgo) {
        // Set activeDeposit.amount to 0 if date is expired
        user.activeDeposit.amount = 0;

        // Optionally, you can clear the date if it’s no longer needed
        // user.activeDeposit.date = null;

        await user.save();
      }
    }
    return new Response(
      JSON.stringify({ data: "Expired active deposits have been reset." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting expired active deposits:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
