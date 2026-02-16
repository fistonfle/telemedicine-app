import { useEffect, useState } from "react";
import { getAdminUsers, setProfileDisabled, setUserEnabled, type UserListItem, type UserProfileSummary } from "../api/adminService";
import { useToast } from "../components/ui/Toast";

export default function AdminUsers() {
  const toast = useToast();
  const [list, setList] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProfileId, setUpdatingProfileId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const load = () => {
    getAdminUsers()
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleProfileDisabled = async (profile: UserProfileSummary, nextDisabled: boolean) => {
    setUpdatingProfileId(profile.profileId);
    try {
      await setProfileDisabled(profile.profileId, nextDisabled);
      toast.success(nextDisabled ? "Profile disabled" : "Profile enabled");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setUpdatingProfileId(null);
    }
  };

  const handleToggleUserEnabled = async (u: UserListItem, nextEnabled: boolean) => {
    setUpdatingUserId(u.userId);
    try {
      await setUserEnabled(u.userId, nextEnabled);
      toast.success(nextEnabled ? "User enabled" : "User disabled");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setUpdatingUserId(null);
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
      <h1 className="text-2xl font-bold text-slate-900 mb-2">All users</h1>
      <p className="text-slate-500 mb-8">Users and their profiles (roles).</p>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No users.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Account</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Profiles</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.userId} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-medium text-slate-900">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={u.isEnabled ? "text-emerald-600" : "text-slate-400"}>
                        {u.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleUserEnabled(u, !u.isEnabled)}
                        disabled={updatingUserId === u.userId}
                        className="ml-2 text-xs font-medium px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-200 disabled:opacity-50"
                      >
                        {updatingUserId === u.userId ? "…" : u.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {u.profiles.length === 0
                        ? "—"
                        : u.profiles.map((p) => (
                            <div
                              key={p.profileId}
                              className={`inline-flex items-center gap-2 mr-2 mb-1.5 px-2 py-1 rounded ${p.disabled ? "bg-slate-200 text-slate-500" : "bg-slate-100 text-slate-700"}`}
                            >
                              <span>
                                {p.role}
                                {p.role === "DOCTOR" && p.approved === false && " (pending)"}
                                {p.disabled && " (disabled)"}
                                {p.names ? ` · ${p.names}` : ""}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleToggleProfileDisabled(p, !p.disabled)}
                                disabled={updatingProfileId === p.profileId}
                                className="text-xs font-medium px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-200 disabled:opacity-50"
                              >
                                {updatingProfileId === p.profileId ? "…" : p.disabled ? "Enable" : "Disable"}
                              </button>
                            </div>
                          ))}
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
