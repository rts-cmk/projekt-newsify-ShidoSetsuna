import { describe, test, expect } from "vitest";
import Error from "./error";

describe("Error", () => {
  test("component exists", () => {
    expect(Error).toBeDefined();
    expect(typeof Error).toBe("function");
  });

  test.todo("Add more tests for Error");
});
