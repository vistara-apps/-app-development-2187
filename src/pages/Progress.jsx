import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Activity,
  Heart,
  Target,
  Plus,
  Award
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Progress = () => {
  const { user, logProgress } = useUser()
  const [showLogModal, setShowLogModal] = useState(false)
  const [logData, setLogData] = useState({
    weight: '',
    energy: 5,
    adherence: 80,
    notes: ''
  })

  const weeklyProgress = user?.progress?.weeklyProgress || []
  const currentWeight = user?.progress?.currentWeight || 70
  const targetWeight = user?.progress?.targetWeight || 65

  const weightChange = weeklyProgress.length > 1 
    ? weeklyProgress[weeklyProgress.length - 1].weight - weeklyProgress[weeklyProgress.length - 2].weight
    : 0

  const averageAdherence = weeklyProgress.length > 0
    ? Math.round(weeklyProgress.reduce((sum, week) => sum + week.adherence, 0) / weeklyProgress.length)
    : 0

  const handleLogSubmit = (e) => {
    e.preventDefault()
    const newEntry = {
      week: weeklyProgress.length + 1,
      weight: parseFloat(logData.weight),
      energy: parseInt(logData.energy),
      adherence: parseInt(logData.adherence),
      notes: logData.notes,
      date: new Date().toISOString().split('T')[0]
    }
    
    logProgress(newEntry)
    setLogData({ weight: '', energy: 5, adherence: 80, notes: '' })
    setShowLogModal(false)
  }

  const achievements = [
    {
      title: 'First Week Complete',
      description: 'Completed your first week of meal plans',
      earned: true,
      icon: '🎯'
    },
    {
      title: 'Consistency Champion',
      description: 'Maintained 90%+ adherence for 2 weeks',
      earned: weeklyProgress.filter(w => w.adherence >= 90).length >= 2,
      icon: '🏆'
    },
    {
      title: 'Weight Loss Warrior',
      description: 'Lost 2kg towards your goal',
      earned: (75 - currentWeight) >= 2,
      icon: '⚖️'
    },
    {
      title: 'Energy Boost',
      description: 'Maintained energy level 8+ for a week',
      earned: weeklyProgress.some(w => w.energy >= 8),
      icon: '⚡'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Progress Tracking</h1>
          <p className="text-white/80">Monitor your journey and celebrate achievements</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="btn-primary bg-white text-purple-600 hover:bg-gray-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Progress
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Current Weight</p>
              <p className="text-3xl font-bold text-white">{currentWeight} kg</p>
              <div className="flex items-center mt-2">
                {weightChange < 0 ? (
                  <TrendingDown className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${weightChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(weightChange).toFixed(1)} kg this week
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Goal Progress</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(((75 - currentWeight) / (75 - targetWeight)) * 100)}%
              </p>
              <p className="text-sm text-white/70 mt-2">
                {(75 - currentWeight).toFixed(1)} / {(75 - targetWeight)} kg lost
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Avg. Adherence</p>
              <p className="text-3xl font-bold text-white">{averageAdherence}%</p>
              <p className="text-sm text-white/70 mt-2">
                {averageAdherence >= 90 ? 'Excellent!' : averageAdherence >= 80 ? 'Great job!' : 'Keep going!'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Weight Progression</h3>
          <div className="h-64">
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
          <div className="mt-4 flex items-center justify-between text-sm text-white/70">
            <span>Target: {targetWeight} kg</span>
            <span>Current: {currentWeight} kg</span>
          </div>
        </div>

        {/* Adherence Chart */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Weekly Adherence</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                />
                <Bar 
                  dataKey="adherence" 
                  fill="#ffffff" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-400'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-medium mb-1 ${
                  achievement.earned ? 'text-black' : 'text-white'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.earned ? 'text-black/70' : 'text-white/70'
                }`}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <Award className="w-5 h-5 text-black mx-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recent Progress Logs</h3>
        <div className="space-y-4">
          {weeklyProgress.slice(-3).reverse().map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-white/70" />
                <div>
                  <p className="text-white font-medium">Week {log.week}</p>
                  <p className="text-white/70 text-sm">Weight: {log.weight} kg</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">Energy: {log.energy}/10</p>
                <p className="text-white/70 text-sm">Adherence: {log.adherence}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Progress Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Your Progress</h2>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={logData.weight}
                  onChange={(e) => setLogData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level (1-10): {logData.energy}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={logData.energy}
                  onChange={(e) => setLogData(prev => ({ ...prev, energy: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adherence to Plan (%): {logData.adherence}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={logData.adherence}
                  onChange={(e) => setLogData(prev => ({ ...prev, adherence: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={logData.notes}
                  onChange={(e) => setLogData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="How are you feeling? Any challenges or wins?"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Save Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Progress