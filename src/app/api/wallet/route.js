import Wallet from "../../models/wallet";
import { connectToDB } from "../../utils/database";
import { cloudinary } from "@/app/utils/cloudinary";

async function handler(req) {
  await connectToDB();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const wallets = await Wallet.find({});
        return new Response(JSON.stringify({ success: true, data: wallets }), {
          status: 200,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: "Error fetching wallets" }),
          { status: 400 }
        );
      }

    case "POST":
      try {
        const { name, id, address, image, ico } = await req.json();
        const newWallet = new Wallet({ name, id, address, image, ico });
        await newWallet.save();
        return new Response(
          JSON.stringify({ success: true, data: newWallet }),
          { status: 201 }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: "Error creating wallet" }),
          { status: 400 }
        );
      }

    default:
      return new Response(
        JSON.stringify({ error: `Method ${method} Not Allowed` }),
        { status: 405 }
      );
  }
}
export const maxDuration = 60;
export const POST = async (req) => {
  await connectToDB();

  try {
    let { name, id, address, image, ico } = await req.json();

    // Check if a wallet with the same name or id already exists
    const existingWallet = await Wallet.findOne({ $or: [{ name }, { id }] });
    if (existingWallet) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `A wallet with the name "${name}" or id "${id}" already exists.`,
        }),
        { status: 400 }
      );
    }

    try {
      const photo = await cloudinary.uploader.upload(ico, {
        folder: "images",
        width: "auto",
        crop: "fit",
      });
      if (photo) {
        ico = {
          public_id: photo.public_id,
          url: photo.url,
        };
      }
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Could not upload image" }), {
        status: 500,
      });
    }
    // Create a new wallet
    const newWallet = await Wallet.create({ name, id, address, image, ico });

    return new Response(JSON.stringify({ success: true, data: newWallet }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error creating wallet" }),
      { status: 400 }
    );
  }
};

export const GET = async (req) => {
  try {
    await connectToDB();
    const wallets = await Wallet.find({});
    return new Response(JSON.stringify(wallets), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
};
