import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider')
  }
  return context
}

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock user data for demo
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email: 'demo@nourishai.com',
        name: 'Demo User',
        healthGoals: ['weight_loss', 'muscle_gain'],
        dietaryPreferences: ['vegetarian'],
        allergies: ['nuts'],
        dislikedIngredients: ['mushrooms'],
        cookingTime: '30_minutes',
        skillLevel: 'intermediate',
        subscriptionTier: 'premium',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        progress: {
          currentWeight: 70,
          targetWeight: 65,
          weeklyProgress: [
            { week: 1, weight: 72, energy: 7, adherence: 85 },
            { week: 2, weight: 71, energy: 8, adherence: 90 },
            { week: 3, weight: 70.5, energy: 8, adherence: 88 },
            { week: 4, weight: 70, energy: 9, adherence: 92 }
          ]
        }
      }
      setUser(mockUser)
      setIsLoading(false)
    }, 1000)
  }, [])

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const logProgress = (progressData) => {
    setUser(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        weeklyProgress: [...prev.progress.weeklyProgress, progressData]
      }
    }))
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateUser,
      logProgress,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  )
}