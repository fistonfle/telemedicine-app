import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signup } from "../api/services";
import { useToast } from "../components/ui/Toast";

const STEPS = [
  { id: 1, title: "Medical details", icon: "medical_services" },
  { id: 2, title: "Account", icon: "lock" },
];

const step1Schema = Yup.object({
  full_name: Yup.string().trim().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  specialty: Yup.string().required("Medical specialty is required"),
  license_number: Yup.string().trim().required("License number is required"),
});

const step2Schema = Yup.object({
  email: Yup.string().trim().required("Email is required").email("Enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number"),
});

type FormValues = {
  full_name: string;
  specialty: string;
  license_number: string;
  practice_description: string;
  email: string;
  password: string;
};

const initialValues: FormValues = {
  full_name: "",
  specialty: "",
  license_number: "",
  practice_description: "",
  email: "",
  password: "",
};

function DoctorRegistration() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentSchema = step === 1 ? step1Schema : step2Schema;
  const inputClass = (touched: boolean, err: string | undefined) =>
    `rounded-lg border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary transition-all p-3 w-full ${
      touched && err ? "border-red-500" : "border-slate-200 dark:border-slate-700"
    }`;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-icons">health_and_safety</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Telemed</span>
        </div>
        <Link className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold group" to="/signup">
          <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Role Selection
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900/50 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <span className="material-icons text-3xl">medical_services</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create your Doctor Account</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Join our network of elite healthcare professionals and start providing remote care today.
            </p>
          </header>

          <div className="flex justify-center gap-4 mb-8">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s.id ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  <span className="material-icons text-lg">{s.icon}</span>
                </div>
                <span className={`text-sm font-medium ${step >= s.id ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{s.title}</span>
                {s.id < STEPS.length && <span className="text-slate-300 dark:text-slate-600">→</span>}
              </div>
            ))}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={currentSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={async (values) => {
              if (step === 1) {
                setStep(2);
                return;
              }
              setError("");
              setLoading(true);
              try {
                const name = (values.full_name || "").trim().split(/\s+/);
                const firstName = name[0] || "";
                const lastName = name.slice(1).join(" ").trim() || firstName;
                await signup({
                  email: (values.email || "").trim(),
                  password: values.password,
                  firstName,
                  lastName,
                  role: "doctor",
                  specialty: values.specialty || null,
                  licenseNumber: values.license_number || null,
                  practiceDescription: values.practice_description || null,
                });
                toast.success("Doctor account created! Check your email for the verification link.");
                navigate("/account-created", { replace: true, state: { email: (values.email || "").trim() } });
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "Registration failed";
                setError(msg);
                toast.error(msg);
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">{error}</div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      <span className="material-icons text-primary text-sm">medical_services</span>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Medical details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="full_name">Full Name</label>
                        <Field name="full_name" placeholder="Dr. Anne Mutoni" className={inputClass(!!touched.full_name, errors.full_name)} />
                        {touched.full_name && errors.full_name && <p className="text-sm text-red-600 dark:text-red-400">{errors.full_name}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="specialty">Medical Specialty</label>
                        <div className="relative">
                          <Field as="select" name="specialty" className={inputClass(!!touched.specialty, errors.specialty) + " pr-10 appearance-none"}>
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
                          </Field>
                          <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                        {touched.specialty && errors.specialty && <p className="text-sm text-red-600 dark:text-red-400">{errors.specialty}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="license_number">Medical License Number</label>
                        <Field name="license_number" placeholder="e.g. RMDC-12345" className={inputClass(!!touched.license_number, errors.license_number)} />
                        {touched.license_number && errors.license_number && <p className="text-sm text-red-600 dark:text-red-400">{errors.license_number}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="practice_description">What do you do?</label>
                        <Field as="textarea" name="practice_description" placeholder="Briefly describe your practice, services, and areas of focus..." rows={3} className={inputClass(false, undefined) + " resize-none"} />
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex gap-3">
                      <span className="material-icons text-primary text-xl">info</span>
                      <p className="text-xs text-primary/80 leading-relaxed italic">
                        By registering, you consent to our automated credentials verification process. Your license will be verified against the Rwanda Medical and Dental Council (RMDC).
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                      <span className="material-icons text-primary text-sm">lock</span>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Account credentials</h2>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Professional Email</label>
                      <Field name="email" type="email" placeholder="mutoni@chck.rw" className={inputClass(!!touched.email, errors.email)} />
                      {touched.email && errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Secure Password</label>
                      <div className="relative">
                        <Field name="password" type="password" placeholder="Min 8 chars, 1 upper, 1 lower, 1 number" className={inputClass(!!touched.password, errors.password) + " pr-10"} />
                        <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">visibility_off</span>
                      </div>
                      {touched.password && errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                      <p className="text-[11px] text-slate-400 mt-1">Must contain at least 8 characters, one uppercase, one lowercase, and one number.</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 space-y-4 flex gap-3">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-icons">arrow_back</span>
                      Back
                    </button>
                  )}
                  <button
                    disabled={loading}
                    className={`${step === 2 ? "flex-1" : "w-full"} bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-60`}
                    type="submit"
                  >
                    {step === 1 ? (
                      <>
                        Next
                        <span className="material-icons text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    ) : loading ? (
                      "Registering..."
                    ) : (
                      "Register as Doctor"
                    )}
                  </button>
                  <div className="text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Already have an account? <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" to="/">Log in</Link>
                    </p>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="text-slate-400 text-sm">© 2024 Telemed Healthcare. All rights reserved.</div>
        <div className="flex gap-8">
          <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Contact Support</a>
        </div>
      </footer>

      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}

export default DoctorRegistration;
