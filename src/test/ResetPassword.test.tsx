import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../pages/ResetPassword";
import * as authService from "../api/authService";

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock("../api/authService", () => ({
  resetPassword: vi.fn(),
}));

function renderResetPassword(route = "/reset-password?token=valid-token-123") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ResetPassword />
    </MemoryRouter>
  );
}

describe("ResetPassword page", () => {
  it("renders set new password form when token is present", () => {
    renderResetPassword();
    expect(screen.getByRole("heading", { name: /set new password/i })).toBeInTheDocument();
    const passwordFields = screen.getAllByPlaceholderText("••••••••");
    expect(passwordFields).toHaveLength(2);
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("renders invalid link message when token is missing", () => {
    renderResetPassword("/reset-password");
    expect(screen.getByText(/invalid or missing reset link/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request a new link/i })).toHaveAttribute("href", "/forgot-password");
  });

  it("calls resetPassword with token and new password on submit", async () => {
    vi.mocked(authService.resetPassword).mockResolvedValue({ message: "Your password has been reset." });
    renderResetPassword();
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInputs[0], { target: { value: "newPassword123" } });
    fireEvent.change(passwordInputs[1], { target: { value: "newPassword123" } });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));
    await waitFor(() => expect(authService.resetPassword).toHaveBeenCalledWith("valid-token-123", "newPassword123"));
    expect(await screen.findByText(/your password has been reset/i)).toBeInTheDocument();
  });
});
