import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/SignUp";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
  },
});

function renderSignUp() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    </Provider>
  );
}

describe("SignUp page", () => {
  it("renders create account form with role selector", () => {
    renderSignUp();
    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
    expect(screen.getByText(/join as a/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders link to login", () => {
    renderSignUp();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/");
  });
});
