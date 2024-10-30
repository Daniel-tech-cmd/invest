// pages/api/wallets/[id].js
import Wallet from "../../../models/wallet";
import { dbConnect } from "../../../utils/database";

export default async function handler(req) {
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

    case "DELETE":
      try {
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

    default:
      return new Response(
        JSON.stringify({ error: `Method ${method} Not Allowed` }),
        { status: 405 }
      );
  }
}
