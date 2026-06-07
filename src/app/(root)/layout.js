import Dashboardnav from "../components/Dashboardnav";
import NotificationPopup from "../components/Notify";
import AccountSuspension from "../components/Suspended";
import TopNav from "../components/Topnav";
import { NavProvider } from "../contexts/navcon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User from "@/app/models/user";
import { connectToDB } from "@/app/utils/database";

async function getdatabyId(id) {
  try {
    await connectToDB();
    const user = await User.findById(id).lean();
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}) {
  const cookiestore = await cookies();
  const userjson = cookiestore.get("user");

  let user = null;
  try {
    user = userjson?.value
      ? JSON.parse(
          decodeURIComponent(userjson.value),
        )
      : null;
  } catch {
    user = null;
  }

  if (!user?._id) {
    redirect("/login");
  }

  const dat = await getdatabyId(user?._id);

  if (!dat) {
    redirect("/login");
  }

  if (dat?.restricted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface p-4">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-xl">
          <h1 className="mb-4 text-2xl font-bold text-red-500">
            Account Restricted
          </h1>
          <p className="text-foreground">
            {dat.restrictionMessage ||
              "Your account has been temporarily restricted. Please contact support for more information."}
          </p>
        </div>
      </div>
    );
  }

  if (dat?.suspended) {
    return <AccountSuspension />;
  }

  return (
    <NavProvider>
      <TopNav />
      <Dashboardnav data={dat} />
      <div className="min-h-screen bg-canvas lg:pl-64">
        <NotificationPopup />
        <main className="min-h-screen bg-surface pt-20 text-foreground transition-colors duration-300 lg:pt-24">
          {children}
        </main>
      </div>
    </NavProvider>
  );
}
