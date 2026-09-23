import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import TaskForm from "../components/TaskForm";

describe("TaskForm", () => {
  test("shows required title validation", async () => {
    render(<TaskForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  test("submits valid task data", async () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Test task",
      description: "",
      status: "pending",
    });
  });
});
