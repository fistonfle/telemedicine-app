import { useEffect, useState } from "react";
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
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<string | number | null>(null);

  useEffect(() => {
    dispatch(fetchDoctorAppointments());
  }, [dispatch]);

  const handleStatusChange = async (aptId: string | number, status: string) => {
    setUpdatingAppointmentId(aptId);
    try {
      const result = await dispatch(updateAppointmentStatusThunk({ appointmentId: aptId, status }));
      if (updateAppointmentStatusThunk.fulfilled.match(result)) {
        dispatch(fetchDoctorAppointments());
      }
    } finally {
      setUpdatingAppointmentId(null);
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
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/doctor/visit?appointmentId=${apt.id}&patientId=${encodeURIComponent(apt.patientId || "")}`}
                        title="Open visit"
                        className="inline-flex items-center gap-2 min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium"
                      >
                        <span className="material-icons text-[20px]">open_in_new</span>
                        <span className="hidden sm:inline">Open</span>
                      </Link>
                      {apt.status === "pending" && (
                        updatingAppointmentId === apt.id ? (
                          <span className="inline-flex items-center gap-2 min-h-[40px] px-3 py-2 text-sm text-slate-500 italic">Updating…</span>
                        ) : (
                          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
                            <button
                              type="button"
                              title="Approve appointment"
                              onClick={() => handleStatusChange(apt.id, "APPROVED")}
                              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg border border-emerald-600/50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-sm font-medium"
                            >
                              <span className="material-icons text-[20px]">check_circle</span>
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                            <button
                              type="button"
                              title="Cancel appointment"
                              onClick={() => handleStatusChange(apt.id, "CANCELLED")}
                              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg border border-red-200 bg-red-50/80 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                              <span className="material-icons text-[20px]">cancel</span>
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                          </div>
                        )
                      )}
                      {apt.status === "approved" && apt.nextStep !== "Complete" && (
                        <Link
                          to={`/doctor/visit?appointmentId=${apt.id}&patientId=${encodeURIComponent(apt.patientId || "")}`}
                          title={apt.nextStep === "Consultation" ? "Start consultation" : apt.nextStep === "Tests" ? "Add tests" : apt.nextStep === "Prescription" ? "Write prescription" : "Continue"}
                          className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm"
                        >
                          <span className="material-icons text-[20px]">
                            {apt.nextStep === "Consultation" ? "person" : apt.nextStep === "Tests" ? "science" : "medication"}
                          </span>
                          {apt.nextStep === "Consultation" ? "Consultation" : apt.nextStep === "Tests" ? "Tests" : apt.nextStep === "Prescription" ? "Prescription" : "Continue"}
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
