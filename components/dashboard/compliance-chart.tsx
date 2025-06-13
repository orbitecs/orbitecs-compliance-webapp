"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Ene", cumplimiento: 65 },
  { month: "Feb", cumplimiento: 59 },
  { month: "Mar", cumplimiento: 70 },
  { month: "Abr", cumplimiento: 72 },
  { month: "May", cumplimiento: 68 },
  { month: "Jun", cumplimiento: 75 },
  { month: "Jul", cumplimiento: 78 },
]

export function ComplianceChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={{
          cumplimiento: {
            label: "Cumplimiento",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--foreground))" tickLine={false} axisLine={false} dy={10} />
            <YAxis
              stroke="hsl(var(--foreground))"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="cumplimiento"
              stroke="var(--color-cumplimiento)"
              strokeWidth={2}
              dot={{ r: 4, fill: "var(--color-cumplimiento)" }}
              activeDot={{ r: 6, fill: "var(--color-cumplimiento)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
