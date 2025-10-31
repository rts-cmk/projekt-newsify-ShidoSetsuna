import { describe, test, expect } from "vitest";
import Login from "./login";

describe("Login", () => {
  test("component exists", () => {
    expect(Login).toBeDefined();
    expect(typeof Login).toBe("function");
  });

  test.todo("Add more tests for Login");
});
