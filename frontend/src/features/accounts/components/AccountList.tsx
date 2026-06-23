import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";
import { useDeactivateAccount } from "../hooks/useAccounts.ts";
import type { Account } from "../services/accountService.ts";

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
}

const TYPE_LABELS: Record<string, string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit_card: "Cartão de Crédito",
  wallet: "Carteira",
  investment: "Investimento",
};

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
}

export function AccountList({ accounts, onEdit }: AccountListProps) {
  const deactivateMutation = useDeactivateAccount();

  if (accounts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma conta cadastrada.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{account.name}</h3>
              <span className="text-xs text-muted-foreground">
                {TYPE_LABELS[account.type] ?? account.type}
              </span>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(account.initialBalance)}
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(account)}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deactivateMutation.mutate(account.id)}
                disabled={deactivateMutation.isPending}
              >
                Desativar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
