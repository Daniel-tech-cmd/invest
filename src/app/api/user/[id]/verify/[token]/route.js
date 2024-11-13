import User from "../../../../../models/user";
import Token from "../../../../../models/token";
import crypto from "crypto";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "@/app/utils/sendEmail";
import jwt from "jsonwebtoken";
export const maxDuration = 60;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "365d" });
};

export const GET = async (request, { params }) => {
  const { id, token } = params; // Extract id and token from params

  await connectToDB(); // Connect to your database

  try {
    const user = await User.findById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid link" }), {
        status: 404,
      });
    }

    const userToken = await Token.findOne({ userId: id });
    if (!userToken || userToken.token !== token) {
      return new Response(JSON.stringify({ error: "Invalid link" }), {
        status: 404,
      });
    }

    // Mark user as verified
    user.verified = true;
    if (user.referredby) {
      // Find the referring user by username
      const referal = await User.findOne({ username: user.referredby });

      // Find the referral object where name matches user.username
      const obj = referal.referals.find((item) => item.name === user.username);

      // If the referral object is found, update its verified property to true
      if (obj) {
        obj.verified = true;
      }

      // Save the changes to the referal document
      await referal.save();
    }

    await user.save(); // Save the updated user

    // Remove the token after verification
    await Token.findByIdAndDelete(userToken._id);

    // Create a new token for the user
    const newToken = createToken(user._id);

    // Prepare email content
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #333; }
            p { color: #666; margin-bottom: 20px; }
            a { display: inline-block; padding: 10px 20px; margin: 10px 0; color: #fff; text-decoration: none; background-color: #3498db; border-radius: 5px; }
            a:hover { background-color: #2980b9; }
            b { color: #333; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div class="container">
                    <span
  style="
    font-weight: 800;
    background: linear-gradient(to right, #22c55e, #000000);
    -webkit-background-clip: text;
    color: transparent;
  "
>
  GoldGroveco.
</span>
            <h1>Sign up</h1>
            <p>${user.email} just signed up!</p>
            <p>Username: ${user.username}</p>
          </div>
        </body>
        </html>
      `;
    const masterAdmin = await User.findOne({ role: "admin" });
    // Send email notification
    await sendEmail(
      masterAdmin.email,
      "Sign Up",
      `${user.email} just registered`,
      html
    );

    // Respond with the new user token
    return new Response(JSON.stringify({ _id: user._id, token: newToken }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
