import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";

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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
