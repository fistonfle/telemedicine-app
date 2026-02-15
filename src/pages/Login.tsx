import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, verifyLoginOtp, clearError } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { useToast } from "../components/ui/Toast";
import * as authService from "../api/authService";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [resendOtpLoading, setResendOtpLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email: email.trim(), password }));
    if (loginUser.fulfilled.match(result)) {
      const payload = result.payload as { requiresOtp?: boolean; email?: string } | { id: string; role?: string };
      if (payload && "requiresOtp" in payload && payload.requiresOtp && payload.email) {
        setOtpEmail(payload.email);
        return;
      }
      toast.success("Signed in successfully!");
      const me = payload as { role?: string };
      if (me?.role === "DOCTOR") navigate("/doctor", { replace: true });
      else navigate("/patient", { replace: true });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail || !code.trim()) return;
    const result = await dispatch(verifyLoginOtp({ email: otpEmail, code: code.trim() }));
    if (verifyLoginOtp.fulfilled.match(result)) {
      toast.success("Signed in successfully!");
      const me = result.payload as { role?: string };
      if (me?.role === "DOCTOR") navigate("/doctor", { replace: true });
      else navigate("/patient", { replace: true });
    }
  };

  const handleResendOtp = async () => {
    if (!otpEmail || resendOtpLoading) return;
    setResendOtpLoading(true);
    try {
      await authService.resendLoginOtp(otpEmail);
      toast.success("A new sign-in code has been sent to your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setResendOtpLoading(false);
    }
  };

  const displayError = error || "";

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Sign in</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {otpEmail ? "Enter the code we sent to your email." : "Use your account to continue."}
          </p>

          {otpEmail ? (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              {displayError && (
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
                  <span className="material-icons text-red-600 dark:text-red-400 text-base shrink-0">error_outline</span>
                  <p className="flex-1 text-red-700 dark:text-red-300">{displayError}</p>
                  <button type="button" onClick={() => dispatch(clearError())} className="shrink-0 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400" aria-label="Dismiss">
                    <span className="material-icons text-base">close</span>
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400">{otpEmail}</p>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sign-in code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-center tracking-widest text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify and sign in"
                )}
              </button>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Didn&apos;t get the code?{" "}
                <button type="button" onClick={handleResendOtp} disabled={resendOtpLoading} className="text-primary font-medium hover:underline disabled:opacity-50">
                  {resendOtpLoading ? "Sending…" : "Resend code"}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {displayError && (
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
                  <span className="material-icons text-red-600 dark:text-red-400 text-base shrink-0">error_outline</span>
                  <p className="flex-1 text-red-700 dark:text-red-300">{displayError}</p>
                  <button
                    type="button"
                    onClick={() => dispatch(clearError())}
                    className="shrink-0 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400"
                    aria-label="Dismiss"
                  >
                    <span className="material-icons text-base">close</span>
                  </button>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
