import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { progressService } from '../services/progressService'
import { mealPlanService } from '../services/mealPlanService'
import { stripeService } from '../services/stripeService'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize user session
  useEffect(() => {
    initializeUser()
  }, [])

  const initializeUser = async () => {
    try {
      setIsLoading(true)
      
      // Check for existing user session
      const currentUser = await authService.getCurrentUser()
      
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
        
        // Load additional user data
        await loadUserData(currentUser.id)
      } else {
        // Load mock user for development/demo
        loadMockUser()
      }
    } catch (error) {
      console.error('Error initializing user:', error)
      loadMockUser()
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserData = async (userId) => {
    try {
      // Load progress data
      const progressLogs = await progressService.getProgressLogs(userId, 30)
      const weeklyProgress = await progressService.getWeeklyProgressSummary(userId, 4)
      
      // Load subscription status
      const subscriptionStatus = await stripeService.getSubscriptionStatus(userId)
      
      setUser(prev => ({
        ...prev,
        progress: {
          logs: progressLogs,
          weeklyProgress,
          currentWeight: progressLogs[0]?.weight || null,
          targetWeight: prev?.targetWeight || 65
        },
        subscription: subscriptionStatus
      }))
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadMockUser = () => {
    const mockUser = {
      id: 'mock-user-id',
      email: 'demo@nourishai.com',
      name: 'Demo User',
      healthGoals: ['weight_loss', 'muscle_gain'],
      dietaryPreferences: ['vegetarian'],
      allergies: ['nuts'],
      dislikedIngredients: ['mushrooms'],
      cookingTime: '30_minutes',
      skillLevel: 'intermediate',
      subscriptionTier: 'premium',
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
    setIsAuthenticated(true)
  }

  // Authentication methods
  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await authService.signUp(email, password, userData)
      if (error) throw error
      
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await authService.signIn(email, password)
      if (error) throw error
      
      setUser(data.user)
      setIsAuthenticated(true)
      await loadUserData(data.user.id)
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (error) {
      console.error('Sign out error:', error)
      return { success: false, error: error.message }
    }
  }

  // User profile methods
  const updateUser = async (updates) => {
    try {
      if (user?.id && user.id !== 'mock-user-id') {
        await authService.updateUserProfile(user.id, updates)
      }
      setUser(prev => ({ ...prev, ...updates }))
      return { success: true }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Progress tracking methods
  const logProgress = async (progressData) => {
    try {
      if (user?.id && user.id !== 'mock-user-id') {
        await progressService.logProgress(user.id, progressData)
        // Reload progress data
        await loadUserData(user.id)
      } else {
        // Mock update for demo
        setUser(prev => ({
          ...prev,
          progress: {
            ...prev.progress,
            weeklyProgress: [...(prev.progress?.weeklyProgress || []), progressData]
          }
        }))
      }
      return { success: true }
    } catch (error) {
      console.error('Log progress error:', error)
      return { success: false, error: error.message }
    }
  }

  // Meal plan methods
  const generateMealPlan = async (targetDate = new Date()) => {
    try {
      if (!user) throw new Error('User not authenticated')
      
      const result = await mealPlanService.generateMealPlan(user.id, user, targetDate)
      return result
    } catch (error) {
      console.error('Generate meal plan error:', error)
      return { success: false, error: error.message }
    }
  }

  const getMealPlan = async (date) => {
    try {
      if (!user) throw new Error('User not authenticated')
      
      const mealPlan = await mealPlanService.getMealPlan(user.id, date)
      return { success: true, data: mealPlan }
    } catch (error) {
      console.error('Get meal plan error:', error)
      return { success: false, error: error.message }
    }
  }

  // Subscription methods
  const upgradeSubscription = async (tier) => {
    try {
      if (!user) throw new Error('User not authenticated')
      
      const result = await stripeService.createSubscriptionCheckout(tier, user.id)
      return result
    } catch (error) {
      console.error('Upgrade subscription error:', error)
      return { success: false, error: error.message }
    }
  }

  return (
    <UserContext.Provider value={{
      // User state
      user,
      setUser,
      isLoading,
      isAuthenticated,
      
      // Authentication methods
      signUp,
      signIn,
      signOut,
      
      // User profile methods
      updateUser,
      
      // Progress methods
      logProgress,
      
      // Meal plan methods
      generateMealPlan,
      getMealPlan,
      
      // Subscription methods
      upgradeSubscription,
      
      // Utility methods
      refreshUserData: () => loadUserData(user?.id)
    }}>
      {children}
    </UserContext.Provider>
  )
}
