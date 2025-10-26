import React, { useState } from 'react'
import { base44 } from '../../api/base44Client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'

const FUEL_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'mid_grade', label: 'Mid-Grade' },
  { value: 'premium', label: 'Premium' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
]

export default function AddFuelForm({ vehicle, onClose }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    vehicle_id: vehicle.id,
    date: new Date().toISOString().split('T')[0],
    mileage: vehicle.current_mileage || '',
    gallons: '',
    cost_per_gallon: '',
    total_cost: '',
    fuel_type: 'regular',
    station: '',
    full_tank: true,
  })

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FuelLog.create(data),
    onSuccess: async () => {
      if (formData.mileage) {
        await base44.entities.Vehicle.update(vehicle.id, {
          current_mileage: parseFloat(formData.mileage),
        })
        queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      }
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] })
      onClose()
    },
  })

  const handleGallonsChange = (value) => {
    setFormData((prev) => {
      const gallons = parseFloat(value) || 0
      const costPerGallon = parseFloat(prev.cost_per_gallon) || 0
      return {
        ...prev,
        gallons: value,
        total_cost: gallons && costPerGallon ? (gallons * costPerGallon).toFixed(2) : prev.total_cost,
      }
    })
  }

  const handleCostPerGallonChange = (value) => {
    setFormData((prev) => {
      const costPerGallon = parseFloat(value) || 0
      const gallons = parseFloat(prev.gallons) || 0
      return {
        ...prev,
        cost_per_gallon: value,
        total_cost: gallons && costPerGallon ? (gallons * costPerGallon).toFixed(2) : prev.total_cost,
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      mileage: formData.mileage ? parseFloat(formData.mileage) : undefined,
      gallons: formData.gallons ? parseFloat(formData.gallons) : undefined,
      cost_per_gallon: formData.cost_per_gallon ? parseFloat(formData.cost_per_gallon) : undefined,
      total_cost: formData.total_cost ? parseFloat(formData.total_cost) : undefined,
    }
    createMutation.mutate(submitData)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm rounded-lg">
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <h3 className="text-white font-semibold text-lg">Add Fuel Log</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData((prev) => ({ ...prev, mileage: e.target.value }))}
                placeholder="Current mileage"
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Gallons</label>
              <input
                type="number"
                step="0.001"
                value={formData.gallons}
                onChange={(e) => handleGallonsChange(e.target.value)}
                placeholder="0.000"
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Cost per Gallon ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost_per_gallon}
                onChange={(e) => handleCostPerGallonChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Total Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.total_cost}
              onChange={(e) => setFormData((prev) => ({ ...prev, total_cost: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, fuel_type: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FUEL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-medium">Station</label>
              <input
                value={formData.station}
                onChange={(e) => setFormData((prev) => ({ ...prev, station: e.target.value }))}
                placeholder="Gas station name"
                className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="full_tank"
              checked={formData.full_tank}
              onChange={(e) => setFormData((prev) => ({ ...prev, full_tank: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="full_tank" className="text-slate-300 cursor-pointer text-sm">
              Full tank fill-up
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Fill-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}