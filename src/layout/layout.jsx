import { Outlet } from "react-router";
import AppBar from "../components/app_bar/app_bar.jsx";
import Nav from "../components/nav/nav.jsx";

export default function Layout({ onLogout }) {
  return (
    <>
      <AppBar />
      <Outlet />
      <Nav />
    </>
  );
}
