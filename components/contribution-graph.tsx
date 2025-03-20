"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ContributionGraphProps {
  data: Array<{
    month: string
    count: number
  }>
}

export function ContributionGraph({ data }: ContributionGraphProps) {
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            {/* Create a beautiful gradient for the bars */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f5a0" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#00d9f5" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#00aeff" stopOpacity={0.5} />
            </linearGradient>

            {/* Add a glow filter */}
            <filter id="barGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(0, 245, 160, 0.3)",
              borderRadius: "8px",
              color: "white",
              boxShadow: "0 4px 20px rgba(0, 245, 160, 0.2)",
            }}
            formatter={(value: number) => [`${value} مشارکت`, ""]}
            cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          />
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            filter="url(#barGlow)"
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

