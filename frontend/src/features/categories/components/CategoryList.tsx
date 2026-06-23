import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";
import { useArchiveCategory } from "../hooks/useCategories.ts";
import type { Category } from "../services/categoryService.ts";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const TYPE_LABELS: Record<string, string> = {
  expense: "Despesa",
  income: "Receita",
  investment: "Investimento",
  transfer: "Transferência",
};

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const archiveMutation = useArchiveCategory();

  if (categories.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma categoria encontrada.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {TYPE_LABELS[category.type] ?? category.type}
                  {category.isDefault && " · Padrão"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => archiveMutation.mutate(category.id)}
                disabled={archiveMutation.isPending}
              >
                Arquivar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
