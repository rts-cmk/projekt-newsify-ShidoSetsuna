import { useLocation, Link } from "react-router";
import logo from "../../assets/logo.png";
import "./app_bar.scss";

export default function AppBar() {
  return (
    <header className="app-bar">
      <Link to="/">
        <img src={logo} alt="Logo" className="app-bar__logo" />
        <h1 className="app-bar__title">Headliner</h1>
      </Link>
    </header>
  );
}
