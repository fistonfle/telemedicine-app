import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/Badge";
import { getDoctorAppointments, getDoctorStats, getPatientTraffic, getMe } from "../api/services";

function DoctorDashboard() {
  const [me, setMe] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getMe(),
      getDoctorAppointments(),
      getDoctorStats(),
      getPatientTraffic(),
    ])
      .then(([m, apts, s, t]) => {
        setMe(m);
        setAppointments(apts);
        setStats(s);
        setTrafficData(t);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const maxPatients = trafficData.length ? Math.max(...trafficData.map((d) => d.patients)) : 1;

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
        ].map((stat) => (
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
              <button className="text-sm text-primary font-medium hover:underline">
                View All
              </button>
              <button className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <span className="material-icons text-lg">filter_list</span>
                Filter
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
                {appointments.map((apt) => (
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
                      <Link
                        to={`/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${encodeURIComponent(apt.patientId || "")}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <span className="material-icons text-base">medication</span>
                        Write Prescription
                      </Link>
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
