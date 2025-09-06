import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { UserContextProvider } from './contexts/UserContext'
import AppShell from './components/AppShell'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import MealPlans from './pages/MealPlans'
import Progress from './pages/Progress'
import Subscription from './pages/Subscription'

function App() {
  return (
    <UserContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="meal-plans" element={<MealPlans />} />
            <Route path="progress" element={<Progress />} />
            <Route path="subscription" element={<Subscription />} />
          </Route>
        </Routes>
      </div>
    </UserContextProvider>
  )
}

export default App