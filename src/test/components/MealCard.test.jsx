import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MealCard } from '../../components/MealCard'

describe('MealCard', () => {
  const mockMeal = {
    name: 'Grilled Chicken Salad',
    description: 'Fresh mixed greens with grilled chicken breast',
    prepTime: 20,
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 18,
    difficulty: 'Easy',
    completed: false
  }

  it('renders meal information correctly', () => {
    render(<MealCard meal={mockMeal} />)

    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument()
    expect(screen.getByText('Fresh mixed greens with grilled chicken breast')).toBeInTheDocument()
    expect(screen.getByText('20 min')).toBeInTheDocument()
    expect(screen.getByText('350 cal')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('shows nutrition information', () => {
    render(<MealCard meal={mockMeal} />)

    expect(screen.getByText('30g protein')).toBeInTheDocument()
    expect(screen.getByText('15g carbs')).toBeInTheDocument()
    expect(screen.getByText('18g fat')).toBeInTheDocument()
  })

  it('calls onComplete when complete button is clicked', () => {
    const mockOnComplete = vi.fn()
    render(<MealCard meal={mockMeal} onComplete={mockOnComplete} />)

    const completeButton = screen.getByRole('button', { name: /mark as completed/i })
    fireEvent.click(completeButton)

    expect(mockOnComplete).toHaveBeenCalledWith(true)
  })

  it('calls onViewRecipe when view recipe button is clicked', () => {
    const mockOnViewRecipe = vi.fn()
    render(<MealCard meal={mockMeal} onViewRecipe={mockOnViewRecipe} />)

    const viewRecipeButton = screen.getByRole('button', { name: /view recipe/i })
    fireEvent.click(viewRecipeButton)

    expect(mockOnViewRecipe).toHaveBeenCalled()
  })

  it('shows completed state correctly', () => {
    const completedMeal = { ...mockMeal, completed: true }
    render(<MealCard meal={completedMeal} />)

    expect(screen.getByText('✓ Completed')).toBeInTheDocument()
  })

  it('handles missing optional props gracefully', () => {
    render(<MealCard meal={mockMeal} />)

    // Should render without crashing even without onComplete and onViewRecipe
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument()
  })

  it('applies correct difficulty styling', () => {
    const { rerender } = render(<MealCard meal={{ ...mockMeal, difficulty: 'Easy' }} />)
    expect(screen.getByText('Easy')).toHaveClass('bg-green-100', 'text-green-800')

    rerender(<MealCard meal={{ ...mockMeal, difficulty: 'Medium' }} />)
    expect(screen.getByText('Medium')).toHaveClass('bg-yellow-100', 'text-yellow-800')

    rerender(<MealCard meal={{ ...mockMeal, difficulty: 'Hard' }} />)
    expect(screen.getByText('Hard')).toHaveClass('bg-red-100', 'text-red-800')
  })

  it('renders with image variant correctly', () => {
    render(<MealCard meal={mockMeal} variant="withImage" />)

    // Should have image placeholder or actual image
    const imageElement = screen.getByRole('img', { name: /grilled chicken salad/i })
    expect(imageElement).toBeInTheDocument()
  })

  it('renders in compact variant correctly', () => {
    render(<MealCard meal={mockMeal} variant="compact" />)

    // In compact mode, some details might be hidden
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument()
    expect(screen.getByText('350 cal')).toBeInTheDocument()
  })
})
