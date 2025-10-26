import React from 'react'
import { base44 } from '../api/base44Client'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Car, Plus, DollarSign, Gauge, Droplets, TrendingUp } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import RecentActivity from '../components/dashboard/RecentActivity'

export default function Dashboard() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list(),
  })

  const { data: fuelLogs = [], isLoading: fuelLoading } = useQuery({
    queryKey: ['fuelLogs'],
    queryFn: () => base44.entities.FuelLog.list('-date'),
  })

  const vehicle = vehicles[0]
  const isLoading = vehiclesLoading || fuelLoading

  const totalSpent = fuelLogs.reduce(
    (sum, record) => sum + (record.total_cost || 0),
    0
  )

  const avgFuelEconomy = (() => {
    const fullTankLogs = fuelLogs.filter((log) => log.full_tank && log.gallons)
    if (fullTankLogs.length < 2) return null

    let totalMpg = 0
    for (let i = 1; i < fullTankLogs.length; i++) {
      const current = fullTankLogs[i - 1]
      const previous = fullTankLogs[i]
      const miles = current.mileage - previous.mileage
      const mpg = miles / current.gallons
      if (mpg > 0 && mpg < 100) totalMpg += mpg
    }
    return totalMpg / (fullTankLogs.length - 1)
  })()

  const recentActivity = fuelLogs.slice(0, 5).map((f) => ({
    id: f.id,
    type: 'fuel',
    title: `Filled ${f.gallons?.toFixed(1) || '?'} gallons`,
    description: f.station || `${f.fuel_type || 'regular'} fuel`,
    date: f.date,
    cost: f.total_cost,
  }))

  if (!vehicle && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Welcome to Vehicle Fuel Tracker</h1>
          <p className="text-slate-400 mb-6 max-w-sm">
            Start tracking your vehicle's fuel logs and expenses
          </p>
          <Link
            to="/vehicle"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your Vehicle
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {vehicle?.make} {vehicle?.model}
            </h1>
            <p className="text-slate-400 text-sm">{vehicle?.year}</p>
          </div>
          <Link
            to="/vehicle"
            className="bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 p-2 rounded-lg transition-colors"
          >
            <Car className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatsCard
            icon={Gauge}
            label="Current Mileage"
            value={vehicle?.current_mileage?.toLocaleString() || '0'}
            subtext="miles"
            gradient="from-blue-600/20 to-blue-500/10"
          />
          <StatsCard
            icon={DollarSign}
            label="Total Spent"
            value={`$${totalSpent.toFixed(0)}`}
            subtext="all time"
            gradient="from-purple-600/20 to-purple-500/10"
          />
          <StatsCard
            icon={Droplets}
            label="Fuel Economy"
            value={avgFuelEconomy ? `${avgFuelEconomy.toFixed(1)}` : 'N/A'}
            subtext={avgFuelEconomy ? 'mpg average' : 'need more data'}
            gradient="from-green-600/20 to-green-500/10"
          />
          <StatsCard
            icon={TrendingUp}
            label="Fuel Logs"
            value={fuelLogs.length}
            subtext="total fill-ups"
            gradient="from-amber-600/20 to-amber-500/10"
          />
        </div>

        <RecentActivity activities={recentActivity} isLoading={isLoading} />
      </div>
    </div>
  )
}