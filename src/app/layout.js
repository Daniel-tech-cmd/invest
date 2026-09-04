import { Fraunces, Sora, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import PwaRegistration from "./components/PwaRegistration";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "GoldGroveco",
  description: "Daily-yield investment, engineered to compound.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // iOS has no beforeinstallprompt / install API at all — these tags are
  // what make the result of a *manual* Share > Add to Home Screen actually
  // launch standalone (its own window, no Safari chrome) instead of just
  // opening back up in the browser.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoldGroveco",
  },
  // Next.js's appleWebApp.capable only emits the newer standards-track
  // "mobile-web-app-capable" tag — older iOS Safari versions only recognize
  // the legacy "apple-" prefixed one, so it's added explicitly too.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#e7b94b",
};

const THEME_INIT = `
(function(){
  try{
    var saved = localStorage.getItem('ggc-theme');
    if(saved === 'light' || saved === 'dark'){
      document.documentElement.setAttribute('data-theme', saved);
    }
  }catch(e){}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sora.variable} ${plexMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <PwaRegistration />
      </body>
    </html>
  );
}
