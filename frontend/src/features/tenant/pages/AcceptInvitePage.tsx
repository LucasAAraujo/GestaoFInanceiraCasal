import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "#components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#components/ui/card.tsx";
import { acceptInvite } from "../services/tenantService.ts";
import { useAuthStore } from "#shared/stores/authStore.ts";
import { AxiosError } from "axios";

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setTenantId = useAuthStore((s) => s.setTenantId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/register?invite=${token}`, { replace: true });
    }
  }, [isAuthenticated, navigate, token]);

  async function handleAccept() {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const tenant = await acceptInvite(token);
      setTenantId(tenant.id);
      setAccepted(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao aceitar convite. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Aceitar Convite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accepted ? (
            <p className="text-center text-green-600">
              Convite aceito! Redirecionando...
            </p>
          ) : (
            <>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <p className="text-sm text-muted-foreground text-center">
                Você foi convidado(a) para compartilhar um workspace financeiro.
              </p>
              <Button
                className="w-full"
                onClick={handleAccept}
                disabled={loading}
              >
                {loading ? "Aceitando..." : "Aceitar Convite"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
