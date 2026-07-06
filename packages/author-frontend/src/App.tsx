import { useState } from "react";
import Sidebar from "./components/Sidebar";
import type { Post } from "./types";
import { Outlet } from "react-router";

type DashView = "posts" | "new-post" | "edit-post";

export default function App() {
  const [dashView, setDashView] = useState<DashView>("posts");

  function handleSaved() {
    setDashView("posts");
  }

  return (
    <div className="min-h-screen bg-ink text-parchment font-body flex">
      <Sidebar />

      {/* Top bar */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-[60px] border-b border-border px-8 flex items-center flex-shrink-0">
          <p className="font-display text-sm font-semibold text-parchment">
            {dashView === "posts" && "Dashboard"}
            {dashView === "new-post" && "New Post"}
            {dashView === "edit-post" && "Edit Post"}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet
            context={{
              onSaved: handleSaved
            }}
          />
        </main>
      </div>
    </div>
  );
}
