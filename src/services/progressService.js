import { supabase } from '../lib/supabase'

export const progressService = {
  // Log new progress entry
  async logProgress(userId, progressData) {
    if (!supabase) {
      // Mock save for development
      return {
        log_id: 'mock-log-id',
        user_id: userId,
        ...progressData,
        created_at: new Date().toISOString()
      }
    }

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .insert([{
          user_id: userId,
          log_date: progressData.log_date || new Date().toISOString().split('T')[0],
          weight: progressData.weight,
          energy_level: progressData.energy_level,
          adherence_score: progressData.adherence_score,
          notes: progressData.notes || '',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error logging progress:', error)
      throw error
    }
  },

  // Get progress logs for a user
  async getProgressLogs(userId, limit = 30) {
    if (!supabase) {
      // Return mock progress data for development
      return this.getMockProgressLogs()
    }

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting progress logs:', error)
      return []
    }
  },

  // Get progress logs for a date range
  async getProgressLogsInRange(userId, startDate, endDate) {
    if (!supabase) {
      return this.getMockProgressLogs().filter(log => {
        const logDate = new Date(log.log_date)
        return logDate >= startDate && logDate <= endDate
      })
    }

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', startDate.toISOString().split('T')[0])
        .lte('log_date', endDate.toISOString().split('T')[0])
        .order('log_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting progress logs in range:', error)
      return []
    }
  },

  // Update progress log
  async updateProgressLog(logId, updates) {
    if (!supabase) {
      return { log_id: logId, ...updates }
    }

    try {
      const { data, error } = await supabase
        .from('progress_logs')
        .update(updates)
        .eq('log_id', logId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating progress log:', error)
      throw error
    }
  },

  // Delete progress log
  async deleteProgressLog(logId) {
    if (!supabase) {
      return { success: true }
    }

    try {
      const { error } = await supabase
        .from('progress_logs')
        .delete()
        .eq('log_id', logId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting progress log:', error)
      throw error
    }
  },

  // Calculate progress statistics
  calculateProgressStats(progressLogs, targetWeight = null) {
    if (!progressLogs || progressLogs.length === 0) {
      return {
        currentWeight: null,
        weightChange: 0,
        averageEnergyLevel: 0,
        averageAdherence: 0,
        progressTowardsGoal: 0,
        trend: 'stable'
      }
    }

    // Sort by date (most recent first)
    const sortedLogs = [...progressLogs].sort((a, b) => 
      new Date(b.log_date) - new Date(a.log_date)
    )

    const currentWeight = sortedLogs[0]?.weight
    const previousWeight = sortedLogs[sortedLogs.length - 1]?.weight
    const weightChange = currentWeight && previousWeight ? currentWeight - previousWeight : 0

    const averageEnergyLevel = progressLogs.reduce((sum, log) => 
      sum + (log.energy_level || 0), 0) / progressLogs.length

    const averageAdherence = progressLogs.reduce((sum, log) => 
      sum + (log.adherence_score || 0), 0) / progressLogs.length

    let progressTowardsGoal = 0
    let trend = 'stable'

    if (targetWeight && currentWeight && previousWeight) {
      const totalNeededChange = Math.abs(targetWeight - previousWeight)
      const actualChange = Math.abs(currentWeight - previousWeight)
      progressTowardsGoal = totalNeededChange > 0 ? (actualChange / totalNeededChange) * 100 : 0

      // Determine trend based on recent weight changes
      if (sortedLogs.length >= 3) {
        const recentWeights = sortedLogs.slice(0, 3).map(log => log.weight).filter(Boolean)
        if (recentWeights.length >= 3) {
          const recentTrend = recentWeights[0] - recentWeights[2]
          if (Math.abs(recentTrend) > 0.5) {
            trend = recentTrend < 0 ? 'decreasing' : 'increasing'
          }
        }
      }
    }

    return {
      currentWeight,
      weightChange,
      averageEnergyLevel: Math.round(averageEnergyLevel * 10) / 10,
      averageAdherence: Math.round(averageAdherence),
      progressTowardsGoal: Math.round(progressTowardsGoal),
      trend
    }
  },

  // Get weekly progress summary
  async getWeeklyProgressSummary(userId, weeks = 4) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (weeks * 7))

    const logs = await this.getProgressLogsInRange(userId, startDate, endDate)
    
    // Group logs by week
    const weeklyData = []
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(weekStart.getDate() + (i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekLogs = logs.filter(log => {
        const logDate = new Date(log.log_date)
        return logDate >= weekStart && logDate <= weekEnd
      })

      if (weekLogs.length > 0) {
        const avgWeight = weekLogs.reduce((sum, log) => sum + (log.weight || 0), 0) / weekLogs.length
        const avgEnergy = weekLogs.reduce((sum, log) => sum + (log.energy_level || 0), 0) / weekLogs.length
        const avgAdherence = weekLogs.reduce((sum, log) => sum + (log.adherence_score || 0), 0) / weekLogs.length

        weeklyData.push({
          week: i + 1,
          weekStart: weekStart.toISOString().split('T')[0],
          weekEnd: weekEnd.toISOString().split('T')[0],
          weight: Math.round(avgWeight * 10) / 10,
          energy: Math.round(avgEnergy * 10) / 10,
          adherence: Math.round(avgAdherence)
        })
      }
    }

    return weeklyData
  },

  // Get mock progress data for development
  getMockProgressLogs() {
    const logs = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      logs.push({
        log_id: `mock-log-${i}`,
        user_id: 'mock-user-id',
        log_date: date.toISOString().split('T')[0],
        weight: 72 - (i * 0.1) + (Math.random() * 0.5 - 0.25), // Gradual weight loss with some variation
        energy_level: Math.floor(Math.random() * 3) + 7, // Energy between 7-10
        adherence_score: Math.floor(Math.random() * 20) + 80, // Adherence between 80-100
        notes: i % 5 === 0 ? 'Feeling great today!' : '',
        created_at: date.toISOString()
      })
    }

    return logs.reverse() // Return in chronological order
  }
}
