import { describe, test, expect } from "vitest";
import SearchBar from "./search_bar";

describe("SearchBar", () => {
  test("component exists", () => {
    expect(SearchBar).toBeDefined();
    expect(typeof SearchBar).toBe("function");
  });

  test.todo("Add more tests for SearchBar");
});
