import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/services";
import { useToast } from "../components/ui/Toast";

function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget as HTMLFormElement & { [k: string]: { value?: string } | undefined };
    const selectedRole = form.role?.value || role;
    setLoading(true);
    try {
      const name = (form.name?.value || "").trim().split(/\s+/);
      const firstName = name[0] || "";
      const lastName = name.slice(1).join(" ").trim() || firstName;
      const data = {
        email: form.email?.value?.trim(),
        password: form.password?.value,
        firstName,
        lastName,
        role: selectedRole === "doctor" ? "doctor" : "patient",
        ...(selectedRole === "doctor" && {
          specialty: form.specialty?.value || null,
          licenseNumber: form.license_number?.value || null,
          practiceDescription: form.practice_description?.value || null,
        }),
      };
      await signup(data);
      toast.success("Account created! Please sign in.");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 font-display">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-icons-round text-white text-2xl">add</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white uppercase">
          Tele<span className="text-primary">med</span>
        </span>
      </div>

      <main className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Join our healthcare network and start your journey today.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Join as a...
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 role-selector">
                <label className="cursor-pointer">
                  <input defaultChecked name="role" type="radio" value="patient" onChange={() => setRole("patient")} />
                  <div className="role-card h-full p-5 border-2 border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-200 hover:border-primary/50">
                    <div className="flex items-start gap-4">
                      <div className="icon-box w-12 h-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-icons-round">favorite</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          I am a Patient
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Book appointments and consult with doctors online.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input name="role" type="radio" value="doctor" onChange={() => setRole("doctor")} />
                  <div className="role-card h-full p-5 border-2 border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-200 hover:border-primary/50">
                    <div className="flex items-start gap-4">
                      <div className="icon-box w-12 h-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                        <span className="material-icons-round">medical_services</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          I am a Doctor
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          Manage your clinic and see patients virtually.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-icons-round text-lg">person_outline</span>
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-icons-round text-lg">mail_outline</span>
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-icons-round text-lg">lock_open</span>
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  htmlFor="confirm-password"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <span className="material-icons-round text-lg">lock</span>
                  </span>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
            </div>

            {role === "doctor" && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Medical Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="specialty">
                      Medical Specialty
                    </label>
                    <select
                      className="w-full appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
                      id="specialty"
                      name="specialty"
                      required
                    >
                      <option value="">Select Specialty</option>
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
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="license_number">
                      License Number
                    </label>
                    <input
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                      id="license_number"
                      name="license_number"
                      placeholder="e.g. RMDC-12345"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="practice_description">
                      What do you do?
                    </label>
                    <textarea
                      className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      id="practice_description"
                      name="practice_description"
                      placeholder="Briefly describe your practice and services"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <input
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                id="terms"
                type="checkbox"
              />
              <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="terms">
                By creating an account, you agree to our{" "}
                <a className="text-primary font-medium hover:underline" href="#">Terms of Service</a>{" "}
                and{" "}
                <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 transform active:scale-[0.98] disabled:opacity-60"
              type="submit"
            >
              {loading ? "Creating account..." : role === "doctor" ? "Register as Doctor" : "Create Account"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors" to="/">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <div className="mt-12 text-slate-400 flex items-center gap-4 opacity-50">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img alt="Healthcare professional" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&rounded" />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img alt="Medical equipment" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=64&h=64&fit=crop&rounded" />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img alt="Stethoscope" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=64&h=64&fit=crop&rounded" />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
