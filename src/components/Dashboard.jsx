import React, { useState, useEffect } from 'react'
import MealCard from './MealCard'
import { Calendar, TrendingUp, Clock, Target } from 'lucide-react'

const Dashboard = ({ user, profile, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todayMeals, setTodayMeals] = useState([])

  // Mock AI-generated meal data based on user profile
  useEffect(() => {
    const generateMeals = () => {
      const mealTemplates = {
        'weight-loss': [
          {
            id: 1,
            type: 'Breakfast',
            name: 'Green Smoothie Bowl',
            description: 'Spinach, banana, berries, and protein powder',
            calories: 280,
            prepTime: '10 min',
            cookTime: '0 min',
            difficulty: 'Easy',
            image: '🥗',
            ingredients: ['1 cup spinach', '1 banana', '1/2 cup mixed berries', '1 scoop protein powder', '1/2 cup almond milk'],
            instructions: [
              'Add all ingredients to blender',
              'Blend until smooth',
              'Pour into bowl and add toppings',
              'Enjoy immediately'
            ]
          },
          {
            id: 2,
            type: 'Lunch',
            name: 'Mediterranean Quinoa Salad',
            description: 'Quinoa with vegetables, feta, and olive oil dressing',
            calories: 420,
            prepTime: '15 min',
            cookTime: '15 min',
            difficulty: 'Medium',
            image: '🥙',
            ingredients: ['1 cup quinoa', '1 cucumber diced', '1 cup cherry tomatoes', '1/4 cup feta cheese', '2 tbsp olive oil'],
            instructions: [
              'Cook quinoa according to package directions',
              'Dice vegetables while quinoa cooks',
              'Mix cooled quinoa with vegetables',
              'Add feta and dressing, toss well'
            ]
          },
          {
            id: 3,
            type: 'Dinner',
            name: 'Grilled Salmon & Vegetables',
            description: 'Fresh salmon with roasted seasonal vegetables',
            calories: 380,
            prepTime: '10 min',
            cookTime: '20 min',
            difficulty: 'Medium',
            image: '🐟',
            ingredients: ['6oz salmon fillet', '1 cup broccoli', '1 bell pepper', '1 zucchini', '2 tbsp olive oil'],
            instructions: [
              'Preheat oven to 400°F',
              'Season salmon and vegetables',
              'Roast vegetables for 15 minutes',
              'Grill salmon for 6-8 minutes per side'
            ]
          }
        ],
        'muscle-building': [
          {
            id: 1,
            type: 'Breakfast',
            name: 'Protein Pancakes',
            description: 'High-protein pancakes with Greek yogurt and berries',
            calories: 450,
            prepTime: '10 min',
            cookTime: '10 min',
            difficulty: 'Easy',
            image: '🥞',
            ingredients: ['2 eggs', '1 scoop protein powder', '1/2 cup oats', '1/2 cup Greek yogurt', '1/2 cup berries'],
            instructions: [
              'Blend eggs, protein powder, and oats',
              'Cook pancakes in non-stick pan',
              'Stack and top with yogurt',
              'Add berries and serve'
            ]
          },
          {
            id: 2,
            type: 'Lunch',
            name: 'Chicken & Sweet Potato Bowl',
            description: 'Grilled chicken with roasted sweet potato and quinoa',
            calories: 520,
            prepTime: '15 min',
            cookTime: '25 min',
            difficulty: 'Medium',
            image: '🍗',
            ingredients: ['6oz chicken breast', '1 large sweet potato', '1/2 cup quinoa', '1 cup spinach', '2 tbsp tahini'],
            instructions: [
              'Season and grill chicken breast',
              'Roast cubed sweet potato',
              'Cook quinoa and prepare spinach',
              'Assemble bowl with tahini dressing'
            ]
          },
          {
            id: 3,
            type: 'Dinner',
            name: 'Lean Beef Stir-Fry',
            description: 'Lean beef with mixed vegetables and brown rice',
            calories: 480,
            prepTime: '15 min',
            cookTime: '15 min',
            difficulty: 'Medium',
            image: '🥩',
            ingredients: ['6oz lean beef strips', '2 cups mixed vegetables', '1/2 cup brown rice', '2 tbsp soy sauce', '1 tbsp sesame oil'],
            instructions: [
              'Cook brown rice first',
              'Heat wok and cook beef quickly',
              'Add vegetables and stir-fry',
              'Season and serve over rice'
            ]
          }
        ]
      }

      // Determine meal type based on health goals
      const primaryGoal = profile?.healthGoals?.[0]?.toLowerCase().replace(' ', '-') || 'weight-loss'
      const goalKey = mealTemplates[primaryGoal] ? primaryGoal : 'weight-loss'
      
      return mealTemplates[goalKey] || mealTemplates['weight-loss']
    }

    setTodayMeals(generateMeals())
  }, [profile])

  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0)
  const completedMeals = todayMeals.filter(meal => meal.completed).length

  const stats = [
    {
      icon: Target,
      label: 'Today\'s Calories',
      value: totalCalories,
      target: 1200,
      unit: 'kcal'
    },
    {
      icon: Clock,
      label: 'Meals Completed',
      value: completedMeals,
      target: 3,
      unit: 'meals'
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: Math.round((completedMeals / 3) * 100),
      target: 100,
      unit: '%'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="heading1 text-text-primary mb-2">
              Good morning! 👋
            </h1>
            <p className="body text-text-secondary">
              Here's your personalized meal plan for {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="btn-secondary flex items-center space-x-2"
          >
            <TrendingUp size={20} />
            <span>View Progress</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <stat.icon size={20} className="text-primary" />
                  <span className="body text-text-secondary">{stat.label}</span>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="heading1 text-text-primary">{stat.value}</span>
                <span className="caption text-text-secondary">/ {stat.target} {stat.unit}</span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meals */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar size={24} className="text-primary" />
          <h2 className="heading2 text-text-primary">Today's Meals</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {todayMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="heading2 text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="block text-2xl mb-2">📝</span>
            <span className="body">Log Progress</span>
          </button>
          <button className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="block text-2xl mb-2">🔄</span>
            <span className="body">Generate New Plan</span>
          </button>
          <button className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="block text-2xl mb-2">🛒</span>
            <span className="body">Shopping List</span>
          </button>
          <button className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="block text-2xl mb-2">⚙️</span>
            <span className="body">Update Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard