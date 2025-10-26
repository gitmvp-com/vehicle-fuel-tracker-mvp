import React, { useState } from 'react'
import { base44 } from '../api/base44Client'
import { useQuery } from '@tanstack/react-query'
import { Plus, Fuel as FuelIcon, Calendar, DollarSign, Gauge, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import AddFuelForm from '../components/fuel/AddFuelForm'
import FuelChart from '../components/fuel/FuelChart'

export default function Fuel() {
  const [showAddForm, setShowAddForm] = useState(false)

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list(),
  })

  const { data: fuelLogs = [], isLoading } = useQuery({
    queryKey: ['fuelLogs'],
    queryFn: () => base44.entities.FuelLog.list('-date'),
  })

  const vehicle = vehicles[0]

  const totalSpent = fuelLogs.reduce((sum, log) => sum + (log.total_cost || 0), 0)
  const totalGallons = fuelLogs.reduce((sum, log) => sum + (log.gallons || 0), 0)
  const avgCostPerGallon = totalGallons > 0 ? totalSpent / totalGallons : 0

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FuelIcon className="w-6 h-6 text-blue-400" />
              Fuel Logs
            </h1>
            <p className="text-slate-400 text-sm mt-1">{fuelLogs.length} fill-ups tracked</p>
          </div>
          {vehicle && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Fill-up
            </button>
          )}
        </div>

        {fuelLogs.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold text-white">${totalSpent.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Total Spent</div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <FuelIcon className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-xl font-bold text-white">{totalGallons.toFixed(1)}</div>
              <div className="text-xs text-slate-400">Total Gallons</div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white">${avgCostPerGallon.toFixed(2)}</div>
              <div className="text-xs text-slate-400">Avg $/Gallon</div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AddFuelForm vehicle={vehicle} onClose={() => setShowAddForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {fuelLogs.length > 0 && <FuelChart fuelLogs={fuelLogs} />}

        {!vehicle ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-12 text-center">
            <FuelIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Add a vehicle first to track fuel</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : fuelLogs.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-12 text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FuelIcon className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-white font-medium mb-2">No fuel logs yet</p>
            <p className="text-slate-400 text-sm mb-4">Start tracking your fill-ups</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Fill-up
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {fuelLogs.map((log, index) => {
              const prevLog = fuelLogs[index + 1]
              const mpg =
                prevLog && log.full_tank && log.gallons
                  ? (log.mileage - prevLog.mileage) / log.gallons
                  : null

              return (
                <div
                  key={log.id}
                  className="bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70 transition-all rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-1 rounded">
                          {log.fuel_type?.toUpperCase() || 'REGULAR'}
                        </span>
                        {log.total_cost && (
                          <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2 py-1 rounded flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {log.total_cost.toFixed(2)}
                          </span>
                        )}
                        {log.full_tank && (
                          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs px-2 py-1 rounded">
                            Full Tank
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-white font-medium">
                            {log.gallons?.toFixed(2) || '?'} gal
                          </span>
                          {log.cost_per_gallon && (
                            <span className="text-slate-400">
                              @ ${log.cost_per_gallon.toFixed(2)}/gal
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(log.date), 'MMM d, yyyy')}
                        </div>

                        {log.mileage && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Gauge className="w-3 h-3" />
                            {log.mileage.toLocaleString()} miles
                          </div>
                        )}

                        {log.station && (
                          <div className="text-xs text-slate-400">{log.station}</div>
                        )}

                        {mpg && mpg > 0 && mpg < 100 && (
                          <div className="mt-2">
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs px-2 py-1 rounded">
                              {mpg.toFixed(1)} MPG
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}