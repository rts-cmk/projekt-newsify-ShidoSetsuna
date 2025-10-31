import { describe, test, expect } from "vitest";
import { useSettingsStore } from "./settings_store";

describe("settingsStore", () => {
  test("store exists and is a function", () => {
    expect(useSettingsStore).toBeDefined();
    expect(typeof useSettingsStore).toBe("function");
  });

  test.todo("Add more tests for settingsStore");
});
