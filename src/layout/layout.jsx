import { Outlet } from "react-router";

export default function Layout({ onLogout }) {
  return (
    <>
      <Outlet />
    </>
  );
}
