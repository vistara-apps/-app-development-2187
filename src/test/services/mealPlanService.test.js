import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mealPlanService } from '../../services/mealPlanService'

describe('mealPlanService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateMealPlan', () => {
    it('should generate a meal plan successfully', async () => {
      const userId = 'test-user-id'
      const userProfile = {
        healthGoals: ['weight_loss'],
        dietaryPreferences: ['vegetarian'],
        allergies: ['nuts'],
        dislikedIngredients: ['mushrooms'],
        cookingTime: '30_minutes',
        skillLevel: 'intermediate'
      }
      const targetDate = new Date('2024-01-15')

      const result = await mealPlanService.generateMealPlan(userId, userProfile, targetDate)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.meals).toBeDefined()
      expect(result.data.meals.breakfast).toBeDefined()
      expect(result.data.meals.lunch).toBeDefined()
      expect(result.data.meals.dinner).toBeDefined()
      expect(result.error).toBeNull()
    })

    it('should handle errors gracefully', async () => {
      // Mock an error scenario
      vi.doMock('../../lib/openai', () => ({
        generateMealPlan: vi.fn().mockRejectedValue(new Error('API Error'))
      }))

      const userId = 'test-user-id'
      const userProfile = {}
      
      const result = await mealPlanService.generateMealPlan(userId, userProfile)

      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeDefined()
    })
  })

  describe('getMockMealPlan', () => {
    it('should return a valid mock meal plan', () => {
      const date = new Date('2024-01-15')
      const mockPlan = mealPlanService.getMockMealPlan(date)

      expect(mockPlan).toBeDefined()
      expect(mockPlan.plan_id).toContain('2024-01-15')
      expect(mockPlan.meals.breakfast).toBeDefined()
      expect(mockPlan.meals.lunch).toBeDefined()
      expect(mockPlan.meals.dinner).toBeDefined()
      expect(mockPlan.meals.snacks).toBeInstanceOf(Array)
      expect(mockPlan.meals.breakfast.name).toBe('Avocado Toast with Poached Eggs')
    })
  })

  describe('getRecipeDetails', () => {
    it('should get recipe details successfully', async () => {
      const mealName = 'Grilled Chicken Salad'
      const dietaryRestrictions = ['gluten-free']

      const result = await mealPlanService.getRecipeDetails(mealName, dietaryRestrictions)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data.ingredients).toBeInstanceOf(Array)
      expect(result.data.instructions).toBeInstanceOf(Array)
      expect(result.data.prepTime).toBeTypeOf('number')
      expect(result.data.nutritionInfo).toBeDefined()
    })
  })
})
