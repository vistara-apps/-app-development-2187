import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will use mock data.')
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
}) : null

export const generateMealPlan = async (userProfile, targetDate = new Date()) => {
  if (!openai) {
    // Return mock data when API is not available
    return getMockMealPlan()
  }

  try {
    const prompt = createMealPlanPrompt(userProfile, targetDate)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and meal planning expert. Generate personalized, healthy meal plans based on user preferences, dietary restrictions, and health goals. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0].message.content
    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating meal plan:', error)
    return getMockMealPlan()
  }
}

export const generateRecipeInstructions = async (mealName, dietaryRestrictions = []) => {
  if (!openai) {
    return getMockRecipe(mealName)
  }

  try {
    const prompt = `Generate detailed cooking instructions for "${mealName}". 
    Consider these dietary restrictions: ${dietaryRestrictions.join(', ')}.
    
    Respond with JSON in this format:
    {
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": 15,
      "cookTime": 20,
      "difficulty": "Easy|Medium|Hard",
      "nutritionInfo": {
        "calories": 400,
        "protein": 25,
        "carbs": 30,
        "fat": 15
      }
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef. Provide detailed, easy-to-follow recipes with accurate nutritional information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    })

    const response = completion.choices[0].message.content
    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating recipe:', error)
    return getMockRecipe(mealName)
  }
}

const createMealPlanPrompt = (userProfile, targetDate) => {
  const { healthGoals, dietaryPreferences, allergies, dislikedIngredients, cookingTime, skillLevel } = userProfile
  
  return `Create a personalized daily meal plan for ${targetDate.toDateString()} with the following requirements:

Health Goals: ${healthGoals?.join(', ') || 'general wellness'}
Dietary Preferences: ${dietaryPreferences?.join(', ') || 'none'}
Allergies: ${allergies?.join(', ') || 'none'}
Disliked Ingredients: ${dislikedIngredients?.join(', ') || 'none'}
Available Cooking Time: ${cookingTime || '30 minutes'}
Cooking Skill Level: ${skillLevel || 'intermediate'}

Respond with JSON in this exact format:
{
  "breakfast": {
    "name": "Meal Name",
    "description": "Brief description",
    "prepTime": 15,
    "calories": 400,
    "protein": 20,
    "carbs": 30,
    "fat": 15,
    "difficulty": "Easy"
  },
  "lunch": {
    "name": "Meal Name",
    "description": "Brief description",
    "prepTime": 25,
    "calories": 500,
    "protein": 25,
    "carbs": 40,
    "fat": 20,
    "difficulty": "Medium"
  },
  "dinner": {
    "name": "Meal Name",
    "description": "Brief description",
    "prepTime": 30,
    "calories": 450,
    "protein": 30,
    "carbs": 35,
    "fat": 18,
    "difficulty": "Medium"
  },
  "snacks": [
    {
      "name": "Snack Name",
      "calories": 150,
      "description": "Brief description"
    }
  ]
}`
}

const getMockMealPlan = () => ({
  breakfast: {
    name: "Avocado Toast with Poached Eggs",
    description: "Whole grain bread topped with smashed avocado and perfectly poached eggs",
    prepTime: 15,
    calories: 420,
    protein: 18,
    carbs: 35,
    fat: 25,
    difficulty: "Easy"
  },
  lunch: {
    name: "Quinoa Buddha Bowl",
    description: "Colorful bowl with quinoa, roasted vegetables, and tahini dressing",
    prepTime: 25,
    calories: 540,
    protein: 20,
    carbs: 65,
    fat: 22,
    difficulty: "Medium"
  },
  dinner: {
    name: "Grilled Salmon with Vegetables",
    description: "Fresh salmon fillet with seasonal roasted vegetables",
    prepTime: 30,
    calories: 480,
    protein: 35,
    carbs: 25,
    fat: 28,
    difficulty: "Medium"
  },
  snacks: [
    {
      name: "Greek Yogurt with Berries",
      calories: 150,
      description: "Protein-rich snack with antioxidant-packed berries"
    }
  ]
})

const getMockRecipe = (mealName) => ({
  ingredients: [
    "2 slices whole grain bread",
    "1 ripe avocado",
    "2 eggs",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Toast the bread slices until golden brown",
    "Mash the avocado with salt and pepper",
    "Poach the eggs in simmering water for 3-4 minutes",
    "Spread avocado on toast and top with poached eggs"
  ],
  prepTime: 15,
  cookTime: 5,
  difficulty: "Easy",
  nutritionInfo: {
    calories: 420,
    protein: 18,
    carbs: 35,
    fat: 25
  }
})
