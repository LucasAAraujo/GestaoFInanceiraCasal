import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card.tsx";
import { loginSchema, type LoginFormData } from "../schemas/login.schema.ts";
import { login } from "../services/authService.ts";
import { useAuthStore } from "#shared/stores/authStore.ts";
import { AxiosError } from "axios";

export function LoginForm() {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    try {
      const response = await login(data);
      storeLogin(response.user, response.accessToken, response.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Entrar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Não tem conta?{" "}
            <a href="/register" className="text-primary underline">
              Criar conta
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
