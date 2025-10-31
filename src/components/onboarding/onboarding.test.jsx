import { describe, test, expect } from "vitest";
import Onboarding from "./onboarding";

describe("Onboarding", () => {
  test("component exists", () => {
    expect(Onboarding).toBeDefined();
    expect(typeof Onboarding).toBe("function");
  });

  test.todo("Add more tests for Onboarding");
});
