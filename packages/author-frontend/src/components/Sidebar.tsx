import { LogOut, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";
import { NavLink } from "react-router";

interface SidebarProps {
  onClose: () => void;
}

function Link({
  path, text, onClose,
}: {
  path: string;
  text: string;
  onClose: () => void;
}) {
  return (
    <NavLink
      to={path}
      onClick={onClose} // close drawer on mobile when a link is tapped
      className={({ isActive }) =>
        `w-full flex items-center gap-2.5 px-3 py-2 text-left
        font-display text-sm font-medium transition-colors duration-150 ` +
        (isActive
          ? "text-parchment bg-card border-l-2 border-brand"
          : "text-slate hover:text-parchment hover:bg-card")
      }
    >
      {text}
    </NavLink>
  );
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "A";

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Author";

  return (
    <aside className="w-[220px] bg-ink flex-shrink-0 border-r border-border flex flex-col h-dvh">

      {/* Logo row */}
      <div className="px-5 h-[60px] flex items-center justify-between border-b border-border flex-shrink-0">
        <Logo />

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden text-slate hover:text-parchment transition-colors p-1 -mr-1"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-4 mb-2 font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-slate">
          Content
        </p>
        <ul className="flex flex-col px-2 gap-0.5 mb-6">
          <Link path="/"    text="All Posts" onClose={onClose} />
          <Link path="new/" text="New Post"  onClose={onClose} />
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
          className="text-slate hover:text-danger transition-colors duration-150 flex-shrink-0"
        >
          <LogOut size={16} />
        </button>
      </div>

    </aside>
  );
}
