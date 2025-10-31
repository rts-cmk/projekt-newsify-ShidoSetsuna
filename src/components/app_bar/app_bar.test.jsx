import { describe, test, expect } from "vitest";
import AppBar from "./app_bar";

describe("AppBar", () => {
  test("component exists", () => {
    expect(AppBar).toBeDefined();
    expect(typeof AppBar).toBe("function");
  });

  test.todo("Add more tests for AppBar");
});
