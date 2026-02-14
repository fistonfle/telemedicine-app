import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectDoctor from "../components/booking/SelectDoctor";
import SelectDateTime from "../components/booking/SelectDateTime";
import ConfirmBooking from "../components/booking/ConfirmBooking";

const STEPS = [
  { id: 1, label: "Select Doctor" },
  { id: 2, label: "Choose Time" },
  { id: 3, label: "Confirm Booking" },
];

const MOCK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology Specialist",
    rating: 4.8,
    reviews: 120,
    description: "Expert in cardiovascular health with over 12 years of experience.",
    nextSession: "Today, 10:00 AM",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 1024,
    experience: "14 years",
    description: "Specialized in heart conditions and preventive care.",
    avatar: "JW",
  },
  {
    id: 3,
    name: "Dr. Marcus Chan",
    specialty: "General Practitioner",
    rating: 4.7,
    reviews: 89,
    description: "Comprehensive primary care and general health consultations.",
    nextSession: "Tomorrow, 02:00 PM",
    avatar: "MC",
  },
  {
    id: 4,
    name: "Dr. Robert Fox",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 156,
    description: "Pediatric care specialist focusing on children's health.",
    nextSession: "Today, 03:30 PM",
    avatar: "RF",
  },
];

const MOCK_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

function BookAppointment() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const navigate = useNavigate();

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleSelectDateTime = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    // TODO: API call to create appointment
    navigate("/patient");
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
          doctors={MOCK_DOCTORS}
          onSelect={handleSelectDoctor}
          specialtyFilter={specialtyFilter}
          onFilterChange={setSpecialtyFilter}
        />
      )}

      {step === 2 && selectedDoctor && (
        <SelectDateTime
          doctor={selectedDoctor}
          slots={MOCK_SLOTS}
          onSelect={handleSelectDateTime}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && selectedDoctor && selectedDate && selectedTime && (
        <ConfirmBooking
          doctor={selectedDoctor}
          date={selectedDate}
          time={selectedTime}
          reasonForVisit={reasonForVisit}
          onReasonChange={setReasonForVisit}
          onConfirm={handleConfirm}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

export default BookAppointment;
