// import { BottomNav } from "@fund/bottom-nav";
import { BottomNavigation } from "@fund/bottom-nav";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

function Layout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
      <Toaster />
    </>
  );
}

export default Layout;
