import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { setStoredActiveProfileId } from "../store/authStorage";
import { fetchMe, logout } from "../store/slices/authSlice";

export default function DoctorPending() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);
  const profiles = me?.profiles ?? [];
  const patientProfile = profiles.find((p) => p.role === "PATIENT");

  const handleSwitchToPatient = () => {
    if (patientProfile) {
      setStoredActiveProfileId(patientProfile.id);
      dispatch(fetchMe());
      navigate("/patient", { replace: true });
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
        <span className="material-icons text-5xl text-amber-600 mb-4 block">schedule</span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Doctor profile pending approval</h1>
        <p className="text-slate-600 mb-6">
          After verifying your email, your doctor profile is now waiting for an administrator to approve it.
          You will be able to use the doctor dashboard once approved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {patientProfile && (
            <button
              type="button"
              onClick={handleSwitchToPatient}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              <span className="material-icons">person</span>
              Use as Patient meanwhile
            </button>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
          >
            <span className="material-icons">logout</span>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
