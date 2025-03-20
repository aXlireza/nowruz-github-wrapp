"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface LanguageChartProps {
  data: Array<{
    name: string
    percentage: number
    color: string
  }>
}

export function LanguageChart({ data }: LanguageChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* Add glow filter for pie chart */}
              <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Create individual gradients for each language */}
              {data.map((entry, index) => (
                <linearGradient key={index} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color.replace(/[0-9A-F]{2}$/i, "99")} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
              dataKey="percentage"
              filter="url(#pieGlow)"
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#pieGradient-${index})`}
                  stroke="rgba(0, 0, 0, 0.3)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
                padding: "8px 12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col justify-center space-y-3">
        {data.map((language, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{
                background: `linear-gradient(135deg, ${language.color}, ${language.color.replace(/[0-9A-F]{2}$/i, "99")})`,
                boxShadow: `0 0 8px ${language.color}80`,
              }}
            ></div>
            <span className="flex-1">{language.name}</span>
            <span className="font-medium">{language.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

