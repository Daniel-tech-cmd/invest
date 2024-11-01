import localFont from "next/font/local";
import "./globals.css";
import { Rubik } from "next/font/google";
import { NavProvider } from "./contexts/navcon";
import { AuthContextProvider } from "./contexts/AuthContext";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.className} antialiased`}
      >
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
