import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import PatientDashboard from "../pages/PatientDashboard";
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
vi.mock("../store/slices/patientSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/patientSlice")>();
  return {
    ...actual,
    fetchPatientDashboard: vi.fn(() => ({ type: "fetchPatientDashboard" })),
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
      user: { id: "1", names: "John Doe", email: "john@test.com", role: "PATIENT" },
      profile: null,
      loading: false,
      error: null,
    },
    patient: {
      appointments: [],
      stats: null,
      health: null,
      loading: false,
      error: null,
    },
  },
});

function renderPatientDashboard() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PatientDashboard />
      </MemoryRouter>
    </Provider>
  );
}

describe("PatientDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders greeting and patient header", () => {
    renderPatientDashboard();
    expect(screen.getByText(/hello,/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it("shows Next Appointment section", () => {
    renderPatientDashboard();
    expect(screen.getByText(/next appointment/i)).toBeInTheDocument();
  });
});
