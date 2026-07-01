import { useState } from "react";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";

export default function App() {
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-ink text-parchment font-body flex flex-col">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-ink border-b border-border h-[60px] px-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentPostId(null)}
          className="font-display font-bold text-[1.05rem] tracking-[-0.02em] text-parchment hover:opacity-80 transition-opacity"
        >
          BLOG<span className="text-brand">-</span>API
        </button>

        <ul className="flex items-center gap-8 list-none">
          {["Posts"].map((link) => (
            <li key={link}>
              <a
                href="/"
                className="font-display text-[11px] font-medium tracking-[0.06em] uppercase text-slate hover:text-parchment transition-colors duration-150"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main */}
      <main className="flex-1">
        {currentPostId ? (
          <PostDetail
            postId={currentPostId}
            onBack={() => setCurrentPostId(null)}
          />
        ) : (
          <PostList onSelectPost={setCurrentPostId} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6 flex justify-between items-center">
        <span className="font-display text-xs text-slate">BLOG-API</span>
      </footer>

    </div>
  );
}
