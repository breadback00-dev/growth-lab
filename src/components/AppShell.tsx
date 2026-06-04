import {
  BarChart3,
  CalendarRange,
  FlaskConical,
  Images,
  Lightbulb,
  Users
} from "lucide-react";
import type { BrandProfile, PageId } from "../types";

const navItems: Array<{
  id: PageId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}> = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "plan", label: "Plan", icon: CalendarRange },
  { id: "experiments", label: "Experiments", icon: FlaskConical },
  { id: "audiences", label: "Audiences", icon: Users },
  { id: "creative", label: "Creative", icon: Images },
  { id: "recommendations", label: "Weekly", icon: Lightbulb }
];

interface AppShellProps {
  activePage: PageId;
  brand: BrandProfile;
  children: React.ReactNode;
  onNavigate: (page: PageId) => void;
}

export default function AppShell({
  activePage,
  brand,
  children,
  onNavigate
}: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            GL
          </div>
          <div>
            <p className="eyebrow">Growth Lab</p>
            <h1>{brand.name}</h1>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className={item.id === activePage ? "nav-item active" : "nav-item"}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <p className="eyebrow">Operating constraint</p>
          <strong>One day per week</strong>
          <span>Keep every test simple enough to run, measure, and decide.</span>
        </div>
      </aside>

      <main className="main-surface">{children}</main>
    </div>
  );
}
