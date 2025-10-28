import { useLocation, Link } from "react-router";
import logo from "../../assets/logo.png";
import SearchBar from "../search_bar/search_bar";
import "./app_bar.scss";

export default function AppBar() {
  const location = useLocation();

  const showSearch = ["/", "/popular", "/archive"].includes(location.pathname);

  return (
    <header className="app-bar">
      <Link to="/" className="app-bar__brand">
        <img src={logo} alt="Logo" className="app-bar__logo" />
        <h1 className="app-bar__title">Headliner</h1>
      </Link>

      {showSearch && <SearchBar />}
    </header>
  );
}
