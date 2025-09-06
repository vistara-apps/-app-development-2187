import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { 
  Home, 
  UtensilsCrossed, 
  TrendingUp, 
  CreditCard, 
  User,
  Bell,
  Settings
} from 'lucide-react'

const AppShell = () => {
  const { user } = useUser()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Meal Plans', href: '/app/meal-plans', icon: UtensilsCrossed },
    { name: 'Progress', href: '/app/progress', icon: TrendingUp },
    { name: 'Subscription', href: '/app/subscription', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 glass-effect">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center px-6 py-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xl font-bold text-white">NourishAI</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/app' && location.pathname.startsWith(item.href))
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white text-purple-600'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                )
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || 'Demo User'}
                  </p>
                  <p className="text-xs text-white/70 truncate">
                    {user?.subscriptionTier || 'Premium'} Plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="glass-effect border-b border-white/20">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {navigation.find(item => 
                    location.pathname === item.href || 
                    (item.href !== '/app' && location.pathname.startsWith(item.href))
                  )?.name || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppShell