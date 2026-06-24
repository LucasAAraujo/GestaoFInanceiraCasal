import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";
import { useCategories, useArchiveCategory } from "#features/categories/hooks/useCategories.ts";
import { useAccounts, useDeactivateAccount } from "#features/accounts/hooks/useAccounts.ts";
import { CategoryForm } from "#features/categories/components/CategoryForm.tsx";
import { AccountForm } from "#features/accounts/components/AccountForm.tsx";
import type { Category } from "#features/categories/services/categoryService.ts";
import type { Account } from "#features/accounts/services/accountService.ts";

type Tab = "categories" | "accounts";

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: "CC",
  savings: "Poup.",
  credit_card: "Cartão",
  wallet: "Carteira",
  investment: "Invest.",
};

export function InlineManager() {
  const [tab, setTab] = useState<Tab>("categories");
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [accFormOpen, setAccFormOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editAcc, setEditAcc] = useState<Account | null>(null);

  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: accounts, isLoading: loadingAccs } = useAccounts();
  const archiveMutation = useArchiveCategory();
  const deactivateMutation = useDeactivateAccount();

  function openEditCat(cat: Category) {
    setEditCat(cat);
    setCatFormOpen(true);
  }

  function openEditAcc(acc: Account) {
    setEditAcc(acc);
    setAccFormOpen(true);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setTab("categories")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${tab === "categories" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              Categorias
            </button>
            <button
              onClick={() => setTab("accounts")}
              className={`px-3 py-1 text-xs font-medium transition-colors ${tab === "accounts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              Contas
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => tab === "categories" ? setCatFormOpen(true) : setAccFormOpen(true)}
          >
            + Nova
          </Button>
        </div>

        {tab === "categories" ? (
          loadingCats ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2 py-1.5 group">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm flex-1 truncate">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.type === "income" ? "Receita" : "Despesa"}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => openEditCat(cat)}>✎</Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs text-destructive" onClick={() => archiveMutation.mutate(cat.id)}>×</Button>
                  </div>
                </div>
              ))}
              {categories?.length === 0 && <p className="text-xs text-muted-foreground py-2">Nenhuma categoria</p>}
            </div>
          )
        ) : (
          loadingAccs ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {accounts?.map((acc) => (
                <div key={acc.id} className="flex items-center gap-2 py-1.5 group">
                  <span className="text-sm font-medium flex-1 truncate">{acc.name}</span>
                  <span className="text-xs text-muted-foreground">{ACCOUNT_TYPE_LABELS[acc.type] ?? acc.type}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs" onClick={() => openEditAcc(acc)}>✎</Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs text-destructive" onClick={() => deactivateMutation.mutate(acc.id)}>×</Button>
                  </div>
                </div>
              ))}
              {accounts?.length === 0 && <p className="text-xs text-muted-foreground py-2">Nenhuma conta</p>}
            </div>
          )
        )}
      </CardContent>

      <CategoryForm open={catFormOpen} onOpenChange={(o) => { setCatFormOpen(o); if (!o) setEditCat(null); }} category={editCat} />
      <AccountForm open={accFormOpen} onOpenChange={(o) => { setAccFormOpen(o); if (!o) setEditAcc(null); }} account={editAcc} />
    </Card>
  );
}
