import type { ReactNode } from "react";

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: ReactNode }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: null },
  active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: null },
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: null },
  suspended: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: null },
  closed: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: null },
  rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: null },
  removed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: null },
  tersedia: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", icon: null },
  penuh: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: null },
};

export function StatusBadge({ value }: { value: string }) {
  const config = statusConfig[value] ?? {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: null,
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}>
      {config.icon} {value}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 text-center">
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}
