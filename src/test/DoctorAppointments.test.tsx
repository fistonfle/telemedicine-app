import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import DoctorAppointments from "../pages/DoctorAppointments";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/doctorSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/doctorSlice")>();
  return {
    ...actual,
    fetchDoctorAppointments: vi.fn(() => ({ type: "fetchDoctorAppointments" })),
    updateAppointmentStatusThunk: vi.fn(() => ({ type: "updateAppointmentStatusThunk" })),
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
    doctor: {
      appointments: [],
      stats: null,
      traffic: [],
      patients: [],
      loading: false,
      error: null,
    },
  },
});

function renderDoctorAppointments() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DoctorAppointments />
      </MemoryRouter>
    </Provider>
  );
}

describe("DoctorAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Appointments heading and description", () => {
    renderDoctorAppointments();
    expect(screen.getByRole("heading", { name: /appointments/i })).toBeInTheDocument();
    expect(screen.getByText(/view and manage appointments booked on your schedule/i)).toBeInTheDocument();
  });

  it("renders table headers for Date & Time, Patient, Slot, Status, Actions", () => {
    renderDoctorAppointments();
    expect(screen.getByRole("columnheader", { name: /date & time/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /patient/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /slot/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /actions/i })).toBeInTheDocument();
  });

  it("shows empty state when no appointments", () => {
    renderDoctorAppointments();
    expect(
      screen.getByText(/no appointments yet/i)
    ).toBeInTheDocument();
  });
});
