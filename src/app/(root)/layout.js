import Dashboardnav from "../components/Dashboardnav";
import NotificationPopup from "../components/Notify";
import AccountSuspension from "../components/Suspended";
import TopNav from "../components/Topnav";
import { NavProvider } from "../contexts/navcon";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getdatabyId(id) {
  const res = await fetch(`${process.env.URI}/api/user/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  return data;
}
export default async function RootLayout({ children }) {
  const cookiestore = cookies();
  const userjson = cookiestore.get("user");

  const user = JSON?.parse(userjson?.value);

  const data = getdatabyId(user._id);
  const [dat] = await Promise.all([data]);
  return (
    <html lang="en">
      <body className={` antialiased`}>
        {dat?.suspended && <AccountSuspension />}
        {!dat?.suspended && (
          <NavProvider>
            <TopNav />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Dashboardnav data={dat} />
              <NotificationPopup />

              {children}
            </div>
          </NavProvider>
        )}
      </body>
    </html>
  );
}
