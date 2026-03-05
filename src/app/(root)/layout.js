import Dashboardnav from "../components/Dashboardnav";
import NotificationPopup from "../components/Notify";
import AccountSuspension from "../components/Suspended";
import TopNav from "../components/Topnav";
import { NavProvider } from "../contexts/navcon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getdatabyId(id) {
  try {
    const res = await fetch(
      `${process.env.URI}/api/user/${id}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}) {
  const cookiestore = cookies();
  const userjson = cookiestore.get("user");

  let user = null;
  try {
    user = userjson?.value
      ? JSON.parse(userjson.value)
      : null;
  } catch {
    user = null;
  }

  if (!user?._id) {
    redirect("/login");
  }

  const dat = await getdatabyId(user._id);

  if (!dat) {
    redirect("/login");
  }

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
