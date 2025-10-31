import { describe, test, expect, vi } from "vitest";
import { useArticleSearch } from "./use_article_search";

// Mock the dependencies
vi.mock("../use_news_articles/use_news_articles", () => ({
  useNewsArticles: vi.fn(() => ({ data: [], isLoading: false, error: null })),
}));

vi.mock("../../store/favorites_store/favorites_store", () => ({
  useFavoritesStore: vi.fn(() => ({ favorites: [] })),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(() => ({ data: [], isLoading: false, error: null })),
}));

// Mock environment variable
vi.stubEnv("VITE_NYT_API_KEY", "test-api-key");

describe("useArticleSearch", () => {
  test("hook exists and is a function", () => {
    expect(useArticleSearch).toBeDefined();
    expect(typeof useArticleSearch).toBe("function");
  });
});
