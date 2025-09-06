import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Payment features will use mock data.')
}

let stripePromise = null
if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey)
}

export const stripeService = {
  // Initialize Stripe
  async getStripe() {
    if (!stripePromise) {
      console.warn('Stripe not initialized. Using mock payment flow.')
      return null
    }
    return await stripePromise
  },

  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    if (!stripePromise) {
      // Mock checkout session for development
      return {
        success: true,
        sessionId: 'mock-session-id',
        url: successUrl // Redirect directly to success for demo
      }
    }

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the response
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      return {
        success: true,
        sessionId: session.id,
        url: session.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
    const stripe = await this.getStripe()
    
    if (!stripe) {
      // Mock redirect for development
      console.log('Mock: Redirecting to checkout with session:', sessionId)
      return { success: true }
    }

    try {
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Create subscription checkout
  async createSubscriptionCheckout(tier, userId) {
    const priceIds = {
      basic: 'price_basic_monthly', // Replace with actual Stripe price IDs
      premium: 'price_premium_monthly',
      pro: 'price_pro_monthly'
    }

    const priceId = priceIds[tier]
    if (!priceId) {
      throw new Error('Invalid subscription tier')
    }

    const successUrl = `${window.location.origin}/app/subscription?success=true&tier=${tier}`
    const cancelUrl = `${window.location.origin}/app/subscription?canceled=true`

    return await this.createCheckoutSession(priceId, userId, successUrl, cancelUrl)
  },

  // Get subscription status
  async getSubscriptionStatus(userId) {
    if (!stripePromise) {
      // Mock subscription status for development
      return {
        active: true,
        tier: 'premium',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      }
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return {
        active: false,
        tier: 'basic',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      }
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    if (!stripePromise) {
      // Mock cancellation for development
      return {
        success: true,
        message: 'Subscription will be canceled at the end of the current period'
      }
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const result = await response.json()
      return {
        success: true,
        message: result.message
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Update subscription
  async updateSubscription(subscriptionId, newPriceId) {
    if (!stripePromise) {
      // Mock update for development
      return {
        success: true,
        message: 'Subscription updated successfully'
      }
    }

    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      const result = await response.json()
      return {
        success: true,
        message: result.message
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get pricing information
  getPricingPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 15,
        interval: 'month',
        features: [
          'Personalized meal plans',
          'Basic recipe suggestions',
          'Progress tracking',
          'Email support'
        ],
        priceId: 'price_basic_monthly',
        popular: false
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 25,
        interval: 'month',
        features: [
          'Everything in Basic',
          'Advanced AI recommendations',
          'Weekly progress analysis',
          'Meal plan adjustments',
          'Priority support'
        ],
        priceId: 'price_premium_monthly',
        popular: true
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 40,
        interval: 'month',
        features: [
          'Everything in Premium',
          'Direct nutritionist consultation',
          'Custom dietary protocols',
          'Advanced analytics',
          '24/7 chat support'
        ],
        priceId: 'price_pro_monthly',
        popular: false
      }
    ]
  }
}
