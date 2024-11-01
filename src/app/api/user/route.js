import User from "../../models/user";
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
