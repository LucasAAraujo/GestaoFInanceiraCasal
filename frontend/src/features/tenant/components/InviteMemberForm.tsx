import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import { inviteMember } from "../services/tenantService.ts";
import { AxiosError } from "axios";

export function InviteMemberForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await inviteMember(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao enviar convite. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <p className="text-center text-green-600">
        Convite enviado para {email}!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
      <div className="space-y-2">
        <Label htmlFor="invite-email">E-mail do parceiro(a)</Label>
        <Input
          id="invite-email"
          type="email"
          placeholder="parceiro@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar Convite"}
      </Button>
    </form>
  );
}
