import { useEffect } from "react";
import type { PatientAppointment, HealthMetric } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { fetchMe } from "../store/slices/authSlice";
import { fetchPatientDashboard } from "../store/slices/patientSlice";

function PatientDashboard() {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);
  const { appointments, stats, health, loading, error } = useAppSelector((s) => s.patient);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchPatientDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hello, {(me?.names || "Patient").split(" ")[0] || "there"}!
          </h1>
          <p className="text-slate-500 mt-1">
            {stats?.nextAppointment
              ? `You have an appointment today (Slot ${stats.nextAppointment.slot}).`
              : "No appointments today."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-slate-900">{me?.names ?? "Patient"}</p>
              <p className="text-xs text-slate-500">Patient account</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {(me?.names || "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <span className="material-icons text-primary">event_available</span>
              </div>
              <h3 className="font-semibold text-slate-900">Next Appointment</h3>
              <p className="text-slate-600 text-sm mt-1">{stats?.nextAppointment?.doctor || "—"}</p>
              <p className="text-primary font-bold text-lg mt-1">{stats?.nextAppointment ? `Slot ${stats.nextAppointment.slot}` : "—"}</p>
              <Badge variant={stats?.nextAppointment?.status || "pending"} className="mt-2">
                {stats?.nextAppointment?.status || "—"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
            <span className="material-icons text-slate-600">description</span>
          </div>
          <h3 className="font-semibold text-slate-900">Past Consultations</h3>
          <p className="text-slate-600 text-sm mt-1">{stats?.pastConsultations ?? "—"} Sessions</p>
          <p className="text-slate-400 text-xs mt-1">Last visit: {stats?.lastVisit ?? "—"}</p>
        </div>

      </div>

      {/* Upcoming Appointments */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <span className="material-icons text-lg">add</span>
            Book New Appointment
          </Link>
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
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: PatientAppointment) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {(apt.doctor || "?").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{apt.doctor || "—"}</p>
                          <p className="text-xs text-slate-500">{apt.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{apt.specialty}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {apt.date}, Slot {apt.slot}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={apt.status}>{apt.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100">
            <Link
              to="/patient/appointments"
              className="text-sm text-primary font-medium hover:underline"
            >
              View all appointments
            </Link>
          </div>
        </div>
      </section>

      {/* Health Snapshot + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Health Snapshot</h2>
          <p className="text-sm text-slate-500 mb-6">Last updated: {health?.lastUpdated ?? "—"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(health?.metrics ?? []).map((metric: HealthMetric) => (
              <div
                key={metric.label}
                className="bg-slate-50 rounded-lg p-4 border border-slate-100"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="text-lg font-bold text-slate-900 mt-1">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-icons text-3xl">add</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Need a check-up?</h2>
          <p className="text-primary-100 text-sm mb-6 opacity-90">
            Connect with a specialist in less than 24 hours. Book your next
            consultation today.
          </p>
          <Link
            to="/patient/book"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Schedule Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
