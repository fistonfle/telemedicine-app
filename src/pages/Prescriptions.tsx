import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import Badge from "../components/ui/Badge";
import { fetchPrescriptions } from "../store/slices/patientSlice";
import type { PrescriptionRow } from "../types";

function Prescriptions() {
  const dispatch = useAppDispatch();
  const { prescriptions, loading, error } = useAppSelector((s) => s.patient);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const filtered = prescriptions.filter(
    (p: PrescriptionRow) =>
      !searchQuery ||
      (p.medication || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.doctor || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading prescriptions</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search medications, doctors, or prescriptions..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-lg hover:bg-slate-100">
            <span className="material-icons text-slate-600">notifications</span>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-slate-100">
            <span className="material-icons text-slate-600">schedule</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Prescriptions</h1>
          <p className="text-slate-500 mt-1">
            Manage your active medications and refill history.
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-primary text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-icons text-4xl mb-4 block text-slate-300">medication</span>
            <p className="font-medium">No prescriptions yet</p>
            <p className="text-sm mt-1">
              Prescriptions appear here after a doctor creates one from your visit (Consultation → Prescription). If you’ve had a visit and expected a prescription, ask your doctor to add medications and create the prescription from the visit page.
            </p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date ordered
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Visit
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "active" ? filtered : filtered).map((rx: PrescriptionRow) => (
                <tr
                  key={rx.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50"
                >
                  <td className="py-4 px-6 text-slate-600">
                    {rx.orderedAt ?? "—"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-icons text-primary">
                          medication
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{rx.medication}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {rx.dosage}
                  </td>
                  <td className="py-4 px-6 text-slate-600">{rx.frequency}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {rx.doctor
                          .replace("Dr. ", "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="text-slate-600">{rx.doctor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={rx.status === "ready" ? "approved" : rx.status === "processing" ? "pending" : "completed"}>
                      {rx.status === "ready"
                        ? "Ready for Refill"
                        : rx.status === "processing"
                        ? "Processing"
                        : "Out of refills"}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    {rx.appointmentId ? (
                      <Link
                        to={`/patient/appointments/${rx.appointmentId}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <span className="material-icons text-lg">event</span>
                        View appointment
                      </Link>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
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

export default Prescriptions;
