import User from "../../../../models/user";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "../../../../utils/sendEmail";

export const PATCH = async (request, { params }) => {
  const { id } = await params;
  const { userId, amount } = await request.json();

  if (!userId || !amount || amount <= 0) {
    return new Response(
      JSON.stringify({ error: "User ID and valid amount are required" }),
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

    // Find the user to add promo bonus to
    const user = await User.findById(userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Add promo bonus to user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { promoBonus: amount },
      },
      { new: true }
    );

    // Send email notification to user
    try {
      const promoBonusEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 30px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
      font-weight: 800;
      font-size: 24px;
      background: linear-gradient(to right, #22c55e, #000000);
      -webkit-background-clip: text;
      color: transparent;
      text-align: center;
      margin-bottom: 20px;
    }
    h1 {
      color: #333;
      text-align: center;
      font-size: 22px;
    }
    p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    .highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 25px;
      margin: 25px 0;
      text-align: center;
      color: white;
    }
    .highlight .amount {
      font-size: 36px;
      font-weight: 800;
      margin: 10px 0;
    }
    .highlight .label {
      font-size: 14px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-box {
      background-color: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .info-box p {
      margin: 5px 0;
      color: #0c4a6e;
      font-size: 14px;
    }
    .button {
      display: block;
      width: 200px;
      margin: 25px auto;
      padding: 14px 28px;
      color: #fff !important;
      text-decoration: none;
      background-color: #2563eb;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .emoji {
      font-size: 48px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">GoldGroveco.</div>
    <div class="emoji">🎉</div>
    <h1>Congratulations! You've Received a Promo Bonus!</h1>
    <p>Hello ${user.username},</p>
    <p>We have some exciting news! A promotional bonus has been added to your account.</p>
    
    <div class="highlight">
      <div class="label">Promo Bonus Amount</div>
      <div class="amount">$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>

    <div class="info-box">
      <p><strong>📌 Important Information:</strong></p>
      <p>• This bonus has been added to your account balance</p>
      <p>• You can use this bonus for trading and investments</p>
      <p>• Profit calculations are based on your actual deposits only</p>
      <p>• The bonus is available immediately in your dashboard</p>
    </div>

    <p>This promotional bonus is our way of saying thank you for being a valued member of the Goldgroveco community. Use it wisely to maximize your investment opportunities!</p>

    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://goldgroveco.com"}/dashboard" class="button">View Dashboard</a>

    <div class="footer">
      <p>Thank you for choosing Goldgroveco Investors</p>
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>`;

      await sendEmail(
        user.email,
        "🎉 Promo Bonus Added to Your Account - Goldgroveco",
        `You've received a promotional bonus of $${amount}!`,
        promoBonusEmailHtml
      );
    } catch (emailError) {
      console.log("Promo bonus email error:", emailError);
      // Don't fail the request if email fails
    }

    return new Response(
      JSON.stringify({
        message: "Promo bonus added successfully",
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          promoBonus: updatedUser.promoBonus,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Promo bonus error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to add promo bonus" }),
      { status: 500 }
    );
  }
};
