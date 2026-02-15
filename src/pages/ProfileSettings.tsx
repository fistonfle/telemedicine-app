import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProfile, updateProfileThunk } from "../store/slices/authSlice";
import { useToast } from "../components/ui/Toast";

function ProfileSettings() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { profile, loading } = useAppSelector((s) => s.auth);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        fullName: profile?.names || (profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "") || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        address: profile?.address || "",
        dateOfBirth: prev.dateOfBirth || "",
      }));
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = form.fullName.trim().split(/\s+/);
    const result = await dispatch(updateProfileThunk({
      names: form.fullName.trim(),
      firstName: name[0] || "",
      lastName: name.slice(1).join(" ") || "",
      email: form.email.trim() || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
    }));
    if (updateProfileThunk.fulfilled.match(result)) {
      setSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setSaved(false), 3000);
    } else if (updateProfileThunk.rejected.match(result)) {
      const msg = result.payload || "Failed to save";
      setError(msg);
      toast.error(msg);
    }
  };

  if (loading && !profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {(form.fullName || "?").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
          </div>
          <span className="font-medium text-slate-900">{form.fullName || "—"}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl" key={form.fullName || "form"}>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                  <span className="material-icons text-4xl">person</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Upload New
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                {[
                  { key: "fullName", label: "Full Name", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "dateOfBirth", label: "Date of Birth", type: "text" },
                ].map(({ key, label, type }: { key: keyof typeof form; label: string; type: string }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Residential Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Security & Password */}
            <div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                Security & Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-slate-500 mt-1">Min. 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Re-type new password"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-600">
                    Two-factor Authentication (2FA) adds an extra layer of security.
                  </p>
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline text-sm"
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-4">
            <button
              type="button"
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-100"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="relative px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
            >
              Save Changes
              {saved && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                  Settings Saved
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="mt-8">
          <button
            type="button"
            className="px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </form>

      <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
        © 2023 Telemed. All rights reserved.{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}

export default ProfileSettings;
