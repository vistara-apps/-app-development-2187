import { supabase } from '../lib/supabase'

export const authService = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    if (!supabase) {
      // Mock response for development
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email,
            ...userData
          }
        },
        error: null
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      // Create user profile in users table
      if (data.user) {
        await this.createUserProfile(data.user.id, {
          email,
          ...userData
        })
      }

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  },

  // Sign in existing user
  async signIn(email, password) {
    if (!supabase) {
      // Mock response for development
      return {
        data: {
          user: {
            id: 'mock-user-id',
            email
          }
        },
        error: null
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  },

  // Sign out user
  async signOut() {
    if (!supabase) {
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  },

  // Get current user
  async getCurrentUser() {
    if (!supabase) {
      // Return mock user for development
      return {
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
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get full user profile from users table
        const profile = await this.getUserProfile(user.id)
        return { ...user, ...profile }
      }
      
      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // Create user profile in database
  async createUserProfile(userId, profileData) {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Create user profile error:', error)
      return null
    }
  },

  // Get user profile from database
  async getUserProfile(userId) {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update user profile error:', error)
      return null
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    if (!supabase) {
      // Mock auth state for development
      setTimeout(() => {
        callback('SIGNED_IN', {
          id: 'mock-user-id',
          email: 'demo@nourishai.com'
        })
      }, 100)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    return supabase.auth.onAuthStateChange(callback)
  }
}
