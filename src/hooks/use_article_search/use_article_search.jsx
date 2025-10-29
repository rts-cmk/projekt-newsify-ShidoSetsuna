import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNewsArticles } from "../use_news_articles/use_news_articles";
import { useFavoritesStore } from "../../store/favorites_store/favorites_store";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const SEARCH_API_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json";

/**
 * Unified hook for searching articles across different sources (for maintainability)
 * @param {string} query - The search query
 * @param {string} source - The source to search: 'home', 'popular', or 'archive'
 * @param {boolean} enabled - Whether the query should be enabled
 * @returns {object} - Query result with data, isLoading, error
 */
export function useArticleSearch(query, source = "home", enabled = true) {
  // === HOME SOURCE: NYT Article Search API ===
  const homeQuery = useQuery({
    queryKey: ["articleSearch", "home", query],
    queryFn: async () => {
      const response = await fetch(
        `${SEARCH_API_URL}?q=${encodeURIComponent(
          query
        )}&rows=10&api-key=${NYT_API_KEY}`
      );

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      // Filter and map articles
      const articles = data.response.docs
        .filter((doc) => {
          const isLiveBlog =
            doc.document_type === "liveblog" ||
            doc.type_of_material === "Live Blog Post" ||
            doc.type_of_material?.includes("Live Blog") ||
            doc.headline?.main?.toLowerCase().includes("here's the latest") ||
            doc.headline?.main?.toLowerCase().includes("live updates");

          const hasContent = doc.abstract || doc.snippet || doc.lead_paragraph;

          return !isLiveBlog && hasContent;
        })
        .map((doc) => {
          // Handle multimedia - NYT Search API has object structure
          let multimedia = null;
          if (doc.multimedia) {
            const imageUrl =
              doc.multimedia.default?.url || doc.multimedia.thumbnail?.url;

            if (imageUrl) {
              multimedia = [{ url: imageUrl }];
            }
          }

          return {
            title: doc.headline.main,
            abstract:
              doc.abstract ||
              doc.snippet ||
              doc.lead_paragraph ||
              "No description available",
            url: doc.web_url,
            section: doc.section_name || doc.news_desk || "General",
            multimedia: multimedia,
          };
        });

      return articles;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: enabled && source === "home" && query.length > 0,
  });

  // === POPULAR SOURCE: NYT Most Popular API ===
  const { data: popularToday } = useNewsArticles(
    "popular",
    "1",
    enabled && source === "popular"
  );
  const { data: popularWeek } = useNewsArticles(
    "popular",
    "7",
    enabled && source === "popular"
  );
  const { data: popularMonth } = useNewsArticles(
    "popular",
    "30",
    enabled && source === "popular"
  );

  const popularResults = useMemo(() => {
    if (source !== "popular" || !query) return [];

    const allPopular = [
      ...(popularToday || []),
      ...(popularWeek || []),
      ...(popularMonth || []),
    ];

    const unique = allPopular.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
    );

    // Filter by query
    return unique
      .filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.abstract.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }, [popularToday, popularWeek, popularMonth, query, source]);

  // === ARCHIVE SOURCE: Local favorites ===
  const { favorites } = useFavoritesStore();

  const archiveResults = useMemo(() => {
    if (source !== "archive" || !query) return [];

    return favorites
      .filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.abstract.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);
  }, [favorites, query, source]);

  // === Return appropriate result based on source ===
  if (source === "popular") {
    return {
      data: popularResults,
      isLoading: false,
      error: null,
    };
  }

  if (source === "archive") {
    return {
      data: archiveResults,
      isLoading: false,
      error: null,
    };
  }

  return {
    data: homeQuery.data || [],
    isLoading: homeQuery.isLoading,
    error: homeQuery.error,
  };
}
