import { useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_SCHEDULE = {
  Monday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, unavailable: false },
  Tuesday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, unavailable: false },
  Wednesday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, unavailable: false },
  Thursday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, unavailable: false },
  Friday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 12, unavailable: false },
  Saturday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 0, unavailable: true },
  Sunday: { start: "09:00 AM", end: "05:00 PM", maxPatients: 0, unavailable: true },
};

function DoctorSchedule() {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [acceptingPatients, setAcceptingPatients] = useState(true);

  const updateDay = (day, field, value) => {
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
                Max Patients
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
                      onChange={(e) => updateDay(day, "start", e.target.value)}
                      placeholder="09:00 AM"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="text"
                      value={schedule[day].end}
                      disabled={schedule[day].unavailable}
                      onChange={(e) => updateDay(day, "end", e.target.value)}
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
                    onChange={(e) =>
                      updateDay(day, "maxPatients", parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </td>
                <td className="py-4 px-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule[day].unavailable}
                      onChange={(e) => {
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
          <li>• Schedule updates apply to upcoming weeks only.</li>
          <li>• Existing appointments are not affected by changes.</li>
          <li>• For emergency cancellations, use the appointment management tool.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
          Reset Changes
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">
          Preview Public Profile
        </button>
        <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
          Save Schedule
        </button>
      </div>
    </div>
  );
}

export default DoctorSchedule;
