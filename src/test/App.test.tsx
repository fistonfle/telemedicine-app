import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
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
});
