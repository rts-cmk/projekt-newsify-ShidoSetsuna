import { useQuery } from "@tanstack/react-query";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const BASE_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

export function useArticleSearch(query, enabled = true) {
  return useQuery({
    queryKey: ["articleSearch", query],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(
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
          // Filter out live blogs
          const isLiveBlog =
            doc.document_type === "liveblog" ||
            doc.type_of_material === "Live Blog Post" ||
            doc.type_of_material?.includes("Live Blog") ||
            doc.headline?.main?.toLowerCase().includes("here's the latest") ||
            doc.headline?.main?.toLowerCase().includes("live updates");

          // Filter out articles with no content (useless)
          const hasContent = doc.abstract || doc.snippet || doc.lead_paragraph;

          return !isLiveBlog && hasContent;
        })
        .map((doc) => {
          // Handle multimedia - NYT Cannot decide how tf they wanna structure this
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
    staleTime: 1000 * 60 * 4, // 4 minutes
    retry: false,
    enabled: enabled && query.length > 0,
  });
}
