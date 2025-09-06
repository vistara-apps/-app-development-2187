import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  Target, 
  Clock, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  Check
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Driven Meal Recommendations',
      description: 'Get personalized meal suggestions tailored to your health goals and preferences.'
    },
    {
      icon: Shield,
      title: 'Allergy & Preference Filtering',
      description: 'Safe meal plans that exclude allergens and ingredients you dislike.'
    },
    {
      icon: Clock,
      title: 'Time-Saving Recipes',
      description: 'Quick, easy recipes that match your available cooking time and skill level.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your journey and get dynamic plan adjustments based on your progress.'
    }
  ]

  const plans = [
    {
      name: 'Basic',
      price: 15,
      description: 'Perfect for getting started with AI nutrition',
      features: [
        'Personalized meal plans',
        'Basic recipe database',
        'Allergy filtering',
        'Weekly meal suggestions'
      ]
    },
    {
      name: 'Premium',
      price: 25,
      description: 'Advanced features for serious health goals',
      features: [
        'Everything in Basic',
        'Weekly progress tracking',
        'Personalized adjustments',
        'Advanced analytics',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Pro',
      price: 40,
      description: 'Complete nutrition coaching experience',
      features: [
        'Everything in Premium',
        'Direct nutritionist consultation',
        'Custom recipe creation',
        'Meal prep planning',
        'Family meal coordination'
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-white">NourishAI</span>
            </div>
            <Link
              to="/onboarding"
              className="btn-secondary bg-white text-purple-600 hover:bg-gray-50"
            >
              Get Started
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Nutrition Coach
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Get personalized meal plans, track your progress, and achieve your health goals 
              with the power of artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding" className="btn-primary text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/app" className="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Health Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides everything you need to transform your nutrition 
              and achieve lasting health results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start your personalized nutrition journey today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white transform scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-block bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-center justify-center mb-2">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={`text-lg ml-2 ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                      /month
                    </span>
                  </div>
                  <p className={`${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                      <span className={`${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/onboarding"
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold">NourishAI</span>
          </div>
          <p className="text-gray-400">
            Transform your nutrition with AI-powered personalized coaching
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage