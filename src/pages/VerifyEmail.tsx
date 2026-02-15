import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmailByToken, resendVerificationLink } from "../api/authService";
import { useToast } from "../components/ui/Toast";

type Status = "verifying" | "success" | "error";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const verifyStarted = useRef(false);

  useEffect(() => {
    if (!token || token.trim() === "") {
      setStatus("error");
      setMessage("Verification link is missing or invalid.");
      return;
    }
    if (verifyStarted.current) return;
    verifyStarted.current = true;
    let cancelled = false;
    verifyEmailByToken(token)
      .then((res) => {
        if (!cancelled) {
          setStatus("success");
          setMessage(res.message || "Email verified. You can now sign in.");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          const msg = err instanceof Error ? err.message : "Verification failed.";
          setMessage(msg);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

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
          {status === "verifying" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <span className="material-icons text-4xl animate-pulse">mark_email_read</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Verifying your email
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Please wait...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <span className="material-icons text-4xl">check_circle</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Email verified
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {message}
              </p>
            </>
          )}

          {status === "error" && (() => {
            const linkInvalidOrUsed =
              /invalid|expired|already used/i.test(message);
            return (
            <>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${linkInvalidOrUsed ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
                <span className="material-icons text-4xl">{linkInvalidOrUsed ? "info" : "error_outline"}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {linkInvalidOrUsed ? "Link already used or expired" : "Verification failed"}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                {linkInvalidOrUsed ? "This verification link was already used or has expired. If you verified your email, you can sign in below." : message}
              </p>
              {!linkInvalidOrUsed && (
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">
                  If you already used this link, try signing in.
                </p>
              )}
              {(linkInvalidOrUsed || !message) && <div className="mb-6" />}
              <form
                className="flex flex-col sm:flex-row gap-2 mb-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = resendEmail.trim();
                  if (!email) {
                    toast.error("Enter your email address.");
                    return;
                  }
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
              >
                <input
                  type="email"
                  placeholder="Your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  disabled={resendLoading}
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
                >
                  {resendLoading ? "Sending…" : "Resend link"}
                </button>
              </form>
            </>
            );
          })()}
        </div>
      </main>
    </div>
  );
}

export default VerifyEmail;
