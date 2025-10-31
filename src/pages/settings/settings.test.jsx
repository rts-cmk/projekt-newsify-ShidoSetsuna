import { describe, test, expect } from "vitest";
import Settings from "./settings";

describe("Settings", () => {
  test("component exists", () => {
    expect(Settings).toBeDefined();
    expect(typeof Settings).toBe("function");
  });

  test.todo("Add more tests for Settings");
});
