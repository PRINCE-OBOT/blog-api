import { useState } from "react";
import Sidebar from "./components/Sidebar";
import type { Post } from "./types";
import { Outlet } from "react-router";

type DashView = "posts" | "new-post" | "edit-post";

export default function App() {
  const [dashView, setDashView] = useState<DashView>("posts");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  function handleEditPost(post: Post) {
    setEditingPost(post);
    setDashView("edit-post");
  }

  function handleSaved() {
    setEditingPost(null);
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
              post: editingPost,
              onEditPost: handleEditPost,
              onSaved: handleSaved
            }}
          />
        </main>
      </div>
    </div>
  );
}
