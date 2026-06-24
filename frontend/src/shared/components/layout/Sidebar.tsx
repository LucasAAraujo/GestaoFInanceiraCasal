import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "#components/ui/button.tsx";
import { useAuthStore } from "#shared/stores/authStore.ts";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/transactions", label: "Extrato" },
  { path: "/recurring", label: "Recorrências" },
  { path: "/accounts", label: "Contas" },
  { path: "/categories", label: "Categorias" },
];

const SETTINGS_ITEMS = [
  { path: "/settings/profile", label: "Perfil" },
  { path: "/settings/workspace", label: "Workspace" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  const content = (
    <>
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-sidebar-primary-foreground">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-sidebar-foreground tracking-tight">Finanças</h2>
            <p className="text-xs text-sidebar-foreground/50">Gestão do Casal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <p className="px-3 pb-2 text-[11px] text-sidebar-foreground/40 uppercase tracking-widest font-semibold">
            Configurações
          </p>
          {SETTINGS_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-lg bg-sidebar-accent/50">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold shadow-sm">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-sidebar-border text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Menu</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border flex flex-col transform transition-transform lg:transform-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {content}
      </aside>
    </>
  );
}
