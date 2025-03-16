// import { BottomNav } from "@fund/bottom-nav";
import { BottomNavigation } from "@fund/bottom-nav";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}

export default Layout;
