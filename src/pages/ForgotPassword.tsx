import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useToast } from "../components/ui/Toast";
import * as authService from "../api/authService";

const schema = Yup.object({
  email: Yup.string().trim().required("Email is required").email("Enter a valid email address"),
});

export default function ForgotPassword() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    try {
      await authService.forgotPassword(values.email.trim());
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Forgot password</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Enter your email and we will send you a link to reset your password.
          </p>

          {submitted ? (
            <div className="space-y-4">
              <div className="py-3 px-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm">
                If an account exists for this email, you will receive a password reset link shortly. Check your inbox and spam folder.
              </div>
              <Link
                to="/"
                className="block w-full py-3 text-center bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none ${
                        touched.email && errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
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
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Remember your password?{" "}
            <Link to="/" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
