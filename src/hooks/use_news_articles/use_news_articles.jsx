import { useQuery } from "@tanstack/react-query";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const SEARCH_API_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json";

// Map section names to their display names for search API
const SECTION_DISPLAY_NAMES = {
  arts: "Arts",
  automobiles: "Automobiles",
  books: "Books",
  business: "Business",
  fashion: "Fashion",
  food: "Food",
  health: "Health",
  home: "Home",
  insider: "Insider",
  magazine: "Magazine",
  movies: "Movies",
  nyregion: "New York",
  obituaries: "Obituaries",
  opinion: "Opinion",
  politics: "Politics",
  realestate: "Real Estate",
  science: "Science",
  sports: "Sports",
  sundayreview: "Sunday Review",
  technology: "Technology",
  theater: "Theater",
  "t-magazine": "T Magazine",
  travel: "Travel",
  upshot: "The Upshot",
  us: "U.S.",
  world: "World",
};

export function useNewsArticles(type, section, enabled = true) {
  return useQuery({
    queryKey: ["news", type, section],
    queryFn: async () => {
      let url;

      if (type === "topstories") {
        url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NYT_API_KEY}`;
      } else if (type === "popular") {
        url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/${section}.json?api-key=${NYT_API_KEY}`;
      }

      if (!url) {
        throw new Error("Invalid type");
      }

      const response = await fetch(url);

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      // Handle case where results is null or empty (no articles available)
      // As a fallback, we use the Article Search API for that category (section)
      if (!data.results || data.results.length === 0) {
        if (type === "topstories") {
          return await fetchFromSearchAPI(section);
        }
        return [];
      }

      // Unlike with search, we do some more harsh filtering to make the front page look good
      // Like fx filtering all articles without abstracts out
      const validArticles = data.results.filter((article) => {
        const hasTitle = article.title && article.title.trim().length > 0;
        const hasAbstract =
          article.abstract && article.abstract.trim().length > 0;
        const hasValidUrl =
          article.url &&
          article.url.trim().length > 0 &&
          article.url.startsWith("http");

        return hasTitle && hasAbstract && hasValidUrl;
      });

      return validArticles;
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
    enabled: enabled,
  });
}

// Fallback function to fetch from Article Search API (Mostly used for sports which hasnt been updated since April 2025....)
// Consider moving this to use_article_search for SOC?
async function fetchFromSearchAPI(section) {
  const sectionDisplayName = SECTION_DISPLAY_NAMES[section] || section;

  const response = await fetch(
    `${SEARCH_API_URL}?fq=section.displayName:("${encodeURIComponent(
      sectionDisplayName
    )}")&sort=newest&rows=10&api-key=${NYT_API_KEY}`
  );

  if (!response.ok) {
    return []; // Return empty if fallback also fails
  }

  const data = await response.json();

  if (!data.response?.docs || data.response.docs.length === 0) {
    return [];
  }

  // Transform Search API format to match Top Stories format
  return data.response.docs
    .filter((doc) => {
      const hasContent = doc.abstract || doc.snippet || doc.lead_paragraph;
      const hasValidUrl =
        doc.web_url &&
        doc.web_url.trim().length > 0 &&
        doc.web_url.startsWith("http");
      return hasContent && hasValidUrl;
    })
    .map((doc) => {
      // Transform to match Top Stories format
      let multimedia = null;
      if (doc.multimedia) {
        const imageUrl =
          doc.multimedia.default?.url || doc.multimedia.thumbnail?.url;
        if (imageUrl) {
          multimedia = [
            {
              url: imageUrl,
              format: "Large Thumbnail",
              height: 150,
              width: 150,
            },
          ];
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
        section: doc.section_name || section,
        published_date: doc.pub_date,
        multimedia: multimedia,
      };
    })
    .slice(0, 10);
}
