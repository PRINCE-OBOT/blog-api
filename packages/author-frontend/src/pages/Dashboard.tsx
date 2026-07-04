import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { Spinner, StatusScreen } from "../components/ui";
import type { Post } from "../types";

interface DashboardProps {
  onNewPost: () => void;
  onEditPost: (post: Post) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function Dashboard({ onNewPost, onEditPost }: DashboardProps) {
  const { posts, loading, error, handleDelete, handleTogglePublish } = usePosts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function confirmDelete(id: string) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    try { await handleDelete(id); }
    finally { setDeletingId(null); }
  }

  async function handlePublishToggle(post: Post) {
    setTogglingId(post.id);
    try { await handleTogglePublish(post.id, !post.published); }
    finally { setTogglingId(null); }
  }

  const published = posts.filter((p) => p.published).length;
  const drafts    = posts.filter((p) => !p.published).length;

  if (loading) return <StatusScreen><Spinner /></StatusScreen>;

  if (error) {
    return (
      <StatusScreen>
        <p className="text-danger font-display text-sm">Failed to load posts: {error}</p>
      </StatusScreen>
    );
  }

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-parchment">Posts</h1>
          <p className="text-slate text-sm mt-0.5 font-display">Manage your blog content</p>
        </div>
        <button
          onClick={onNewPost}
          className="bg-brand text-white font-display font-bold text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 hover:opacity-85 transition-opacity"
        >
          + New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border border-border mb-8">
        {[
          { label: "Total",     value: posts.length,  color: "text-parchment" },
          { label: "Published", value: published,      color: "text-success"   },
          { label: "Drafts",    value: drafts,         color: "text-slate"     },
        ].map(({ label, value, color }, i) => (
          <div
            key={label}
            className={`p-5 ${i < 2 ? "border-r border-border" : ""}`}
          >
            <p className="font-display text-[10px] font-semibold tracking-[0.12em] uppercase text-slate mb-1">
              {label}
            </p>
            <p className={`font-display font-bold text-3xl tracking-tight ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="text-slate font-display text-sm mb-4">No posts yet.</p>
          <button
            onClick={onNewPost}
            className="text-brand font-display text-xs font-semibold tracking-wide uppercase hover:opacity-80 transition-opacity"
          >
            Write your first post →
          </button>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Status", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-display text-[10px] font-semibold tracking-[0.12em] uppercase text-slate"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border last:border-0 hover:bg-card transition-colors duration-100"
                >
                  {/* Title */}
                  <td className="px-4 py-4 max-w-xs">
                    <p className="font-display font-semibold text-sm text-parchment truncate">
                      {post.title}
                    </p>
                    {post.subtitle && (
                      <p className="text-slate text-xs truncate mt-0.5">{post.subtitle}</p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`
                        inline-flex items-center gap-1.5 font-display text-[10px] font-semibold
                        tracking-[0.06em] uppercase px-2 py-1 border
                        ${post.published
                          ? "text-success border-success/25 bg-success/8"
                          : "text-slate border-border bg-transparent"
                        }
                      `}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-success" : "bg-slate"}`} />
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4">
                    <span className="font-display text-xs text-slate">
                      {formatDate(post.updatedAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {/* Publish / Unpublish */}
                      <button
                        onClick={() => handlePublishToggle(post)}
                        disabled={togglingId === post.id}
                        className={`
                          font-display text-[10px] font-semibold tracking-wide uppercase
                          px-2.5 py-1 border transition-colors duration-150
                          disabled:opacity-40 disabled:cursor-not-allowed
                          ${post.published
                            ? "border-border text-slate hover:border-parchment hover:text-parchment"
                            : "border-success/40 text-success hover:bg-success/8"
                          }
                        `}
                      >
                        {togglingId === post.id
                          ? "…"
                          : post.published ? "Unpublish" : "Publish"
                        }
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditPost(post)}
                        className="font-display text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 border border-border text-slate hover:border-parchment hover:text-parchment transition-colors duration-150"
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => confirmDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="font-display text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 border border-border text-slate hover:border-danger hover:text-danger transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deletingId === post.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
