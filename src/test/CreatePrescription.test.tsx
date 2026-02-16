import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreatePrescription from "../pages/CreatePrescription";
import * as services from "../api/services";

vi.mock("../api/services", () => ({
  getDoctorAppointment: vi.fn(),
  getAppointmentDetails: vi.fn(),
  getConsultationForAppointment: vi.fn(),
  createConsultation: vi.fn(),
  getTestsByConsultation: vi.fn(),
  addMedicalTest: vi.fn(),
  updateTestStatus: vi.fn(),
  updateAppointmentStatus: vi.fn(),
  createPrescription: vi.fn(),
}));

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

describe("CreatePrescription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows invalid link message when appointmentId and patientId are missing", async () => {
    render(
      <MemoryRouter>
        <CreatePrescription />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/cannot create prescription/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/prescriptions are created from an appointment/i)).toBeInTheDocument();
  });

  it("shows invalid link when only appointmentId is provided", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/prescription?appointmentId=apt-123"]}>
        <CreatePrescription />
      </MemoryRouter>
    );
    expect(
      await screen.findByText(/cannot create prescription/i)
    ).toBeInTheDocument();
  });

  it("loads appointment when appointmentId and patientId are in URL", async () => {
    vi.mocked(services.getDoctorAppointment).mockResolvedValue({
      id: "apt-1",
      patient: "Jane Doe",
      patientId: "p-1",
      slot: "1",
      status: "approved",
      appointmentDate: "2025-02-15T10:00:00",
    });
    vi.mocked(services.getAppointmentDetails).mockRejectedValue(new Error("not found"));

    render(
      <MemoryRouter initialEntries={["/doctor/prescription?appointmentId=apt-1&patientId=p-1"]}>
        <CreatePrescription />
      </MemoryRouter>
    );

    await vi.waitFor(() => {
      expect(services.getDoctorAppointment).toHaveBeenCalledWith("apt-1");
    });
  });
});
