import React from 'react'
import { format } from 'date-fns'
import { Fuel, Calendar } from 'lucide-react'

const activityIcons = {
  fuel: Fuel,
}

const activityColors = {
  fuel: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default function RecentActivity({ activities, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <h2 className="text-white text-lg flex items-center gap-2 mb-4 font-semibold">
          <Calendar className="w-5 h-5 text-blue-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 bg-slate-700/30 rounded-lg">
              <div className="w-10 h-10 bg-slate-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-white text-lg flex items-center gap-2 mb-4 font-semibold">
        <Calendar className="w-5 h-5 text-blue-400" />
        Recent Activity
      </h2>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No activity yet</p>
          <p className="text-sm mt-1">Start adding fuel logs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type]
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activityColors[activity.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </span>
                    {activity.cost && (
                      <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded">
                        ${activity.cost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}