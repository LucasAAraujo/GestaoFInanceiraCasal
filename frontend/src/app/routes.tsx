import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "#shared/components/layout/AuthLayout.tsx";
import { AppLayout } from "#shared/components/layout/AppLayout.tsx";
import { AuthGuard } from "#shared/components/guards/AuthGuard.tsx";
import { LoginPage } from "#features/auth/pages/LoginPage.tsx";
import { RegisterPage } from "#features/auth/pages/RegisterPage.tsx";

function DashboardPage() {
  return <h1>Dashboard</h1>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
