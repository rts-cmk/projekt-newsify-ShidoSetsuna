import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { IoSearch, IoClose } from "react-icons/io5";
import "./search_bar.scss";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getSearchSource = () => {
    if (location.pathname === "/archive") return "archive";
    if (location.pathname === "/popular") return "popular";
    return "home";
  };

  // Check for clicks outside the search bar to collapse it
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //If we register a tab outside the searchbar, close the searchbar
  const handleClickOutside = (e) => {
    if (!e.target.closest(".search-bar")) {
      setIsExpanded(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const source = getSearchSource();
      navigate(`/search?q=${encodeURIComponent(query)}&source=${source}`);
      setQuery("");
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsExpanded(false);
  };

  const handleIconClick = () => {
    if (isExpanded && query.trim()) {
      // If already expanded with text, submit the search
      const source = getSearchSource();
      navigate(`/search?q=${encodeURIComponent(query)}&source=${source}`);
      setQuery("");
      setIsExpanded(false);
    } else {
      // Otherwise just expand the bar
      setIsExpanded(true);
    }
  };

  return (
    <form
      className={`search-bar ${isExpanded ? "search-bar--expanded" : ""}`}
      onSubmit={handleSubmit}>
      <button
        type="button"
        className="search-bar__icon"
        onClick={handleIconClick}>
        <IoSearch size={20} />
      </button>

      <input
        type="text"
        className="search-bar__input"
        placeholder="Search articles..."
        value={query}
        name="searchBar"
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => !query && setIsExpanded(false)}
      />

      {query && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}>
          <IoClose size={20} />
        </button>
      )}
    </form>
  );
}

export default SearchBar;
