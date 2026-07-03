import { NavLink, Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-screen w-[min(1200px,100%)] mx-auto bg-ink text-parchment font-body flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-ink border-b border-border h-[60px] px-8 flex items-center justify-between">
        <NavLink
          to="/"
          className="font-display font-bold text-[1.05rem] tracking-[-0.02em] text-parchment hover:opacity-80 transition-opacity"
        >
          BLOG<span className="text-brand">-</span>API
        </NavLink>

        <ul className="flex items-center gap-8 list-none">
          {[{ text: "Posts", path: "/" }].map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className="font-display text-[11px] font-medium tracking-[0.06em] uppercase text-slate hover:text-parchment transition-colors duration-150"
              >
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main className="flex-1">
        <Outlet context={{}} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex justify-between items-center">
        <span className="font-display text-xs text-slate">BLOG-API</span>
      </footer>
    </div>
  );
}
