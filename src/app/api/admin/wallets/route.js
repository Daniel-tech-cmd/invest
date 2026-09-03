import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import Wallet from "../../../../models/Wallet";
import { uploadWalletIcon } from "../../../../lib/cloudinary";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { label, assetId, address, network, icon } = await req.json();

    if (!label?.trim() || !assetId?.trim() || !address?.trim()) {
      return Response.json({ error: "Asset name, asset ID, and wallet address are required." }, { status: 400 });
    }

    await connectToDB();

    const existing = await Wallet.findOne({ assetId: assetId.trim().toUpperCase() });
    if (existing) {
      return Response.json({ error: `A wallet with asset ID "${assetId}" already exists.` }, { status: 409 });
    }

    let uploadedIcon;
    if (icon) {
      try {
        uploadedIcon = await uploadWalletIcon(icon);
      } catch (err) {
        console.error(err);
        return Response.json({ error: "Could not upload wallet icon." }, { status: 500 });
      }
    }

    const wallet = await Wallet.create({
      label: label.trim(),
      assetId: assetId.trim(),
      address: address.trim(),
      network: network?.trim(),
      icon: uploadedIcon,
    });

    return Response.json({ ok: true, wallet: { id: wallet._id } }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ error: "A wallet with that asset ID already exists." }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid input";
      return Response.json({ error: firstError }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
