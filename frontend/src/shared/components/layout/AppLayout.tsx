import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.tsx";

export function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-background lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
}
