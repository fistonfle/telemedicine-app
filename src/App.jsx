import { useMemo, useState } from "react";
import { telemedScreenCount, telemedScreens } from "./telemedScreens";

function App() {
  const [activeScreenId, setActiveScreenId] = useState(telemedScreens[0].id);

  const activeScreen = useMemo(
    () => telemedScreens.find((screen) => screen.id === activeScreenId) ?? telemedScreens[0],
    [activeScreenId],
  );

  const ActiveScreenComponent = activeScreen.component;

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6">
      <div className="mx-auto grid max-w-[1500px] gap-4 xl:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Telemed UI Implementation
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-800">Screen Navigator</h1>
          <p className="mt-2 text-sm text-slate-600">
            All mockups you shared are implemented below. Pick any screen to preview.
          </p>

          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">Total implemented screens</p>
            <p className="text-2xl font-semibold text-slate-800">{telemedScreenCount}</p>
          </div>

          <div className="mt-4 space-y-3">
            {["Onboarding", "Patient Journey", "Doctor Journey"].map((category) => {
              const screensInCategory = telemedScreens.filter(
                (screen) => screen.category === category,
              );

              return (
                <section key={category}>
                  <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {category}
                  </h2>
                  <div className="mt-1 space-y-1">
                    {screensInCategory.map((screen) => (
                      <button
                        key={screen.id}
                        type="button"
                        onClick={() => setActiveScreenId(screen.id)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                          activeScreenId === screen.id
                            ? "bg-sky-500 font-semibold text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {screen.title}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </aside>

        <section className="space-y-3">
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active Screen
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-800">{activeScreen.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{activeScreen.description}</p>
          </header>

          <ActiveScreenComponent />
        </section>
      </div>
    </main>
  );
}

export default App;
