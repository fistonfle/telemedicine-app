import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, type AdminStats } from "../api/adminService";

const statCards: { key: keyof AdminStats; label: string; icon: string; link?: string }[] = [
  { key: "totalUsers", label: "Total users", icon: "people" },
  { key: "totalDoctors", label: "Doctors", icon: "medical_services", link: "/admin/doctors" },
  { key: "approvedDoctors", label: "Approved doctors", icon: "check_circle" },
  { key: "pendingDoctors", label: "Pending approval", icon: "pending_actions", link: "/admin/pending-doctors" },
  { key: "totalPatients", label: "Patients", icon: "person", link: "/admin/patients" },
  { key: "totalAppointments", label: "Appointments", icon: "event" },
  { key: "totalConsultations", label: "Consultations", icon: "description" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin dashboard</h1>
      <p className="text-slate-500 mb-8">Overview of users and platform data.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map(({ key, label, icon, link }) => {
          const value = stats ? Number(stats[key]) : 0;
          const content = (
            <div
              key={key}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <span className="material-icons text-2xl">{icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          );
          return link ? (
            <Link key={key} to={link} className="block hover:opacity-90 transition-opacity">
              {content}
            </Link>
          ) : (
            <div key={key}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
