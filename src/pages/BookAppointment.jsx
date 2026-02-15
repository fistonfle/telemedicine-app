import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectDoctor from "../components/booking/SelectDoctor";
import SelectDateTime from "../components/booking/SelectDateTime";
import ConfirmBooking from "../components/booking/ConfirmBooking";
import { getDoctors, getTimeSlots, createAppointment } from "../api/services";
import { useToast } from "../components/Toast";

const STEPS = [
  { id: 1, label: "Select Doctor" },
  { id: 2, label: "Choose Slot" },
  { id: 3, label: "Confirm Booking" },
];

function BookAppointment() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [slotsData, setSlotsData] = useState({ slots: [], dayStart: null, dayEnd: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoctors(specialtyFilter).then(setDoctors).finally(() => setLoading(false));
  }, [specialtyFilter]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setLoading(true);
      getTimeSlots(selectedDoctor.id, selectedDate)
        .then((data) => setSlotsData(data ?? { slots: [], dayStart: null, dayEnd: null }))
        .finally(() => setLoading(false));
    } else if (selectedDoctor && !selectedDate) {
      setSlotsData({ slots: [], dayStart: null, dayEnd: null });
    }
  }, [selectedDoctor, selectedDate]);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(new Date());
    setStep(2);
  };

  const handleSelectDateTime = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await createAppointment({
        doctorId: selectedDoctor?.id,
        doctor: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
        reasonForVisit,
      });
      toast.success("Appointment booked successfully");
      navigate("/patient");
    } catch (err) {
      toast.error(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
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
          slots={slotsData.slots}
          workingHours={slotsData.dayStart != null && slotsData.dayEnd != null ? { dayStart: slotsData.dayStart, dayEnd: slotsData.dayEnd } : null}
          loading={loading}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onSelect={handleSelectDateTime}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selectedDoctor && selectedDate && selectedSlot && (
        <ConfirmBooking
          doctor={selectedDoctor}
          date={selectedDate}
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
