"use client";

import { DashboardCards } from "@/app/(main)/(pages)/dashboard/_components/DashboardCards";
import SalesPerformance from "@/app/(main)/(pages)/dashboard/_components/SalesPerformance";
import UpgradePlan from "@/components/global/UpgradePlan";
import TeamComparison from "@/app/(main)/(pages)/dashboard/_components/TeamComparison";
import DailyGoals from "@/app/(main)/(pages)/dashboard/_components/DailyGoals";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "flex-1 overflow-y-auto",
      theme === "dark" ? "bg-gray-900" : "bg-gray-100"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto p-6 space-y-6",
        theme === "dark" ? "text-gray-100" : "text-gray-800"
      )}>
        <DashboardCards />
        <SalesPerformance />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TeamComparison />
          <DailyGoals />
        </div>
        <UpgradePlan />
      </div>
    </div>
  );
}