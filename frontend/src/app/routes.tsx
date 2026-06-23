import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout } from "#shared/components/layout/AuthLayout.tsx";
import { AppLayout } from "#shared/components/layout/AppLayout.tsx";
import { AuthGuard } from "#shared/components/guards/AuthGuard.tsx";
import { LoginPage } from "#features/auth/pages/LoginPage.tsx";
import { RegisterPage } from "#features/auth/pages/RegisterPage.tsx";
import { ForgotPasswordPage } from "#features/auth/pages/ForgotPasswordPage.tsx";
import { ResetPasswordPage } from "#features/auth/pages/ResetPasswordPage.tsx";
import { CreateWorkspacePage } from "#features/tenant/pages/CreateWorkspacePage.tsx";
import { AcceptInvitePage } from "#features/tenant/pages/AcceptInvitePage.tsx";

function DashboardPage() {
  return <h1>Dashboard</h1>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path="/create-workspace" element={<CreateWorkspacePage />} />
        <Route path="/invite/:token" element={<AcceptInvitePage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
