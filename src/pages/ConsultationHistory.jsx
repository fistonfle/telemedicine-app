import { useState } from "react";
import Badge from "../components/Badge";

const MOCK_CONSULTATIONS = [
  {
    id: 1,
    doctor: "Dr. Sarah Jenkins",
    specialty: "Cardiology Specialist",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    diagnosis: "Mild hypertension...",
    status: "completed",
    hasReport: true,
  },
  {
    id: 2,
    doctor: "Dr. Marcus Thorne",
    specialty: "General Practitioner",
    date: "Sep 12, 2023",
    time: "03:00 PM",
    diagnosis: "Seasonal allergies and virus.",
    status: "completed",
    hasReport: true,
  },
  {
    id: 3,
    doctor: "Dr. Elena Rodriguez",
    specialty: "Dermatologist",
    date: "Aug 05, 2023",
    time: "11:15 AM",
    diagnosis: "Consultation was completed by the patient.",
    status: "completed",
    hasReport: false,
  },
];

function ConsultationHistory() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Consultation History</h1>
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search consultations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <button className="ml-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 inline-flex items-center">
            <span className="material-icons text-slate-600">filter_list</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Consultations", value: "24", sub: "Today", variant: "emerald" },
          { label: "Unread Messages", value: "3", sub: "Last Month", icon: "schedule" },
          { label: "Recent Checkups", value: "3", icon: "check_circle" },
          { label: "Average Overall Rating", value: "4.9/5.0", icon: "star" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            {stat.sub && (
              <Badge variant="completed" className="mt-2">
                {stat.sub}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Past Appointments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100">
          Past Appointments
        </h2>
        <div className="divide-y divide-slate-100">
          {MOCK_CONSULTATIONS.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-slate-50/50"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                  {c.doctor
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{c.doctor}</p>
                  <p className="text-sm text-slate-500">{c.specialty}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {c.date}, {c.time}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.diagnosis}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Badge variant={c.status}>{c.status}</Badge>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    c.hasReport
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {c.hasReport ? "View Report" : "Report Unavailable"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page 1 of 3</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50">
              <span className="material-icons text-slate-600">chevron_left</span>
            </button>
            <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
              1
            </span>
            <button className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 text-sm">
              2
            </button>
            <button className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100 text-sm">
              3
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100">
              <span className="material-icons text-slate-600">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationHistory;
