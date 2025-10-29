import { describe, test, expect } from "vitest";
import { useNewsArticles } from "./use_news_articles";

describe("UseNewsArticles", () => {
  test("component exists", () => {
    expect(useNewsArticles).toBeDefined();
    expect(typeof useNewsArticles).toBe("function");
  });

  test.todo("Add more tests for UseNewsArticles");
});
