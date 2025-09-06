import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'

const Onboarding = () => {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    healthGoals: [],
    dietaryPreferences: [],
    allergies: [],
    dislikedIngredients: '',
    cookingTime: '',
    skillLevel: '',
    subscriptionTier: 'premium'
  })

  const steps = [
    {
      title: 'Basic Information',
      fields: ['email', 'name']
    },
    {
      title: 'Health Goals',
      fields: ['healthGoals']
    },
    {
      title: 'Dietary Preferences',
      fields: ['dietaryPreferences', 'allergies']
    },
    {
      title: 'Cooking Preferences',
      fields: ['cookingTime', 'skillLevel', 'dislikedIngredients']
    },
    {
      title: 'Choose Your Plan',
      fields: ['subscriptionTier']
    }
  ]

  const healthGoalOptions = [
    { id: 'weight_loss', label: 'Weight Loss' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'maintain_weight', label: 'Maintain Weight' },
    { id: 'improve_energy', label: 'Improve Energy' },
    { id: 'better_digestion', label: 'Better Digestion' },
    { id: 'heart_health', label: 'Heart Health' }
  ]

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'low_carb', label: 'Low Carb' }
  ]

  const allergyOptions = [
    { id: 'nuts', label: 'Nuts' },
    { id: 'dairy', label: 'Dairy' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'shellfish', label: 'Shellfish' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'soy', label: 'Soy' }
  ]

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 15,
      description: 'Perfect for getting started',
      features: ['Personalized meal plans', 'Basic recipes', 'Allergy filtering']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      description: 'Most popular choice',
      features: ['Everything in Basic', 'Progress tracking', 'Plan adjustments', 'Priority support']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 40,
      description: 'Complete nutrition coaching',
      features: ['Everything in Premium', 'Nutritionist consultation', 'Custom recipes', 'Family coordination']
    }
  ]

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      const newUser = {
        id: '1',
        ...formData,
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: {
          currentWeight: 70,
          targetWeight: 65,
          weeklyProgress: []
        }
      }
      setUser(newUser)
      navigate('/app')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Your full name"
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div>
            <p className="text-white/80 mb-6">Select your primary health goals (choose multiple)</p>
            <div className="grid grid-cols-2 gap-4">
              {healthGoalOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleMultiSelect('healthGoals', option.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.healthGoals.includes(option.id)
                      ? 'bg-white text-purple-600 border-white'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                  {formData.healthGoals.includes(option.id) && (
                    <Check className="w-4 h-4 ml-2 inline" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <p className="text-white/80 mb-4">Dietary preferences (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                {dietaryOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleMultiSelect('dietaryPreferences', option.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.dietaryPreferences.includes(option.id)
                        ? 'bg-white text-purple-600 border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/80 mb-4">Food allergies (select all that apply)</p>
              <div className="grid grid-cols-2 gap-3">
                {allergyOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleMultiSelect('allergies', option.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.allergies.includes(option.id)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-4">
                How much time do you have for cooking?
              </label>
              <div className="space-y-3">
                {[
                  { value: '15_minutes', label: '15 minutes or less' },
                  { value: '30_minutes', label: '30 minutes' },
                  { value: '45_minutes', label: '45 minutes' },
                  { value: '60_minutes', label: '1 hour or more' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, cookingTime: option.value }))}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.cookingTime === option.value
                        ? 'bg-white text-purple-600 border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-4">
                What's your cooking skill level?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Beginner - Simple recipes only' },
                  { value: 'intermediate', label: 'Intermediate - Some cooking experience' },
                  { value: 'advanced', label: 'Advanced - Love cooking challenges' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, skillLevel: option.value }))}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.skillLevel === option.value
                        ? 'bg-white text-purple-600 border-white'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Any ingredients you dislike? (optional)
              </label>
              <textarea
                value={formData.dislikedIngredients}
                onChange={(e) => setFormData(prev => ({ ...prev, dislikedIngredients: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., mushrooms, cilantro, spicy food..."
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div>
            <p className="text-white/80 mb-6 text-center">Choose the plan that's right for you</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setFormData(prev => ({ ...prev, subscriptionTier: plan.id }))}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    formData.subscriptionTier === plan.id
                      ? 'bg-white text-purple-600 border-white transform scale-105'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  } ${plan.id === 'premium' ? 'ring-2 ring-yellow-400' : ''}`}
                >
                  {plan.id === 'premium' && (
                    <div className="text-center mb-2">
                      <span className="inline-block bg-yellow-400 text-purple-900 px-2 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm ml-2 opacity-70">/month</span>
                  </div>
                  <p className="text-sm opacity-80 mb-4">{plan.description}</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-white/80 text-sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-effect rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/80 mb-8">
            Let's personalize your nutrition journey
          </p>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? 'text-white/50 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              className="btn-primary bg-white text-purple-600 hover:bg-gray-100"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding