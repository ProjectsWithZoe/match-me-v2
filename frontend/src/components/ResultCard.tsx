import { AlertTriangle, BookOpen, Briefcase, CheckCircle, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisResult } from "@/lib/api";

type CardConfig = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  headerBg: string;
  headerText: string;
};

const configs: Record<keyof AnalysisResult, CardConfig> = {
  "Matching Skills": {
    icon: CheckCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50 hover:bg-emerald-100",
    badgeText: "text-emerald-800",
    borderColor: "border-emerald-200",
    headerBg: "bg-emerald-50",
    headerText: "text-emerald-800",
  },
  "Missing Skills": {
    icon: AlertTriangle,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-50 hover:bg-rose-100",
    badgeText: "text-rose-800",
    borderColor: "border-rose-200",
    headerBg: "bg-rose-50",
    headerText: "text-rose-800",
  },
  "Similar Job Titles": {
    icon: Briefcase,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50 hover:bg-sky-100",
    badgeText: "text-sky-800",
    borderColor: "border-sky-200",
    headerBg: "bg-sky-50",
    headerText: "text-sky-800",
  },
  "Upskilling Resources": {
    icon: BookOpen,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-50 hover:bg-amber-100",
    badgeText: "text-amber-800",
    borderColor: "border-amber-200",
    headerBg: "bg-amber-50",
    headerText: "text-amber-800",
  },
};

type Props = {
  title: keyof AnalysisResult;
  items: string[];
  isAnalyzing: boolean;
};

export function ResultCard({ title, items, isAnalyzing }: Props) {
  const cfg = configs[title];
  const Icon = cfg.icon;

  return (
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm ${cfg.borderColor}`}>
      {/* Card header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${cfg.headerBg}`}>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.iconBg}`}>
          <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
        </span>
        <h3 className={`text-sm font-semibold ${cfg.headerText}`}>{title}</h3>
        {!isAnalyzing && items.length > 0 && (
          <span className={`ml-auto text-xs font-bold ${cfg.iconColor}`}>{items.length}</span>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 py-3">
        {isAnalyzing ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-4/5 rounded-full" />
            <Skeleton className="h-6 w-3/5 rounded-full" />
            <Skeleton className="h-6 w-2/3 rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nothing to show yet</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <span
                key={item}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${cfg.badgeBg} ${cfg.badgeText}`}
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
