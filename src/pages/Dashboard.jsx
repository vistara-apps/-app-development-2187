import React from 'react'
import { useUser } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock,
  ArrowRight,
  Utensils,
  Award,
  Activity
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  const weeklyProgress = user?.progress?.weeklyProgress || []
  const currentWeight = user?.progress?.currentWeight || 70
  const targetWeight = user?.progress?.targetWeight || 65
  const progressPercent = Math.round(((currentWeight - targetWeight) / (75 - targetWeight)) * 100)

  const todaysMeals = [
    {
      type: 'Breakfast',
      name: 'Avocado Toast with Eggs',
      calories: 420,
      time: '8:00 AM',
      image: '🥑'
    },
    {
      type: 'Lunch',
      name: 'Quinoa Buddha Bowl',
      calories: 540,
      time: '12:30 PM',
      image: '🥗'
    },
    {
      type: 'Dinner',
      name: 'Grilled Salmon with Vegetables',
      calories: 480,
      time: '7:00 PM',
      image: '🐟'
    }
  ]

  const stats = [
    {
      label: 'Current Weight',
      value: `${currentWeight} kg`,
      icon: Activity,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Target Weight',
      value: `${targetWeight} kg`,
      icon: Target,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Weekly Adherence',
      value: '92%',
      icon: Award,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Energy Level',
      value: '9/10',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-effect rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || 'Demo User'}! 👋
        </h1>
        <p className="text-white/80">
          You're doing great! Here's your nutrition overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Weight Progress</h3>
            <Link 
              to="/app/progress"
              className="text-white/70 hover:text-white text-sm flex items-center"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyProgress}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#ffffff" 
                  strokeWidth={3}
                  dot={{ fill: '#ffffff', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              {progressPercent}% progress towards your goal
            </p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Today's Meals</h3>
            <Link 
              to="/app/meal-plans"
              className="text-white/70 hover:text-white text-sm flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-white/10">
                <div className="text-2xl">{meal.image}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{meal.name}</h4>
                  <p className="text-sm text-white/70">{meal.type} • {meal.calories} cal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70">{meal.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Total Calories</span>
              <span className="text-white font-bold">1,440 cal</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-green-400 rounded-full h-2" style={{ width: '72%' }}></div>
              </div>
              <p className="text-xs text-white/70 mt-1">72% of daily goal (2,000 cal)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/app/meal-plans"
          className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-white">Generate New Meal Plan</h3>
              <p className="text-sm text-white/70">Get fresh meal suggestions</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/app/progress"
          className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-white">Log Progress</h3>
              <p className="text-sm text-white/70">Update your journey</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/app/subscription"
          className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-colors group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-white">Manage Subscription</h3>
              <p className="text-sm text-white/70">View your {user?.subscriptionTier} plan</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Dashboard