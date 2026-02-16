import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDoctors, type DoctorListItem } from "../api/adminService";

export default function AdminDoctors() {
  const [list, setList] = useState<DoctorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDoctors()
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load doctors"))
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

  const pending = list.filter((d) => !d.approved);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">All doctors</h1>
      <p className="text-slate-500 mb-8">
        {pending.length > 0 && (
          <Link to="/admin/pending-doctors" className="text-amber-600 font-medium hover:underline">
            {pending.length} pending approval →
          </Link>
        )}
        {pending.length === 0 && "Approved and pending doctors."}
      </p>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No doctors.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Specialty</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((d) => (
                  <tr key={d.profileId} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">{d.names || "—"}</td>
                    <td className="py-4 px-6 text-slate-600">{d.email}</td>
                    <td className="py-4 px-6 text-slate-600">{d.specialty || "—"}</td>
                    <td className="py-4 px-6">
                      {d.approved ? (
                        <span className="text-emerald-600 font-medium">Approved</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
