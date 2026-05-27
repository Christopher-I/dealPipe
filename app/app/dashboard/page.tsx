"use client";

import { useEffect, useMemo, useState } from "react";
import { History, RotateCw, TrendingUp } from "lucide-react";

import { usePersona } from "@/components/shared/PersonaProvider";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { ActivityManagerCard } from "@/components/dashboard/ActivityManagerCard";
import { AiPromptHero } from "@/components/dashboard/AiPromptHero";
import { AnnualProfitsCard } from "@/components/dashboard/AnnualProfitsCard";
import { DateTaskRow } from "@/components/dashboard/DateTaskRow";
import { DaysCountdownCard } from "@/components/dashboard/DaysCountdownCard";
import { GrowthRateDial } from "@/components/dashboard/GrowthRateDial";
import { MainStocksCard } from "@/components/dashboard/MainStocksCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ReviewRatingCard } from "@/components/dashboard/ReviewRatingCard";
import { SystemLockCard } from "@/components/dashboard/SystemLockCard";
import { VerticalActionRail } from "@/components/dashboard/VerticalActionRail";
import { YearChartCard } from "@/components/dashboard/YearChartCard";

import { getDealsSummary, listDeals } from "@/lib/data";

export default function DashboardPage() {
  const { persona } = usePersona();

  const [income, setIncome] = useState<number>(23194.8);
  const [paid, setPaid] = useState<number>(8145.2);
  const [stocks, setStocks] = useState<number>(16073.49);
  const [daysToClose, setDaysToClose] = useState<number>(13);

  useEffect(() => {
    let alive = true;
    Promise.all([
      listDeals({ orgId: persona.orgId }),
      getDealsSummary({ orgId: persona.orgId }),
    ]).then(([deals, summary]) => {
      if (!alive) return;
      const won = summary.byStage.closed_won.valueUsd / 1000 / 52;
      const inflow = won > 0 ? won : 23_194.8;
      const outflow = inflow * 0.35;
      setIncome(Math.round(inflow * 100) / 100);
      setPaid(Math.round(outflow * 100) / 100);
      setStocks(summary.pipelineValueUsd / 1_000_000);

      const now = Date.now();
      const upcoming = deals
        .filter(
          (d) => d.stage !== "closed_won" && d.stage !== "closed_lost",
        )
        .map((d) => new Date(d.expectedClose).getTime())
        .filter((t) => t > now)
        .sort((a, b) => a - b)[0];
      if (upcoming) {
        const days = Math.max(
          1,
          Math.round((upcoming - now) / 86_400_000),
        );
        setDaysToClose(Math.min(99, days));
      }
    });
    return () => {
      alive = false;
    };
  }, [persona.orgId]);

  const today = useMemo(() => new Date(), []);
  const barChartTop = (income / 1000).toFixed(2);

  const growthPercent = 36;
  const stocksDelta = 9.3;

  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 xl:gap-8 mt-1">
        <DateTaskRow date={today} />
        <AiPromptHero />
      </div>

      <div className="flex gap-4">
        <div className="hidden lg:block">
          <VerticalActionRail />
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* ── Row 1 ── */}
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,3fr)_minmax(0,6fr)]">
            <AccountCard />

            <div className="flex flex-col gap-4">
              <MetricCard
                icon={RotateCw}
                label="Pipeline inflow"
                value={income}
                cadence="Weekly"
              />
              <MetricCard
                icon={History}
                label="Cap calls"
                value={paid}
                cadence="Weekly"
                action={{ icon: TrendingUp, line1: "View", line2: "trend" }}
              />
            </div>

            {/* Right cluster — collapses to single column below xl */}
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] xl:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
              <SystemLockCard />
              <DaysCountdownCard
                days={daysToClose}
                totalDays={30}
                subtitle="To next close"
              />
              <div className="sm:col-span-2 xl:col-span-1">
                <YearChartCard />
              </div>
              <div className="flex items-center justify-center sm:col-span-2 xl:col-span-2">
                <GrowthRateDial percent={growthPercent} />
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <MainStocksCard
                  value={stocks}
                  title="Portfolio NAV"
                  subtitle="Open + closed deals"
                  deltaPercent={stocksDelta}
                />
              </div>
            </div>
          </div>

          {/* ── Row 2 ── */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)]">
            <AnnualProfitsCard />
            <ActivityManagerCard amount={barChartTop} />
            <div className="lg:col-span-2 xl:col-span-1">
              <ReviewRatingCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
