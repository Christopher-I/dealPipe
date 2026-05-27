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

function splitMoney(value: number): {
  sign: string;
  integer: string;
  fraction: string;
} {
  const sign = "$";
  const fixed = value.toFixed(2);
  const [int, frac] = fixed.split(".");
  const integer = Number(int).toLocaleString("en-US");
  return { sign, integer, fraction: frac ?? "00" };
}

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
      // Derive visually-pleasing weekly numbers from the org's own pipeline.
      const won = summary.byStage.closed_won.valueUsd / 1000 / 52;
      const inflow = won > 0 ? won : 23_194.8;
      const outflow = inflow * 0.35;
      setIncome(Math.round(inflow * 100) / 100);
      setPaid(Math.round(outflow * 100) / 100);
      setStocks(summary.pipelineValueUsd / 1_000_000);

      // Find the nearest expected close for an active deal.
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
  const incomeAmount = splitMoney(income);
  const paidAmount = splitMoney(paid);
  const stocksAmount = splitMoney(stocks);
  const barChartTop = (income / 1000).toFixed(2);

  // 36% is the reference value — we approximate from won/total later.
  const growthPercent = 36;
  const stocksDelta = 9.3;

  return (
    <div className="space-y-6">
      {/* Header row 2: date + tasks (left) | AI prompt + mic (right) */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-10 mt-2">
        <DateTaskRow date={today} />
        <AiPromptHero />
      </div>

      {/* Main grid: vertical rail + 12-col card grid */}
      <div className="flex gap-5">
        <VerticalActionRail />
        <div
          className="grid flex-1 gap-5"
          style={{
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gridAutoRows: "minmax(0, auto)",
          }}
        >
          {/* Row 1 */}
          <div style={{ gridColumn: "span 3" }}>
            <AccountCard />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <MetricCard
              icon={RotateCw}
              label="Total income"
              amount={incomeAmount}
              cadence="Weekly"
            />
          </div>
          <div style={{ gridColumn: "span 1" }}>
            <SystemLockCard />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <DaysCountdownCard
              days={daysToClose}
              totalDays={30}
              subtitle="To next close"
            />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <YearChartCard />
          </div>

          {/* Row 2 */}
          <div style={{ gridColumn: "span 3", gridRow: "span 2" }}>
            <AnnualProfitsCard />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <MetricCard
              icon={History}
              label="Total paid"
              amount={paidAmount}
              cadence="Weekly"
              action={{ icon: TrendingUp, line1: "View", line2: "on chart mode" }}
            />
          </div>
          <div
            style={{ gridColumn: "span 2" }}
            className="flex items-center justify-center"
          >
            <GrowthRateDial percent={growthPercent} />
          </div>
          <div style={{ gridColumn: "span 4" }}>
            <MainStocksCard
              amount={stocksAmount}
              title="Main Stocks"
              subtitle="Extended & Limited"
              deltaPercent={stocksDelta}
            />
          </div>

          {/* Row 3 */}
          <div style={{ gridColumn: "span 6" }}>
            <ActivityManagerCard amount={barChartTop} />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <ReviewRatingCard />
          </div>
        </div>
      </div>
    </div>
  );
}
