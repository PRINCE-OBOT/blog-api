import { useAuth } from "../context/AuthContext";
import { Logo } from "./Logo";

type View = "posts" | "new-post" | "edit-post";

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

interface NavItemProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-2.5 px-3 py-2 text-left
          font-display text-sm font-medium transition-colors duration-150
          ${active
            ? "text-parchment bg-card border-l-2 border-brand"
            : "text-slate hover:text-parchment hover:bg-card"
          }
        `}
      >
        <span aria-hidden="true">{icon}</span>
        {label}
      </button>
    </li>
  );
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "A";

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Author";

  return (
    <aside className="w-[220px] flex-shrink-0 border-r border-border flex flex-col sticky top-0 h-screen">

      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-border flex-shrink-0">
        <Logo/>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-4 mb-2 font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-slate">
          Content
        </p>
        <ul className="flex flex-col px-2 gap-0.5 mb-6">
          <NavItem
            label="All Posts"
            icon="📄"
            active={currentView === "posts"}
            onClick={() => onNavigate("posts")}
          />
          <NavItem
            label="New Post"
            icon="✏️"
            active={currentView === "new-post"}
            onClick={() => onNavigate("new-post")}
          />
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-border p-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-brand flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-xs text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-xs text-parchment truncate">{fullName}</p>
          <p className="font-display text-[10px] text-slate">Author</p>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
          className="text-slate hover:text-danger transition-colors duration-150 text-sm flex-shrink-0"
        >
          ⏻
        </button>
      </div>

    </aside>
  );
}
