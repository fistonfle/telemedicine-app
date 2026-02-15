import { useState, useEffect } from "react";
import type { Doctor, TimeSlot } from "../../types";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatSlotLabel(slot: TimeSlot | unknown, idx = 0): string {
  if (!slot) return "";
  if (typeof slot === "object") {
    const n = (slot.slotIndex ?? idx) + 1;
    if (slot.start && slot.end) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      const opts = { hour: "numeric", minute: "2-digit", hour12: true };
      return `Slot ${n}: ${start.toLocaleTimeString([], opts)} – ${end.toLocaleTimeString([], opts)}`;
    }
    return `Slot ${n}`;
  }
  return `Slot ${slot}`;
}

function isPastDate(year: number, month: number, day: number): boolean {
  const today = new Date();
  const d = new Date(year, month - 1, day);
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function formatTimeStr(str: string | undefined): string {
  if (!str) return "";
  const parts = String(str).split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  if (h === 0) return `12:${String(m).padStart(2, "0")} AM`;
  if (h < 12) return `${h}:${String(m).padStart(2, "0")} AM`;
  if (h === 12) return `12:${String(m).padStart(2, "0")} PM`;
  return `${h - 12}:${String(m).padStart(2, "0")} PM`;
}

interface SelectDateTimeProps {
  doctor: Doctor;
  slots?: TimeSlot[];
  workingHours: { dayStart: string; dayEnd: string } | null;
  loading: boolean;
  selectedDate: Date | string;
  onDateChange: (date: Date) => void;
  onSelect: (date: Date | string, slot: TimeSlot | null) => void;
  onBack: () => void;
}

function SelectDateTime({ doctor, slots = [], workingHours, loading, selectedDate: propDate, onDateChange, onSelect, onBack }: SelectDateTimeProps) {
  const now = propDate ? new Date(propDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    if (propDate) {
      const d = new Date(propDate);
      setCurrentMonth(d.getMonth() + 1);
      setCurrentYear(d.getFullYear());
      setSelectedDay(d.getDate());
    }
  }, [propDate]);

  useEffect(() => {
    if (slots?.length && typeof slots[0] === "object") {
      setSelectedSlot(slots[0]);
    } else if (!slots?.length) {
      setSelectedSlot(null);
    }
  }, [slots]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const handleDayClick = (day: number | null) => {
    if (!day || isPastDate(currentYear, currentMonth, day)) return;
    setSelectedDay(day);
    onDateChange?.(new Date(currentYear, currentMonth - 1, day));
  };

  const slotList = Array.isArray(slots) ? slots : [];
  const assignedSlot = slotList.length ? (selectedSlot ?? slotList[0]) : null;
  const handleContinue = () => {
    const dateStr = `${MONTHS[currentMonth - 1]} ${selectedDay}, ${currentYear}`;
    onSelect(dateStr, assignedSlot);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Selected Doctor Info */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
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
        <div className="bg-white border border-slate-200 rounded-lg p-6">
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
            {calendarDays.map((day, i) => {
              const past = day && isPastDate(currentYear, currentMonth, day);
              return day ? (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  disabled={past}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    past
                      ? "text-slate-300 cursor-not-allowed bg-transparent"
                      : selectedDay === day
                        ? "bg-primary text-white"
                        : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {day}
                </button>
              ) : (
                <div key={i} />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-transparent border border-slate-200" />
              Past
            </span>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-4">
            Available Slots
          </h3>
          {workingHours && propDate && (
            <p className="text-slate-500 text-sm mb-4">
              {DAYS[new Date(propDate).getDay()]},{" "}
              {MONTHS[new Date(propDate).getMonth()]} {new Date(propDate).getDate()} — Working hours: {formatTimeStr(workingHours.dayStart)} – {formatTimeStr(workingHours.dayEnd)}
            </p>
          )}
          {loading && !slotList.length ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : slotList.length === 0 ? (
            <div className="py-4">
              {workingHours && (
                <p className="text-slate-500 text-sm mb-2">
                  Working hours: {formatTimeStr(workingHours.dayStart)} – {formatTimeStr(workingHours.dayEnd)}
                </p>
              )}
              <p className="text-slate-500 text-sm">
                No available slots for this date. Select another day.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-500 text-sm mb-3">Choose your preferred slot:</p>
              {slotList.map((slot, idx) => {
                const key = slot.start ?? `${slot.scheduleId}-${idx}`;
                const isSelected = selectedSlot?.start === slot.start;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSlot(slot as TimeSlot)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1"
                        : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-medium text-slate-900">{formatSlotLabel(slot, idx)}</span>
                  </button>
                );
              })}
              {selectedSlot && (
                <p className="text-slate-500 text-xs mt-3">
                  Selected: {formatSlotLabel(selectedSlot)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!assignedSlot}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <span className="material-icons text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

export default SelectDateTime;
