import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, TrendingUp, Calendar, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const ProgressTracker = ({ user, profile, onBack }) => {
  const [progressLogs, setProgressLogs] = useState([])
  const [showAddLog, setShowAddLog] = useState(false)
  const [newLog, setNewLog] = useState({
    weight: '',
    energyLevel: 5,
    adherenceScore: 8,
    notes: ''
  })

  useEffect(() => {
    // Load existing progress logs or create sample data
    const savedLogs = localStorage.getItem(`progress-${user.id}`)
    if (savedLogs) {
      setProgressLogs(JSON.parse(savedLogs))
    } else {
      // Sample data for demo
      const sampleLogs = [
        {
          id: 1,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight: 165,
          energyLevel: 6,
          adherenceScore: 7,
          notes: 'Started the program, feeling motivated!'
        },
        {
          id: 2,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight: 163,
          energyLevel: 7,
          adherenceScore: 8,
          notes: 'Week 1 going well, loving the meal variety'
        },
        {
          id: 3,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight: 162,
          energyLevel: 8,
          adherenceScore: 9,
          notes: 'Feeling more energetic, recipes are delicious'
        },
        {
          id: 4,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight: 161,
          energyLevel: 8,
          adherenceScore: 8,
          notes: 'Great progress, pants fitting better!'
        }
      ]
      setProgressLogs(sampleLogs)
      localStorage.setItem(`progress-${user.id}`, JSON.stringify(sampleLogs))
    }
  }, [user.id])

  const handleAddLog = (e) => {
    e.preventDefault()
    const log = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newLog.weight),
      energyLevel: parseInt(newLog.energyLevel),
      adherenceScore: parseInt(newLog.adherenceScore),
      notes: newLog.notes
    }
    
    const updatedLogs = [...progressLogs, log]
    setProgressLogs(updatedLogs)
    localStorage.setItem(`progress-${user.id}`, JSON.stringify(updatedLogs))
    
    setNewLog({ weight: '', energyLevel: 5, adherenceScore: 8, notes: '' })
    setShowAddLog(false)
  }

  const chartData = progressLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: log.weight,
    energy: log.energyLevel,
    adherence: log.adherenceScore
  }))

  const latestLog = progressLogs[progressLogs.length - 1]
  const firstLog = progressLogs[0]
  const weightChange = latestLog && firstLog ? latestLog.weight - firstLog.weight : 0
  const avgEnergyLevel = progressLogs.length > 0 
    ? progressLogs.reduce((sum, log) => sum + log.energyLevel, 0) / progressLogs.length 
    : 0
  const avgAdherence = progressLogs.length > 0 
    ? progressLogs.reduce((sum, log) => sum + log.adherenceScore, 0) / progressLogs.length 
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="heading1 text-text-primary">Progress Tracking</h1>
            <p className="body text-text-secondary">Monitor your health journey and see your improvements</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddLog(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Log Progress</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
            <Target size={24} className="text-primary" />
          </div>
          <h3 className="heading2 text-text-primary mb-1">Weight Change</h3>
          <p className={`text-2xl font-bold ${weightChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
          </p>
        </div>
        
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-3">
            <TrendingUp size={24} className="text-accent" />
          </div>
          <h3 className="heading2 text-text-primary mb-1">Avg Energy</h3>
          <p className="text-2xl font-bold text-accent">{avgEnergyLevel.toFixed(1)}/10</p>
        </div>
        
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
            <Calendar size={24} className="text-green-600" />
          </div>
          <h3 className="heading2 text-text-primary mb-1">Adherence</h3>
          <p className="text-2xl font-bold text-green-600">{avgAdherence.toFixed(1)}/10</p>
        </div>
        
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <h3 className="heading2 text-text-primary mb-1">Days Tracked</h3>
          <p className="text-2xl font-bold text-purple-600">{progressLogs.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Weight Progress Chart */}
        <div className="card">
          <h3 className="heading2 text-text-primary mb-6">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(195, 70%, 40%)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(195, 70%, 40%)', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Energy & Adherence Chart */}
        <div className="card">
          <h3 className="heading2 text-text-primary mb-6">Energy & Adherence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="energy" fill="hsl(45, 90%, 50%)" name="Energy Level" />
              <Bar dataKey="adherence" fill="hsl(195, 70%, 40%)" name="Adherence Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Log History */}
      <div className="card">
        <h3 className="heading2 text-text-primary mb-6">Progress History</h3>
        <div className="space-y-4">
          {progressLogs.slice().reverse().map((log) => (
            <div key={log.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-text-primary">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <span>Weight: <strong>{log.weight} lbs</strong></span>
                  <span>Energy: <strong>{log.energyLevel}/10</strong></span>
                  <span>Adherence: <strong>{log.adherenceScore}/10</strong></span>
                </div>
              </div>
              {log.notes && (
                <p className="body text-text-secondary">{log.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md animate-slide-up">
            <h2 className="heading2 text-center mb-6">Log Your Progress</h2>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newLog.weight}
                  onChange={(e) => setNewLog(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Energy Level (1-10): {newLog.energyLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newLog.energyLevel}
                  onChange={(e) => setNewLog(prev => ({ ...prev, energyLevel: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Adherence Score (1-10): {newLog.adherenceScore}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newLog.adherenceScore}
                  onChange={(e) => setNewLog(prev => ({ ...prev, adherenceScore: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Notes (Optional)</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="How are you feeling? Any observations?"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Save Progress
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLog(false)}
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

export default ProgressTracker