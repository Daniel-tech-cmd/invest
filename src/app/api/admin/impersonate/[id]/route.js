import User from "../../../../models/user";
import { connectToDB } from "@/app/utils/database";
import jwt from "jsonwebtoken";

export const POST = async (request, { params }) => {
  const { id } = await params;
  const { targetUserId } = await request.json();

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: "Target user ID is required" }),
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    // Verify admin making the request
    const admin = await User.findById(id);
    if (!admin || (admin.role !== "admin" && admin.role !== "master admin")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Admin access required." }),
        { status: 403 }
      );
    }

    // Find the target user to impersonate
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: "Target user not found" }),
        { status: 404 }
      );
    }

    // Prevent impersonating other admins
    if (targetUser.role === "admin" || targetUser.role === "master admin") {
      return new Response(
        JSON.stringify({ error: "Cannot impersonate other administrators" }),
        { status: 403 }
      );
    }

    // Create JWT token for the target user
    const token = jwt.sign(
      { 
        _id: targetUser._id,
        impersonatedBy: admin._id,
        impersonatedByUsername: admin.username,
        isImpersonation: true
      },
      process.env.SECRET,
      { expiresIn: "2h" } // Limited session time
    );

    // Log in admin's account only
    await User.findByIdAndUpdate(id, {
      $push: {
        notifications: {
          text: `You impersonated user ${targetUser.username} (${targetUser.email})`,
          type: "admin_action",
          date: new Date(),
          status: "logged",
          id: `imp_admin_${Date.now()}`,
        },
      },
    });

    console.log(`[ADMIN IMPERSONATION] ${admin.username} (${admin._id}) impersonated ${targetUser.username} (${targetUser._id}) at ${new Date().toISOString()}`);

    return new Response(
      JSON.stringify({
        message: "Impersonation successful",
        token,
        user: {
          _id: targetUser._id,
          email: targetUser.email,
          username: targetUser.username,
          role: targetUser.role,
          isImpersonation: true,
          impersonatedBy: admin.username,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Impersonation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to impersonate user" }),
      { status: 500 }
    );
  }
};
