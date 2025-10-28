import { useQuery } from "@tanstack/react-query";

const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;

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

      console.log(`Popular articles (${section} days):`, data.results);

      const validArticles = data.results.filter(
        (article) => article.title && article.abstract && article.url
      );

      return validArticles;
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
    enabled: enabled,
  });
}
