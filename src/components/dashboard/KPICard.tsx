import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number; // percentage change
  colorClass?: string;
  valuePrefix?: string;
  valueSuffix?: React.ReactNode;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  colorClass = "text-[#003893]",
  valuePrefix = "",
  valueSuffix
}: KPICardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-2xl bg-slate-50 border border-slate-100", colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-500">{title}</h3>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-slate-800">
          {valuePrefix}{value.toLocaleString()}{valueSuffix}
        </span>
        {trend !== undefined && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend > 0 ? "bg-emerald-50 text-emerald-600" : trend < 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
          )}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs font-medium text-slate-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
}
