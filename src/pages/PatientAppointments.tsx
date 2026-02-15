import { useState, useEffect } from "react";
import type { PatientAppointment } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { fetchPatientAppointments } from "../store/slices/patientSlice";

function PatientAppointments() {
  const dispatch = useAppDispatch();
  const { appointments, loading, error } = useAppSelector((s) => s.patient);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  const now = new Date();
  const upcoming = appointments.filter((apt: PatientAppointment) => {
    const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate) : null;
    return aptDate && aptDate >= now;
  });
  const past = appointments.filter((apt: PatientAppointment) => {
    const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate) : null;
    return !aptDate || aptDate < now;
  });

  const filtered = activeTab === "upcoming" ? upcoming : past;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading appointments</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">
            View and manage your upcoming and past appointments.
          </p>
        </div>
        <Link
          to="/patient/book"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <span className="material-icons text-lg">add</span>
          Book New Appointment
        </Link>
      </div>

      <div className="flex rounded-lg border border-slate-200 p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "upcoming"
              ? "bg-primary text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "past"
              ? "bg-primary text-white"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Past ({past.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Doctor Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Specialty
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Date & Slot
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <span className="material-icons text-4xl mb-2 block text-slate-300">event_busy</span>
                    <p className="font-medium">No {activeTab} appointments</p>
                    <p className="text-sm mt-1">
                      {activeTab === "upcoming"
                        ? "Book an appointment to get started."
                        : "Your past appointments will appear here."}
                    </p>
                    {activeTab === "upcoming" && (
                      <Link
                        to="/patient/book"
                        className="inline-block mt-4 text-primary font-medium hover:underline"
                      >
                        Book appointment
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((apt: PatientAppointment) => (
                  <tr
                    key={apt.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {(apt.doctor || "?")
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {apt.doctor || "—"}
                          </p>
                          {apt.email && (
                            <p className="text-xs text-slate-500">{apt.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {apt.specialty || "—"}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {apt.date}, Slot {apt.slot}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={apt.status}>{apt.status}</Badge>
                        {apt.isFollowUp && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-sky-100 text-sky-800">
                            <span className="material-icons text-sm">replay</span>
                            Follow-up
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/patient/appointments/${apt.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <span className="material-icons text-lg">visibility</span>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointments;
