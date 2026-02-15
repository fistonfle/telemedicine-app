import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import PatientAppointments from "../pages/PatientAppointments";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/patientSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/patientSlice")>();
  return {
    ...actual,
    fetchPatientAppointments: vi.fn(() => ({ type: "fetchPatientAppointments" })),
  };
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
  },
  preloadedState: {
    patient: {
      appointments: [],
      stats: null,
      health: null,
      consultations: [],
      consultationStats: null,
      prescriptions: [],
      loading: false,
      error: null,
    },
  },
});

function renderPatientAppointments() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PatientAppointments />
      </MemoryRouter>
    </Provider>
  );
}

describe("PatientAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Appointments heading and description", () => {
    renderPatientAppointments();
    expect(screen.getByRole("heading", { name: /appointments/i })).toBeInTheDocument();
    expect(screen.getByText(/view and manage your upcoming and past appointments/i)).toBeInTheDocument();
  });

  it("renders link to book new appointment", () => {
    renderPatientAppointments();
    const link = screen.getByRole("link", { name: /book new appointment/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/patient/book");
  });

  it("renders Upcoming and Past tabs", () => {
    renderPatientAppointments();
    expect(screen.getByRole("button", { name: /upcoming/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /past/i })).toBeInTheDocument();
  });
});
