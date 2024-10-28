import User from "../../models/user";
import Token from "@/app/models/token";
import { connectToDB } from "@/app/utils/database";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import Passwordrec from require("../models/passwordrec");
// import Token from require("../models/token");
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "365d" });
};
const generateRandomString = () => {
  const characters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(new Uint8Array(6));

  const generatedString = Array.from(randomBuffer)
    .map((byte) => characters[byte % characters.length])
    .join("");

  return generatedString.substring(0, 6);
};
export const POST = async (request) => {
  const { email, password, username, confirmPassword, referralCode, role } =
    await request.json();

  try {
    if (username.length < 4) {
      return new Response(
        JSON.stringify({ error: "Username should be more than 4 letters!" }),
        {
          status: 400,
        }
      );
    }
    if (password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Password mis-match!" }), {
        status: 400,
      });
    }
    await connectToDB();

    try {
      let user;
      try {
        const lowercaseEmail = email.toLowerCase();
        user = await User.signup(lowercaseEmail, password, username, role);
        if (user.isnot === true) {
          const deletetok = await Token.findOneAndDelete({ userId: user.id });
          try {
            const token = await Token.create({
              userId: user.id,
              token: crypto.randomBytes(32).toString("hex"),
              exp: Date.now() + 60 * 60 * 1000,
            });
            const url = `${process.env.BASE_URL}/${user.id}/verify/${token.token}`;
            const html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f5f5f5;
              text-align: center;
              margin: 0;
              padding: 0;
            }
        
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            h1 {
              color: #333;
            }
        
            p {
              color: #666;
              margin-bottom: 20px;
            }
        
            a {
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              color: #fff;
              text-decoration: none;
              background-color: #3498db;
              border-radius: 5px;
            }
        
            a:hover {
              background-color: #2980b9;
            }
        
            b {
              color: #333;
            }
        
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <img src="https://peakfund.org/_next/image?url=%2Flogo.png&w=64&q=75" alt="Company Logo">
            <h1>Email Verification</h1>
            <p>Click the link below to verify your email</p>
            <a href="${url}">Verification Link</a>
            <p>The link expires in <b>1 hour</b></p>
          </div>
        </body>
        
        </html>
        `;
            await sendEmail(email, "Verify email", url, html);
            return new Response(
              JSON.stringify({
                message:
                  "an email has been sent to your email account.kindly verify our identity!",
              }),
              { status: 201 }
            );
          } catch (error) {
            console.log(error);
            return new Response(
              JSON.stringify({
                error: error.message,
              }),
              { status: 500 }
            );

            // console.log(error)
          }
        }
      } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      try {
        if (referralCode) {
          const referal = await User.findOne({ username: referralCode });
          referal.referals[referal.referals.length] = {
            name: username,
            id: generateRandomString(),
          };
          const updateref = await User.findByIdAndUpdate(
            { _id: referal._id },
            { ...referal },
            { new: false }
          );
        }
      } catch (error) {
        console.log(error);

        return new Response(
          JSON.stringify({
            error: error.message,
          }),
          { status: 400 }
        );
      }
      try {
        const token = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
          exp: Date.now() + 60 * 60 * 1000,
        });
        const url = `${process.env.BASE_URL}/${user._id}/verify/${token.token}`;
        const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          text-align: center;
          margin: 0;
          padding: 0;
        }
    
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1 {
          color: #333;
        }
    
        p {
          color: #666;
          margin-bottom: 20px;
        }
    
        a {
          display: inline-block;
          padding: 10px 20px;
          margin: 10px 0;
          color: #fff;
          text-decoration: none;
          background-color: #3498db;
          border-radius: 5px;
        }
    
        a:hover {
          background-color: #2980b9;
        }
    
        b {
          color: #333;
        }
    
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    
    <body>
      <div class="container">
        <img src="https://peakfund.org/_next/image?url=%2Flogo.png&w=64&q=75" alt="Company Logo">
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email</p>
        <a href="${url}">Verification Link</a>
        <p>The link expires in <b>1 hour</b></p>
      </div>
    </body>
    
    </html>
    `;
        await sendEmail(email, "verify email", url, html);

        return new Response(
          JSON.stringify({
            message:
              "an email has been sent to your email account.kindly verify our identity!",
          }),
          { status: 201 }
        );
      } catch (error) {
        console.log(error);

        return new Response(
          JSON.stringify({
            error: "error during verification",
          }),
          { status: 500 }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
