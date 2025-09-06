import React from 'react'
import { User, Home, TrendingUp, LogOut, Menu, X } from 'lucide-react'

const AppShell = ({ children, user, onLogout, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navigation = [
    { name: 'Dashboard', icon: Home, action: () => onNavigate('dashboard') },
    { name: 'Progress', icon: TrendingUp, action: () => onNavigate('progress') },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary">NourishAI</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-text-secondary">
                <User size={16} />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-text-secondary hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden md:inline">Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-text-secondary hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default AppShell