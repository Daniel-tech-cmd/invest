import Dashboardnav from "../components/Dashboardnav";
import TopNav from "../components/Topnav";
import { NavProvider } from "../contexts/navcon";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <NavProvider>
          <TopNav />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Dashboardnav />

            {children}
          </div>
        </NavProvider>
      </body>
    </html>
  );
}
