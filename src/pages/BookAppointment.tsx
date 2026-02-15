import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import SelectDoctor from "../components/booking/SelectDoctor";
import SelectDateTime from "../components/booking/SelectDateTime";
import ConfirmBooking from "../components/booking/ConfirmBooking";
import { fetchDoctors, fetchTimeSlots, createAppointmentThunk, clearSlots } from "../store/slices/bookingSlice";
import { useToast } from "../components/ui/Toast";
import type { Doctor, TimeSlot } from "../types";

const STEPS = [
  { id: 1, label: "Select Doctor" },
  { id: 2, label: "Choose Slot" },
  { id: 3, label: "Confirm Booking" },
];

function BookAppointment() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { doctors, slots, dayStart, dayEnd, loading, submitting } = useAppSelector((s) => s.booking);
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchDoctors(specialtyFilter));
  }, [dispatch, specialtyFilter]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(fetchTimeSlots({ doctorId: selectedDoctor.id, date: selectedDate }));
    } else if (selectedDoctor && !selectedDate) {
      dispatch(clearSlots());
    }
  }, [dispatch, selectedDoctor, selectedDate]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(new Date());
    setStep(2);
  };

  const handleSelectDateTime = (date: Date | string, slot: TimeSlot | null) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = async () => {
    const result = await dispatch(createAppointmentThunk({
      doctorId: selectedDoctor?.id,
      doctor: selectedDoctor ?? undefined,
      date: selectedDate ?? undefined,
      slot: selectedSlot ?? undefined,
      reasonForVisit,
    }));
    if (createAppointmentThunk.fulfilled.match(result)) {
      toast.success("Appointment booked successfully");
      navigate("/patient");
    } else if (createAppointmentThunk.rejected.match(result)) {
      console.log("ERROR >>"+JSON.stringify(result))
      toast.error(String(result.payload ?? "Failed to book appointment"));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Compact Step Indicator */}
      <div className="flex items-center gap-1 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                step === s.id
                  ? "bg-primary text-white"
                  : step > s.id
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s.id ? (
                <span className="material-icons text-base">check</span>
              ) : (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border border-current/50">
                  {s.id}
                </span>
              )}
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <span className="mx-1 text-slate-300">
                <span className="material-icons text-lg">chevron_right</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <SelectDoctor
          doctors={doctors}
          loading={loading}
          onSelect={handleSelectDoctor}
          specialtyFilter={specialtyFilter}
          onFilterChange={setSpecialtyFilter}
        />
      )}

      {step === 2 && selectedDoctor && (
        <SelectDateTime
          doctor={selectedDoctor}
          slots={slots}
          workingHours={dayStart != null && dayEnd != null ? { dayStart, dayEnd } : null}
          loading={loading}
          selectedDate={selectedDate ?? new Date()}
          onDateChange={handleDateChange}
          onSelect={handleSelectDateTime}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selectedDoctor && selectedDate && selectedSlot && (
        <ConfirmBooking
          doctor={selectedDoctor}
          date={typeof selectedDate === "string" ? selectedDate : selectedDate.toLocaleDateString()}
          slot={selectedSlot}
          reasonForVisit={reasonForVisit}
          onReasonChange={setReasonForVisit}
          onConfirm={handleConfirm}
          onBack={() => setStep(2)}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default BookAppointment;
