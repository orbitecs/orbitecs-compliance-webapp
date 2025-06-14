"use client"

import { Pie, PieChart, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Completados", value: 32 },
  { name: "En progreso", value: 8 },
  { name: "Vencidos", value: 4 },
]

export function ActionPlansChart() {
  return (
    <div className="h-full w-full min-h-[300px]">
      <ChartContainer
        config={{
          completados: {
            label: "Completados",
            color: "hsl(var(--chart-1))",
          },
          enProgreso: {
            label: "En progreso",
            color: "hsl(var(--chart-2))",
          },
          vencidos: {
            label: "Vencidos",
            color: "hsl(var(--chart-3))",
          },
        }}
      >
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => {
              const colorKey = index === 0 ? "completados" : index === 1 ? "enProgreso" : "vencidos"
              return <Cell key={`cell-${index}`} fill={`var(--color-${colorKey})`} />
            })}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
