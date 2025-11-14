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
    <html lang="en" className="min-h-full">
      <body className="antialiased min-h-full bg-background text-foreground transition-colors duration-300">
        {dat?.suspended && <AccountSuspension />}
        {!dat?.suspended && (
          <NavProvider>
            <TopNav />
            <Dashboardnav data={dat} />
            <div className="min-h-screen bg-canvas lg:pl-64">
              <NotificationPopup />
              <main className="min-h-screen bg-surface text-foreground transition-colors duration-300 pt-20 lg:pt-24">
                {children}
              </main>
            </div>
          </NavProvider>
        )}
      </body>
    </html>
  );
}
