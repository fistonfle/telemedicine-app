import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resendVerificationLink } from "../api/authService";
import { useToast } from "../components/ui/Toast";

function AccountCreated() {
  const toast = useToast();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email?.trim();
  const [resendLoading, setResendLoading] = useState(false);

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
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <span className="material-icons text-4xl">mark_email_unread</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Account created
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
            We&apos;ve sent a verification link to your email. Click the link to verify your account, then sign in.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
            Didn&apos;t receive the email? Check your spam folder or resend the link.
          </p>
          {email && (
            <div className="mb-6">
              <button
                type="button"
                disabled={resendLoading}
                onClick={async () => {
                  setResendLoading(true);
                  try {
                    const res = await resendVerificationLink(email);
                    toast.success(res.message || "A new verification link has been sent to your email.");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Could not resend link.");
                  } finally {
                    setResendLoading(false);
                  }
                }}
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Sending…" : "Resend verification link"}
              </button>
            </div>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AccountCreated;
