import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

describe("Login", () => {
  test("shows validation when fields are empty", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(
      screen.getByText("Email and password are required"),
    ).toBeInTheDocument();
  });
});
