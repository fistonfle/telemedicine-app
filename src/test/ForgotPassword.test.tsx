import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../pages/ForgotPassword";
import * as authService from "../api/authService";

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock("../api/authService", () => ({
  forgotPassword: vi.fn(),
}));

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  );
}

describe("ForgotPassword page", () => {
  it("renders forgot password form with email field", () => {
    renderForgotPassword();
    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("renders link to sign in", () => {
    renderForgotPassword();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/");
  });

  it("calls forgotPassword and shows success message on submit", async () => {
    vi.mocked(authService.forgotPassword).mockResolvedValue({ message: "If an account exists..." });
    renderForgotPassword();
    fireEvent.change(screen.getByPlaceholderText(/you@example\.com/i), { target: { value: "user@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));
    await waitFor(() => expect(authService.forgotPassword).toHaveBeenCalledWith("user@example.com"));
    expect(await screen.findByText(/if an account exists/i)).toBeInTheDocument();
  });
});
