import { describe, test, expect } from "vitest";
import Home from "./home";

describe("Home", () => {
  test("component exists", () => {
    expect(Home).toBeDefined();
    expect(typeof Home).toBe("function");
  });

  test.todo("Add more tests for Home");
});
