import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { getPatientAppointment } from "../api/patientService";
import type { PatientAppointment } from "../types";

function PatientAppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<PatientAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid appointment");
      return;
    }
    getPatientAppointment(id)
      .then(setAppointment)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Appointment not found</p>
          <p className="text-sm mt-1">{error ?? "This appointment may have been removed or you don't have access."}</p>
          <Link
            to="/patient/appointments"
            className="inline-block mt-4 text-primary font-medium hover:underline"
          >
            Back to appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          to="/patient/appointments"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <span className="material-icons">arrow_back</span>
          Back to appointments
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Appointment details</h1>
        <p className="text-slate-500 mb-8">View your appointment information.</p>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg shrink-0">
                {(appointment.doctor || "?")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-lg">{appointment.doctor || "—"}</p>
                <p className="text-slate-600">{appointment.specialty || "—"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant={appointment.status}>{appointment.status}</Badge>
                  {appointment.isFollowUp && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-sky-100 text-sky-800">
                      <span className="material-icons text-lg">replay</span>
                      Follow-up visit
                    </span>
                  )}
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <dt className="text-sm font-medium text-slate-500">Date</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{appointment.date}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Slot</dt>
                <dd className="mt-0.5 font-medium text-slate-900">Slot {appointment.slot}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Status</dt>
                <dd className="mt-0.5">
                  <Badge variant={appointment.status}>{appointment.status}</Badge>
                </dd>
              </div>
            </dl>

            {appointment.consultationSummary && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <p className="text-sm font-medium text-slate-500">Visit summary</p>
                {appointment.consultationSummary.diagnosis && appointment.consultationSummary.diagnosis.trim() && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Diagnosis</p>
                    <p className="text-sm text-slate-700 mt-0.5">{appointment.consultationSummary.diagnosis}</p>
                  </div>
                )}
                {appointment.consultationSummary.notes && appointment.consultationSummary.notes.trim() && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-slate-600 mt-0.5 whitespace-pre-wrap">{appointment.consultationSummary.notes.trim()}</p>
                  </div>
                )}
                {(appointment.consultationSummary.temperatureCelsius != null ||
                  appointment.consultationSummary.weightKg != null ||
                  appointment.consultationSummary.heightCm != null ||
                  appointment.consultationSummary.bloodPressureSystolic != null ||
                  appointment.consultationSummary.bloodPressureDiastolic != null ||
                  appointment.consultationSummary.heartRateBpm != null ||
                  appointment.consultationSummary.respiratoryRatePerMin != null ||
                  appointment.consultationSummary.oxygenSaturation != null) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                    {appointment.consultationSummary.temperatureCelsius != null && (
                      <span className="text-slate-600">Temp: <strong>{appointment.consultationSummary.temperatureCelsius}°C</strong></span>
                    )}
                    {appointment.consultationSummary.weightKg != null && (
                      <span className="text-slate-600">Weight: <strong>{appointment.consultationSummary.weightKg} kg</strong></span>
                    )}
                    {appointment.consultationSummary.heightCm != null && (
                      <span className="text-slate-600">Height: <strong>{appointment.consultationSummary.heightCm} cm</strong></span>
                    )}
                    {(appointment.consultationSummary.bloodPressureSystolic != null || appointment.consultationSummary.bloodPressureDiastolic != null) && (
                      <span className="text-slate-600">
                        BP: <strong>{appointment.consultationSummary.bloodPressureSystolic ?? "—"}/{appointment.consultationSummary.bloodPressureDiastolic ?? "—"} mmHg</strong>
                      </span>
                    )}
                    {appointment.consultationSummary.heartRateBpm != null && (
                      <span className="text-slate-600">HR: <strong>{appointment.consultationSummary.heartRateBpm} bpm</strong></span>
                    )}
                    {appointment.consultationSummary.respiratoryRatePerMin != null && (
                      <span className="text-slate-600">RR: <strong>{appointment.consultationSummary.respiratoryRatePerMin}/min</strong></span>
                    )}
                    {appointment.consultationSummary.oxygenSaturation != null && (
                      <span className="text-slate-600">SpO₂: <strong>{appointment.consultationSummary.oxygenSaturation}%</strong></span>
                    )}
                  </div>
                )}
                {(appointment.consultationSummary.requiresLabTest || appointment.consultationSummary.labResultsSameDay || appointment.consultationSummary.labRequiresFollowUp) && (
                  <div className="flex flex-wrap gap-2">
                    {appointment.consultationSummary.requiresLabTest && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">
                        <span className="material-icons text-sm">science</span>
                        Lab tests ordered
                      </span>
                    )}
                    {appointment.consultationSummary.labResultsSameDay && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-emerald-100 text-emerald-800">
                        Same-day results
                      </span>
                    )}
                    {appointment.consultationSummary.labRequiresFollowUp && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-800">
                        Follow-up for results
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {appointment.prescriptionNote && appointment.prescriptionNote.trim() && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-500 mb-2">Prescription</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {appointment.prescriptionNote
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

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/patient/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            Back to list
          </Link>
          <Link
            to="/patient/history"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          >
            <span className="material-icons text-lg">history</span>
            View visit history
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointmentDetail;
