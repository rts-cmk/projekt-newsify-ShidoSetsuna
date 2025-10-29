import { describe, test, expect } from "vitest";
import Splash from "./splash";

describe("Splash", () => {
  test("component exists", () => {
    expect(Splash).toBeDefined();
    expect(typeof Splash).toBe("function");
  });

  test.todo("Add more tests for Splash");
});
