import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// dataUrl is a base64 data: URL from the client's FileReader.
export async function uploadReceipt(dataUrl) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary is not configured — add CLOUDINARY_* vars to .env.local");
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "goldgroveco/receipts",
    // "auto" (not the old app's default "image") so PDF receipts actually
    // upload correctly instead of silently failing image-only validation.
    resource_type: "auto",
  });

  return { url: result.secure_url, publicId: result.public_id };
}

// dataUrl is a base64 data: URL from the client's FileReader.
export async function uploadWalletIcon(dataUrl) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary is not configured — add CLOUDINARY_* vars to .env.local");
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "goldgroveco/wallet-icons",
    resource_type: "image",
    width: 128,
    height: 128,
    crop: "fit",
  });

  return { url: result.secure_url, publicId: result.public_id };
}
