import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./theme_toggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document body className
    document.body.className = "";
  });

  test("component exists", () => {
    expect(ThemeToggle).toBeDefined();
    expect(typeof ThemeToggle).toBe("function");
  });

  test("toggles between light and dark theme when clicked", async () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole("button"); // Changed from "checkbox"

    // Initially should be light theme
    expect(document.body.className).toBe("light-theme");

    // Click to switch to dark theme
    await userEvent.click(toggleButton);
    expect(document.body.className).toBe("dark-theme");

    // Click again to switch back to light theme
    await userEvent.click(toggleButton);
    expect(document.body.className).toBe("light-theme");
  });

  test("saves theme preference to localStorage", async () => {
    render(<ThemeToggle />);
    const toggleButton = screen.getByRole("button"); // Changed from "checkbox"

    // Switch to dark theme
    await userEvent.click(toggleButton);
    expect(localStorage.getItem("theme")).toBe("dark");

    // Switch back to light theme
    await userEvent.click(toggleButton);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("loads saved theme from localStorage on mount", () => {
    // Set dark theme in localStorage before rendering
    localStorage.setItem("theme", "dark");

    render(<ThemeToggle />);

    expect(document.body.className).toBe("dark-theme");
  });

  test.todo("Add more tests for ThemeToggle");
});
