import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Prescriptions from "../pages/Prescriptions";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/patientSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/patientSlice")>();
  return {
    ...actual,
    fetchPrescriptions: vi.fn(() => ({ type: "fetchPrescriptions" })),
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

function renderPrescriptions() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Prescriptions />
      </MemoryRouter>
    </Provider>
  );
}

describe("Prescriptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Prescriptions heading and description", () => {
    renderPrescriptions();
    expect(screen.getByRole("heading", { name: /prescriptions/i })).toBeInTheDocument();
    expect(screen.getByText(/manage your active medications and refill history/i)).toBeInTheDocument();
  });

  it("renders search input for medications and doctors", () => {
    renderPrescriptions();
    expect(
      screen.getByPlaceholderText(/search medications, doctors, or prescriptions/i)
    ).toBeInTheDocument();
  });
});
