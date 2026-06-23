import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { useCategories } from "../hooks/useCategories.ts";
import { CategoryList } from "../components/CategoryList.tsx";
import { CategoryForm } from "../components/CategoryForm.tsx";
import type { Category } from "../services/categoryService.ts";

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  function handleEdit(category: Category) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) setEditingCategory(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => setFormOpen(true)}>Nova Categoria</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <CategoryList
          categories={categories ?? []}
          onEdit={handleEdit}
        />
      )}

      <CategoryForm
        open={formOpen}
        onOpenChange={handleOpenChange}
        category={editingCategory}
      />
    </div>
  );
}
