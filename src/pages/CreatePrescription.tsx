import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  getDoctorAppointment,
  getAppointmentDetails,
  createPrescription,
  getConsultationForAppointment,
  createConsultation,
  getTestsByConsultation,
  addMedicalTest,
  updateTestStatus,
  updateAppointmentStatus,
} from "../api/services";
import { useToast } from "../components/ui/Toast";
import Badge from "../components/ui/Badge";

const FREQUENCY_OPTIONS = [
  { value: "ONCE_DAILY", label: "Once daily" },
  { value: "TWICE_DAILY", label: "Twice daily" },
  { value: "THREE_TIMES_DAILY", label: "Three times daily" },
  { value: "FOUR_TIMES_DAILY", label: "Four times daily" },
  { value: "EVERY_6_HOURS", label: "Every 6 hours" },
  { value: "EVERY_8_HOURS", label: "Every 8 hours" },
  { value: "EVERY_12_HOURS", label: "Every 12 hours" },
  { value: "AS_NEEDED", label: "As needed (PRN)" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "OTHER", label: "Other" },
];

const DOSAGE_UNITS = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "mcg", label: "mcg" },
  { value: "ml", label: "ml" },
  { value: "IU", label: "IU" },
  { value: "tablets", label: "tablets" },
  { value: "capsules", label: "capsules" },
  { value: "drops", label: "drops" },
  { value: "puffs", label: "puffs" },
  { value: "application", label: "application" },
  { value: "OTHER", label: "Other" },
];

function formatDosage(m: { dosageAmount?: string; dosage?: string; dosageUnit?: string; dosageOther?: string }): string {
  if (!m.dosageAmount && !m.dosage) return m.dosage || "";
  if (m.dosageUnit === "OTHER" && m.dosageOther) return `${m.dosageAmount || ""} ${m.dosageOther}`.trim();
  if (m.dosageUnit) return `${m.dosageAmount || ""} ${m.dosageUnit}`.trim();
  return m.dosage || "";
}

function formatFrequency(m: { frequency?: string; frequencyOther?: string }): string {
  if (m.frequency === "OTHER" && m.frequencyOther) return m.frequencyOther;
  const opt = FREQUENCY_OPTIONS.find((o) => o.value === m.frequency);
  return opt ? opt.label : m.frequency || "";
}

function CreatePrescription() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientIdParam = searchParams.get("patientId");
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Record<string, unknown> | null>(null);
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [consultation, setConsultation] = useState<{ id?: string } | null>(null);
  const [tests, setTests] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: "", notes: "",
    temperature: "", weight: "", height: "",
    bloodPressureSystolic: "", bloodPressureDiastolic: "",
    heartRate: "", respiratoryRate: "", oxygenSaturation: "",
    requiresLabTest: null,
    labResultsSameDay: null,
    labRequiresFollowUp: null,
  });
  const [testForm, setTestForm] = useState({ name: "", description: "" });
  const [showTestForm, setShowTestForm] = useState(false);
  const [medications, setMedications] = useState<Record<string, unknown>[]>([]);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [medicationForm, setMedicationForm] = useState({
    medication: "",
    dosageAmount: "",
    dosageUnit: "mg",
    dosageOther: "",
    frequency: "TWICE_DAILY",
    frequencyOther: "",
    instructions: "",
    refills: 0,
    expiresIn: 90,
  });
  const [form, setForm] = useState({
    patientId: patientIdParam || "",
  });

  const loadDetails = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const d = await getAppointmentDetails(appointmentId);
      setDetails(d);
      if (d?.consultation) setConsultation(d.consultation);
      if (d?.tests?.length) setTests(d.tests);
      return d;
    } catch {
      return null;
    }
  }, [appointmentId]);

  const loadConsultation = useCallback(async () => {
    if (!appointmentId) return;
    try {
      const d = await loadDetails();
      if (d?.consultation) return d.consultation;
      const c = await getConsultationForAppointment(appointmentId);
      setConsultation(c);
      return c;
    } catch {
      const c = await getConsultationForAppointment(appointmentId).catch(() => null);
      if (c) setConsultation(c);
      return c;
    }
  }, [appointmentId, loadDetails]);

  const loadTests = useCallback(async () => {
    if (!consultation?.id) return;
    const list = await getTestsByConsultation(consultation.id);
    setTests(list);
    return list;
  }, [consultation?.id]);

  useEffect(() => {
    if (!appointmentId || !patientIdParam) {
      setError("Invalid link. Prescriptions are created from an appointment.");
      setLoading(false);
      return;
    }
    setForm((prev) => ({ ...prev, patientId: patientIdParam }));
    Promise.all([
      getDoctorAppointment(appointmentId),
      getAppointmentDetails(appointmentId).catch(() => null),
    ])
      .then(([apt, d]) => {
        setAppointment(apt);
        if (d) {
          setDetails(d);
          if (d.consultation) setConsultation(d.consultation);
          if (d.tests?.length) setTests(d.tests);
        } else {
          getConsultationForAppointment(appointmentId).then((c) => c && setConsultation(c)).catch(() => {});
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [appointmentId, patientIdParam]);

  useEffect(() => {
    if (!consultation?.id || tests.length > 0) return;
    loadTests();
  }, [consultation?.id, loadTests]);

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const hasDosage = medicationForm.dosageAmount?.trim() || (medicationForm.dosageUnit === "OTHER" && medicationForm.dosageOther?.trim());
    const hasFreq = medicationForm.frequency !== "OTHER" || medicationForm.frequencyOther?.trim();
    if (!medicationForm.medication?.trim() || !hasDosage || !hasFreq) {
      setError("Fill in name, dosage (amount + unit), and frequency.");
      return;
    }
    setError(null);
    setMedications((prev) => [...prev, { ...medicationForm }]);
    setShowMedicationForm(false);
    setMedicationForm({
      medication: "",
      dosageAmount: "",
      dosageUnit: "mg",
      dosageOther: "",
      frequency: "TWICE_DAILY",
      frequencyOther: "",
      instructions: "",
      refills: 0,
      expiresIn: 90,
    });
    toast.success("Medication added");
  };
  const removeMedication = (index: number) => setMedications((prev) => prev.filter((_, i) => i !== index));

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (consultationForm.requiresLabTest === null) {
      setError("Please indicate whether the next step requires lab tests.");
      return;
    }
    if (consultationForm.requiresLabTest === true) {
      const hasSameDay = consultationForm.labResultsSameDay === true;
      const hasFollowUp = consultationForm.labRequiresFollowUp === true;
      if (!hasSameDay && !hasFollowUp) {
        setError("Please indicate when results will be ready: same day, follow-up, or both.");
        return;
      }
    }
    setError(null);
    setSubmitting(true);
    try {
      const c = await createConsultation({
        appointmentId,
        diagnosis: consultationForm.diagnosis || "Consultation",
        notes: consultationForm.notes,
        temperatureCelsius: consultationForm.temperature || null,
        weightKg: consultationForm.weight || null,
        heightCm: consultationForm.height || null,
        bloodPressureSystolic: consultationForm.bloodPressureSystolic || null,
        bloodPressureDiastolic: consultationForm.bloodPressureDiastolic || null,
        heartRateBpm: consultationForm.heartRate || null,
        respiratoryRatePerMin: consultationForm.respiratoryRate || null,
        oxygenSaturation: consultationForm.oxygenSaturation || null,
        requiresLabTest: consultationForm.requiresLabTest === true,
        labResultsSameDay: consultationForm.requiresLabTest ? consultationForm.labResultsSameDay === true : null,
        labRequiresFollowUp: consultationForm.requiresLabTest ? consultationForm.labRequiresFollowUp === true : null,
      });
      setConsultation(c);
      const d = await getAppointmentDetails(appointmentId).catch(() => null);
      if (d) setDetails(d);
      toast.success("Consultation created");
    } catch (err) {
      setError(err.message || "Failed to start consultation");
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAppointmentStatus = async (status: string) => {
    if (!appointmentId) return;
    setError(null);
    setSubmitting(true);
    try {
      await updateAppointmentStatus(appointmentId, status);
      const apt = await getDoctorAppointment(appointmentId);
      setAppointment(apt);
      const d = await getAppointmentDetails(appointmentId).catch(() => null);
      if (d) setDetails(d);
      toast.success(status === "COMPLETED" ? "Appointment closed" : "Appointment status updated");
    } catch (err) {
      setError(err.message || "Failed to update status");
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelTest = async (testId: string) => {
    if (!consultation?.id) return;
    setError(null);
    try {
      await updateTestStatus(testId, "CANCELLED");
      await loadTests();
      const d = await getAppointmentDetails(appointmentId).catch(() => null);
      if (d) setDetails(d);
      toast.success("Test cancelled");
    } catch (err) {
      setError(err.message || "Failed to cancel test");
      toast.error(err.message);
    }
  };

  const handleUpdateTestStatus = async (testId, status) => {
    if (!consultation?.id) return;
    setError(null);
    try {
      await updateTestStatus(testId, status);
      await loadTests();
      const d = await getAppointmentDetails(appointmentId).catch(() => null);
      if (d) setDetails(d);
      toast.success("Test status updated");
    } catch (err) {
      setError(err.message || "Failed to update test");
      toast.error(err.message);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultation?.id || !testForm.name?.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await addMedicalTest(consultation.id, testForm.name.trim(), testForm.description?.trim() || "");
      setTestForm({ name: "", description: "" });
      setShowTestForm(false);
      await loadTests();
      const d = await getAppointmentDetails(appointmentId).catch(() => null);
      if (d) setDetails(d);
      toast.success("Test added");
    } catch (err) {
      setError(err.message || "Failed to add test");
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultation || tests.length < 1) return;
    if (medications.length === 0) {
      setError("Add at least one medication before creating the prescription.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const medParts = medications.map((m) => {
        const dosage = formatDosage(m);
        const frequency = formatFrequency(m);
        const p = [`${m.medication}`, dosage, frequency, m.instructions && m.instructions].filter(Boolean);
        let line = p.join(" — ");
        const extra = [];
        if (m.refills > 0) extra.push(`${m.refills} refills`);
        if (m.expiresIn > 0) extra.push(`valid ${m.expiresIn} days`);
        if (extra.length) line += ` (${extra.join(", ")})`;
        return line;
      });
      const note = medParts.join("\n");
      await createPrescription({
        appointmentId,
        patientId: patientIdParam,
        diagnosis: medications[0]?.medication || "Prescription",
        note,
      });
      toast.success("Prescription created successfully");
      navigate("/doctor");
    } catch (err) {
      const msg = err.message || "Failed to create prescription";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!appointmentId || !patientIdParam) {
    return (
      <div className="p-8 max-w-2xl">
        <Link
          to="/doctor"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-4"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          <p className="font-semibold">Cannot create prescription</p>
          <p className="text-sm mt-1">Prescriptions are created from an appointment. Go to your dashboard and use Prescription on an appointment.</p>
        </div>
      </div>
    );
  }

  const displayAppointment = details?.appointment ?? appointment;
  const statusLower = (displayAppointment?.status || "").toLowerCase();
  const isClosed = ["completed", "cancelled"].includes(statusLower);
  const isApproved = statusLower === "approved";
  const activeTests = tests.filter((t: { status?: string }) => t.status !== "CANCELLED");
  const hasPrescription = !!details?.prescription;
  const canWritePrescription = !isClosed && consultation && activeTests.length >= 1 && !hasPrescription;
  const canAddPrescription = !isClosed && consultation && activeTests.length >= 1;
  const pageTitle = isClosed ? "Appointment (closed)" : !consultation ? "Create consultation" : !canAddPrescription ? "Add tests" : hasPrescription ? "Prescription" : "Create prescription";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          to="/doctor"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-4"
        >
          <span className="material-icons text-lg">arrow_back</span>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
        <p className="text-slate-500 mt-1">
          {displayAppointment && <>For <span className="font-medium text-slate-700">{displayAppointment.patient}</span> — Slot {displayAppointment.slot}</>}
        </p>
      </div>

      {/* Appointment details summary */}
      {(details?.appointment || details?.consultation || details?.tests?.length || details?.prescription) && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="material-icons text-primary">info</span>
            Appointment details
          </h2>
          <div className="space-y-4">
            {displayAppointment && (
              <div>
                <p className="text-sm font-medium text-slate-500">Appointment</p>
                <p className="text-slate-800">
                  {displayAppointment.appointmentDate ? new Date(displayAppointment.appointmentDate).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—"} · Slot {displayAppointment.slot}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant={(displayAppointment.status || "pending").toLowerCase()}>{(displayAppointment.status || "Pending").charAt(0).toUpperCase() + (displayAppointment.status || "pending").slice(1)}</Badge>
                  {!isClosed && (
                    <button
                      type="button"
                      onClick={() => handleUpdateAppointmentStatus("COMPLETED")}
                      className="text-sm px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Close appointment
                    </button>
                  )}
                  {isClosed && (
                    <span className="text-sm text-slate-500">No further actions — appointment is closed</span>
                  )}
                </div>
              </div>
            )}
            {details?.consultation && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Consultation</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  {details.consultation.temperatureCelsius != null && <span>Temp: {details.consultation.temperatureCelsius}°C</span>}
                  {details.consultation.weightKg != null && <span>Weight: {details.consultation.weightKg} kg</span>}
                  {details.consultation.heightCm != null && <span>Height: {details.consultation.heightCm} cm</span>}
                  {(details.consultation.bloodPressureSystolic != null || details.consultation.bloodPressureDiastolic != null) && (
                    <span>BP: {details.consultation.bloodPressureSystolic ?? "—"}/{details.consultation.bloodPressureDiastolic ?? "—"} mmHg</span>
                  )}
                  {details.consultation.heartRateBpm != null && <span>HR: {details.consultation.heartRateBpm} bpm</span>}
                  {details.consultation.respiratoryRatePerMin != null && <span>RR: {details.consultation.respiratoryRatePerMin}/min</span>}
                  {details.consultation.oxygenSaturation != null && <span>SpO₂: {details.consultation.oxygenSaturation}%</span>}
                </div>
                {details.consultation.diagnosis && <p className="text-slate-700 mt-1"><strong>Diagnosis:</strong> {details.consultation.diagnosis}</p>}
                {details.consultation.notes && <p className="text-slate-600 text-sm mt-0.5">{details.consultation.notes}</p>}
                {details.consultation.requiresLabTest && (
                  <p className="text-amber-700 text-sm mt-1">
                    Lab tests required — {[
                      details.consultation.labResultsSameDay && "some results same day",
                      details.consultation.labRequiresFollowUp && "patient needs follow-up for others",
                    ].filter(Boolean).join("; ") || "see consultation"}
                  </p>
                )}
              </div>
            )}
            {details?.tests?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tests</p>
                <ul className="text-slate-700 text-sm space-y-0.5">
                  {details.tests.map((t) => (
                    <li key={t.id} className={t.status === "CANCELLED" ? "opacity-60" : ""}>
                      • {t.name}{t.description ? ` — ${t.description}` : ""}
                      {t.status && <Badge variant={t.status === "CANCELLED" ? "cancelled" : t.status.toLowerCase()} className="ml-1">{t.status === "CANCELLED" ? "Cancelled" : t.status === "DONE" ? "Done" : t.status === "FOLLOW_UP_NEEDED" ? "Needs follow-up" : "Ordered"}</Badge>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(details?.consultation || details?.tests?.length) && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Medications</p>
                {details?.prescription?.note ? (
                  <ul className="text-slate-700 text-sm space-y-0.5">
                    {details.prescription.note
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{line.trim()}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic">No medications prescribed</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Create consultation if needed */}
      {!isClosed && !consultation && !isApproved && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Approve first</h2>
          <p className="text-sm text-slate-600 mb-4">The appointment must be approved before you can start a consultation.</p>
          <button
            type="button"
            onClick={() => handleUpdateAppointmentStatus("APPROVED")}
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
          >
            Approve appointment
          </button>
        </div>
      )}
      {!isClosed && !consultation && isApproved && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Create consultation</h2>
          <p className="text-sm text-slate-600 mb-4">Create a consultation record before adding tests and prescribing.</p>
          <form onSubmit={handleCreateConsultation} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
            )}
            <p className="text-sm font-medium text-slate-700 mb-3">Vital signs (in-clinic measures)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Temperature (°C)</label>
                <input type="number" step="0.1" min="35" max="43" value={consultationForm.temperature}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, temperature: e.target.value }))}
                  placeholder="36.5" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
                <input type="number" step="0.1" min="20" max="300" value={consultationForm.weight}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, weight: e.target.value }))}
                  placeholder="70" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Height (cm)</label>
                <input type="number" step="0.1" min="50" max="250" value={consultationForm.height}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, height: e.target.value }))}
                  placeholder="170" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Blood pressure (mmHg)</label>
                <div className="flex gap-2">
                  <input type="number" min="60" max="250" value={consultationForm.bloodPressureSystolic}
                    onChange={(e) => setConsultationForm((p) => ({ ...p, bloodPressureSystolic: e.target.value }))}
                    placeholder="120" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                  <span className="self-center text-slate-400">/</span>
                  <input type="number" min="40" max="150" value={consultationForm.bloodPressureDiastolic}
                    onChange={(e) => setConsultationForm((p) => ({ ...p, bloodPressureDiastolic: e.target.value }))}
                    placeholder="80" className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Heart rate (bpm)</label>
                <input type="number" min="30" max="200" value={consultationForm.heartRate}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, heartRate: e.target.value }))}
                  placeholder="72" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Resp. rate (/min)</label>
                <input type="number" min="8" max="40" value={consultationForm.respiratoryRate}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, respiratoryRate: e.target.value }))}
                  placeholder="16" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">SpO₂ (%)</label>
                <input type="number" min="85" max="100" value={consultationForm.oxygenSaturation}
                  onChange={(e) => setConsultationForm((p) => ({ ...p, oxygenSaturation: e.target.value }))}
                  placeholder="98" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div className="pt-2 pb-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Does the next step require lab tests?</label>
              <p className="text-sm text-slate-600 mb-2">If yes, add lab test orders below. Then indicate when results will be ready.</p>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="requiresLabTest" checked={consultationForm.requiresLabTest === true}
                      onChange={() => setConsultationForm((p) => ({ ...p, requiresLabTest: true, labResultsSameDay: null, labRequiresFollowUp: null }))}
                      className="rounded-full border-slate-300 text-primary focus:ring-primary" />
                    <span>Yes — lab tests needed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="requiresLabTest" checked={consultationForm.requiresLabTest === false}
                      onChange={() => setConsultationForm((p) => ({ ...p, requiresLabTest: false, labResultsSameDay: null, labRequiresFollowUp: null }))}
                      className="rounded-full border-slate-300 text-primary focus:ring-primary" />
                    <span>No — proceed to prescription</span>
                  </label>
                </div>
                {consultationForm.requiresLabTest === true && (
                  <div className="ml-6 mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-2">When will results be ready? (select all that apply)</p>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={consultationForm.labResultsSameDay === true}
                          onChange={(e) => setConsultationForm((p) => ({ ...p, labResultsSameDay: e.target.checked }))}
                          className="rounded border-slate-300 text-primary focus:ring-primary" />
                        <span>Same day — quick tests ready today, no follow-up needed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={consultationForm.labRequiresFollowUp === true}
                          onChange={(e) => setConsultationForm((p) => ({ ...p, labRequiresFollowUp: e.target.checked }))}
                          className="rounded border-slate-300 text-primary focus:ring-primary" />
                        <span>Follow-up needed — some tests require patient to return for results</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnosis (optional)</label>
              <input
                type="text"
                value={consultationForm.diagnosis}
                onChange={(e) => setConsultationForm((p) => ({ ...p, diagnosis: e.target.value }))}
                placeholder="e.g. Upper respiratory infection"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (optional)</label>
              <textarea
                value={consultationForm.notes}
                onChange={(e) => setConsultationForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Clinical notes..."
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create consultation"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Add tests */}
      {!isClosed && consultation && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            2. {consultation.requiresLabTest ? "Lab test orders" : "Medical tests"} {activeTests.length >= 1 && <span className="text-green-600 text-sm font-normal">✓</span>}
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            {consultation.requiresLabTest
              ? "Add lab tests to order. Add each test, then add prescription below — prescribe now; patient may get results same day or return for follow-up."
              : "Add at least one test, then add prescription (medication) below."}
          </p>
          {tests.length > 0 && (
            <ul className="mb-4 space-y-2">
              {tests.map((t) => (
                <li key={t.id} className={`flex items-center gap-2 text-slate-700 ${t.status === "CANCELLED" ? "opacity-60" : ""}`}>
                  {t.status === "CANCELLED" ? (
                    <span className="material-icons text-slate-400 text-lg">cancel</span>
                  ) : (
                    <span className="material-icons text-green-600 text-lg">check_circle</span>
                  )}
                  <span className="font-medium">{t.name}</span>
                  {t.description && <span className="text-slate-500">— {t.description}</span>}
                  <Badge variant={t.status === "CANCELLED" ? "cancelled" : (t.status || "ORDERED").toLowerCase()} className="ml-auto">
                    {t.status === "CANCELLED" ? "Cancelled" : t.status === "DONE" ? "Done" : t.status === "FOLLOW_UP_NEEDED" ? "Needs follow-up" : "Ordered"}
                  </Badge>
                  {t.status !== "CANCELLED" && (
                    <div className="flex items-center gap-1">
                      <select
                        value={t.status || "ORDERED"}
                        onChange={(e) => handleUpdateTestStatus(t.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded px-2 py-1"
                      >
                        <option value="ORDERED">Ordered</option>
                        <option value="DONE">Done</option>
                        <option value="FOLLOW_UP_NEEDED">Needs follow-up</option>
                      </select>
                      <button type="button" onClick={() => handleCancelTest(t.id)} className="text-red-600 hover:text-red-700 text-sm">Cancel</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!showTestForm ? (
            <button
              type="button"
              onClick={() => setShowTestForm(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <span className="material-icons text-lg">add_circle</span>
              Add test
            </button>
          ) : (
            <form onSubmit={handleAddTest} className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  value={testForm.name}
                  onChange={(e) => setTestForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder={consultation?.requiresLabTest ? "e.g. Full blood count" : "e.g. Blood count"}
                  required
                  className="flex-1 min-w-[180px] px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <input
                  type="text"
                  value={testForm.description}
                  onChange={(e) => setTestForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="flex-1 min-w-[180px] px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowTestForm(false); setTestForm({ name: "", description: "" }); }}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !testForm.name?.trim()}
                    className="px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-60"
                  >
                    Add test
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 3: Prescription — add medications one by one (like lab tests) */}
      {canWritePrescription && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            3. Prescription — medications {medications.length >= 1 && <span className="text-green-600 text-sm font-normal">✓</span>}
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Add each medication. You can add as many as needed, then create the prescription.
          </p>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
          )}
          {medications.length > 0 && (
            <ul className="mb-4 space-y-2">
              {medications.map((med, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-700">
                  <span className="material-icons text-green-600 text-lg">check_circle</span>
                  <span className="font-medium">{med.medication}</span>
                  <span className="text-slate-500">— {formatDosage(med)}, {formatFrequency(med)}</span>
                  {med.instructions && <span className="text-slate-500">({med.instructions})</span>}
                  <button type="button" onClick={() => removeMedication(index)} className="ml-auto text-red-600 hover:text-red-700 text-sm">Remove</button>
                </li>
              ))}
            </ul>
          )}
          {!showMedicationForm ? (
            <button
              type="button"
              onClick={() => setShowMedicationForm(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              <span className="material-icons text-lg">add_circle</span>
              Add medication
            </button>
          ) : (
          <form onSubmit={handleAddMedication} className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  value={medicationForm.medication}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, medication: e.target.value }))}
                  placeholder="e.g. Amoxicillin"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Dosage — amount</label>
                <input
                  type="text"
                  value={medicationForm.dosageAmount}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, dosageAmount: e.target.value }))}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Dosage — unit</label>
                <select
                  value={medicationForm.dosageUnit}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, dosageUnit: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  {DOSAGE_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
              {medicationForm.dosageUnit === "OTHER" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Custom unit</label>
                  <input
                    type="text"
                    value={medicationForm.dosageOther}
                    onChange={(e) => setMedicationForm((p) => ({ ...p, dosageOther: e.target.value }))}
                    placeholder="e.g. spoonfuls"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                <select
                  value={medicationForm.frequency}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, frequency: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              {medicationForm.frequency === "OTHER" && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Custom frequency</label>
                  <input
                    type="text"
                    value={medicationForm.frequencyOther}
                    onChange={(e) => setMedicationForm((p) => ({ ...p, frequencyOther: e.target.value }))}
                    placeholder="e.g. Every 4 hours"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Instructions (optional)</label>
                <input
                  type="text"
                  value={medicationForm.instructions}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, instructions: e.target.value }))}
                  placeholder="e.g. Take with food"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Refills</label>
                <input
                  type="number"
                  min={0}
                  value={medicationForm.refills ?? 0}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, refills: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  title="0 = one-time fill, 1+ = patient can get refills"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Valid for (days)</label>
                <input
                  type="number"
                  min={1}
                  value={medicationForm.expiresIn ?? 90}
                  onChange={(e) => setMedicationForm((p) => ({ ...p, expiresIn: parseInt(e.target.value) || 90 }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  title="How long the prescription is valid"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowMedicationForm(false); setMedicationForm({ medication: "", dosageAmount: "", dosageUnit: "mg", dosageOther: "", frequency: "TWICE_DAILY", frequencyOther: "", instructions: "", refills: 0, expiresIn: 90 }); }}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !medicationForm.medication?.trim() ||
                  !medicationForm.dosageAmount?.trim() ||
                  (medicationForm.frequency === "OTHER" && !medicationForm.frequencyOther?.trim())
                }
                className="px-4 py-2.5 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-60"
              >
                Add medication
              </button>
            </div>
          </form>
          )}
        </div>
      )}
    </div>
  );
}

export default CreatePrescription;
