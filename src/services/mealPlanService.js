import { supabase } from '../lib/supabase'
import { generateMealPlan, generateRecipeInstructions } from '../lib/openai'

export const mealPlanService = {
  // Generate and save a new meal plan
  async generateMealPlan(userId, userProfile, targetDate = new Date()) {
    try {
      // Generate meal plan using AI
      const aiMealPlan = await generateMealPlan(userProfile, targetDate)
      
      // Save to database
      const savedPlan = await this.saveMealPlan(userId, targetDate, aiMealPlan)
      
      return {
        success: true,
        data: savedPlan,
        error: null
      }
    } catch (error) {
      console.error('Error generating meal plan:', error)
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  },

  // Save meal plan to database
  async saveMealPlan(userId, planDate, meals) {
    if (!supabase) {
      // Mock save for development
      return {
        plan_id: 'mock-plan-id',
        user_id: userId,
        plan_date: planDate.toISOString().split('T')[0],
        meals,
        created_at: new Date().toISOString()
      }
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([{
          user_id: userId,
          plan_date: planDate.toISOString().split('T')[0],
          meals,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving meal plan:', error)
      throw error
    }
  },

  // Get meal plan for a specific date
  async getMealPlan(userId, date) {
    if (!supabase) {
      // Return mock meal plan for development
      return this.getMockMealPlan(date)
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_date', date.toISOString().split('T')[0])
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error
      }

      return data || null
    } catch (error) {
      console.error('Error getting meal plan:', error)
      return null
    }
  },

  // Get meal plans for a date range
  async getMealPlans(userId, startDate, endDate) {
    if (!supabase) {
      // Return mock meal plans for development
      const plans = []
      const current = new Date(startDate)
      while (current <= endDate) {
        plans.push(this.getMockMealPlan(new Date(current)))
        current.setDate(current.getDate() + 1)
      }
      return plans
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .gte('plan_date', startDate.toISOString().split('T')[0])
        .lte('plan_date', endDate.toISOString().split('T')[0])
        .order('plan_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting meal plans:', error)
      return []
    }
  },

  // Update meal plan
  async updateMealPlan(planId, updates) {
    if (!supabase) {
      return { ...updates, plan_id: planId }
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .update(updates)
        .eq('plan_id', planId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating meal plan:', error)
      throw error
    }
  },

  // Delete meal plan
  async deleteMealPlan(planId) {
    if (!supabase) {
      return { success: true }
    }

    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('plan_id', planId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting meal plan:', error)
      throw error
    }
  },

  // Get recipe details for a meal
  async getRecipeDetails(mealName, dietaryRestrictions = []) {
    try {
      const recipe = await generateRecipeInstructions(mealName, dietaryRestrictions)
      return {
        success: true,
        data: recipe,
        error: null
      }
    } catch (error) {
      console.error('Error getting recipe details:', error)
      return {
        success: false,
        data: null,
        error: error.message
      }
    }
  },

  // Mark meal as completed
  async markMealCompleted(planId, mealType, completed = true) {
    if (!supabase) {
      return { success: true }
    }

    try {
      // Get current meal plan
      const { data: plan, error: fetchError } = await supabase
        .from('meal_plans')
        .select('meals')
        .eq('plan_id', planId)
        .single()

      if (fetchError) throw fetchError

      // Update the specific meal's completion status
      const updatedMeals = {
        ...plan.meals,
        [mealType]: {
          ...plan.meals[mealType],
          completed
        }
      }

      // Save updated meal plan
      const { data, error } = await supabase
        .from('meal_plans')
        .update({ meals: updatedMeals })
        .eq('plan_id', planId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error marking meal completed:', error)
      return { success: false, error: error.message }
    }
  },

  // Get mock meal plan for development
  getMockMealPlan(date) {
    return {
      plan_id: `mock-plan-${date.toISOString().split('T')[0]}`,
      user_id: 'mock-user-id',
      plan_date: date.toISOString().split('T')[0],
      meals: {
        breakfast: {
          name: "Avocado Toast with Poached Eggs",
          description: "Whole grain bread topped with smashed avocado and perfectly poached eggs",
          prepTime: 15,
          calories: 420,
          protein: 18,
          carbs: 35,
          fat: 25,
          difficulty: "Easy",
          completed: false
        },
        lunch: {
          name: "Quinoa Buddha Bowl",
          description: "Colorful bowl with quinoa, roasted vegetables, and tahini dressing",
          prepTime: 25,
          calories: 540,
          protein: 20,
          carbs: 65,
          fat: 22,
          difficulty: "Medium",
          completed: false
        },
        dinner: {
          name: "Grilled Salmon with Vegetables",
          description: "Fresh salmon fillet with seasonal roasted vegetables",
          prepTime: 30,
          calories: 480,
          protein: 35,
          carbs: 25,
          fat: 28,
          difficulty: "Medium",
          completed: false
        },
        snacks: [
          {
            name: "Greek Yogurt with Berries",
            calories: 150,
            description: "Protein-rich snack with antioxidant-packed berries",
            completed: false
          }
        ]
      },
      created_at: new Date().toISOString()
    }
  }
}
