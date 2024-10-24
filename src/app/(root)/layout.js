import Dashboardnav from "../components/Dashboardnav";
import TopNav from "../components/Topnav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Dashboardnav />
        <TopNav />
        {children}
      </body>
    </html>
  );
}
