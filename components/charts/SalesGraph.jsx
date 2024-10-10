"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked area chart for sales"

const salesData = [
  { month: "January", online: 12000, offline: 8000 },
  { month: "February", online: 15000, offline: 10000 },
  { month: "March", online: 17000, offline: 12000 },
  { month: "April", online: 14000, offline: 11000 },
  { month: "May", online: 18000, offline: 15000 },
  { month: "June", online: 19000, offline: 16000 },
]

const salesChartConfig = {
  online: {
    label: "Online Sales",
    color: "hsl(var(--chart-online))", // Define custom color variable
  },
  offline: {
    label: "Offline Sales",
    color: "hsl(var(--chart-offline))", // Define custom color variable
  },
}

export function SalesGraph() {
    return (
      <Card className="w-1/3 m-3 mx-10">
        <CardHeader>
          <CardTitle className="text-sm">Sales Chart - Stacked</CardTitle>
          <CardDescription className="text-xs">
            Showing sales data for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer config={salesChartConfig}>
            <AreaChart
              width={800}
              height={200}
              data={salesData}
              margin={{
                top: 10,
                left: 12,
                right: 12,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {/* Offline Sales Area */}
              <Area
                dataKey="offline"
                type="natural"
                fill="#f97316"  
                fillOpacity={0.4}
                stroke="#f97316"
                stackId="a"
              />
              {/* Online Sales Area */}
              <Area
                dataKey="online"
                type="natural"
                fill="#4f46e5"  
                fillOpacity={0.4}
                stroke="#4f46e5"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-xs">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Sales increased by 7.8% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2024
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }
  