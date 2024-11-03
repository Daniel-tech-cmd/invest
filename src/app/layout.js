import localFont from "next/font/local";
import "./globals.css";
import { Rubik } from "next/font/google";
import { NavProvider } from "./contexts/navcon";
import { AuthContextProvider } from "./contexts/AuthContext";
import SmartsuppChat from "./components/Tawtto";

const rubik = Rubik({ subsets: ["latin"], weight: ["400", "500", "700"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "GoldGroveco",
  description: "Expanding Opportunities in Investment.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <SmartsuppChat />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.className} antialiased`}
      >
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
