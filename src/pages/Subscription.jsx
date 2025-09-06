import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { 
  Check, 
  Crown, 
  Star, 
  Calendar,
  CreditCard,
  Settings,
  Download,
  Bell
} from 'lucide-react'

const Subscription = () => {
  const { user, updateUser } = useUser()
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionTier || 'premium')

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 15,
      description: 'Perfect for getting started with AI nutrition',
      features: [
        'Personalized meal plans',
        'Basic recipe database',
        'Allergy filtering',
        'Weekly meal suggestions',
        'Email support'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      description: 'Advanced features for serious health goals',
      features: [
        'Everything in Basic',
        'Weekly progress tracking',
        'Personalized adjustments',
        'Advanced analytics',
        'Priority support',
        'Recipe variations',
        'Nutrition insights'
      ],
      popular: true,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 40,
      description: 'Complete nutrition coaching experience',
      features: [
        'Everything in Premium',
        'Direct nutritionist consultation',
        'Custom recipe creation',
        'Meal prep planning',
        'Family meal coordination',
        'Advanced dietary tracking',
        'White-glove onboarding'
      ],
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const currentPlan = plans.find(plan => plan.id === user?.subscriptionTier)
  const subscriptionExpiresAt = user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null
  const daysUntilExpiry = subscriptionExpiresAt ? Math.ceil((subscriptionExpiresAt - new Date()) / (1000 * 60 * 60 * 24)) : 0

  const handlePlanChange = (planId) => {
    setSelectedPlan(planId)
    // In a real app, this would trigger Stripe payment flow
    updateUser({ subscriptionTier: planId })
  }

  const usageStats = [
    {
      label: 'Meal Plans Generated',
      value: '24',
      limit: user?.subscriptionTier === 'basic' ? '30' : 'Unlimited',
      percentage: user?.subscriptionTier === 'basic' ? 80 : null
    },
    {
      label: 'Recipe Views',
      value: '156',
      limit: 'Unlimited',
      percentage: null
    },
    {
      label: 'Progress Logs',
      value: '8',
      limit: user?.subscriptionTier === 'basic' ? '10' : 'Unlimited',
      percentage: user?.subscriptionTier === 'basic' ? 80 : null
    }
  ]

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Subscription</h1>
            <p className="text-white/80">Manage your NourishAI plan and billing</p>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-semibold capitalize">{user?.subscriptionTier} Plan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-sm">Next Billing</p>
                <p className="text-white font-medium">
                  {subscriptionExpiresAt ? subscriptionExpiresAt.toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-white/70 text-xs">
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-sm">Monthly Cost</p>
                <p className="text-white font-medium">${currentPlan?.price}/month</p>
                <p className="text-white/70 text-xs">Auto-renewal enabled</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-sm">Plan Status</p>
                <p className="text-white font-medium">Active</p>
                <p className="text-white/70 text-xs">Full access enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Usage This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usageStats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className="text-white text-sm">{stat.value} / {stat.limit}</p>
              </div>
              {stat.percentage && (
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-6 border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-white bg-white/20'
                  : 'border-white/20 bg-white/10 hover:bg-white/15'
              } ${plan.popular ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/70 ml-2">/month</span>
                </div>
                <p className="text-white/80 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-white mr-3 flex-shrink-0" />
                    <span className="text-white text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanChange(plan.id)}
                disabled={user?.subscriptionTier === plan.id}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  user?.subscriptionTier === plan.id
                    ? 'bg-white/20 text-white/60 cursor-not-allowed'
                    : selectedPlan === plan.id
                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {user?.subscriptionTier === plan.id ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Billing Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Update Payment Method</p>
                  <p className="text-sm text-white/70">Change your credit card</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Download Invoices</p>
                  <p className="text-sm text-white/70">Get receipts for taxes</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Billing Settings</p>
                  <p className="text-sm text-white/70">Manage auto-renewal</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Billing Reminders</p>
                <p className="text-white/70 text-sm">Get notified before charges</p>
              </div>
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only" />
                <div className="w-11 h-6 bg-white/20 rounded-full flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full ml-1 transform transition-transform translate-x-5"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Plan Updates</p>
                <p className="text-white/70 text-sm">New features and changes</p>
              </div>
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only" />
                <div className="w-11 h-6 bg-white/20 rounded-full flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full ml-1 transform transition-transform translate-x-5"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Usage Alerts</p>
                <p className="text-white/70 text-sm">When nearing limits</p>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" />
                <div className="w-11 h-6 bg-white/20 rounded-full flex items-center">
                  <div className="w-4 h-4 bg-white rounded-full ml-1 transform transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="glass-effect rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
        <p className="text-white/80 mb-4">
          Our support team is here to help with any billing or subscription questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
            Contact Support
          </button>
          <button className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  )
}

export default Subscription