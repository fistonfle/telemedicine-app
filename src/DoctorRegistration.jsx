import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "./api/services";
import { useToast } from "./components/Toast";

function DoctorRegistration() {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Top Navigation / Progress */}
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-icons">health_and_safety</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Telemed
          </span>
        </div>
        <Link
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold group"
          to="/"
        >
          <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back to Role Selection
        </Link>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900/50 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12">
          {/* Header Section */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <span className="material-icons text-3xl">medical_services</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Create your Doctor Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Join our network of elite healthcare professionals and start providing
              remote care today.
            </p>
          </header>

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setLoading(true);
            try {
              const form = e.target;
              const name = (form.full_name?.value || "").trim().split(/\s+/);
              const firstName = name[0] || "";
              const lastName = name.slice(1).join(" ").trim() || firstName;
              await signup({
                email: (form.email?.value || "").trim(),
                password: form.password?.value || "",
                firstName,
                lastName,
                role: "doctor",
                specialty: form.specialty?.value || null,
                licenseNumber: form.license_number?.value || null,
                practiceDescription: form.practice_description?.value || null,
              });
              toast.success("Doctor account created! Please sign in.");
              navigate("/login", { replace: true });
            } catch (err) {
              const msg = err.message || "Registration failed";
              setError(msg);
              toast.error(msg);
            } finally {
              setLoading(false);
            }
          }}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            {/* Section 1: Personal Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <span className="material-icons text-primary text-sm">person</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="full_name"
                  >
                    Full Name
                  </label>
                  <input
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3"
                    id="full_name"
                    name="full_name"
                    placeholder="Dr. Anne Mutoni"
                    type="text"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="email"
                  >
                    Professional Email
                  </label>
                  <input
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3"
                    id="email"
                    name="email"
                    placeholder="mutoni@chck.rw"
                    type="email"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="password"
                >
                  Secure Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3 pr-10"
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type="password"
                    required
                  />
                  <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                    visibility_off
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Must contain at least 8 characters, one uppercase, and one number.
                </p>
              </div>
            </div>

            {/* Section 2: Professional Credentials */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                <span className="material-icons text-primary text-sm">verified_user</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Medical Credentials
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="specialty"
                  >
                    Medical Specialty
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3 pr-10"
                      defaultValue=""
                      id="specialty"
                      name="specialty"
                      required
                    >
                      <option disabled value="">
                        Select Specialty
                      </option>
                      <optgroup label="Primary Care">
                        <option value="General Practice">General Practice</option>
                        <option value="Family Medicine">Family Medicine</option>
                        <option value="Internal Medicine">Internal Medicine</option>
                      </optgroup>
                      <optgroup label="Specialists">
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Psychiatry">Psychiatry</option>
                      </optgroup>
                      <optgroup label="Surgery">
                        <option value="General Surgery">General Surgery</option>
                        <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                        <option value="Cardiac Surgery">Cardiac Surgery</option>
                        <option value="Neurosurgery">Neurosurgery</option>
                        <option value="Plastic Surgery">Plastic Surgery</option>
                      </optgroup>
                    </select>
                    <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="license_number"
                  >
                    Medical License Number
                  </label>
                  <input
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3"
                    id="license_number"
                    name="license_number"
                    placeholder="e.g. RMDC-12345"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    htmlFor="practice_description"
                  >
                    What do you do?
                  </label>
                  <textarea
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3 resize-none"
                    id="practice_description"
                    name="practice_description"
                    placeholder="Briefly describe your practice, services, and areas of focus (e.g. cardiovascular care, preventive medicine, minor procedures...)"
                    rows={3}
                  />
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex gap-3">
                <span className="material-icons text-primary text-xl">info</span>
                <p className="text-xs text-primary/80 leading-relaxed italic">
                  By registering, you consent to our automated credentials verification
                  process. Your license will be verified against the Rwanda Medical and Dental Council (RMDC).
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 space-y-4">
              <button
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                type="submit"
              >
                {loading ? "Registering..." : "Register as Doctor"}
                <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    className="text-primary font-bold hover:underline decoration-2 underline-offset-4"
                    to="/doctor"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Site Footer Section */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="text-slate-400 text-sm">
          © 2024 Telemed Healthcare. All rights reserved.
        </div>
        <div className="flex gap-8">
          <a
            className="text-sm text-slate-400 hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm text-slate-400 hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-sm text-slate-400 hover:text-primary transition-colors"
            href="#"
          >
            Contact Support
          </a>
        </div>
      </footer>

      {/* Background Illustration Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}

export default DoctorRegistration;
