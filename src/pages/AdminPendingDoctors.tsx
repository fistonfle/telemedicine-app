import { useEffect, useState } from "react";
import { getPendingDoctors, approveDoctor, type PendingDoctor } from "../api/adminService";
import { useToast } from "../components/ui/Toast";

export default function AdminPendingDoctors() {
  const toast = useToast();
  const [list, setList] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingDoctors();
      setList(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pending doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (profileId: string) => {
    setApprovingId(profileId);
    try {
      await approveDoctor(profileId);
      toast.success("Doctor approved.");
      setList((prev) => prev.filter((d) => d.profileId !== profileId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to approve");
    } finally {
      setApprovingId(null);
    }
  };

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
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Pending doctors</h1>
      <p className="text-slate-500 mb-8">
        Doctors who have verified their email and are waiting for approval to use the platform.
      </p>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-icons text-4xl mb-4 block text-slate-300">check_circle</span>
            <p className="font-medium">No pending approvals</p>
            <p className="text-sm mt-1">All doctor requests have been processed.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((d) => (
              <li key={d.profileId} className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{d.names || "—"}</p>
                  <p className="text-sm text-slate-500">{d.email}</p>
                  {(d.specialty || d.licenseNumber) && (
                    <p className="text-sm text-slate-600 mt-1">
                      {[d.specialty, d.licenseNumber].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleApprove(d.profileId)}
                  disabled={approvingId === d.profileId}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
                >
                  {approvingId === d.profileId ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-lg">check_circle</span>
                      Approve
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
