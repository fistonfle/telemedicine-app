import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useToast } from "../components/ui/Toast";
import * as authService from "../api/authService";

const schema = Yup.object({
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export default function ResetPassword() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token.trim()) {
      toast.error("Invalid reset link. Please use the link from your email.");
    }
  }, [token]);

  const handleSubmit = async (values: { newPassword: string }) => {
    if (!token.trim()) return;
    try {
      await authService.resetPassword(token, values.newPassword);
      setSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password.");
    }
  };

  if (!token.trim()) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 font-display">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Request a new link
          </Link>
          {" · "}
          <Link to="/" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 font-display">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-icons-round text-white text-2xl">add</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white uppercase">
          Tele<span className="text-primary">med</span>
        </span>
      </div>

      <main className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Set new password</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Enter your new password below. Use at least 8 characters.
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="py-3 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm">
                Your password has been reset. You can now sign in.
              </div>
              <Link
                to="/"
                className="block w-full py-3 text-center bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ newPassword: "", confirmPassword: "" }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New password</label>
                    <Field
                      name="newPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${
                        touched.newPassword && errors.newPassword ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {touched.newPassword && errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${
                        touched.confirmPassword && errors.confirmPassword ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="text-primary font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
