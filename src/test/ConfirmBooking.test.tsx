import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmBooking from "../components/booking/ConfirmBooking";

const mockDoctor = {
  id: "doc-1",
  name: "Dr. Jane Smith",
  specialty: "Cardiology",
  avatar: "JS",
};

describe("ConfirmBooking", () => {
  it("renders doctor name and specialty", () => {
    render(
      <ConfirmBooking
        doctor={mockDoctor}
        date="Feb 15, 2025"
        slot={{ scheduleId: "s1", slotIndex: 0, start: "2025-02-15T09:00:00", end: "2025-02-15T09:30:00" }}
        reasonForVisit=""
        onReasonChange={vi.fn()}
        onConfirm={vi.fn()}
        onBack={vi.fn()}
      />
    );
    expect(screen.getByText("Dr. Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
  });

  it("renders date and slot", () => {
    render(
      <ConfirmBooking
        doctor={mockDoctor}
        date="Feb 15, 2025"
        slot={{ scheduleId: "s1", slotIndex: 0, start: "2025-02-15T09:00:00", end: "2025-02-15T09:30:00" }}
        reasonForVisit=""
        onReasonChange={vi.fn()}
        onConfirm={vi.fn()}
        onBack={vi.fn()}
      />
    );
    expect(screen.getByText(/feb 15, 2025/i)).toBeInTheDocument();
  });

  it("calls onBack when Back is clicked", () => {
    const onBack = vi.fn();
    render(
      <ConfirmBooking
        doctor={mockDoctor}
        date="Feb 15, 2025"
        slot={null}
        reasonForVisit=""
        onReasonChange={vi.fn()}
        onConfirm={vi.fn()}
        onBack={onBack}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Confirm Booking is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmBooking
        doctor={mockDoctor}
        date="Feb 15, 2025"
        slot={null}
        reasonForVisit=""
        onReasonChange={vi.fn()}
        onConfirm={onConfirm}
        onBack={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
