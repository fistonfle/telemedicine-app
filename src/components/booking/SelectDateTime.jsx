import { useState, useEffect } from "react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function SelectDateTime({ doctor, slots = [], loading, selectedDate: propDate, onDateChange, onSelect, onBack }) {
  const now = propDate ? new Date(propDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedSlot, setSelectedSlot] = useState(() => (Array.isArray(slots) && slots.length && typeof slots[0] === "object" ? slots[0] : 1));

  useEffect(() => {
    if (propDate) {
      const d = new Date(propDate);
      setCurrentMonth(d.getMonth() + 1);
      setCurrentYear(d.getFullYear());
      setSelectedDay(d.getDate());
    }
  }, [propDate]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
    onDateChange?.(new Date(currentYear, currentMonth - 1, day));
  };

  const handleContinue = () => {
    const dateStr = `${MONTHS[currentMonth - 1]} ${selectedDay}, ${currentYear}`;
    onSelect(dateStr, selectedSlot);
  };

  const slotList = Array.isArray(slots) ? slots : [];
  const isSlotObject = slotList.length && typeof slotList[0] === "object";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Selected Doctor Info */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {doctor.avatar ?? (doctor.name || "D").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{doctor.name}</h3>
          <p className="text-slate-500 text-sm">
            {doctor.specialty}
            {doctor.experience && ` • ${doctor.experience} exp.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">
              {MONTHS[currentMonth - 1]} {currentYear}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth((m) => Math.max(1, m - 1))}
                className="p-1 rounded hover:bg-slate-100"
              >
                <span className="material-icons text-slate-600">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentMonth((m) => Math.min(12, m + 1))}
                className="p-1 rounded hover:bg-slate-100"
              >
                <span className="material-icons text-slate-600">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-slate-500 py-1"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) =>
              day ? (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? "bg-primary text-white"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div key={i} />
              )
            )}
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              Available
            </span>
          </div>
        </div>

        {/* Slot Numbers */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">
            Available Slots
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {DAYS[new Date(currentYear, currentMonth - 1, selectedDay).getDay()]},{" "}
            {MONTHS[currentMonth - 1]} {selectedDay} — Select your slot
          </p>
          <div className="space-y-4">
            {loading && !slotList.length ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slotList.map((slot, idx) => {
                  const label = isSlotObject ? `Slot ${(slot.slotIndex ?? idx) + 1}` : `Slot ${slot}`;
                  const key = isSlotObject ? slot.scheduleId ?? idx : slot;
                  const isSelected = isSlotObject ? selectedSlot?.scheduleId === slot.scheduleId : selectedSlot === slot;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Current selection:{" "}
            <span className="text-primary font-semibold">
              {MONTHS[currentMonth - 1]} {selectedDay}, {currentYear}
              {isSlotObject && selectedSlot?.scheduleId ? ` — Slot ${(selectedSlot.slotIndex ?? 0) + 1}` : ` — Slot ${selectedSlot}`}
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
        >
          Continue to Confirmation
          <span className="material-icons text-lg">arrow_forward</span>
        </button>
      </div>

      <p className="text-center text-slate-400 text-sm mt-8">
        © 2023 Telemed Health. All appointments are subject to doctor availability.
      </p>
    </div>
  );
}

export default SelectDateTime;
