import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DoctorSchedule from "../pages/DoctorSchedule";
import * as api from "../api/services";

vi.mock("../api/services", () => ({
  getDoctorSchedule: vi.fn(),
  updateDoctorSchedule: vi.fn(),
}));

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

describe("DoctorSchedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getDoctorSchedule).mockResolvedValue({ days: [] });
  });

  it("renders Schedule Management heading after load", async () => {
    render(
      <MemoryRouter>
        <DoctorSchedule />
      </MemoryRouter>
    );
    expect(await screen.findByRole("heading", { name: /schedule management/i })).toBeInTheDocument();
  });

  it("renders description for weekly availability", async () => {
    render(
      <MemoryRouter>
        <DoctorSchedule />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/configure your weekly availability and patient capacity/i)
    ).toBeInTheDocument();
  });

  it("renders Accepting New Patients toggle", async () => {
    render(
      <MemoryRouter>
        <DoctorSchedule />
      </MemoryRouter>
    );
    expect(await screen.findByText(/accepting new patients/i)).toBeInTheDocument();
  });

  it("renders Day of Week and Operating Hours table headers", async () => {
    render(
      <MemoryRouter>
        <DoctorSchedule />
      </MemoryRouter>
    );
    expect(await screen.findByText(/day of week/i)).toBeInTheDocument();
    expect(await screen.findByText(/operating hours/i)).toBeInTheDocument();
  });
});
