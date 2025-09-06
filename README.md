# NourishAI - AI-Powered Personalized Nutrition Coach

NourishAI is a subscription-based platform that offers personalized diet plans tailored to individuals' health goals, preferences, allergies, and lifestyle using AI.

## 🌟 Features

### Core Features
- **AI-Driven Meal Recommendations**: Generates daily and weekly meal suggestions tailored to user's specific health goals, dietary preferences, and time availability
- **Allergy & Preference Filtering**: Ensures all meal plans exclude specified allergens, disliked ingredients, and dietary restrictions
- **Time-Saving Recipe Generation**: Creates recipes with estimated preparation times that match user's availability and cooking skill level
- **Progress Tracking & Adjustments**: Allows users to log progress and dynamically adjusts future meal recommendations

### Business Model
- **Tiered Subscription**: Basic ($15/month), Premium ($25/month), Pro ($40/month)
- **Recurring Revenue**: Continuous AI model improvement and content updates
- **Value-Based Pricing**: Aligns with personalized health guidance value

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for database and authentication)
- OpenAI API key (for AI meal recommendations)
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-2187.git
   cd -app-development-2187
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
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

4. **Database Setup**
   
   Create the following tables in your Supabase database:
   
   ```sql
   -- Users table
   CREATE TABLE IF NOT EXISTS users (
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

   -- Meal Plans table
   CREATE TABLE IF NOT EXISTS meal_plans (
     plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
     plan_date DATE NOT NULL,
     meals JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Progress Logs table
   CREATE TABLE IF NOT EXISTS progress_logs (
     log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
     log_date DATE NOT NULL,
     weight DECIMAL(5,2),
     energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
     adherence_score INTEGER CHECK (adherence_score >= 0 AND adherence_score <= 100),
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON meal_plans(user_id, plan_date);
   CREATE INDEX IF NOT EXISTS idx_progress_logs_user_date ON progress_logs(user_id, log_date);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-3.5-turbo
- **Payments**: Stripe

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (UserContext)
├── lib/               # External service configurations
├── pages/             # Page components
├── services/          # API service layers
└── main.jsx          # App entry point
```

### Key Services
- **authService**: User authentication and profile management
- **mealPlanService**: AI meal plan generation and storage
- **progressService**: Progress tracking and analytics
- **stripeService**: Subscription and payment processing

## 🎨 Design System

### Color Palette
- **Background**: `hsl(200, 30%, 98%)`
- **Primary**: `hsl(195, 70%, 40%)`
- **Accent**: `hsl(45, 90%, 50%)`
- **Surface**: `hsl(200, 30%, 100%)`
- **Text Primary**: `hsl(200, 30%, 10%)`
- **Text Secondary**: `hsl(200, 30%, 30%)`

### Typography
- **Display**: `font-sans text-5xl font-bold leading-[1.1]`
- **Heading 1**: `font-sans text-3xl font-semibold`
- **Heading 2**: `font-sans text-2xl font-semibold`
- **Body**: `font-sans text-base leading-7`
- **Caption**: `font-sans text-sm font-light`

### Layout
- **Grid**: 12-column fluid with 24px gutter
- **Container**: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- **Spacing**: sm(8px), md(12px), lg(20px), xl(24px)
- **Radius**: sm(6px), md(10px), lg(16px)

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database schema from the installation steps
3. Configure Row Level Security (RLS) policies
4. Get your project URL and anon key

### OpenAI Setup
1. Create an OpenAI account
2. Generate an API key
3. Add it to your environment variables
4. Monitor usage and set billing limits

### Stripe Setup
1. Create a Stripe account
2. Set up your products and pricing
3. Get your publishable key
4. Configure webhooks for subscription events

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Make sure to set all environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_APP_URL`

## 📱 User Flows

### Onboarding Flow
1. User signs up with email/password
2. Completes profile questionnaire (health goals, preferences, allergies)
3. Selects subscription tier
4. Completes payment via Stripe
5. Receives welcome message and initial meal plan

### Daily Usage Flow
1. User logs in and views daily meal plan
2. Clicks on meals to view recipe details
3. Marks meals as completed or skipped
4. Logs progress (weight, energy, adherence)

### Progress Tracking Flow
1. User navigates to Progress section
2. Logs current metrics
3. Views progress charts and analytics
4. AI adjusts future meal plans based on progress

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Database**: Row Level Security (RLS) policies
- **API Keys**: Environment variables only
- **Payments**: Stripe handles all sensitive payment data
- **HTTPS**: Required for all production deployments

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Unit tests for services
- Integration tests for user flows
- E2E tests for critical paths

## 📊 Analytics & Monitoring

### Key Metrics
- User acquisition and retention
- Subscription conversion rates
- Meal plan engagement
- Progress tracking adherence
- AI recommendation accuracy

### Monitoring
- Error tracking with Sentry
- Performance monitoring
- API usage tracking
- Database performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@nourishai.com or join our Discord community.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core meal planning functionality
- ✅ User authentication and profiles
- ✅ Progress tracking
- ✅ Subscription management

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Nutritionist consultation integration
- [ ] Advanced analytics dashboard
- [ ] Social features and meal sharing

### Phase 3 (Future)
- [ ] Grocery list integration
- [ ] Meal delivery partnerships
- [ ] Wearable device integration
- [ ] Multi-language support

---

Built with ❤️ by the NourishAI team
