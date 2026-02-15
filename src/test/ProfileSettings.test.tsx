import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import ProfileSettings from "../pages/ProfileSettings";
import authReducer from "../store/slices/authSlice";
import patientReducer from "../store/slices/patientSlice";
import doctorReducer from "../store/slices/doctorSlice";
import bookingReducer from "../store/slices/bookingSlice";

vi.mock("../components/ui/Toast", () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock("../store/slices/authSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../store/slices/authSlice")>();
  return {
    ...actual,
    fetchProfile: vi.fn(() => ({ type: "fetchProfile" })),
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
      user: null,
      profile: { firstName: "John", lastName: "Doe", email: "john@test.com" },
      loading: false,
      error: null,
    },
  },
});

function renderProfileSettings() {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfileSettings />
      </MemoryRouter>
    </Provider>
  );
}

describe("ProfileSettings", () => {
  it("renders Profile Settings heading", () => {
    renderProfileSettings();
    expect(screen.getByRole("heading", { name: /profile settings/i })).toBeInTheDocument();
  });

  it("renders profile picture section", () => {
    renderProfileSettings();
    expect(screen.getByText(/profile picture/i)).toBeInTheDocument();
  });

  it("renders Personal Information section", () => {
    renderProfileSettings();
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
  });

  it("renders Save Changes button", () => {
    renderProfileSettings();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
