import { useState, useEffect } from "react";
import { getDoctorSchedule, updateDoctorSchedule } from "../api/services";
import { useToast } from "../components/ui/Toast";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const dayNameToIdx = Object.fromEntries(DAYS.map((d, i) => [d, i + 1]));

function toDisplayTime(hhmm: string | undefined): string {
  if (!hhmm) return "09:00 AM";
  const [h, m] = String(hhmm).split(":").map(Number);
  if (h === 0) return `12:${String(m || 0).padStart(2, "0")} AM`;
  if (h < 12) return `${h}:${String(m || 0).padStart(2, "0")} AM`;
  if (h === 12) return `12:${String(m || 0).padStart(2, "0")} PM`;
  return `${h - 12}:${String(m || 0).padStart(2, "0")} PM`;
}

function fromDisplayTime(str: string | undefined): string {
  if (!str) return "09:00";
  const match = String(str).match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return "09:00";
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (match[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (match[3].toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const DEFAULT_SCHEDULE = Object.fromEntries(
  DAYS.map((d) => [d, { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, slotDuration: 60, unavailable: d === "Saturday" || d === "Sunday" }])
);

function DoctorSchedule() {
  const toast = useToast();
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [acceptingPatients, setAcceptingPatients] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDoctorSchedule();
        if (res?.days) {
          const next = { ...DEFAULT_SCHEDULE };
          res.days.forEach((d: { dayName?: string; dayOfWeek: number; startTime?: string; endTime?: string; maxPatientsPerDay?: number; slotDurationMinutes?: number; unavailable?: boolean }) => {
            const name = d.dayName || DAYS[d.dayOfWeek - 1];
            if (name && next[name] !== undefined) {
              next[name] = {
                start: toDisplayTime(d.startTime),
                end: toDisplayTime(d.endTime),
                maxPatients: d.maxPatientsPerDay ?? 12,
                slotDuration: d.slotDurationMinutes ?? 60,
                unavailable: d.unavailable ?? (d.maxPatientsPerDay <= 0),
              };
            }
          });
          setSchedule(next);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateDay = (day: string, field: string, value: string | number | boolean) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const copyToAll = () => {
    const monday = schedule.Monday;
    setSchedule((prev) => {
      const next = { ...prev };
      DAYS.forEach((day) => {
        if (day !== "Monday") {
          next[day] = {
            ...monday,
            unavailable: prev[day].unavailable,
            maxPatients: prev[day].unavailable ? 0 : monday.maxPatients,
            slotDuration: monday.slotDuration ?? 60,
          };
        }
      });
      return next;
    });
  };

  const totalHours = DAYS.reduce((acc, day) => {
    if (schedule[day].unavailable) return acc;
    const [startH, startM] = schedule[day].start.replace(" AM", "").replace(" PM", "").split(":").map(Number);
    const [endH, endM] = schedule[day].end.replace(" AM", "").replace(" PM", "").split(":").map(Number);
    let start = startH + startM / 60;
    let end = endH + endM / 60;
    if (schedule[day].start.includes("PM") && startH !== 12) start += 12;
    if (schedule[day].start.includes("AM") && startH === 12) start -= 12;
    if (schedule[day].end.includes("PM") && endH !== 12) end += 12;
    if (schedule[day].end.includes("AM") && endH === 12) end -= 12;
    return acc + (end - start);
  }, 0);

  const totalPatients = DAYS.reduce(
    (acc, day) => acc + (schedule[day].unavailable ? 0 : schedule[day].maxPatients),
    0
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Schedule Management</h1>
          <p className="text-slate-500 mt-1">
            Configure your weekly availability and patient capacity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">
            Accepting New Patients
          </span>
          <button
            onClick={() => setAcceptingPatients(!acceptingPatients)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              acceptingPatients ? "bg-primary" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                acceptingPatients ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Day of Week
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Operating Hours
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Max Slots
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Slot Duration <span className="font-normal text-slate-400">(default 1h)</span>
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr
                key={day}
                className={`border-b border-slate-100 ${
                  schedule[day].unavailable ? "bg-slate-50/50" : ""
                }`}
              >
                <td className="py-4 px-6 font-medium text-slate-900">{day}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={schedule[day].start}
                      disabled={schedule[day].unavailable}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDay(day, "start", e.target.value)}
                      placeholder="09:00 AM"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="text"
                      value={schedule[day].end}
                      disabled={schedule[day].unavailable}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDay(day, "end", e.target.value)}
                      placeholder="05:00 PM"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {day === "Monday" && (
                      <button
                        onClick={copyToAll}
                        className="ml-2 text-sm text-primary font-medium hover:underline"
                      >
                        Copy to All
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <input
                    type="number"
                    min={0}
                    value={schedule[day].maxPatients}
                    disabled={schedule[day].unavailable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateDay(day, "maxPatients", parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </td>
                <td className="py-4 px-6">
                  <select
                    value={schedule[day].slotDuration ?? 60}
                    disabled={schedule[day].unavailable}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDay(day, "slotDuration", parseInt(e.target.value) || 60)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1h 30min</option>
                    <option value={120}>2 hours</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule[day].unavailable}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateDay(day, "unavailable", e.target.checked);
                        if (e.target.checked) {
                          updateDay(day, "maxPatients", 0);
                        } else {
                          updateDay(day, "maxPatients", 12);
                        }
                      }}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-slate-600">Unavailable</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-6">
          <div>
            <span className="text-2xl font-bold text-slate-900">{Math.round(totalHours)}</span>
            <span className="text-slate-500 ml-2">Hours</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">{totalPatients}</span>
            <span className="text-slate-500 ml-2">Patients</span>
          </div>
          <span className="text-slate-400">Weekly capacity</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <h4 className="font-semibold text-slate-900 mb-2">Schedule Best Practices</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Slot duration defaults to 1 hour. Modify per day in the table above.</li>
          <li>• Slots divide your working hours (e.g. 9–12 with 1h duration = 3 slots: 9–10, 10–11, 11–12).</li>
          <li>• Schedule updates apply to upcoming weeks only.</li>
          <li>• Existing appointments are not affected by changes.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        {error && (
          <span className="text-red-600 text-sm mr-auto self-center">{error}</span>
        )}
        <button
          type="button"
          onClick={() => {
            const days = DAYS.map((day) => ({
              dayOfWeek: dayNameToIdx[day],
              startTime: fromDisplayTime(schedule[day]?.start || "09:00 AM"),
              endTime: fromDisplayTime(schedule[day]?.end || "05:00 PM"),
              maxPatientsPerDay: schedule[day]?.unavailable ? 0 : (schedule[day]?.maxPatients ?? 12),
              slotDurationMinutes: schedule[day]?.unavailable ? 60 : (schedule[day]?.slotDuration ?? 60),
              unavailable: schedule[day]?.unavailable ?? false,
            }));
            setSaving(true);
            setError(null);
            updateDoctorSchedule(days)
              .then((res) => {
                if (res?.days) {
                  const next = { ...DEFAULT_SCHEDULE };
                  res.days.forEach((d: { dayName?: string; dayOfWeek: number; startTime?: string; endTime?: string; maxPatientsPerDay?: number; slotDurationMinutes?: number; unavailable?: boolean }) => {
                    const name = d.dayName || DAYS[d.dayOfWeek - 1];
                    if (name && next[name] !== undefined) {
                      next[name] = {
                        start: toDisplayTime(d.startTime),
                        end: toDisplayTime(d.endTime),
                        maxPatients: d.maxPatientsPerDay ?? 12,
                        slotDuration: d.slotDurationMinutes ?? 60,
                        unavailable: d.unavailable ?? (d.maxPatientsPerDay <= 0),
                      };
                    }
                  });
                  setSchedule(next);
                  toast.success("Schedule updated successfully");
                }
              })
              .catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : "Failed to save schedule";
                setError(msg);
                toast.error(msg || "Failed to save schedule");
              })
              .finally(() => setSaving(false));
          }}
          disabled={loading || saving}
          className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>
    </div>
  );
}

export default DoctorSchedule;
