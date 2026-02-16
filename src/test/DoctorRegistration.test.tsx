import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DoctorRegistration from "../pages/DoctorRegistration";

vi.mock("../api/services", () => ({
  signup: vi.fn(),
}));

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

function renderDoctorRegistration() {
  return render(
    <MemoryRouter>
      <DoctorRegistration />
    </MemoryRouter>
  );
}

describe("DoctorRegistration", () => {
  it("renders Telemed branding", () => {
    renderDoctorRegistration();
    expect(screen.getByText(/telemed/i)).toBeInTheDocument();
  });

  it("renders link back to role selection", () => {
    renderDoctorRegistration();
    const link = screen.getByRole("link", { name: /back to role selection/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("renders Medical details step", () => {
    renderDoctorRegistration();
    expect(screen.getByText(/medical details/i)).toBeInTheDocument();
  });

  it("renders Create Account or Next button", () => {
    renderDoctorRegistration();
    expect(
      screen.getByRole("button", { name: /create account|next/i })
    ).toBeInTheDocument();
  });
});
