import Dashboardnav from "../components/Dashboardnav";
import TopNav from "../components/Topnav";
import { NavProvider } from "../contexts/navcon";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getdatabyId(id) {
  const res = await fetch(`${process.env.URL}/api/user/${id}`, {
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
        <NavProvider>
          <TopNav />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Dashboardnav data={dat} />

            {children}
          </div>
        </NavProvider>
      </body>
    </html>
  );
}
