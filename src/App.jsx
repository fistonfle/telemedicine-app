const features = [
  "Virtual consultation scheduling",
  "Secure doctor-patient messaging",
  "Electronic prescription tracking",
];

function App() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Vite + Tailwind Setup
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Telemedicine App Frontend Starter
        </h1>
        <p className="mt-4 text-slate-600">
          You now have a Vite-powered React app with Tailwind CSS configured and
          ready for development.
        </p>

        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
            >
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            React
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Vite
          </span>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
            Tailwind CSS
          </span>
        </div>
      </section>
    </main>
  );
}

export default App;
