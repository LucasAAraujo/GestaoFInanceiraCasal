import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card.tsx";
import { useAuthStore } from "#shared/stores/authStore.ts";
import { updateProfile, changePassword } from "../services/profileService.ts";
import { AxiosError } from "axios";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const [name, setName] = useState(user?.name ?? "");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [savingPwd, setSavingPwd] = useState(false);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setProfileError(null);
    try {
      const updated = await updateProfile({ name });
      if (token && refreshToken) {
        login(updated, token, refreshToken);
      }
      setProfileMsg("Perfil atualizado com sucesso");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setProfileError(err.response.data.message);
      } else {
        setProfileError("Erro ao atualizar perfil");
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);
    setPwdError(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setPwdMsg("Senha alterada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setPwdError(err.response.data.message);
      } else {
        setPwdError("Erro ao alterar senha");
      }
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
            {profileError && <p className="text-sm text-destructive">{profileError}</p>}
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">E-mail</Label>
              <Input id="profile-email" value={user?.email ?? ""} disabled />
            </div>
            <Button type="submit" disabled={savingProfile}>
              {savingProfile ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {pwdMsg && <p className="text-sm text-green-600">{pwdMsg}</p>}
            {pwdError && <p className="text-sm text-destructive">{pwdError}</p>}
            <div className="space-y-2">
              <Label htmlFor="current-pwd">Senha Atual</Label>
              <Input
                id="current-pwd"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pwd">Nova Senha</Label>
              <Input
                id="new-pwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={savingPwd}>
              {savingPwd ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
