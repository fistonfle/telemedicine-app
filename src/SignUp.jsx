import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = e.target.role?.value;
    if (role === "doctor") {
      navigate("/register/doctor");
    } else {
      // Patient flow - add your API/backend logic here
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 font-display">
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-icons-round text-white text-2xl">add</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white uppercase">
          Tele<span className="text-primary">med</span>
        </span>
      </div>

      {/* Sign Up Card */}
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

          <form action="#" className="space-y-8" method="POST" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Join as a...
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 role-selector">
                {/* Patient Option */}
                <label className="cursor-pointer">
                  <input defaultChecked name="role" type="radio" value="patient" />
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

                {/* Doctor Option */}
                <label className="cursor-pointer">
                  <input name="role" type="radio" value="doctor" />
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

            {/* Input Fields */}
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
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
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

            {/* Terms and Privacy */}
            <div className="flex items-start gap-3">
              <input
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                id="terms"
                type="checkbox"
              />
              <label className="text-xs text-slate-500 dark:text-slate-400" htmlFor="terms">
                By creating an account, you agree to our{" "}
                <a className="text-primary font-medium hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-primary font-medium hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 transform active:scale-[0.98]"
              type="submit"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors" to="/patient">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Decorative */}
      <div className="mt-12 text-slate-400 flex items-center gap-4 opacity-50">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            alt="Healthcare professional"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&rounded"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            alt="Medical equipment"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=64&h=64&fit=crop&rounded"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img
            alt="Stethoscope"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=64&h=64&fit=crop&rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
