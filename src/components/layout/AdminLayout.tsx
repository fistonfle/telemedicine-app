import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { fetchMe, logout } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { getStoredActiveProfileId } from "../../store/authStorage";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.user);
  const profiles = me?.profiles ?? [];
  const activeProfileId = getStoredActiveProfileId();
  const activeProfile = activeProfileId ? profiles.find((p) => p.id === activeProfileId) : profiles[0];

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (me && activeProfile?.role !== "ADMIN") {
      navigate("/choose-profile", { replace: true });
    }
  }, [me, activeProfile, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-display">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-icons text-white text-xl">admin_panel_settings</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Admin</span>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-icons text-xl">dashboard</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-icons text-xl">people</span>
            Users
          </NavLink>
          <NavLink
            to="/admin/doctors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-icons text-xl">medical_services</span>
            Doctors
          </NavLink>
          <NavLink
            to="/admin/pending-doctors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-icons text-xl">pending_actions</span>
            Pending doctors
          </NavLink>
          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive ? "bg-amber-100 text-amber-800" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-icons text-xl">person</span>
            Patients
          </NavLink>
        </nav>
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
              {(me?.names || "A").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{me?.names ?? "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { dispatch(logout()); navigate("/"); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
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
