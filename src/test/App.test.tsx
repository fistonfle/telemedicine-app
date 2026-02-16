import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import { ToastProvider } from "../components/ui/Toast";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";
import * as authStorage from "../store/authStorage";

vi.mock("../store/authStorage", () => ({
  getStoredToken: vi.fn(),
}));

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
  },
});

function renderWithProviders(ui: React.ReactElement, { route = "/" } = {}) {
  return render(
    <ToastProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </Provider>
    </ToastProvider>
  );
}

describe("App routing", () => {
  beforeEach(() => {
    vi.mocked(authStorage.getStoredToken).mockReset();
    vi.mocked(authStorage.getStoredToken).mockReturnValue(null);
  });

  it("renders Login at root path", () => {
    renderWithProviders(<App />, { route: "/" });
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders SignUp at /signup", () => {
    renderWithProviders(<App />, { route: "/signup" });
    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
  });

  it("renders DoctorRegistration at /register/doctor", () => {
    renderWithProviders(<App />, { route: "/register/doctor" });
    expect(screen.getAllByText(/telemed/i).length).toBeGreaterThan(0);
  });

  it("redirects unknown routes to Login", () => {
    renderWithProviders(<App />, { route: "/unknown/path" });
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("redirects /patient to Login when no token", () => {
    vi.mocked(authStorage.getStoredToken).mockReturnValue(null);
    renderWithProviders(<App />, { route: "/patient" });
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders ForgotPassword at /forgot-password", () => {
    renderWithProviders(<App />, { route: "/forgot-password" });
    expect(screen.getByRole("heading", { name: /forgot password/i })).toBeInTheDocument();
  });

  it("renders ResetPassword at /reset-password with token", () => {
    renderWithProviders(<App />, { route: "/reset-password?token=abc123" });
    expect(screen.getByRole("heading", { name: /set new password/i })).toBeInTheDocument();
  });
});
