import React, { useState } from 'react'
import { ChefHat, Target, Clock, TrendingUp, Star, Check } from 'lucide-react'

const LandingPage = ({ onSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showSignUp, setShowSignUp] = useState(false)

  const features = [
    {
      icon: ChefHat,
      title: 'AI-Driven Meal Recommendations',
      description: 'Get personalized daily and weekly meal suggestions tailored to your health goals and preferences.'
    },
    {
      icon: Target,
      title: 'Allergy & Preference Filtering',
      description: 'All meal plans automatically exclude your allergens and dietary restrictions for safe eating.'
    },
    {
      icon: Clock,
      title: 'Time-Saving Recipes',
      description: 'Recipes matched to your available cooking time and skill level with simple instructions.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Log your progress and get dynamic adjustments to keep your nutrition plan effective.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Busy Professional',
      content: 'NourishAI has transformed how I eat. The meal plans fit perfectly into my hectic schedule!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Fitness Enthusiast',
      content: 'The progress tracking feature helped me reach my muscle gain goals faster than ever.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Working Mom',
      content: 'Finally, healthy meals that my whole family enjoys and that I can actually cook!',
      rating: 5
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      onSignUp(email, password)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-primary">NourishAI</h1>
            <button
              onClick={() => setShowSignUp(!showSignUp)}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="display text-text-primary mb-6">
                Transform Your Journey with 
                <span className="text-primary"> AI-Powered</span> Meal Planning
              </h1>
              <p className="body text-text-secondary mb-8 max-w-lg">
                Get personalized nutrition plans tailored to your goals, preferences, and lifestyle. 
                Let AI be your personal nutrition coach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="btn-primary"
                >
                  Start Your Journey
                </button>
                <button className="btn-secondary">
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Meal Plan Preview */}
            <div className="animate-slide-up">
              <div className="relative">
                <div className="card bg-gradient-to-br from-surface to-gray-50 p-8">
                  <h3 className="heading2 mb-4 text-center">Today's Meal Plan</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Protein Smoothie Bowl', time: '7:00 AM', calories: '320' },
                      { name: 'Mediterranean Quinoa Salad', time: '12:30 PM', calories: '450' },
                      { name: 'Grilled Salmon & Vegetables', time: '7:00 PM', calories: '380' }
                    ].map((meal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-md border border-gray-100">
                        <div>
                          <p className="font-medium text-text-primary">{meal.name}</p>
                          <p className="caption text-text-secondary">{meal.time}</p>
                        </div>
                        <span className="text-sm font-medium text-primary">{meal.calories} cal</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading1 text-text-primary mb-4">Why Choose NourishAI?</h2>
            <p className="body text-text-secondary max-w-2xl mx-auto">
              Our AI-powered platform makes personalized nutrition accessible, practical, and effective for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <feature.icon size={24} className="text-primary" />
                </div>
                <h3 className="heading2 mb-3 text-text-primary">{feature.title}</h3>
                <p className="body text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading1 text-text-primary mb-4">What Our Users Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-accent fill-current" />
                  ))}
                </div>
                <p className="body text-text-secondary mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium text-text-primary">{testimonial.name}</p>
                  <p className="caption text-text-secondary">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading1 text-white mb-4">Ready to Transform Your Nutrition?</h2>
          <p className="body text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've already improved their health with AI-powered meal planning.
          </p>
          <button
            onClick={() => setShowSignUp(true)}
            className="bg-white text-primary px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md animate-slide-up">
            <h2 className="heading2 text-center mb-6">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage