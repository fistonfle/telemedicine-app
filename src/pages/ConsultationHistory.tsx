import { useState, useEffect } from "react";
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
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Error loading consultations</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Consultation History</h1>
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search consultations..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <button className="ml-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 inline-flex items-center">
            <span className="material-icons text-slate-600">filter_list</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Consultations", value: stats?.total ?? "—", sub: "Today" },
          { label: "Recent Checkups", value: stats?.recent ?? "—" },
          { label: "Average Overall Rating", value: stats?.avgRating ?? "—" },
        ].map((stat: { label: string; value: string | number; sub?: string }) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            {stat.sub && (
              <Badge variant="completed" className="mt-2">
                {stat.sub}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Past Appointments */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 px-6 py-4 border-b border-slate-100">
          Past Appointments
        </h2>
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
                <div>
                  <p className="font-semibold text-slate-900">{c.doctor}</p>
                  <p className="text-sm text-slate-500">{c.specialty}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {c.date}, {c.time}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.diagnosis}</p>
                </div>
              </div>
              <div className="shrink-0">
                <Badge variant={c.status}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">{consultations.length} consultations</p>
        </div>
      </div>
    </div>
  );
}

export default ConsultationHistory;
