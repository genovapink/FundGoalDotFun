// import { BottomNav } from "@fund/bottom-nav";
import FloatingActionButton from "@fund/floating-button";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Outlet />
      <FloatingActionButton />
    </>
  );
}

export default Layout;
