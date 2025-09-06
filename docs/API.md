# NourishAI API Documentation

This document outlines the API integrations and service layer architecture for the NourishAI application.

## 🏗️ Service Architecture

The application uses a service-oriented architecture with the following layers:

```
Frontend (React) → Services → External APIs
                 ↓
              UserContext
```

## 🔐 Authentication Service

### `authService`

Handles user authentication and profile management using Supabase Auth.

#### Methods

##### `signUp(email, password, userData)`
Creates a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password
- `userData` (object): Additional user profile data

**Returns:**
```javascript
{
  data: { user: UserObject },
  error: null | ErrorObject
}
```

##### `signIn(email, password)`
Authenticates an existing user.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password

**Returns:**
```javascript
{
  data: { user: UserObject },
  error: null | ErrorObject
}
```

##### `signOut()`
Signs out the current user.

**Returns:**
```javascript
{
  error: null | ErrorObject
}
```

##### `getCurrentUser()`
Gets the currently authenticated user.

**Returns:**
```javascript
UserObject | null
```

##### `updateUserProfile(userId, updates)`
Updates user profile information.

**Parameters:**
- `userId` (string): User's unique identifier
- `updates` (object): Profile updates

**Returns:**
```javascript
UserObject | null
```

## 🍽️ Meal Plan Service

### `mealPlanService`

Manages AI-powered meal plan generation and storage.

#### Methods

##### `generateMealPlan(userId, userProfile, targetDate)`
Generates a personalized meal plan using AI.

**Parameters:**
- `userId` (string): User's unique identifier
- `userProfile` (object): User's dietary preferences and restrictions
- `targetDate` (Date): Target date for the meal plan

**Returns:**
```javascript
{
  success: boolean,
  data: MealPlanObject | null,
  error: string | null
}
```

##### `getMealPlan(userId, date)`
Retrieves a meal plan for a specific date.

**Parameters:**
- `userId` (string): User's unique identifier
- `date` (Date): Target date

**Returns:**
```javascript
MealPlanObject | null
```

##### `getMealPlans(userId, startDate, endDate)`
Retrieves meal plans for a date range.

**Parameters:**
- `userId` (string): User's unique identifier
- `startDate` (Date): Start date of range
- `endDate` (Date): End date of range

**Returns:**
```javascript
MealPlanObject[]
```

##### `getRecipeDetails(mealName, dietaryRestrictions)`
Gets detailed recipe instructions for a meal.

**Parameters:**
- `mealName` (string): Name of the meal
- `dietaryRestrictions` (array): List of dietary restrictions

**Returns:**
```javascript
{
  success: boolean,
  data: RecipeObject | null,
  error: string | null
}
```

##### `markMealCompleted(planId, mealType, completed)`
Marks a meal as completed or skipped.

**Parameters:**
- `planId` (string): Meal plan identifier
- `mealType` (string): Type of meal (breakfast, lunch, dinner)
- `completed` (boolean): Completion status

**Returns:**
```javascript
{
  success: boolean,
  data: MealPlanObject | null,
  error: string | null
}
```

## 📊 Progress Service

### `progressService`

Handles progress tracking and analytics.

#### Methods

##### `logProgress(userId, progressData)`
Logs a new progress entry.

**Parameters:**
- `userId` (string): User's unique identifier
- `progressData` (object): Progress data including weight, energy, adherence

**Returns:**
```javascript
ProgressLogObject
```

##### `getProgressLogs(userId, limit)`
Retrieves progress logs for a user.

**Parameters:**
- `userId` (string): User's unique identifier
- `limit` (number): Maximum number of logs to return

**Returns:**
```javascript
ProgressLogObject[]
```

##### `getProgressLogsInRange(userId, startDate, endDate)`
Retrieves progress logs within a date range.

**Parameters:**
- `userId` (string): User's unique identifier
- `startDate` (Date): Start date of range
- `endDate` (Date): End date of range

**Returns:**
```javascript
ProgressLogObject[]
```

##### `calculateProgressStats(progressLogs, targetWeight)`
Calculates progress statistics from logs.

**Parameters:**
- `progressLogs` (array): Array of progress log objects
- `targetWeight` (number): User's target weight

**Returns:**
```javascript
{
  currentWeight: number | null,
  weightChange: number,
  averageEnergyLevel: number,
  averageAdherence: number,
  progressTowardsGoal: number,
  trend: 'increasing' | 'decreasing' | 'stable'
}
```

##### `getWeeklyProgressSummary(userId, weeks)`
Gets a weekly summary of progress data.

**Parameters:**
- `userId` (string): User's unique identifier
- `weeks` (number): Number of weeks to include

**Returns:**
```javascript
WeeklyProgressObject[]
```

## 💳 Stripe Service

### `stripeService`

Handles subscription management and payments.

#### Methods

##### `createSubscriptionCheckout(tier, userId)`
Creates a Stripe checkout session for subscription.

**Parameters:**
- `tier` (string): Subscription tier (basic, premium, pro)
- `userId` (string): User's unique identifier

**Returns:**
```javascript
{
  success: boolean,
  sessionId: string,
  url: string,
  error?: string
}
```

##### `getSubscriptionStatus(userId)`
Gets the current subscription status.

**Parameters:**
- `userId` (string): User's unique identifier

**Returns:**
```javascript
{
  active: boolean,
  tier: string,
  currentPeriodEnd: Date | null,
  cancelAtPeriodEnd: boolean
}
```

##### `cancelSubscription(subscriptionId)`
Cancels a subscription.

**Parameters:**
- `subscriptionId` (string): Stripe subscription ID

**Returns:**
```javascript
{
  success: boolean,
  message?: string,
  error?: string
}
```

##### `updateSubscription(subscriptionId, newPriceId)`
Updates a subscription to a different tier.

**Parameters:**
- `subscriptionId` (string): Stripe subscription ID
- `newPriceId` (string): New Stripe price ID

**Returns:**
```javascript
{
  success: boolean,
  message?: string,
  error?: string
}
```

##### `getPricingPlans()`
Gets available pricing plans.

**Returns:**
```javascript
PricingPlanObject[]
```

## 🤖 OpenAI Integration

### AI Meal Plan Generation

The application uses OpenAI's GPT-3.5-turbo model to generate personalized meal plans.

#### Prompt Structure

```javascript
const prompt = `Create a personalized daily meal plan for ${targetDate} with the following requirements:

Health Goals: ${healthGoals.join(', ')}
Dietary Preferences: ${dietaryPreferences.join(', ')}
Allergies: ${allergies.join(', ')}
Disliked Ingredients: ${dislikedIngredients.join(', ')}
Available Cooking Time: ${cookingTime}
Cooking Skill Level: ${skillLevel}

Respond with JSON in this exact format: { ... }`
```

#### Response Format

```javascript
{
  "breakfast": {
    "name": "Meal Name",
    "description": "Brief description",
    "prepTime": 15,
    "calories": 400,
    "protein": 20,
    "carbs": 30,
    "fat": 15,
    "difficulty": "Easy"
  },
  "lunch": { ... },
  "dinner": { ... },
  "snacks": [{ ... }]
}
```

### Recipe Generation

Detailed recipe instructions are generated using a separate OpenAI call.

#### Recipe Response Format

```javascript
{
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "prepTime": 15,
  "cookTime": 20,
  "difficulty": "Easy|Medium|Hard",
  "nutritionInfo": {
    "calories": 400,
    "protein": 25,
    "carbs": 30,
    "fat": 15
  }
}
```

## 🗄️ Database Schema

### Supabase Tables

#### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  health_goals TEXT[] DEFAULT '{}',
  dietary_preferences TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  disliked_ingredients TEXT[] DEFAULT '{}',
  cooking_time_availability VARCHAR(50),
  cooking_skill_level VARCHAR(50),
  subscription_tier VARCHAR(50) DEFAULT 'basic',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Meal Plans Table
```sql
CREATE TABLE meal_plans (
  plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  meals JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Progress Logs Table
```sql
CREATE TABLE progress_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight DECIMAL(5,2),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  adherence_score INTEGER CHECK (adherence_score >= 0 AND adherence_score <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📝 Data Models

### UserObject
```javascript
{
  id: string,
  email: string,
  name?: string,
  healthGoals: string[],
  dietaryPreferences: string[],
  allergies: string[],
  dislikedIngredients: string[],
  cookingTime: string,
  skillLevel: string,
  subscriptionTier: string,
  subscriptionExpiresAt: Date,
  progress?: ProgressObject
}
```

### MealPlanObject
```javascript
{
  plan_id: string,
  user_id: string,
  plan_date: string,
  meals: {
    breakfast: MealObject,
    lunch: MealObject,
    dinner: MealObject,
    snacks: MealObject[]
  },
  created_at: string
}
```

### MealObject
```javascript
{
  name: string,
  description: string,
  prepTime: number,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  difficulty: string,
  completed?: boolean
}
```

### ProgressLogObject
```javascript
{
  log_id: string,
  user_id: string,
  log_date: string,
  weight: number,
  energy_level: number,
  adherence_score: number,
  notes: string,
  created_at: string
}
```

### RecipeObject
```javascript
{
  ingredients: string[],
  instructions: string[],
  prepTime: number,
  cookTime: number,
  difficulty: string,
  nutritionInfo: {
    calories: number,
    protein: number,
    carbs: number,
    fat: number
  }
}
```

### PricingPlanObject
```javascript
{
  id: string,
  name: string,
  price: number,
  interval: string,
  features: string[],
  priceId: string,
  popular: boolean
}
```

## 🔧 Configuration

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_URL=http://localhost:5173
```

## 🚨 Error Handling

All services implement consistent error handling:

```javascript
try {
  const result = await serviceMethod()
  return { success: true, data: result, error: null }
} catch (error) {
  console.error('Service error:', error)
  return { success: false, data: null, error: error.message }
}
```

## 🔒 Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Authentication**: All API calls require valid user authentication
3. **Data Validation**: Input validation on both client and server
4. **Rate Limiting**: Implement rate limiting for AI API calls
5. **HTTPS**: All production traffic must use HTTPS

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **API Performance**
   - Response times
   - Error rates
   - Success rates

2. **AI Usage**
   - OpenAI API calls
   - Token usage
   - Cost per user

3. **User Engagement**
   - Meal plan generation frequency
   - Progress logging frequency
   - Feature usage patterns

4. **Business Metrics**
   - Subscription conversion rates
   - Churn rates
   - Revenue per user

## 🧪 Testing

### Service Testing

Each service should have comprehensive tests:

```javascript
// Example test structure
describe('mealPlanService', () => {
  test('generateMealPlan returns valid meal plan', async () => {
    const result = await mealPlanService.generateMealPlan(userId, userProfile)
    expect(result.success).toBe(true)
    expect(result.data).toHaveProperty('meals')
  })
})
```

### Mock Data

All services include mock data fallbacks for development and testing.

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database Migration**: Run database schema creation scripts
3. **API Limits**: Configure appropriate rate limits
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backup**: Configure database backups
6. **CDN**: Use CDN for static assets

---

For more information, see the main [README.md](../README.md) file.
