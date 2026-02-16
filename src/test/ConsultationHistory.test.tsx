import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import ConsultationHistory from "../pages/ConsultationHistory";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../store/slices/patientSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/patientSlice")>();
  return {
    ...actual,
    fetchConsultations: vi.fn(() => ({ type: "fetchConsultations" })),
    fetchConsultationStats: vi.fn(() => ({ type: "fetchConsultationStats" })),
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
      consultationStats: { total: 0, recent: 0, avgRating: "—" },
      prescriptions: [],
      loading: false,
      error: null,
    },
  },
});

function renderConsultationHistory() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ConsultationHistory />
      </MemoryRouter>
    </Provider>
  );
}

describe("ConsultationHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Visit history heading", () => {
    renderConsultationHistory();
    expect(screen.getByRole("heading", { name: /visit history/i })).toBeInTheDocument();
  });

  it("renders search input for consultations", () => {
    renderConsultationHistory();
    expect(screen.getByPlaceholderText(/search by diagnosis or notes/i)).toBeInTheDocument();
  });

  it("renders Total visits summary", () => {
    renderConsultationHistory();
    expect(screen.getByText(/total visits/i)).toBeInTheDocument();
  });
});
