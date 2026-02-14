import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectDoctor from "../components/booking/SelectDoctor";
import SelectDateTime from "../components/booking/SelectDateTime";
import ConfirmBooking from "../components/booking/ConfirmBooking";
import { getDoctors, getTimeSlots, createAppointment } from "../api/services";

const STEPS = [
  { id: 1, label: "Select Doctor" },
  { id: 2, label: "Choose Slot" },
  { id: 3, label: "Confirm Booking" },
];

function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors(specialtyFilter).then(setDoctors).finally(() => setLoading(false));
  }, [specialtyFilter]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setLoading(true);
      getTimeSlots(selectedDoctor.id, selectedDate).then(setSlots).finally(() => setLoading(false));
    } else if (selectedDoctor && !selectedDate) {
      setSlots([]);
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
      navigate("/patient");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > s.id
                    ? "bg-emerald-500 text-white"
                    : step === s.id
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > s.id ? (
                  <span className="material-icons text-lg">check</span>
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= s.id ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 h-0.5 bg-slate-200 mx-2" />
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
