import { Button } from "#components/ui/button.tsx";

type Scope = "all" | "shared" | "individual";

interface ScopeFilterProps {
  value: Scope;
  onChange: (scope: Scope) => void;
}

const OPTIONS: { value: Scope; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "shared", label: "Casal" },
  { value: "individual", label: "Individual" },
];

export function ScopeFilter({ value, onChange }: ScopeFilterProps) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
