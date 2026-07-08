import { NavLink } from "react-router";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#F0EEE8 1px, transparent 1px), linear-gradient(90deg, #F0EEE8 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
        aria-hidden="true"
      />

      {/* Top nav strip */}
      <div className="absolute top-0 left-0 right-0 h-[60px] border-b border-border flex items-center px-8 justify-between">
        <NavLink
          to="/"
          className="font-display font-bold text-base tracking-[-0.02em] text-parchment hover:opacity-75 transition-opacity"
        >
          BLOG<span className="text-brand">-</span>API
        </NavLink>
        <span className="font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-slate">
          Error
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full">
        {/* Terminal error block */}
        <div className="w-full border border-border bg-card mb-10">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-[#0d0d0d]">
            <span className="w-3 h-3 rounded-full bg-danger/60" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
            <span className="w-3 h-3 rounded-full bg-success/60" />
            <span className="ml-3 font-mono text-[11px] text-slate tracking-wide">
              devlog — bash
            </span>
          </div>

          {/* Terminal body */}
          <div className="px-5 py-5 font-mono text-sm text-left leading-relaxed">
            <p className="text-slate text-[12px] mb-3">
              <span className="text-brand">→</span> GET
              /this-page-does-not-exist
            </p>
            <p>
              <span className="text-danger font-bold">Error</span>
              <span className="text-slate">: </span>
              <span className="text-muted">Route not found</span>
            </p>
            <p className="text-slate text-[12px] mt-1">
              &nbsp;&nbsp;at Router.resolve {"(router.js:204)"}
            </p>
            <p className="text-slate text-[12px]">
              &nbsp;&nbsp;at expressMiddleware {"(app.js:31)"}
            </p>
            <p className="mt-3">
              <span className="text-brand">status</span>
              <span className="text-slate">: </span>
              <span className="text-[#F59E0B] font-bold">404</span>
            </p>
            <p className="mt-4 text-slate text-[12px]">
              <span className="text-brand">$</span>{" "}
              <span className="text-muted">{blink ? "▋" : " "}</span>
            </p>
          </div>
        </div>

        {/* 404 headline */}
        <div className="mb-3 flex items-baseline gap-4">
          <span
            className="font-display font-bold text-[clamp(5rem,18vw,9rem)] leading-none tracking-[-0.05em] text-parchment/10 select-none"
            aria-hidden="true"
          >
            404
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl tracking-tight text-parchment mb-3 -mt-6">
          Page not found
        </h1>

        <p className="text-slate text-sm leading-relaxed max-w-sm mb-8 font-body">
          The route you requested doesn't exist. It may have been moved,
          deleted, or you might have mistyped the URL.
        </p>

        {/* Actions */}
        <NavLink
          to="/"
          className="
            font-display font-bold text-[11px] tracking-[0.08em] uppercase
            px-5 py-2.5 bg-brand text-white
            hover:opacity-85 transition-opacity duration-150
            "
        >
          ← Back to posts
        </NavLink>
      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 h-[50px] border-t border-border flex items-center px-8">
        <span className="font-display text-[10px] font-semibold tracking-[0.12em] uppercase text-slate/40">
          BLOG-API — HTTP 404
        </span>
      </div>
    </div>
  );
}
