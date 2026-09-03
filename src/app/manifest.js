export default function manifest() {
  return {
    name: "GoldGroveco",
    short_name: "GoldGroveco",
    description: "Daily-yield investment, engineered to compound.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf8f1",
    theme_color: "#e7b94b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
