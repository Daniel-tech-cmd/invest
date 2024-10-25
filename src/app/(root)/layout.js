import Dashboardnav from "../components/Dashboardnav";
import TopNav from "../components/Topnav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <TopNav />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Dashboardnav />

          {children}
        </div>
      </body>
    </html>
  );
}
