import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.SECURE === "true",
  auth: {
    user: "support@goldgroveco.com",
    pass: "Daniel650##",
  },
});

const sendEmail = async (email, subject, text, html, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await transporter.sendMail({
        from: "support@goldgroveco.com",
        to: email,
        subject,
        text,
        html,
      });
      return true;
    } catch (error) {
      lastError = error;
      console.log(`Email attempt ${attempt}/${maxAttempts} failed:`, error.message);

      if (attempt < maxAttempts) {
        // wait 1s before attempt 2, 2s before attempt 3
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  throw new Error(`Failed to send email after ${maxAttempts} attempts: ${lastError.message}`);
};

export default sendEmail;
