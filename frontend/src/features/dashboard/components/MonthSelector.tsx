import { Button } from "#components/ui/button.tsx";

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function MonthSelector({ month, year, onChange }: MonthSelectorProps) {
  function prev() {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  }

  function next() {
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={prev}>
        &larr;
      </Button>
      <span className="font-medium min-w-[160px] text-center">
        {MONTH_NAMES[month - 1]} {year}
      </span>
      <Button variant="outline" size="sm" onClick={next}>
        &rarr;
      </Button>
    </div>
  );
}
