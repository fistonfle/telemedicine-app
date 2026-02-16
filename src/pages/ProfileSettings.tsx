import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchProfile, updateProfileThunk } from "../store/slices/authSlice";
import { useToast } from "../components/ui/Toast";

const profileSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  email: Yup.string().trim().email("Enter a valid email address"),
  phone: Yup.string().trim(),
  dateOfBirth: Yup.string().trim(),
  address: Yup.string().trim(),
  currentPassword: Yup.string(),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .optional(),
  confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords do not match").optional(),
});

type ProfileFormValues = Yup.InferType<typeof profileSchema>;

const initialValues: ProfileFormValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ProfileSettings() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { profile, loading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const inputClass = (touched: boolean, err: string | undefined) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none ${
      touched && err ? "border-red-500" : "border-slate-200"
    }`;

  if (loading && !profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const valuesFromProfile: Partial<ProfileFormValues> = profile
    ? {
        fullName: profile.names || `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      }
    : {};

  return (
    <div className="p-8">
      <Formik
        initialValues={{ ...initialValues, ...valuesFromProfile }}
        validationSchema={profileSchema}
        validate={(values) => {
          const errs: Record<string, string> = {};
          if ((values.currentPassword || "").trim()) {
            if (!(values.newPassword || "").trim()) errs.newPassword = "New password is required when changing password";
            else if (values.newPassword !== values.confirmPassword) errs.confirmPassword = "Passwords do not match";
          }
          return errs;
        }}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          const name = (values.fullName || "").trim().split(/\s+/);
          const result = await dispatch(
            updateProfileThunk({
              names: (values.fullName || "").trim(),
              firstName: name[0] || "",
              lastName: name.slice(1).join(" ") || "",
              email: (values.email || "").trim() || undefined,
              phone: (values.phone || "").trim() || undefined,
              address: (values.address || "").trim() || undefined,
            })
          );
          setSubmitting(false);
          if (updateProfileThunk.fulfilled.match(result)) {
            toast.success("Profile updated successfully");
            // TODO: if password change is implemented, call API here
          } else if (updateProfileThunk.rejected.match(result)) {
            toast.error(String(result.payload || "Failed to save"));
          }
        }}
      >
        {({ errors, touched, values, isSubmitting }) => (
          <Form className="max-w-2xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {(values.fullName || "?").split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </div>
                <span className="font-medium text-slate-900">{values.fullName || "—"}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <span className="material-icons text-4xl">person</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Upload New
                      </button>
                      <button type="button" className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <Field name="fullName" className={inputClass(!!touched.fullName, errors.fullName)} />
                      {touched.fullName && errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <Field name="email" type="email" className={inputClass(!!touched.email, errors.email)} />
                      {touched.email && errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <Field name="phone" type="tel" placeholder="+250 788 123 456" className={inputClass(!!touched.phone, errors.phone)} />
                      {touched.phone && errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                      <Field name="dateOfBirth" className={inputClass(false, undefined)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
                      <Field as="textarea" name="address" rows={2} className={inputClass(false, undefined) + " resize-none"} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Security & Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                      <Field name="currentPassword" type="password" placeholder="••••••••" className={inputClass(false, undefined)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                      <Field name="newPassword" type="password" placeholder="••••••••" className={inputClass(!!touched.newPassword, errors.newPassword)} />
                      {touched.newPassword && errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                      <p className="text-xs text-slate-500 mt-1">Min 8 chars, 1 upper, 1 lower, 1 number</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                      <Field name="confirmPassword" type="password" placeholder="Re-type new password" className={inputClass(!!touched.confirmPassword, errors.confirmPassword)} />
                      {touched.confirmPassword && errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-600">Two-factor Authentication (2FA) adds an extra layer of security.</p>
                      <button type="button" className="text-primary font-medium hover:underline text-sm">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button type="button" className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-100">
                  Discard Changes
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button type="button" className="px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600">
                Delete Account
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
        © 2024 Telemed. All rights reserved.{" "}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a> | <a href="#" className="text-primary hover:underline">Terms of Service</a>
      </footer>
    </div>
  );
}

export default ProfileSettings;
