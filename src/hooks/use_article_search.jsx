import { useQuery } from "@tanstack/react-query";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

export function useArticleSearch(query, enabled = true) {
  return useQuery({
    queryKey: ["articleSearch", query],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(query)}&api-key=${NYT_API_KEY}`
      );

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      const articles = data.response.docs.map((doc) => ({
        title: doc.headline.main,
        abstract: doc.abstract || doc.snippet || doc.lead_paragraph,
        url: doc.web_url,
        multimedia:
          doc.multimedia?.length > 0
            ? [
                {
                  url: `https://www.nytimes.com/${doc.multimedia[0].url}`,
                },
              ]
            : null,
      }));

      return articles;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: enabled && query.length > 0,
  });
}
