import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog.tsx";
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories.ts";
import type { Category } from "../services/categoryService.ts";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

const CATEGORY_TYPES = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
];

const COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#22C55E", "#10B981",
  "#14B8A6", "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#EC4899", "#6B7280",
];

export function CategoryForm({ open, onOpenChange, category }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState(category?.type ?? "expense");
  const [color, setColor] = useState(category?.color ?? "#6B7280");

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isEditing = !!category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditing) {
      await updateMutation.mutateAsync({ id: category.id, data: { name, type, color } });
    } else {
      await createMutation.mutateAsync({ name, type, color });
    }
    onOpenChange(false);
    setName("");
    setType("expense");
    setColor("#6B7280");
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome da categoria"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {CATEGORY_TYPES.map((t) => (
                <Button
                  key={t.value}
                  type="button"
                  variant={type === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "#000" : "transparent",
                    transform: color === c ? "scale(1.2)" : "scale(1)",
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar Categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
