import React, { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const UserProfileForm = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    healthGoals: [],
    dietaryPreferences: [],
    allergies: [],
    dislikedIngredients: [],
    cookingTimeAvailability: '',
    cookingSkillLevel: ''
  })

  const healthGoalOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Improved Energy',
    'Better Digestion', 'Heart Health', 'Diabetes Management', 'General Wellness'
  ]

  const dietaryPreferenceOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean',
    'Low Carb', 'Gluten-Free', 'Dairy-Free', 'Intermittent Fasting'
  ]

  const commonAllergies = [
    'Nuts', 'Shellfish', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Fish', 'Sesame'
  ]

  const cookingTimeOptions = [
    { value: '15-min', label: '15 minutes or less' },
    { value: '30-min', label: '30 minutes' },
    { value: '45-min', label: '45 minutes' },
    { value: '60-min', label: '1 hour or more' }
  ]

  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner (Basic cooking skills)' },
    { value: 'intermediate', label: 'Intermediate (Can follow recipes well)' },
    { value: 'advanced', label: 'Advanced (Experienced home cook)' }
  ]

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    onComplete(formData)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.healthGoals.length > 0
      case 2:
        return true // Optional step
      case 3:
        return formData.cookingTimeAvailability && formData.cookingSkillLevel
      case 4:
        return true // Review step
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading1 mb-4">What are your health goals?</h2>
              <p className="body text-text-secondary">Select all that apply to get personalized recommendations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {healthGoalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleArrayToggle('healthGoals', goal)}
                  className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                    formData.healthGoals.includes(goal)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-gray-200 hover:border-primary'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading1 mb-4">Dietary preferences & restrictions</h2>
              <p className="body text-text-secondary">Let us know about your eating style and any allergies</p>
            </div>
            
            <div>
              <h3 className="heading2 mb-4">Dietary Preferences (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietaryPreferenceOptions.map((pref) => (
                  <button
                    key={pref}
                    onClick={() => handleArrayToggle('dietaryPreferences', pref)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.dietaryPreferences.includes(pref)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-gray-200 hover:border-primary'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="heading2 mb-4">Allergies & Intolerances</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => handleArrayToggle('allergies', allergy)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.allergies.includes(allergy)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-surface border-gray-200 hover:border-red-500'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block heading2 mb-4">Foods you dislike (Optional)</label>
              <input
                type="text"
                placeholder="e.g., mushrooms, cilantro, spicy food..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dislikedIngredients: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }))}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading1 mb-4">Your cooking preferences</h2>
              <p className="body text-text-secondary">Help us match recipes to your lifestyle and skills</p>
            </div>
            
            <div>
              <h3 className="heading2 mb-4">How much time do you have for cooking?</h3>
              <div className="space-y-3">
                {cookingTimeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, cookingTimeAvailability: option.value }))}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      formData.cookingTimeAvailability === option.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-gray-200 hover:border-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="heading2 mb-4">What's your cooking skill level?</h3>
              <div className="space-y-3">
                {skillLevelOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, cookingSkillLevel: option.value }))}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      formData.cookingSkillLevel === option.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-gray-200 hover:border-primary'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading1 mb-4">Review your profile</h2>
              <p className="body text-text-secondary">Make sure everything looks good before we create your plan</p>
            </div>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="heading2 mb-3">Health Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.healthGoals.map((goal) => (
                    <span key={goal} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="heading2 mb-3">Dietary Preferences</h3>
                {formData.dietaryPreferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.dietaryPreferences.map((pref) => (
                      <span key={pref} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary">No specific preferences</p>
                )}
              </div>

              <div className="card">
                <h3 className="heading2 mb-3">Allergies & Restrictions</h3>
                {formData.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy) => (
                      <span key={allergy} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary">No allergies reported</p>
                )}
              </div>

              <div className="card">
                <h3 className="heading2 mb-3">Cooking Preferences</h3>
                <p className="body">
                  Time available: <span className="font-medium">{cookingTimeOptions.find(opt => opt.value === formData.cookingTimeAvailability)?.label}</span>
                </p>
                <p className="body">
                  Skill level: <span className="font-medium">{skillLevelOptions.find(opt => opt.value === formData.cookingSkillLevel)?.label}</span>
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-text-secondary">Step {step} of 4</span>
            <span className="text-sm font-medium text-text-secondary">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="card animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          {step === 4 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Complete Profile</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                isStepValid()
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfileForm