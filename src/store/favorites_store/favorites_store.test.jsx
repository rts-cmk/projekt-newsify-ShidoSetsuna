import { describe, test, expect } from "vitest";
import { useFavoritesStore } from "./favorites_store";

describe("favoritesStore", () => {
  test("store exists and is a function", () => {
    expect(useFavoritesStore).toBeDefined();
    expect(typeof useFavoritesStore).toBe("function");
  });

  test.todo("Add more tests for favoritesStore");
});
