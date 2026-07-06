import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import { NavLink } from "react-router";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "A";

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Author";

  return (
    <aside className="w-[220px] flex-shrink-0 border-r border-border flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-border flex-shrink-0">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-4 mb-2 font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-slate">
          Content
        </p>
        <ul className="flex flex-col px-2 gap-0.5 mb-6">
          <NavLink to="/">All Posts</NavLink>
          <NavLink to="/new">New Post</NavLink>
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-border p-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-brand flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-xs text-white">
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-xs text-parchment truncate">
            {fullName}
          </p>
          <p className="font-display text-[10px] text-slate">Author</p>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
          className="text-slate hover:text-danger transition-colors duration-150 text-sm flex-shrink-0"
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
