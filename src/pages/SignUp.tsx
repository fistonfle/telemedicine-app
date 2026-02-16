import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signup } from "../api/services";
import { useToast } from "../components/ui/Toast";

const passwordRule = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/\d/, "Password must contain at least one number");

const signUpSchema = Yup.object({
  name: Yup.string().trim().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  email: Yup.string().trim().required("Email is required").email("Enter a valid email address"),
  password: passwordRule,
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  role: Yup.string().oneOf(["patient", "doctor"]),
  specialty: Yup.string(),
  license_number: Yup.string(),
  practice_description: Yup.string(),
});

type SignUpValues = Yup.InferType<typeof signUpSchema>;

function SignUp() {
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");

  const initialValues: SignUpValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    specialty: "",
    license_number: "",
    practice_description: "",
  };

  const validate = (values: SignUpValues) => {
    const errs: Record<string, string> = {};
    if (role === "doctor") {
      if (!values.specialty?.trim()) errs.specialty = "Medical specialty is required";
      if (!values.license_number?.trim()) errs.license_number = "License number is required";
    }
    return errs;
  };

  const handleSubmit = async (values: SignUpValues) => {
    setError("");
    setLoading(true);
    try {
      const name = (values.name || "").trim().split(/\s+/);
      const firstName = name[0] || "";
      const lastName = name.slice(1).join(" ").trim() || firstName;
      const data = {
        email: (values.email || "").trim(),
        password: values.password,
        firstName,
        lastName,
        role: role as "patient" | "doctor",
        ...(role === "doctor" && {
          specialty: values.specialty || null,
          licenseNumber: values.license_number || null,
          practiceDescription: values.practice_description || null,
        }),
      };
      await signup(data);
      toast.success("Account created! Check your email for the verification link.");
      navigate("/account-created", { replace: true, state: { email: data.email } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (touched: boolean, err: string | undefined) =>
    `block w-full pl-10 pr-3 py-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
      touched && err ? "border-red-500" : "border-slate-200 dark:border-slate-700"
    }`;

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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Your Account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join our healthcare network and start your journey today.</p>
          </div>

          <Formik initialValues={initialValues} validationSchema={signUpSchema} validate={validate} onSubmit={handleSubmit} enableReinitialize>
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Join as a...</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 role-selector">
                    <label className="cursor-pointer">
                      <input type="radio" name="role" checked={role === "patient"} onChange={() => { setRole("patient"); setFieldValue("role", "patient"); }} className="sr-only" />
                      <div className="role-card h-full p-5 border-2 border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-200 hover:border-primary/50">
                        <div className="flex items-start gap-4">
                          <div className="icon-box w-12 h-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-icons-round">favorite</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">I am a Patient</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Book appointments and consult with doctors online.</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="role" checked={role === "doctor"} onChange={() => { setRole("doctor"); setFieldValue("role", "doctor"); }} className="sr-only" />
                      <div className="role-card h-full p-5 border-2 border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-200 hover:border-primary/50">
                        <div className="flex items-start gap-4">
                          <div className="icon-box w-12 h-12 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                            <span className="material-icons-round">medical_services</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">I am a Doctor</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Manage your clinic and see patients virtually.</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="name">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-icons-round text-lg">person_outline</span>
                      </span>
                      <Field name="name" placeholder="Enter your full name" className={inputClass(!!touched.name, errors.name)} />
                    </div>
                    {touched.name && errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-icons-round text-lg">mail_outline</span>
                      </span>
                      <Field name="email" type="email" placeholder="niyonzima@gmail.com" className={inputClass(!!touched.email, errors.email)} />
                    </div>
                    {touched.email && errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-icons-round text-lg">lock_open</span>
                      </span>
                      <Field name="password" type="password" placeholder="Min 8 chars, 1 upper, 1 lower, 1 number" className={inputClass(!!touched.password, errors.password)} />
                    </div>
                    {touched.password && errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <span className="material-icons-round text-lg">lock</span>
                      </span>
                      <Field name="confirmPassword" type="password" placeholder="••••••••" className={inputClass(!!touched.confirmPassword, errors.confirmPassword)} />
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {role === "doctor" && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Medical Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="specialty">Medical Specialty</label>
                        <Field as="select" name="specialty" className={`w-full appearance-none rounded-lg border bg-slate-50 dark:bg-slate-800/50 p-3 pr-10 focus:ring-2 focus:ring-primary focus:border-transparent ${touched.specialty && errors.specialty ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`}>
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
                        {touched.specialty && errors.specialty && <p className="text-sm text-red-600 dark:text-red-400">{errors.specialty}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="license_number">License Number</label>
                        <Field name="license_number" placeholder="e.g. RMDC-12345" className={`block w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent ${touched.license_number && errors.license_number ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`} />
                        {touched.license_number && errors.license_number && <p className="text-sm text-red-600 dark:text-red-400">{errors.license_number}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="practice_description">What do you do?</label>
                        <Field as="textarea" name="practice_description" placeholder="Briefly describe your practice and services" rows={3} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary focus:border-transparent resize-none" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Field name="terms" type="checkbox" className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800" id="terms" />
                  <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="terms">
                    By creating an account, you agree to our <a className="text-primary font-medium hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.
                  </label>
                </div>

                <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 transform active:scale-[0.98] disabled:opacity-60" type="submit">
                  {loading ? "Creating account..." : role === "doctor" ? "Register as Doctor" : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Already have an account? <Link className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors" to="/">Login</Link>
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
