import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import Sidebar from "./components/Sidebar";
import type { Post } from "./types";

type AuthView    = "login" | "signup";
type DashView    = "posts" | "new-post" | "edit-post";

function AppInner() {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView]     = useState<AuthView>("login");
  const [dashView, setDashView]     = useState<DashView>("posts");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // ── Not logged in ──────────────────────────────────
  if (!isAuthenticated) {
    return authView === "login"
      ? <LoginPage  onGoSignup={() => setAuthView("signup")} />
      : <SignupPage onGoLogin={()  => setAuthView("login")}  />;
  }

  // ── Logged in ──────────────────────────────────────
  function handleEditPost(post: Post) {
    setEditingPost(post);
    setDashView("edit-post");
  }

  function handleNavigate(view: DashView) {
    if (view !== "edit-post") setEditingPost(null);
    setDashView(view);
  }

  function handleSaved() {
    setEditingPost(null);
    setDashView("posts");
  }

  return (
    <div className="min-h-screen bg-ink text-parchment font-body flex">

      <Sidebar currentView={dashView} onNavigate={handleNavigate} />

      {/* Top bar */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-[60px] border-b border-border px-8 flex items-center flex-shrink-0">
          <p className="font-display text-sm font-semibold text-parchment">
            {dashView === "posts"     && "Dashboard"}
            {dashView === "new-post"  && "New Post"}
            {dashView === "edit-post" && "Edit Post"}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto">
          {dashView === "posts" && (
            <Dashboard
              onNewPost={() => handleNavigate("new-post")}
              onEditPost={handleEditPost}
            />
          )}
          {dashView === "new-post" && (
            <PostEditor
              post={null}
              onBack={() => handleNavigate("posts")}
              onSaved={handleSaved}
            />
          )}
          {dashView === "edit-post" && (
            <PostEditor
              post={editingPost}
              onBack={() => handleNavigate("posts")}
              onSaved={handleSaved}
            />
          )}
        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
