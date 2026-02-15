import { useEffect, useState } from "react";
import type { DoctorAppointment, TrafficDay } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { fetchMe } from "../store/slices/authSlice";
import {
  fetchDoctorDashboard,
  fetchDoctorAppointments,
  updateAppointmentStatusThunk,
} from "../store/slices/doctorSlice";

function DoctorDashboard() {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);
  const { appointments, stats, traffic: trafficData, loading, error } = useAppSelector((s) => s.doctor);

  useEffect(() => {
    dispatch(fetchMe());
    dispatch(fetchDoctorDashboard());
  }, [dispatch]);

  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<string | number | null>(null);
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

  const maxPatients = trafficData.length ? Math.max(...trafficData.map((d: TrafficDay) => d.patients)) : 1;

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
            Hello, {me?.names ? (me.names.startsWith("Dr") ? me.names : `Dr. ${me.names}`) : "Doctor"}!
          </h1>
          <p className="text-slate-500 mt-1">
            You have {stats?.appointmentsToday ?? 0} appointments scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {(me?.names || "D").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: "event_available", label: "Appointments Today", value: stats?.appointmentsToday ?? "—", change: stats?.appointmentsChange ?? "", changeColor: "text-emerald-600" },
          { icon: "notifications", label: "Pending Requests", value: stats?.pendingRequests ?? "—", change: "+new", changeColor: "text-amber-600" },
          { icon: "people", label: "Total Patients", value: stats?.totalPatients ?? "—", change: stats?.patientsChange ?? "", changeColor: "text-emerald-600" },
        ].map((stat: { icon: string; label: string; value: string | number; change: string; changeColor: string }) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className={`text-xs font-medium mt-1 ${stat.changeColor}`}>
                  {stat.change}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-primary">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Today's Appointments</h2>
            <div className="flex gap-2">
              <Link to="/doctor/appointments" className="text-sm text-primary font-medium hover:underline">
                View All
              </Link>
              <button type="button" title="Filter" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <span className="material-icons text-xl">filter_list</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient Name
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
                {appointments.map((apt: DoctorAppointment) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {(apt.patient || "?").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{apt.patient || "—"}</p>
                          <p className="text-xs text-slate-500">{apt.description}</p>
                        </div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Traffic Chart */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Patient Traffic</h2>
            <button className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              Last 7 Days
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="h-48 flex items-end gap-2">
              {trafficData.map((d, i) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/30 rounded-t transition-all hover:bg-primary/50"
                    style={{
                      height: `${(d.patients / maxPatients) * 100}%`,
                      minHeight: "20px",
                    }}
                  />
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
