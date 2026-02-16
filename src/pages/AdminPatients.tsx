import { useEffect, useState } from "react";
import { getAdminPatients, type PatientListItem } from "../api/adminService";

export default function AdminPatients() {
  const [list, setList] = useState<PatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminPatients()
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load patients"))
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
      <h1 className="text-2xl font-bold text-slate-900 mb-2">All patients</h1>
      <p className="text-slate-500 mb-8">Patient profiles and contact info.</p>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No patients.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Phone</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.profileId} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">{p.names || "—"}</td>
                    <td className="py-4 px-6 text-slate-600">{p.email}</td>
                    <td className="py-4 px-6 text-slate-600">{p.phone || "—"}</td>
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
