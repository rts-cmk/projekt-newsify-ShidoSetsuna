import { useSearchParams } from "react-router";
import { useArticleSearch } from "../../hooks/use_article_search/use_article_search";
import ArticleItem from "../../components/article_item/article_item";
import "../../styles/pages/search.scss";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const source = searchParams.get("source") || "home";

  const { data: results, isLoading, error } = useArticleSearch(query, source);

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
      {/* {error && <p className="search__error">Error loading results</p>} */}

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
