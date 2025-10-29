import { describe, test, expect } from "vitest";
import ArticleItem from "./article_item";

describe("ArticleItem", () => {
  test("component exists", () => {
    expect(ArticleItem).toBeDefined();
    expect(typeof ArticleItem).toBe("function");
  });

  test.todo("Add more tests for ArticleItem");
});
