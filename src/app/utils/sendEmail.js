import nodemailer from "nodemailer";

const sendEmail = async (
  email,
  subject,
  text,
  html,
) => {
  try {
    const transporter =
      nodemailer.createTransport({
        host: process.env.HOST,
        port:
          Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.SECURE === "true",
        auth: {
          user: "support@goldgroveco.com",
          pass: "Daniel650##",
        },
      });

    await transporter.sendMail({
      from: "support@goldgroveco.com",
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    return true;
  } catch (error) {
    console.log(
      "Email sending error:",
      error.message,
    );
    throw new Error(
      `Failed to send email: ${error.message}`,
    );
  }
};

export default sendEmail;
