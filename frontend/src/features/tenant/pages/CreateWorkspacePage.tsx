import { useState } from "react";
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
import { createTenant } from "../services/tenantService.ts";
import { useAuthStore } from "#shared/stores/authStore.ts";
import { InviteMemberForm } from "../components/InviteMemberForm.tsx";
import { AxiosError } from "axios";

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const setTenantId = useAuthStore((s) => s.setTenantId);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tenant = await createTenant(name);
      setTenantId(tenant.id);
      setCreated(true);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao criar workspace. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {created ? "Convidar Parceiro(a)" : "Criar Workspace"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {created ? (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground text-center">
                Workspace criado! Convide seu parceiro(a) para compartilhar as
                finanças.
              </p>
              <InviteMemberForm />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Pular por agora
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Nome do Workspace</Label>
                <Input
                  id="workspace-name"
                  placeholder="Ex: Finanças do Casal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando..." : "Criar Workspace"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
