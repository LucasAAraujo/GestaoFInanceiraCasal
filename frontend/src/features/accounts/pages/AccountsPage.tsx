import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { useAccounts } from "../hooks/useAccounts.ts";
import { AccountList } from "../components/AccountList.tsx";
import { AccountForm } from "../components/AccountForm.tsx";
import type { Account } from "../services/accountService.ts";

export function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  function handleEdit(account: Account) {
    setEditingAccount(account);
    setFormOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingAccount(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contas</h1>
        <Button onClick={() => setFormOpen(true)}>Nova Conta</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <AccountList accounts={accounts ?? []} onEdit={handleEdit} />
      )}

      <AccountForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        account={editingAccount}
      />
    </div>
  );
}
