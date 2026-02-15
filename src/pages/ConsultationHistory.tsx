import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import Badge from "../components/ui/Badge";
import { fetchConsultations, fetchConsultationStats } from "../store/slices/patientSlice";
import type { Consultation } from "../types";

function ConsultationHistory() {
  const dispatch = useAppDispatch();
  const { consultations, consultationStats: stats, loading, error } = useAppSelector((s) => s.patient);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchConsultations(searchQuery));
    dispatch(fetchConsultationStats());
  }, [dispatch, searchQuery]);

  if (loading && !consultations.length) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading visit history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading visit history</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Visit history</h1>
          <p className="text-slate-500 mt-1">
            Your past consultations and visit summaries. Prescriptions from these visits are in{" "}
            <Link to="/patient/prescriptions" className="text-primary font-medium hover:underline">
              Prescriptions
            </Link>
            .
          </p>
        </div>
        <div className="relative flex items-center gap-2">
          <span className="material-icons absolute left-3 text-slate-400 pointer-events-none">search</span>
          <input
            type="text"
            placeholder="Search by diagnosis or notes..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total visits", value: stats?.total ?? 0 },
          { label: "Recent checkups", value: stats?.recent ?? 0 },
          { label: "Average rating", value: stats?.avgRating ?? "—" },
        ].map((stat: { label: string; value: string | number }) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Visit history list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100">
          Past visits
        </h2>
        {consultations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-icons text-4xl mb-4 block text-slate-300">medical_services</span>
            <p className="font-medium">No visits yet</p>
            <p className="text-sm mt-1">
              After you have an appointment and a doctor completes the consultation, it will appear here. You can also view your{" "}
              <Link to="/patient/appointments" className="text-primary font-medium hover:underline">appointments</Link> and{" "}
              <Link to="/patient/prescriptions" className="text-primary font-medium hover:underline">prescriptions</Link>.
            </p>
          </div>
        ) : (
        <div className="divide-y divide-slate-100">
          {consultations.map((c: Consultation) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 hover:bg-slate-50/50"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                  {c.doctor
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{c.doctor}</p>
                  <p className="text-sm text-slate-500">{c.specialty}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {c.date}, {c.time}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.diagnosis}</p>
                  {c.prescriptionNote && c.prescriptionNote.trim() && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Prescription</p>
                      <ul className="text-sm text-slate-700 space-y-0.5">
                        {c.prescriptionNote
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {c.labRequiresFollowUp && (
                  <Link
                    to="/patient/book"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    <span className="material-icons text-lg">event_available</span>
                    Book follow-up
                  </Link>
                )}
                <Badge variant={c.status}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        )}

        {consultations.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">{consultations.length} visit{consultations.length !== 1 ? "s" : ""}</p>
            <Link
              to="/patient/prescriptions"
              className="text-sm font-medium text-primary hover:underline"
            >
              View prescriptions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationHistory;
