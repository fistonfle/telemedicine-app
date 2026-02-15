import { useEffect } from "react";
import type { DoctorAppointment } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { fetchDoctorAppointments, updateAppointmentStatusThunk } from "../store/slices/doctorSlice";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function DoctorAppointments() {
  const dispatch = useAppDispatch();
  const { appointments, loading, error } = useAppSelector((s) => s.doctor);

  useEffect(() => {
    dispatch(fetchDoctorAppointments());
  }, [dispatch]);

  const handleStatusChange = async (aptId: string | number, status: string) => {
    const result = await dispatch(updateAppointmentStatusThunk({ appointmentId: aptId, status }));
    if (updateAppointmentStatusThunk.fulfilled.match(result)) {
      dispatch(fetchDoctorAppointments());
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
        <p className="text-slate-500 mt-1">
          View and manage appointments booked on your schedule
        </p>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Slot
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No appointments yet. Appointments will appear here when patients book on your schedule.
                </td>
              </tr>
            ) : (
              appointments.map((apt: DoctorAppointment) => (
                <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-900">{formatDate(apt.appointmentDate)}</p>
                    <p className="text-sm text-slate-500">{formatTime(apt.appointmentDate)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {(apt.patient || "?").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "?"}
                      </div>
                      <p className="font-medium text-slate-900">{apt.patient || "—"}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    Slot {apt.slot}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={apt.status}>{apt.status}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/doctor/visit?appointmentId=${apt.id}&patientId=${encodeURIComponent(apt.patientId || "")}`}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-icons text-lg">visibility</span>
                        View
                      </Link>
                      {apt.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(apt.id, "APPROVED")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {apt.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {apt.status === "approved" && apt.nextStep !== "Complete" && (
                        <Link
                          to={`/doctor/visit?appointmentId=${apt.id}&patientId=${encodeURIComponent(apt.patientId || "")}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm border border-primary bg-primary text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          <span className="material-icons text-lg">
                            {apt.nextStep === "Consultation" ? "person" : apt.nextStep === "Tests" ? "science" : "medication"}
                          </span>
                          {apt.nextStep === "Consultation" ? "Start consultation" : apt.nextStep === "Tests" ? "Add tests" : apt.nextStep === "Prescription" ? "Write prescription" : "Continue"}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
