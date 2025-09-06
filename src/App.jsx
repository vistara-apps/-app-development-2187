import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import LandingPage from './components/LandingPage'
import UserProfileForm from './components/UserProfileForm'
import Dashboard from './components/Dashboard'
import SubscriptionPlans from './components/SubscriptionPlans'
import ProgressTracker from './components/ProgressTracker'

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    // Load user data from localStorage on app start
    const savedUser = localStorage.getItem('nourish-user')
    const savedProfile = localStorage.getItem('nourish-profile')
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setUserProfile(JSON.parse(savedProfile))
      setCurrentView('dashboard')
    }
  }, [])

  const handleSignUp = (email, password) => {
    const newUser = {
      id: Date.now().toString(),
      email,
      subscriptionTier: null,
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString()
    }
    setUser(newUser)
    localStorage.setItem('nourish-user', JSON.stringify(newUser))
    setCurrentView('profile-setup')
  }

  const handleProfileComplete = (profile) => {
    const completeProfile = {
      ...profile,
      userId: user.id,
      createdAt: new Date().toISOString()
    }
    setUserProfile(completeProfile)
    localStorage.setItem('nourish-profile', JSON.stringify(completeProfile))
    setCurrentView('subscription')
  }

  const handleSubscriptionComplete = (tier) => {
    const updatedUser = {
      ...user,
      subscriptionTier: tier,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
    setUser(updatedUser)
    localStorage.setItem('nourish-user', JSON.stringify(updatedUser))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('nourish-user')
    localStorage.removeItem('nourish-profile')
    setUser(null)
    setUserProfile(null)
    setCurrentView('landing')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onSignUp={handleSignUp} />
      case 'profile-setup':
        return <UserProfileForm onComplete={handleProfileComplete} />
      case 'subscription':
        return <SubscriptionPlans onSubscribe={handleSubscriptionComplete} />
      case 'dashboard':
        return <Dashboard user={user} profile={userProfile} onNavigate={setCurrentView} />
      case 'progress':
        return <ProgressTracker user={user} profile={userProfile} onBack={() => setCurrentView('dashboard')} />
      default:
        return <LandingPage onSignUp={handleSignUp} />
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {(currentView === 'dashboard' || currentView === 'progress') ? (
        <AppShell user={user} onLogout={handleLogout} onNavigate={setCurrentView}>
          {renderCurrentView()}
        </AppShell>
      ) : (
        renderCurrentView()
      )}
    </div>
  )
}

export default App