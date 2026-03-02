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
          user: process.env.USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.USER,
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
