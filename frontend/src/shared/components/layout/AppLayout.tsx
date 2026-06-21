import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-border bg-sidebar p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
      </aside>
      <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
}
