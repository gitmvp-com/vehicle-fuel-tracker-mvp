import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Fuel, Car } from 'lucide-react'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Fuel', icon: Fuel, path: '/fuel' },
    { name: 'Vehicle', icon: Car, path: '/vehicle' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-20">
      <div className="min-h-screen">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-50">
        <div className="flex justify-around items-center px-2 py-3 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}