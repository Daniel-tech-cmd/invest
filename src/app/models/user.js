import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists!"],
      required: [true, "Email is required!"],
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      match: [
        /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
      ],
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "master admin"],
    },

    transaction: [
      {
        text: {
          type: String,
        },
        type: {
          type: String,
        },
        date: {
          type: Date,
        },
        status: {
          type: String,
        },
        id: {
          type: Number,
        },
      },
    ],
    withdraw: [
      {
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        wallet: {
          type: String,
        },
        method: {
          type: String,
        },
        date: {
          type: Date,
        },
        index: {
          type: Number,
        },
        transactid: {
          type: String,
        },
      },
    ],
    deposit: [
      {
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        method: {
          type: String,
        },
        date: {
          type: Date,
        },
        index: {
          type: Number,
        },
        transactid: {
          type: String,
        },
        reciept: {
          url: String,
          public_id: String,
        },
      },
    ],
    fullName: {
      type: String,
    },
    bitcoinAccountId: {
      type: String,
    },
    ethereumAccountId: {
      type: String,
    },
    dogeAccountId: {
      type: String,
    },
    litecoinAccountId: {
      type: String,
    },
    usdtAccountId: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0.0,
      // required: false,
    },
    country: {
      type: String,
    },

    number: {
      type: String,
    },

    referralBonus: {
      type: Number,
      // required: false,
      default: 0.0,
    },
    referals: [
      {
        name: { type: String },
        id: { type: String },
      },
    ],
    profit: {
      type: Number,
      // required: false,
      default: 0.0,
    },
    minimumWithdrawal: {
      type: Number,
      default: 0.0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    notifications: [
      {
        text: {
          type: String,
        },
        amount: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "declined"],
        },
        method: {
          type: String,
          enum: ["crypto", "bank"],
        },
        date: {
          type: Date,
        },
        userid: {
          type: String,
        },
        index: {
          type: Number,
        },
        id: {
          type: String,
        },
        type: {
          type: String,
        },
        reciept: {
          url: String,
          public_id: String,
        },
      },
    ],
    totalWithdraw: {
      type: Number,
      default: 0,
    },
    totalDeposit: {
      type: Number,
      default: 0,
    },
    totalbalance: {
      type: Number,
    },
    invested: {
      type: Boolean,
      default: false,
    },
    amountinvested: {
      type: Number,
      default: 0,
    },
    zipcode: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (email, password, username, role) {
  console.log(email, password, username);
  const emailExists = await this.findOne({ email });
  const userExists = await this.findOne({ username });
  if (!email || !password || !username) {
    throw Error("All fields must be filled!");
  }
  if (!validator.isEmail(email)) {
    throw Error("email is not valid!");
  }
  if (emailExists && emailExists.verified === false) {
    const data = {
      id: emailExists._id,
      isnot: true,
    };
    return data;
  }
  if (emailExists) {
    throw Error("email already in use!");
  }

  if (userExists) {
    throw Error("username already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    email,
    password: hash,
    role,
  });
  const data = {
    _id: user._id,
    role: user.role,
  };
  return data;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("all fields must be filled!");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("no such user!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("incorrect password!");
  }
  const data = {
    _id: user._id,
    role: user.role,
  };
  return data;
};

const User = models.User || model("User", UserSchema);

export default User;
