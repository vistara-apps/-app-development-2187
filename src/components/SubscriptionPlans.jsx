import React from 'react'
import { Check, Star } from 'lucide-react'

const SubscriptionPlans = ({ onSubscribe }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 15,
      description: 'Perfect for getting started with AI meal planning',
      features: [
        'Personalized meal plans',
        'Basic recipe suggestions',
        'Allergy & preference filtering',
        'Mobile app access',
        'Email support'
      ],
      recommended: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      description: 'Most popular choice for serious health enthusiasts',
      features: [
        'Everything in Basic',
        'Weekly progress tracking',
        'Advanced nutrition analytics',
        'Recipe customization',
        'Meal prep planning',
        'Priority support'
      ],
      recommended: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 40,
      description: 'Complete nutrition solution with expert guidance',
      features: [
        'Everything in Premium',
        'Direct nutritionist consultation',
        'Custom supplement recommendations',
        'Detailed health insights',
        'One-on-one coaching sessions',
        'Premium support'
      ],
      recommended: false
    }
  ]

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="display text-text-primary mb-4">Choose Your Plan</h1>
          <p className="body text-text-secondary max-w-2xl mx-auto">
            Select the perfect plan to start your personalized nutrition journey. 
            All plans include our core AI-powered meal planning features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative transition-all duration-300 hover:shadow-lg ${
                plan.recommended ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full flex items-center space-x-1 text-sm font-medium">
                    <Star size={16} />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="heading1 text-text-primary mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-text-secondary ml-1">/month</span>
                </div>
                <p className="body text-text-secondary">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={12} className="text-green-600" />
                    </div>
                    <span className="body text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSubscribe(plan.id)}
                className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
                  plan.recommended
                    ? 'btn-primary'
                    : 'btn-secondary hover:bg-primary hover:text-white'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="body text-text-secondary mb-4">
            🔒 Secure payment powered by Stripe • Cancel anytime • 7-day money-back guarantee
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-text-secondary">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans