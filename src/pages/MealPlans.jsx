import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { 
  RefreshCw, 
  Clock, 
  Users, 
  ChefHat,
  Calendar,
  BookOpen,
  Heart,
  Zap
} from 'lucide-react'

const MealPlans = () => {
  const { user } = useUser()
  const [selectedDay, setSelectedDay] = useState('today')
  const [isGenerating, setIsGenerating] = useState(false)

  const weekdays = [
    { id: 'today', label: 'Today', date: 'Dec 15' },
    { id: 'tomorrow', label: 'Tomorrow', date: 'Dec 16' },
    { id: 'wednesday', label: 'Wednesday', date: 'Dec 17' },
    { id: 'thursday', label: 'Thursday', date: 'Dec 18' },
    { id: 'friday', label: 'Friday', date: 'Dec 19' },
    { id: 'saturday', label: 'Saturday', date: 'Dec 20' },
    { id: 'sunday', label: 'Sunday', date: 'Dec 21' }
  ]

  const mealPlans = {
    today: [
      {
        type: 'Breakfast',
        name: 'Avocado Toast with Poached Eggs',
        description: 'Whole grain bread topped with smashed avocado, perfectly poached eggs, and a sprinkle of hemp seeds',
        prepTime: 15,
        calories: 420,
        protein: 18,
        carbs: 35,
        fat: 25,
        image: '🥑',
        difficulty: 'Easy',
        ingredients: ['2 slices whole grain bread', '1 ripe avocado', '2 eggs', '1 tbsp hemp seeds', 'Salt & pepper'],
        instructions: [
          'Toast the bread slices until golden brown',
          'Mash the avocado with salt and pepper',
          'Poach the eggs in simmering water for 3-4 minutes',
          'Spread avocado on toast, top with eggs and hemp seeds'
        ]
      },
      {
        type: 'Lunch',
        name: 'Mediterranean Quinoa Bowl',
        description: 'Protein-rich quinoa with roasted vegetables, chickpeas, feta cheese, and tahini dressing',
        prepTime: 25,
        calories: 540,
        protein: 22,
        carbs: 65,
        fat: 18,
        image: '🥗',
        difficulty: 'Medium',
        ingredients: ['1 cup cooked quinoa', '1/2 cup chickpeas', '1/2 cup cherry tomatoes', '1/4 cup feta cheese', '2 tbsp tahini'],
        instructions: [
          'Cook quinoa according to package instructions',
          'Roast vegetables at 400°F for 15 minutes',
          'Mix tahini with lemon juice and water for dressing',
          'Combine all ingredients in a bowl and drizzle with dressing'
        ]
      },
      {
        type: 'Dinner',
        name: 'Herb-Crusted Salmon with Sweet Potato',
        description: 'Fresh salmon fillet with herb crust, roasted sweet potato wedges, and steamed broccoli',
        prepTime: 30,
        calories: 480,
        protein: 35,
        carbs: 28,
        fat: 22,
        image: '🐟',
        difficulty: 'Medium',
        ingredients: ['6oz salmon fillet', '1 medium sweet potato', '1 cup broccoli', 'Fresh herbs', 'Olive oil'],
        instructions: [
          'Preheat oven to 425°F',
          'Cut sweet potato into wedges and toss with oil',
          'Season salmon with herbs and bake for 12-15 minutes',
          'Steam broccoli until tender'
        ]
      }
    ],
    tomorrow: [
      {
        type: 'Breakfast',
        name: 'Greek Yogurt Berry Parfait',
        description: 'Creamy Greek yogurt layered with mixed berries, granola, and a drizzle of honey',
        prepTime: 10,
        calories: 380,
        protein: 20,
        carbs: 45,
        fat: 12,
        image: '🥄',
        difficulty: 'Easy'
      },
      {
        type: 'Lunch',
        name: 'Asian-Style Lettuce Wraps',
        description: 'Ground turkey seasoned with ginger and soy sauce, served in crisp lettuce cups',
        prepTime: 20,
        calories: 320,
        protein: 28,
        carbs: 15,
        fat: 16,
        image: '🥬',
        difficulty: 'Easy'
      },
      {
        type: 'Dinner',
        name: 'Vegetable Curry with Brown Rice',
        description: 'Aromatic coconut curry with mixed vegetables and protein-rich lentils',
        prepTime: 35,
        calories: 520,
        protein: 18,
        carbs: 75,
        fat: 16,
        image: '🍛',
        difficulty: 'Medium'
      }
    ]
  }

  const currentMeals = mealPlans[selectedDay] || mealPlans.today

  const handleGenerateNewPlan = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      // In a real app, this would call the OpenAI API
    }, 3000)
  }

  const [selectedMeal, setSelectedMeal] = useState(null)

  const MealCard = ({ meal, onClick }) => (
    <div 
      onClick={() => onClick(meal)}
      className="glass-effect rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-2">
            {meal.type}
          </span>
          <h3 className="text-xl font-semibold text-white mb-2">{meal.name}</h3>
          <p className="text-white/80 text-sm">{meal.description}</p>
        </div>
        <div className="text-4xl">{meal.image}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">{meal.prepTime} min</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm">{meal.calories} cal</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-white/20">
        <div className="text-center">
          <p className="text-white text-sm font-medium">{meal.protein}g</p>
          <p className="text-white/70 text-xs">Protein</p>
        </div>
        <div className="text-center">
          <p className="text-white text-sm font-medium">{meal.carbs}g</p>
          <p className="text-white/70 text-xs">Carbs</p>
        </div>
        <div className="text-center">
          <p className="text-white text-sm font-medium">{meal.fat}g</p>
          <p className="text-white/70 text-xs">Fat</p>
        </div>
      </div>
    </div>
  )

  const RecipeModal = ({ meal, onClose }) => {
    if (!meal) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h2>
                <p className="text-gray-600">{meal.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{meal.prepTime} min</p>
                <p className="text-sm text-gray-600">Prep Time</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ChefHat className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{meal.difficulty}</p>
                <p className="text-sm text-gray-600">Difficulty</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">{meal.calories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
            </div>

            {meal.ingredients && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {meal.instructions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {meal.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your Meal Plans</h1>
          <p className="text-white/80">AI-generated meals tailored to your preferences</p>
        </div>
        <button
          onClick={handleGenerateNewPlan}
          disabled={isGenerating}
          className="btn-primary bg-white text-purple-600 hover:bg-gray-100 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New Plan
            </>
          )}
        </button>
      </div>

      {/* Day Selector */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {weekdays.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                selectedDay === day.id
                  ? 'bg-white text-purple-600'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="text-center">
                <p>{day.label}</p>
                <p className="text-xs opacity-70">{day.date}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMeals.map((meal, index) => (
          <MealCard 
            key={index} 
            meal={meal} 
            onClick={setSelectedMeal}
          />
        ))}
      </div>

      {/* Daily Summary */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Daily Nutrition Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {currentMeals.reduce((sum, meal) => sum + meal.calories, 0)}
            </p>
            <p className="text-white/70 text-sm">Total Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {currentMeals.reduce((sum, meal) => sum + meal.protein, 0)}g
            </p>
            <p className="text-white/70 text-sm">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {currentMeals.reduce((sum, meal) => sum + meal.carbs, 0)}g
            </p>
            <p className="text-white/70 text-sm">Carbs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {currentMeals.reduce((sum, meal) => sum + meal.fat, 0)}g
            </p>
            <p className="text-white/70 text-sm">Fat</p>
          </div>
        </div>
      </div>

      {/* Recipe Modal */}
      <RecipeModal 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </div>
  )
}

export default MealPlans