"use client";

import { useQuery } from "@tanstack/react-query";
import { analysisApi } from "@/entities/analysis/api/analysis";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function SpendingChart() {
  const { data: spending, isLoading } = useQuery({
    queryKey: ["spending-by-category"],
    queryFn: analysisApi.getSpendingByCategory,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!spending?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No spending data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spending as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ category, percent }: any) =>
                `${category} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
            >
              {spending.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₩${value.toLocaleString()}`}
              labelFormatter={(label: string) => label}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string, entry: any) => entry.payload.category}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details Table */}
      <div className="mt-6 space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground">
          카테고리별 상세
        </h4>
        <div className="space-y-2">
          {spending.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  거래: {item.quantity}건
                </span>
                <span className="font-semibold">
                  ₩{item.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
