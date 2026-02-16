import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";
import { setStoredActiveProfileId } from "../store/authStorage";
import type { ProfileSummary } from "../types";

export default function ChooseProfile() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const profiles = user?.profiles;

  const enabledProfiles = profiles?.filter((p) => !p.disabled) ?? [];

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    if (profiles?.length === 1) {
      const p = profiles[0];
      if (p.disabled) return;
      setStoredActiveProfileId(p.id);
      if (p.role === "DOCTOR") navigate(p.approved ? "/doctor" : "/doctor/pending", { replace: true });
      else if (p.role === "ADMIN") navigate("/admin", { replace: true });
      else navigate("/patient", { replace: true });
    }
  }, [user, profiles, navigate]);

  const handleSelect = (profile: ProfileSummary) => {
    if (profile.disabled) return;
    setStoredActiveProfileId(profile.id);
    if (profile.role === "DOCTOR") navigate(profile.approved ? "/doctor" : "/doctor/pending", { replace: true });
    else if (profile.role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/patient", { replace: true });
  };

  if (!user || !profiles?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profiles.length === 1) {
    if (profiles[0].disabled) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 max-w-md text-center">
            <span className="material-icons text-4xl text-amber-600 mb-4 block">block</span>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Profile disabled</h1>
            <p className="text-slate-600 text-sm mb-6">
              This profile has been disabled. You cannot use it for operations. Please contact support if you believe this is an error.
            </p>
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
              Sign out
            </a>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Choose how to continue</h1>
        <p className="text-slate-500 text-sm mb-8">
          You have more than one profile. Select which one you want to use now.
        </p>
        <div className="space-y-3">
          {profiles.map((profile) => {
            const isDisabled = !!profile.disabled;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelect(profile)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                  isDisabled
                    ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-75"
                    : "border-slate-200 bg-white hover:border-primary hover:bg-primary/5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    isDisabled ? "bg-slate-200 text-slate-500" : profile.role === "DOCTOR"
                    ? "bg-emerald-100 text-emerald-700"
                    : profile.role === "ADMIN"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-sky-100 text-sky-700"
                  }`}
                >
                  <span className="material-icons text-2xl">
                    {profile.role === "DOCTOR" ? "medical_services" : profile.role === "ADMIN" ? "admin_panel_settings" : "person"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {profile.role === "DOCTOR" ? "Use as Doctor" : profile.role === "ADMIN" ? "Use as Admin" : "Use as Patient"}
                    {isDisabled && " (disabled)"}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {profile.names || (profile.role === "DOCTOR" ? "Doctor profile" : profile.role === "ADMIN" ? "Admin" : "Patient profile")}
                    {profile.specialty ? ` · ${profile.specialty}` : ""}
                    {profile.role === "DOCTOR" && profile.approved === false && " · Pending approval"}
                    {isDisabled && " · This profile has been disabled"}
                  </p>
                </div>
                {!isDisabled && <span className="material-icons text-slate-400 ml-auto">chevron_right</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          You can switch at any time from the menu without signing out.
        </p>
      </div>
    </div>
  );
}
