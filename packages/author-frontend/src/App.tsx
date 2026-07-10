import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router";
import { Menu } from "lucide-react";

function topBarTitle(pathname: string): string {
  return pathname === "/"
    ? "Dashboard"
    : pathname === "/new/"
      ? "New Post"
      : pathname.includes("/edit")
        ? "Edit Post"
        : "Dashboard";
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function handleChange(e: MediaQueryListEvent) {
      if (!e.matches) {
        // Crossed below lg → close sidebar
        setSidebarOpen(false);
      }
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-dvh bg-ink text-parchment font-body flex w-[min(1200px,100%)] mx-auto relative">
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──
            Desktop: sticky in normal flow
            Mobile: fixed, slides in/out via translate  */}
      <div
        className={`
          fixed z-30 top-0 left-0 h-dvh
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-dvh min-w-0">
        {/* Top bar */}
        <header className="h-[60px] border-b border-border px-4 md:px-8 flex items-center gap-4 flex-shrink-0 sticky top-0 z-10 bg-ink">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-1 text-slate hover:text-parchment transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu />
          </button>

          <p className="font-display text-sm font-semibold text-parchment">
            {topBarTitle(location.pathname)}
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet context={{}} />
        </main>
      </div>
    </div>
  );
}
