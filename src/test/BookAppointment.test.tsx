import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import BookAppointment from "../pages/BookAppointment";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
  },
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

function renderBookAppointment() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    </Provider>
  );
}

describe("BookAppointment page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders step indicator for Select Doctor, Choose Slot, Confirm Booking", () => {
    renderBookAppointment();
    expect(screen.getByText(/select doctor/i)).toBeInTheDocument();
    expect(screen.getByText(/choose slot/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm booking/i)).toBeInTheDocument();
  });
});
