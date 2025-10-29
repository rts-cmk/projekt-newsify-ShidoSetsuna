import { describe, test, expect } from "vitest";
import Category from "./category";

describe("Category", () => {
  test("component exists", () => {
    expect(Category).toBeDefined();
    expect(typeof Category).toBe("function");
  });

  test.todo("Add more tests for Category");
});
