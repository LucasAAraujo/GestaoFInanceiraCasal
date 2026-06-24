import { useState, useEffect } from "react";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card.tsx";
import { getMyTenant, type Tenant } from "#features/tenant/services/tenantService.ts";
import { InviteMemberForm } from "#features/tenant/components/InviteMemberForm.tsx";
import { api } from "#shared/lib/api.ts";
import { AxiosError } from "axios";

export function WorkspacePage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTenant()
      .then((t) => {
        setTenant(t);
        setName(t.name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      const response = await api.patch<Tenant>("/tenants/me", { name });
      setTenant(response.data);
      setMsg("Workspace atualizado");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao atualizar workspace");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Configurações do Workspace</h1>

      <Card>
        <CardHeader>
          <CardTitle>Nome do Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            {msg && <p className="text-sm text-green-600">{msg}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="ws-name">Nome</Label>
              <Input
                id="ws-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tenant?.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: m.color ?? "#6B7280" }}
              >
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{m.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {m.user.email} · {m.role}
                </p>
              </div>
            </div>
          ))}

          {(tenant?.members.length ?? 0) < 2 && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Convide seu parceiro(a)
              </p>
              <InviteMemberForm />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
