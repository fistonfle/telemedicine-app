import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getMe, logout } from "../api/services.js";

function PatientLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    getMe().then(setMe).catch(() => setMe(null));
  }, []);

  const navItems = [
    { path: "/patient", icon: "dashboard", label: "Dashboard" },
    { path: "/patient/appointments", icon: "event", label: "Appointments" },
    { path: "/patient/book", icon: "add_circle", label: "Book Appointment" },
    { path: "/patient/history", icon: "history", label: "History" },
    { path: "/patient/prescriptions", icon: "medication", label: "Prescriptions" },
    { path: "/patient/profile", icon: "person", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-display">
      {/* Sidebar */}
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
              end={item.path === "/patient"}
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
              {(me?.names || "P").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 truncate">{me?.names ?? "Patient"}</p>
              <p className="text-xs text-slate-500 truncate">Patient</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-icons text-xl">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default PatientLayout;
