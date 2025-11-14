import User from "../../../../models/user";
import { connectToDB } from "@/app/utils/database";
export const dynamic = "force-dynamic";
import { cloudinary } from "../../../../utils/cloudinary";
import sendEmail from "@/app/utils/sendEmail";

const generateRandomString = () => {
  const characters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(new Uint8Array(6));

  const generatedString = Array.from(randomBuffer)
    .map((byte) => characters[byte % characters.length])
    .join("");

  return generatedString;
};

export const PATCH = async (req, { params }) => {
  await connectToDB();

  try {
    const { index, amount, userid, id } = await req.json();

    const user = await User.findById(userid);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    if (
      user.deposit[index]?.status === "approved" ||
      user.deposit[index]?.status === "declined"
    ) {
      return new Response(
        JSON.stringify({
          error: `Request already ${user.deposit[index].status}`,
        }),
        { status: 400 }
      );
    }

    // Approve the deposit
    user.deposit[index].status = "declined";
    user.transaction.push({
      text: `Deposit of $${amount} declined`,
      type: "deposit",
      date: Date.now(),
      status: "declined",
    });

    // Update user's balance

    // Remove notification from admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.notifications = admin.notifications.filter(
        (notification) => notification.id !== id
      );
      await admin.save();
    }

    // Prepare and send email notification
    const userEmailContent = {
      url: `Hello ${user.username},\n\nYour deposit request of ${amount} USD was declined.\n\nIf you believe this is an error, please contact our support team.\n\nThank you for choosing GoldGroveco.\n`,
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deposit Declined - GoldGroveco</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.5px; }
      .header-subtitle { color: #ffffff; font-size: 16px; font-weight: 400; opacity: 0.95; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .declined-badge { display: inline-flex; align-items: center; background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .declined-icon { width: 18px; height: 18px; margin-right: 8px; }
      .transaction-card { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-left: 4px solid #ef4444; border-radius: 8px; padding: 25px; margin: 25px 0; }
      .transaction-title { font-size: 14px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
      .transaction-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .transaction-row:last-child { border-bottom: none; }
      .transaction-label { font-size: 14px; color: #6b7280; font-weight: 500; }
      .transaction-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; }
      .amount-highlight { font-size: 24px; color: #ef4444; font-weight: 700; }
      .info-box { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
      .info-box p { font-size: 14px; color: #1e40af; margin: 0; }
      .cta-section { text-align: center; margin: 30px 0; }
      .cta-button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; margin-bottom: 15px; }
      .footer-links { margin: 20px 0; }
      .footer-link { color: #22c55e; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 20px; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 25px 0; }
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 20px 10px; }
        .content { padding: 30px 20px; }
        .header { padding: 30px 20px; }
        .transaction-card { padding: 20px; }
        .amount-highlight { font-size: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <div class="logo">GoldGroveco.</div>
          <div class="header-subtitle">Expanding Opportunities in Investment</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${user.username},</div>
          <div class="declined-badge">
            <svg class="declined-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            Deposit Declined
          </div>
          <p class="message">
            We regret to inform you that your deposit request could not be processed at this time. This may be due to payment verification issues or other technical reasons.
          </p>
          <div class="transaction-card">
            <div class="transaction-title">Deposit Details</div>
            <div class="transaction-row">
              <span class="transaction-label">Amount</span>
              <span class="transaction-value amount-highlight">$${amount} USD</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Status</span>
              <span class="transaction-value" style="color: #ef4444;">Declined</span>
            </div>
          </div>
          <div class="info-box">
            <p><strong>Need Help?</strong> If you believe this is an error or need clarification, please contact our support team. We're here to assist you.</p>
          </div>
          <div class="divider"></div>
          <p class="message" style="margin-bottom: 15px;">
            You can try submitting a new deposit request or reach out to our support team for assistance.
          </p>
          <div class="cta-section">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://goldgroveco.com'}/dashboard" class="cta-button">
              Go to Dashboard
            </a>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content">
            <strong style="color: #ffffff;">GoldGroveco</strong><br />
            20 Audley St. London, W1K 6WE, United Kingdom<br />
            📞 +44 0203 0990123 | ✉️ support@goldgroveco.com
          </div>
          <div class="footer-links">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://goldgroveco.com'}/about-us" class="footer-link">About Us</a>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://goldgroveco.com'}/services" class="footer-link">Services</a>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://goldgroveco.com'}/contact" class="footer-link">Contact</a>
          </div>
          <div class="copyright">
            &copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
      `,
    };

    await sendEmail(
      user.email,
      "Deposit Declined",
      userEmailContent.url,
      userEmailContent.html
    );

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to decline deposit" }),
      {
        status: 500,
      }
    );
  }
};
