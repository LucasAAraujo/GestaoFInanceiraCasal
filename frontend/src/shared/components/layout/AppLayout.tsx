import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";

export function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-background min-w-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
