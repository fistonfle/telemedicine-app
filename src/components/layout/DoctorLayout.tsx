import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { getStoredActiveProfileId, setStoredActiveProfileId } from "../../store/authStorage";
import * as authService from "../../api/authService";
import { useToast } from "../ui/Toast";

export default function DoctorLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const me = useAppSelector((s) => s.auth.user);
  const profiles = me?.profiles ?? [];
  const patientProfile = profiles.find((p) => p.role === "PATIENT");
  const hasPatientProfile = !!patientProfile;

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  const activeProfileId = getStoredActiveProfileId();
  const activeProfile = activeProfileId ? profiles.find((p) => p.id === activeProfileId) : profiles[0];
  useEffect(() => {
    if (me && activeProfile?.role === "DOCTOR" && activeProfile.approved === false) {
      navigate("/doctor/pending", { replace: true });
    }
  }, [me, activeProfile, navigate]);

  const handleSwitchToPatient = async () => {
    if (patientProfile) {
      setStoredActiveProfileId(patientProfile.id);
      dispatch(fetchMe());
      navigate("/patient", { replace: true });
      return;
    }
    try {
      await authService.addProfile({ role: "PATIENT" });
      await dispatch(fetchMe()).unwrap();
      const updated = await authService.getMe();
      const newPatient = updated?.profiles?.find((p) => p.role === "PATIENT");
      if (newPatient) {
        setStoredActiveProfileId(newPatient.id);
        navigate("/patient", { replace: true });
        toast.success("Patient profile created. Switched to patient view.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create patient profile.");
    }
  };

  const navItems = [
    { path: "/doctor", icon: "dashboard", label: "Dashboard" },
    { path: "/doctor/appointments", icon: "event_note", label: "Appointments" },
    { path: "/doctor/patients", icon: "people", label: "Patients" },
    { path: "/doctor/schedule", icon: "calendar_month", label: "Schedule" },
    { path: "/doctor/profile", icon: "person", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-display">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">add</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Tele<span className="text-slate-500">med</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/doctor"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="material-icons text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(me?.names || "D").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {me?.names ? (me.names.startsWith("Dr") ? me.names : `Dr. ${me.names}`) : "Doctor"}
              </p>
              <p className="text-xs text-slate-500 truncate">Doctor</p>
            </div>
          </div>
          <button
            onClick={handleSwitchToPatient}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <span className="material-icons text-xl">person</span>
            {hasPatientProfile ? "Switch to Patient" : "Also use as Patient"}
          </button>
          <button
            onClick={() => { dispatch(logout()); navigate("/"); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-icons text-xl">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
