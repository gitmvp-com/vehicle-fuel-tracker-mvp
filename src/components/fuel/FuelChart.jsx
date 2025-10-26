import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { TrendingUp } from 'lucide-react'

export default function FuelChart({ fuelLogs }) {
  const chartData = fuelLogs
    .slice()
    .reverse()
    .filter((log) => log.cost_per_gallon)
    .slice(-10)
    .map((log) => ({
      date: format(new Date(log.date), 'MM/dd'),
      price: log.cost_per_gallon,
    }))

  if (chartData.length < 2) return null

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-white text-lg flex items-center gap-2 font-semibold">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Fuel Price Trend
        </h3>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}