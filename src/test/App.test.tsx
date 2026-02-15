import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";
import * as apiServices from "../api/services";

vi.mock("../api/services", () => ({
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
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}

describe("App routing", () => {
  beforeEach(() => {
    vi.mocked(apiServices.getStoredToken).mockReset();
    vi.mocked(apiServices.getStoredToken).mockReturnValue(undefined);
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
    expect(screen.getByText(/telemed/i)).toBeInTheDocument();
  });

  it("redirects unknown routes to Login", () => {
    renderWithProviders(<App />, { route: "/unknown/path" });
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });

  it("redirects /patient to Login when no token", () => {
    vi.mocked(apiServices.getStoredToken).mockReturnValue(null);
    renderWithProviders(<App />, { route: "/patient" });
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
  });
});
