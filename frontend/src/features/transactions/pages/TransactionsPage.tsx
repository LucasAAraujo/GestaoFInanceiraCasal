import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import {
  useTransactions,
  useDeleteTransaction,
} from "../hooks/useTransactions.ts";
import { TransactionList } from "../components/TransactionList.tsx";
import { TransactionFilters } from "../components/TransactionFilters.tsx";
import { TransactionForm } from "../components/TransactionForm.tsx";
import type { Transaction, TransactionFilters as Filters } from "../services/transactionService.ts";

export function TransactionsPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const { data, isLoading } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingTransaction(null);
  }

  function handlePageChange(page: number) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Extrato</h1>
        <Button onClick={() => setFormOpen(true)}>Nova Transação</Button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <TransactionList
          transactions={data?.data ?? []}
          page={data?.page ?? 1}
          totalPages={data?.totalPages ?? 1}
          total={data?.total ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        transaction={editingTransaction}
      />
    </div>
  );
}
