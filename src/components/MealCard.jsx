import React, { useState } from 'react'
import { Clock, Users, ChefHat, Check, X } from 'lucide-react'

const MealCard = ({ meal }) => {
  const [showRecipe, setShowRecipe] = useState(false)
  const [completed, setCompleted] = useState(meal.completed || false)

  const handleComplete = () => {
    setCompleted(!completed)
    // In a real app, this would sync with backend
  }

  return (
    <>
      <div className={`card transition-all duration-300 hover:shadow-lg ${completed ? 'opacity-75' : ''}`}>
        {/* Meal Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {meal.type}
            </span>
            <h3 className="heading2 text-text-primary mt-2 mb-1">{meal.name}</h3>
            <p className="caption text-text-secondary">{meal.description}</p>
          </div>
          <div className="text-3xl">{meal.image}</div>
        </div>

        {/* Meal Stats */}
        <div className="flex items-center space-x-4 text-sm text-text-secondary mb-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{meal.prepTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChefHat size={16} />
            <span>{meal.difficulty}</span>
          </div>
          <div className="font-medium text-primary">
            {meal.calories} cal
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowRecipe(true)}
            className="btn-primary flex-1"
          >
            View Recipe
          </button>
          <button
            onClick={handleComplete}
            className={`px-4 py-2 rounded-md transition-all ${
              completed
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {completed ? <Check size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Recipe Modal */}
      {showRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="heading1 text-text-primary mb-2">{meal.name}</h2>
                  <p className="body text-text-secondary">{meal.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-text-secondary">
                    <span>Prep: {meal.prepTime}</span>
                    <span>Cook: {meal.cookTime}</span>
                    <span>{meal.difficulty}</span>
                    <span className="font-medium text-primary">{meal.calories} calories</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecipe(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="heading2 text-text-primary mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="body text-text-primary">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="heading2 text-text-primary mb-4">Instructions</h3>
                <ol className="space-y-3">
                  {meal.instructions.map((instruction, index) => (
                    <li key={index} className="flex space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="body text-text-primary">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleComplete()
                    setShowRecipe(false)
                  }}
                  className="btn-primary flex-1"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => setShowRecipe(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MealCard