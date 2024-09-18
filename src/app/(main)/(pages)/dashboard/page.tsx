"use client";

import { Sidebar } from "@/components/sidebar";
import { Infobar } from "@/components/infobar";
import { DashboardCards } from "@/components/global/DashboardCards";
import SalesPerformance from "@/components/global/SalesPerformance";
import { SearchFilter } from "@/components/global/SearchFilter";
import UpgradePlan from "@/components/global/UpgradePlan";
import ConversationTranscript from "@/components/global/ConversationTranscript";
import TeamComparison from "@/components/global/TeamComparison";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Infobar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <DashboardCards />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <SalesPerformance />
              </div>
              <div>
                <TeamComparison />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ConversationTranscript />
              </div>
              <div>
                <UpgradePlan />
              </div>
            </div>
            <SearchFilter />
          </div>
        </main>
      </div>
    </div>
  );
}