import { describe, it, expect, vi, beforeEach } from 'vitest'
import { progressService } from '../../services/progressService'

describe('progressService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('calculateProgressStats', () => {
    it('should calculate progress statistics correctly', () => {
      const progressLogs = [
        {
          log_date: '2024-01-15',
          weight: 70,
          energy_level: 8,
          adherence_score: 90
        },
        {
          log_date: '2024-01-14',
          weight: 70.5,
          energy_level: 7,
          adherence_score: 85
        },
        {
          log_date: '2024-01-13',
          weight: 71,
          energy_level: 9,
          adherence_score: 95
        }
      ]
      const targetWeight = 68

      const stats = progressService.calculateProgressStats(progressLogs, targetWeight)

      expect(stats.currentWeight).toBe(70)
      expect(stats.weightChange).toBe(-1) // 70 - 71 = -1
      expect(stats.averageEnergyLevel).toBe(8) // (8 + 7 + 9) / 3 = 8
      expect(stats.averageAdherence).toBe(90) // (90 + 85 + 95) / 3 = 90
      expect(stats.trend).toBe('decreasing') // Weight is decreasing
    })

    it('should handle empty progress logs', () => {
      const stats = progressService.calculateProgressStats([])

      expect(stats.currentWeight).toBeNull()
      expect(stats.weightChange).toBe(0)
      expect(stats.averageEnergyLevel).toBe(0)
      expect(stats.averageAdherence).toBe(0)
      expect(stats.progressTowardsGoal).toBe(0)
      expect(stats.trend).toBe('stable')
    })

    it('should calculate progress towards goal correctly', () => {
      const progressLogs = [
        { log_date: '2024-01-15', weight: 69, energy_level: 8, adherence_score: 90 },
        { log_date: '2024-01-10', weight: 72, energy_level: 7, adherence_score: 85 }
      ]
      const targetWeight = 68

      const stats = progressService.calculateProgressStats(progressLogs, targetWeight)

      // Started at 72, now at 69, target is 68
      // Total needed change: |68 - 72| = 4
      // Actual change: |69 - 72| = 3
      // Progress: (3 / 4) * 100 = 75%
      expect(stats.progressTowardsGoal).toBe(75)
    })
  })

  describe('getMockProgressLogs', () => {
    it('should generate mock progress logs', () => {
      const mockLogs = progressService.getMockProgressLogs()

      expect(mockLogs).toBeInstanceOf(Array)
      expect(mockLogs.length).toBe(30)
      
      const firstLog = mockLogs[0]
      expect(firstLog).toHaveProperty('log_id')
      expect(firstLog).toHaveProperty('user_id')
      expect(firstLog).toHaveProperty('log_date')
      expect(firstLog).toHaveProperty('weight')
      expect(firstLog).toHaveProperty('energy_level')
      expect(firstLog).toHaveProperty('adherence_score')
      
      // Check that energy levels are within valid range
      expect(firstLog.energy_level).toBeGreaterThanOrEqual(7)
      expect(firstLog.energy_level).toBeLessThanOrEqual(10)
      
      // Check that adherence scores are within valid range
      expect(firstLog.adherence_score).toBeGreaterThanOrEqual(80)
      expect(firstLog.adherence_score).toBeLessThanOrEqual(100)
    })

    it('should generate logs in chronological order', () => {
      const mockLogs = progressService.getMockProgressLogs()
      
      for (let i = 1; i < mockLogs.length; i++) {
        const currentDate = new Date(mockLogs[i].log_date)
        const previousDate = new Date(mockLogs[i - 1].log_date)
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(previousDate.getTime())
      }
    })
  })

  describe('logProgress', () => {
    it('should log progress successfully with mock data', async () => {
      const userId = 'test-user-id'
      const progressData = {
        weight: 70.5,
        energy_level: 8,
        adherence_score: 90,
        notes: 'Feeling great today!'
      }

      const result = await progressService.logProgress(userId, progressData)

      expect(result).toBeDefined()
      expect(result.user_id).toBe(userId)
      expect(result.weight).toBe(progressData.weight)
      expect(result.energy_level).toBe(progressData.energy_level)
      expect(result.adherence_score).toBe(progressData.adherence_score)
      expect(result.notes).toBe(progressData.notes)
    })
  })
})
