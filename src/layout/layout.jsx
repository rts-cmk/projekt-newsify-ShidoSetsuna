import { Outlet } from "react-router";
import Nav from "../components/nav/nav.jsx";

export default function Layout({ onLogout }) {
  return (
    <>
      <Outlet />
      <Nav />
    </>
  );
}
