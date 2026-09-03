import { auth } from "../../../../../auth";
import { connectToDB } from "../../../../../lib/db";
import Wallet from "../../../../../models/Wallet";
import { uploadWalletIcon } from "../../../../../lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be signed in.", status: 401 };
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return { error: "Admin access required.", status: 403 };
  }
  return null;
}

export async function PATCH(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return Response.json({ error: denied.error }, { status: denied.status });

  try {
    const { id } = await params;
    const { label, assetId, address, network, icon } = await req.json();

    await connectToDB();
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return Response.json({ error: "Wallet not found." }, { status: 404 });
    }

    if (assetId !== undefined) {
      const normalized = assetId.trim().toUpperCase();
      const existing = await Wallet.findOne({ assetId: normalized, _id: { $ne: id } });
      if (existing) {
        return Response.json({ error: `A wallet with asset ID "${assetId}" already exists.` }, { status: 409 });
      }
      wallet.assetId = normalized;
    }
    if (label !== undefined) wallet.label = label.trim();
    if (address !== undefined) wallet.address = address.trim();
    if (network !== undefined) wallet.network = network.trim();

    // Only re-upload when the admin actually picked a new icon file — the
    // form omits this field entirely when the icon is unchanged.
    if (icon) {
      try {
        wallet.icon = await uploadWalletIcon(icon);
      } catch (err) {
        console.error(err);
        return Response.json({ error: "Could not upload wallet icon." }, { status: 500 });
      }
    }

    await wallet.save();

    return Response.json({ ok: true });
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

export async function DELETE(req, { params }) {
  const denied = await requireAdmin();
  if (denied) return Response.json({ error: denied.error }, { status: denied.status });

  try {
    const { id } = await params;

    await connectToDB();
    const deleted = await Wallet.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Wallet not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
