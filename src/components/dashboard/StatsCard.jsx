import React from 'react'

export default function StatsCard({ icon: Icon, label, value, subtext, gradient }) {
  return (
    <div className={`relative overflow-hidden border border-slate-700/50 bg-gradient-to-br ${gradient} p-4 rounded-lg`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-white/60 font-medium">{label}</div>
        {subtext && <div className="text-xs text-white/40 mt-1">{subtext}</div>}
      </div>
    </div>
  )
}