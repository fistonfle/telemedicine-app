import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import DoctorDashboard from "../pages/DoctorDashboard";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/authSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/authSlice")>();
  return {
    ...actual,
    fetchMe: vi.fn(() => ({ type: "fetchMe" })),
  };
});
vi.mock("../store/slices/doctorSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/doctorSlice")>();
  return {
    ...actual,
    fetchDoctorDashboard: vi.fn(() => ({ type: "fetchDoctorDashboard" })),
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
    auth: {
      user: { id: "1", names: "Dr. Jane", email: "jane@test.com", role: "DOCTOR" },
      profile: null,
      loading: false,
      error: null,
    },
    doctor: {
      appointments: [],
      stats: null,
      traffic: [],
      loading: false,
      error: null,
    },
  },
});

function renderDoctorDashboard() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DoctorDashboard />
      </MemoryRouter>
    </Provider>
  );
}

describe("DoctorDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders greeting for doctor", () => {
    renderDoctorDashboard();
    expect(screen.getByText(/hello,/i)).toBeInTheDocument();
  });

  it("shows appointments today", () => {
    renderDoctorDashboard();
    expect(screen.getByText(/appointments scheduled for today/i)).toBeInTheDocument();
  });
});
