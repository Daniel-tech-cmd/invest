// pages/api/wallets/[id].js
import Wallet from "../../../models/wallet";
import { connectToDB } from "../../../utils/database";
import { cloudinary } from "@/app/utils/cloudinary";
export const maxDuration = 60;
async function handler(req) {
  await dbConnect();

  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET":
      try {
        const wallet = await Wallet.findById(id);
        if (!wallet) {
          return new Response(
            JSON.stringify({ success: false, error: "Wallet not found" }),
            { status: 404 }
          );
        }
        return new Response(JSON.stringify({ success: true, data: wallet }), {
          status: 200,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: "Error fetching wallet" }),
          { status: 400 }
        );
      }

    case "PUT":
      try {
        const { name, address, image, ico } = await req.json();
        const wallet = await Wallet.findByIdAndUpdate(
          id,
          { name, address, image, ico },
          { new: true }
        );
        if (!wallet) {
          return new Response(
            JSON.stringify({ success: false, error: "Wallet not found" }),
            { status: 404 }
          );
        }
        return new Response(JSON.stringify({ success: true, data: wallet }), {
          status: 200,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: "Error updating wallet" }),
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

export const GET = async (req, { params }) => {
  const { id } = params;

  try {
    await connectToDB();
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return new Response(
        JSON.stringify({ success: false, error: "Wallet not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(wallet), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error fetching wallet" }),
      { status: 400 }
    );
  }
};

export const PATCH = async (req, { params }) => {
  const { id: walletid } = params;

  try {
    const wallet1 = await Wallet.findById(walletid);
    if (!wallet1) {
      return new Response(
        JSON.stringify({ success: false, error: "Wallet not found" }),
        { status: 404 }
      );
    }

    let { name, address, id, ico, icochanged } = await req.json();

    // Check for existing wallets with the same name or id (excluding the current wallet)
    const existingWallet = await Wallet.findOne({
      $or: [{ name }, { id }],
      _id: { $ne: walletid }, // Exclude the current wallet
    });

    if (existingWallet) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `${name} or ${id} wallet already exists`,
        }),
        { status: 400 }
      );
    }

    // Handle the ICO image upload if changed
    if (icochanged) {
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
        return new Response(
          JSON.stringify({ error: "Could not upload image" }),
          { status: 500 }
        );
      }
    }

    // Update the wallet
    const wallet = await Wallet.findByIdAndUpdate(
      walletid,
      { name, address, id, ico },
      { new: true }
    );

    if (!wallet) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to update" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: wallet }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, error: "Error updating wallet" }),
      { status: 400 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = params;
  try {
    await connectToDB();
    const deletedWallet = await Wallet.findByIdAndDelete(id);
    if (!deletedWallet) {
      return new Response(
        JSON.stringify({ success: false, error: "Wallet not found" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ success: true, data: deletedWallet }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error deleting wallet" }),
      { status: 400 }
    );
  }
};
