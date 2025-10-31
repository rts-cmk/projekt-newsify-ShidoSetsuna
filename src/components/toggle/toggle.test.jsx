import { describe, test, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "./toggle";

describe("Toggle", () => {
  test("component exists", () => {
    expect(Toggle).toBeDefined();
    expect(typeof Toggle).toBe("function");
  });

  test.todo("Add more tests for Toggle");

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<Toggle label="Test Toggle" checked={false} onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
