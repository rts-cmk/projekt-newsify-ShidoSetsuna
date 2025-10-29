import { describe, test, expect } from "vitest";
import Nav from "./nav";

describe("Nav", () => {
  test("component exists", () => {
    expect(Nav).toBeDefined();
    expect(typeof Nav).toBe("function");
  });

  test.todo("Add more tests for Nav");
});
