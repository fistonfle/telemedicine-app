import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import type { Doctor, TimeSlot } from "../../types";

const confirmSchema = Yup.object({
  reasonForVisit: Yup.string().max(500, "Reason must be 500 characters or less"),
});

function formatSlotLabel(slot: TimeSlot | null): string {
  if (!slot) return "";
  if (typeof slot === "object") {
    const n = (slot.slotIndex ?? 0) + 1;
    if (slot.start && slot.end) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      const opts = { hour: "numeric", minute: "2-digit", hour12: true };
      return `Slot ${n}: ${start.toLocaleTimeString([], opts)} – ${end.toLocaleTimeString([], opts)}`;
    }
    return `Slot ${n}`;
  }
  return `Slot ${slot}`;
}

interface ConfirmBookingProps {
  doctor: Doctor;
  date: string;
  slot: TimeSlot | null;
  reasonForVisit: string;
  onReasonChange: (value: string) => void;
  onConfirm: (reason: string) => void;
  onBack: () => void;
  submitting?: boolean;
}

function ConfirmBooking({
  doctor,
  date,
  slot,
  reasonForVisit,
  onReasonChange,
  onConfirm,
  onBack,
  submitting = false,
}: ConfirmBookingProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Confirm Booking</h2>
      <p className="text-slate-500 text-sm mb-6">Review the details before confirming.</p>

      {/* Doctor Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            {doctor.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{doctor.name}</h3>
            <p className="text-slate-500 text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      {/* Date & Slot */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
        <span className="material-icons text-primary">event</span>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">Date & Slot</p>
          <p className="font-medium text-slate-900">
            {date}
            {slot != null && ` — ${formatSlotLabel(slot)}`}
          </p>
        </div>
      </div>

      <Formik
        initialValues={{ reasonForVisit }}
        validationSchema={confirmSchema}
        enableReinitialize
        onSubmit={(values) => onConfirm(values.reasonForVisit)}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Reason for Visit (Optional)
              </label>
              <Field
                as="textarea"
                name="reasonForVisit"
                placeholder="Please describe briefly any symptoms or specific health concerns"
                rows={3}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setFieldValue("reasonForVisit", e.target.value);
                  onReasonChange(e.target.value);
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none ${
                  touched.reasonForVisit && errors.reasonForVisit ? "border-red-500" : "border-slate-200"
                }`}
              />
              {touched.reasonForVisit && errors.reasonForVisit && (
                <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-6">
              <span className="material-icons text-primary shrink-0">info</span>
              <p className="text-sm text-slate-700">
                You will receive a reminder before your appointment. You can cancel or reschedule up to 24 hours in advance.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-700 text-sm font-medium">
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-icons text-lg">check_circle</span>
                )}
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ConfirmBooking;
