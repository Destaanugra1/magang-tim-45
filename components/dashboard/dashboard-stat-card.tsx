import type { ReactNode } from "react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  color: "primary" | "sky" | "emerald" | "amber" | "rose";
};

export function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`rounded-2xl p-2.5 ${colorMap[color]}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
