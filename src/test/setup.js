import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_OPENAI_API_KEY: 'test-openai-key',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
    VITE_APP_URL: 'http://localhost:5173'
  }
}))

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: null,
  createTablesSQL: 'CREATE TABLE test;'
}))

// Mock OpenAI
vi.mock('../lib/openai', () => ({
  generateMealPlan: vi.fn().mockResolvedValue({
    breakfast: { name: 'Test Breakfast', calories: 400 },
    lunch: { name: 'Test Lunch', calories: 500 },
    dinner: { name: 'Test Dinner', calories: 450 },
    snacks: [{ name: 'Test Snack', calories: 150 }]
  }),
  generateRecipeInstructions: vi.fn().mockResolvedValue({
    ingredients: ['Test ingredient'],
    instructions: ['Test instruction'],
    prepTime: 15,
    cookTime: 20,
    difficulty: 'Easy',
    nutritionInfo: { calories: 400, protein: 20, carbs: 30, fat: 15 }
  })
}))

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    redirectToCheckout: vi.fn().mockResolvedValue({ error: null })
  })
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
