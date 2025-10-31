import { describe, test, expect } from "vitest";
import Search from "./search";

describe("Search", () => {
  test("component exists", () => {
    expect(Search).toBeDefined();
    expect(typeof Search).toBe("function");
  });

  test.todo("Add more tests for Search");
});
