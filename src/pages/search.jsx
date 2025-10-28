import { useSearchParams } from "react-router";
import { useMemo } from "react";
import { useArticleSearch } from "../hooks/use_article_search";
import { useNewsArticles } from "../hooks/use_news_articles";
import { useFavoritesStore } from "../store/favorites_store";
import ArticleItem from "../components/article_item/article_item";
import "../styles/pages/search.scss";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const source = searchParams.get("source") || "home";

  const { favorites } = useFavoritesStore();

  const {
    data: homeResults,
    isLoading: homeLoading,
    error: homeError,
  } = useArticleSearch(query, source === "home");

  const { data: popularToday } = useNewsArticles(
    "popular",
    "1",
    source === "popular"
  );
  const { data: popularWeek } = useNewsArticles(
    "popular",
    "7",
    source === "popular"
  );
  const { data: popularMonth } = useNewsArticles(
    "popular",
    "30",
    source === "popular"
  );

  const popularResults = useMemo(() => {
    if (source !== "popular") return [];

    const allPopular = [
      ...(popularToday || []),
      ...(popularWeek || []),
      ...(popularMonth || []),
    ];

    const unique = allPopular.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
    );

    return unique
      .filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.abstract.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }, [popularToday, popularWeek, popularMonth, query, source]);

  const archiveResults = useMemo(() => {
    if (source !== "archive") return [];

    return favorites
      .filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.abstract.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }, [favorites, query, source]);

  const results =
    source === "archive"
      ? archiveResults
      : source === "popular"
      ? popularResults
      : homeResults || [];

  const isLoading = source === "home" && homeLoading;
  const error = source === "home" && homeError;

  const getSourceLabel = () => {
    if (source === "archive") return "Archive";
    if (source === "popular") return "Popular";
    return "All Articles";
  };

  return (
    <main className="search">
      <div className="search__header">
        <h1 className="search__title">Search Results in {getSourceLabel()}</h1>
        <p className="search__query">"{query}"</p>
        <p className="search__count">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {isLoading && <p className="search__loading">Searching...</p>}
      {error && <p className="search__error">Error loading results</p>}

      <div className="search__results">
        {results.length === 0 && !isLoading && (
          <p className="search__empty">No articles found for "{query}"</p>
        )}

        {results.map((article, index) => (
          <ArticleItem
            key={`search-${index}-${article.url}`}
            article={article}
            category={article.section || article.category || "General"}
          />
        ))}
      </div>
    </main>
  );
}

export default Search;
