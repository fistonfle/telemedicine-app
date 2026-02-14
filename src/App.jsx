import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { telemedScreenCount, telemedScreens } from "./telemedScreens";

function ScreenDirectoryPage() {
  const categories = [...new Set(telemedScreens.map((screen) => screen.category))];

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <section className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Telemed UI Pages
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            Screen Index ({telemedScreenCount} pages)
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Each screen is now a dedicated route/page. Open one using the links below.
          </p>
        </header>

        {categories.map((category) => {
          const screens = telemedScreens.filter((screen) => screen.category === category);

          return (
            <section key={category} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {category}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {screens.map((screen) => (
                  <Link
                    key={screen.id}
                    to={`/${screen.id}`}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    {screen.title}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}

function ScreenPage() {
  const { screenId } = useParams();
  const currentIndex = telemedScreens.findIndex((screen) => screen.id === screenId);

  if (currentIndex < 0) {
    return <Navigate to="/" replace />;
  }

  const screen = telemedScreens[currentIndex];
  const ScreenComponent = screen.component;
  const previousScreen = telemedScreens[currentIndex - 1];
  const nextScreen = telemedScreens[currentIndex + 1];

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto max-w-[1600px] space-y-3">
        <header className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {screen.category}
            </p>
            <h1 className="text-xl font-semibold text-slate-800">{screen.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link to="/" className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-600">
              All pages
            </Link>
            {previousScreen ? (
              <Link
                to={`/${previousScreen.id}`}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-600"
              >
                Previous
              </Link>
            ) : null}
            {nextScreen ? (
              <Link
                to={`/${nextScreen.id}`}
                className="rounded-md bg-sky-500 px-3 py-1.5 text-white"
              >
                Next
              </Link>
            ) : null}
          </div>
        </header>
        <ScreenComponent />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScreenDirectoryPage />} />
        <Route path="/:screenId" element={<ScreenPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
