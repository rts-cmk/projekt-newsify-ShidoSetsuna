import { describe, test, expect } from "vitest";
import Popular from "./popular";

describe("Popular", () => {
  test("component exists", () => {
    expect(Popular).toBeDefined();
    expect(typeof Popular).toBe("function");
  });

  test.todo("Add more tests for Popular");
});
