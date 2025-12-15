"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", amount: 1200000 },
  { name: "Feb", amount: 1100000 },
  { name: "Mar", amount: 1400000 },
  { name: "Apr", amount: 980000 },
  { name: "May", amount: 1600000 },
  { name: "Jun", amount: 1250000 },
];

export function MonthlyTrendChart() {
  const amounts = data.map((d) => d.amount);
  const avgAmount = Math.round(
    amounts.reduce((a, b) => a + b, 0) / amounts.length
  );
  const maxAmount = Math.max(...amounts);
  const minAmount = Math.min(...amounts);

  return (
    <div className="space-y-6">
      <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₩${value / 10000}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `₩${value.toLocaleString()}`,
                "지출",
              ]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">평균 지출</p>
          <p className="text-sm font-semibold">
            ₩{(avgAmount / 10000).toFixed(0)}M
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">최고 지출</p>
          <p className="text-sm font-semibold">
            ₩{(maxAmount / 10000).toFixed(0)}M
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">최저 지출</p>
          <p className="text-sm font-semibold">
            ₩{(minAmount / 10000).toFixed(0)}M
          </p>
        </div>
      </div>

      {/* Monthly Details */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground">
          월별 상세
        </h4>
        <div className="space-y-1">
          {data.map((item, index) => {
            const prevAmount = index > 0 ? data[index - 1].amount : item.amount;
            const changePercent = (
              ((item.amount - prevAmount) / prevAmount) *
              100
            ).toFixed(0);
            const isIncrease = item.amount > prevAmount;

            return (
              <div
                key={index}
                className="flex items-center justify-between text-xs p-2 rounded bg-muted/30"
              >
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span>₩{(item.amount / 10000).toFixed(0)}M</span>
                  {index > 0 && (
                    <span
                      className={isIncrease ? "text-red-500" : "text-green-500"}
                    >
                      {isIncrease ? "↑" : "↓"} {Math.abs(Number(changePercent))}
                      %
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
