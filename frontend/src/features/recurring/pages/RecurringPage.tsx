import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { useRecurrences } from "../hooks/useRecurring.ts";
import { RecurringList } from "../components/RecurringList.tsx";
import { RecurringForm } from "../components/RecurringForm.tsx";
import type { RecurringTransaction } from "../services/recurringService.ts";

export function RecurringPage() {
  const { data: items, isLoading } = useRecurrences();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringTransaction | null>(null);

  function handleEdit(item: RecurringTransaction) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingItem(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recorrências</h1>
        <Button onClick={() => setFormOpen(true)}>Nova Recorrência</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <RecurringList items={items ?? []} onEdit={handleEdit} />
      )}

      <RecurringForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        recurring={editingItem}
      />
    </div>
  );
}
