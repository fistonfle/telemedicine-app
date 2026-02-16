import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import DoctorPatients from "../pages/DoctorPatients";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/doctorSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/doctorSlice")>();
  return {
    ...actual,
    fetchDoctorPatients: vi.fn(() => ({ type: "fetchDoctorPatients" })),
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

function renderDoctorPatients() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DoctorPatients />
      </MemoryRouter>
    </Provider>
  );
}

describe("DoctorPatients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Patient List heading", () => {
    renderDoctorPatients();
    expect(screen.getByRole("heading", { name: /patient list/i })).toBeInTheDocument();
  });

  it("renders search input for patient name or ID", () => {
    renderDoctorPatients();
    expect(
      screen.getByPlaceholderText(/search patient name or id/i)
    ).toBeInTheDocument();
  });

  it("renders table headers for Patient Name, Last Appointment, Contact", () => {
    renderDoctorPatients();
    expect(screen.getByText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByText(/last appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/contact info/i)).toBeInTheDocument();
  });
});
