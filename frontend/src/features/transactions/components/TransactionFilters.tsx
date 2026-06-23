import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import { Button } from "#components/ui/button.tsx";
import { useCategories } from "#features/categories/hooks/useCategories.ts";
import { useAccounts } from "#features/accounts/hooks/useAccounts.ts";
import type { TransactionFilters as Filters } from "../services/transactionService.ts";

interface TransactionFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  function update(partial: Partial<Filters>) {
    onChange({ ...filters, ...partial, page: 1 });
  }

  function clearFilters() {
    onChange({ page: 1, limit: 20 });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="f-start" className="text-xs">
            De
          </Label>
          <Input
            id="f-start"
            type="date"
            value={filters.startDate ?? ""}
            onChange={(e) => update({ startDate: e.target.value || undefined })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="f-end" className="text-xs">
            Até
          </Label>
          <Input
            id="f-end"
            type="date"
            value={filters.endDate ?? ""}
            onChange={(e) => update({ endDate: e.target.value || undefined })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="f-type" className="text-xs">
            Tipo
          </Label>
          <select
            id="f-type"
            value={filters.type ?? ""}
            onChange={(e) => update({ type: e.target.value || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
            <option value="transfer">Transferência</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="f-category" className="text-xs">
            Categoria
          </Label>
          <select
            id="f-category"
            value={filters.categoryId ?? ""}
            onChange={(e) => update({ categoryId: e.target.value || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="f-account" className="text-xs">
            Conta
          </Label>
          <select
            id="f-account"
            value={filters.accountId ?? ""}
            onChange={(e) => update({ accountId: e.target.value || undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {accounts?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="f-search" className="text-xs">
            Busca
          </Label>
          <Input
            id="f-search"
            placeholder="Buscar por descrição..."
            value={filters.search ?? ""}
            onChange={(e) => update({ search: e.target.value || undefined })}
          />
        </div>
        <div className="flex items-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
