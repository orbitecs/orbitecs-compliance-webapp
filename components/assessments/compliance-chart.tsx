"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ComplianceChartProps {
  data: {
    name: string
    compliance: number
  }[]
}

export function ComplianceChart({ data }: ComplianceChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer
        config={{
          compliance: {
            label: "Cumplimiento",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--foreground))"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fontSize: 11 }}
              height={40}
              textAnchor="middle"
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.compliance >= 80
                      ? "hsl(var(--chart-1))"
                      : entry.compliance >= 60
                        ? "hsl(var(--chart-2))"
                        : "hsl(var(--chart-3))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
