import { api } from "#shared/lib/api.ts";

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  members: TenantMember[];
}

export interface TenantMember {
  id: string;
  userId: string;
  role: string;
  color: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function createTenant(name: string) {
  const response = await api.post<Tenant>("/tenants", { name });
  return response.data;
}

export async function getMyTenant() {
  const response = await api.get<Tenant>("/tenants/me");
  return response.data;
}

export async function inviteMember(email: string) {
  const response = await api.post("/tenants/invite", { email });
  return response.data;
}

export async function acceptInvite(token: string) {
  const response = await api.post<Tenant>("/tenants/accept-invite", { token });
  return response.data;
}
