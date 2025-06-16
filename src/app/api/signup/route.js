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
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "365d",
  });
};
const generateRandomString = () => {
  const characters =
    "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(
    new Uint8Array(6)
  );

  const generatedString = Array.from(randomBuffer)
    .map(
      (byte) =>
        characters[byte % characters.length]
    )
    .join("");

  return generatedString.substring(0, 6);
};
export const POST = async (request) => {
  const {
    email,
    password,
    username,
    confirmPassword,
    referralCode,
    role,
    gender,
  } = await request.json();
  try {
    if (username.length < 4) {
      return new Response(
        JSON.stringify({
          error:
            "Username should be more than 4 letters!",
        }),
        {
          status: 400,
        }
      );
    }
    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({
          error: "Password mis-match!",
        }),
        {
          status: 400,
        }
      );
    }
    await connectToDB();

    try {
      let user;
      try {
        const lowercaseEmail =
          email.toLowerCase();
        const genderr = gender.toLowerCase();
        let verified = true;
        user = await User.signup(
          lowercaseEmail,
          password,
          username,
          role,
          genderr,
          referralCode || null,
          verified
        );
      } catch (error) {
        console.log(error);
        return new Response(
          JSON.stringify({
            error: error.message,
          }),
          {
            status: 500,
          }
        );
      }

      try {
        if (referralCode) {
          const referal = await User.findOne({
            username: referralCode,
          });
          referal.referals[
            referal.referals.length
          ] = {
            name: username,
            id: generateRandomString(),
            verified: false,
          };
          const updateref =
            await User.findByIdAndUpdate(
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
      const token = createToken(user._id);

      user.token = token;

      return new Response(JSON.stringify(user), {
        status: 200,
      });
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
