import { Card, CardContent } from "#components/ui/card.tsx";
import { useTransactions } from "#features/transactions/hooks/useTransactions.ts";
import { useRecurrences } from "#features/recurring/hooks/useRecurring.ts";
import { InlineManager } from "./InlineManager.tsx";
import type { RecurringTransaction } from "#features/recurring/services/recurringService.ts";

const STREAMING_ICONS: Record<string, { icon: string; color: string }> = {
  netflix: { icon: "🎬", color: "#E50914" },
  spotify: { icon: "🎵", color: "#1DB954" },
  "disney+": { icon: "🏰", color: "#113CCF" },
  disney: { icon: "🏰", color: "#113CCF" },
  "amazon prime": { icon: "📦", color: "#00A8E1" },
  prime: { icon: "📦", color: "#00A8E1" },
  "hbo max": { icon: "🎭", color: "#B509FF" },
  hbo: { icon: "🎭", color: "#B509FF" },
  "youtube premium": { icon: "▶️", color: "#FF0000" },
  youtube: { icon: "▶️", color: "#FF0000" },
  "apple tv": { icon: "🍎", color: "#555" },
  "crunchyroll": { icon: "🎌", color: "#F47521" },
  "globoplay": { icon: "📺", color: "#E21E26" },
  academia: { icon: "💪", color: "#8B5CF6" },
  internet: { icon: "🌐", color: "#6366F1" },
  aluguel: { icon: "🏠", color: "#EF4444" },
  "conta de luz": { icon: "⚡", color: "#F59E0B" },
  "conta de água": { icon: "💧", color: "#0EA5E9" },
  "plano de saúde": { icon: "🏥", color: "#10B981" },
  seguro: { icon: "🛡️", color: "#3B82F6" },
};

function getRecurringIcon(description: string): { icon: string; color: string } {
  const lower = description.toLowerCase();
  for (const [key, val] of Object.entries(STREAMING_ICONS)) {
    if (lower.includes(key)) return val;
  }
  return { icon: "🔄", color: "#6B7280" };
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function RecurringItem({ item }: { item: RecurringTransaction }) {
  const { icon, color } = getRecurringIcon(item.description);
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: color + "18" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(item.nextDueDate)}
        </p>
      </div>
      <p className="text-sm font-semibold text-rose-600 shrink-0">
        {formatCurrency(item.amount)}
      </p>
    </div>
  );
}

export function DashboardSidebar() {
  const { data: txData, isLoading: loadingTx } = useTransactions({ limit: 5 });
  const { data: recurring, isLoading: loadingRec } = useRecurrences();

  const recentTransactions = txData?.data ?? [];
  const activeRecurring = recurring?.slice(0, 6) ?? [];

  return (
    <div className="space-y-4">
      <InlineManager />

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Últimos Lançamentos
          </h3>
          {loadingTx ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 skeleton rounded-lg" />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Nenhum lançamento</p>
          ) : (
            <div className="space-y-1">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center gap-2 py-1.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.category.color }}
                  />
                  <span className="text-sm truncate flex-1">{t.description}</span>
                  <span className={`text-sm font-medium shrink-0 ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Despesas Recorrentes
          </h3>
          {loadingRec ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 skeleton rounded-lg" />
              ))}
            </div>
          ) : activeRecurring.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">Nenhuma recorrência ativa</p>
          ) : (
            <div className="divide-y divide-border">
              {activeRecurring.map((item) => (
                <RecurringItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
