# NourishAI Deployment Guide

This guide covers the complete deployment process for the NourishAI application, from development to production.

## 🏗️ Architecture Overview

```
Frontend (React/Vite) → CDN (Vercel/Netlify)
                     ↓
Backend Services:
├── Supabase (Database + Auth)
├── OpenAI API (AI Meal Plans)
└── Stripe (Payments)
```

## 🚀 Quick Deployment (Vercel)

### Prerequisites
- GitHub repository with your code
- Vercel account
- All required API keys and credentials

### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel --prod
   ```

2. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   Vercel will automatically build and deploy your application.

## 🔧 Detailed Setup Guide

### 1. Supabase Configuration

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Database Setup
Run this SQL in the Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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

-- Row Level Security Policies
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Meal plans policies
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Progress logs policies
CREATE POLICY "Users can view own progress logs" ON progress_logs
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own progress logs" ON progress_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress logs" ON progress_logs
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own progress logs" ON progress_logs
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
```

#### Authentication Configuration
1. Go to Authentication → Settings
2. Configure email templates
3. Set up OAuth providers (optional)
4. Configure redirect URLs

### 2. OpenAI Setup

#### API Key Generation
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Set usage limits and billing alerts
4. Add key to environment variables

#### Usage Monitoring
```javascript
// Add to your OpenAI service
const trackUsage = (tokens, cost) => {
  // Log to your analytics service
  console.log(`OpenAI usage: ${tokens} tokens, $${cost}`)
}
```

### 3. Stripe Configuration

#### Account Setup
1. Create Stripe account
2. Complete business verification
3. Set up tax settings

#### Product Configuration
Create these products in Stripe Dashboard:

```javascript
// Basic Plan
{
  name: "NourishAI Basic",
  description: "Personalized meal plans and basic features",
  price: "$15/month",
  features: [
    "Personalized meal plans",
    "Basic recipe suggestions", 
    "Progress tracking",
    "Email support"
  ]
}

// Premium Plan  
{
  name: "NourishAI Premium",
  description: "Advanced AI recommendations and progress analysis",
  price: "$25/month",
  features: [
    "Everything in Basic",
    "Advanced AI recommendations",
    "Weekly progress analysis", 
    "Meal plan adjustments",
    "Priority support"
  ]
}

// Pro Plan
{
  name: "NourishAI Pro", 
  description: "Full access with nutritionist consultation",
  price: "$40/month",
  features: [
    "Everything in Premium",
    "Direct nutritionist consultation",
    "Custom dietary protocols",
    "Advanced analytics",
    "24/7 chat support"
  ]
}
```

#### Webhook Configuration
Set up webhooks for these events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### 4. Domain and SSL

#### Custom Domain (Vercel)
1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate is automatic

#### DNS Configuration
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.61
```

## 🌍 Environment-Specific Configurations

### Development
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_URL=http://localhost:5173
```

### Staging
```env
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_URL=https://staging.nourishai.com
```

### Production
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_APP_URL=https://nourishai.com
```

## 📊 Monitoring and Analytics

### Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/lib/sentry.js
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

### Performance Monitoring
```javascript
// src/lib/analytics.js
export const trackEvent = (eventName, properties) => {
  // Google Analytics, Mixpanel, etc.
  gtag('event', eventName, properties)
}

export const trackPageView = (path) => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: path
  })
}
```

### Health Checks
```javascript
// src/lib/healthCheck.js
export const healthCheck = async () => {
  const checks = {
    supabase: false,
    openai: false,
    stripe: false
  }

  try {
    // Test Supabase connection
    const { data } = await supabase.from('users').select('count').limit(1)
    checks.supabase = !!data
  } catch (error) {
    console.error('Supabase health check failed:', error)
  }

  // Add other service checks...
  
  return checks
}
```

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] All API keys are in environment variables
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced in production
- [ ] Row Level Security enabled in Supabase
- [ ] Input validation on all forms
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Content Security Policy headers set

### Post-Deployment Security
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Monitoring for suspicious activity
- [ ] Backup and recovery procedures
- [ ] Incident response plan

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
          VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Performance Optimization

### Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes for different devices

### Caching Strategy
```javascript
// Service Worker for caching
const CACHE_NAME = 'nourishai-v1'
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})
```

## 🔄 Database Migrations

### Migration Scripts
```sql
-- migrations/001_initial_schema.sql
-- (Include the initial schema from above)

-- migrations/002_add_user_preferences.sql
ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{}';

-- migrations/003_add_meal_ratings.sql
ALTER TABLE meal_plans ADD COLUMN user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5);
```

### Migration Runner
```javascript
// scripts/migrate.js
import { supabase } from '../src/lib/supabase.js'
import fs from 'fs'
import path from 'path'

const runMigrations = async () => {
  const migrationsDir = './migrations'
  const files = fs.readdirSync(migrationsDir).sort()
  
  for (const file of files) {
    if (file.endsWith('.sql')) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      console.log(`Running migration: ${file}`)
      
      const { error } = await supabase.rpc('exec_sql', { sql })
      if (error) {
        console.error(`Migration ${file} failed:`, error)
        process.exit(1)
      }
    }
  }
  
  console.log('All migrations completed successfully')
}

runMigrations()
```

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

#### Environment Variable Issues
```javascript
// Debug environment variables
console.log('Environment check:', {
  supabase: !!import.meta.env.VITE_SUPABASE_URL,
  openai: !!import.meta.env.VITE_OPENAI_API_KEY,
  stripe: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
})
```

#### Database Connection Issues
```javascript
// Test Supabase connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) throw error
    console.log('Database connection successful')
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}
```

### Rollback Procedures
```bash
# Rollback to previous Vercel deployment
vercel rollback [deployment-url]

# Rollback database migration
# (Implement based on your migration strategy)
```

## 📋 Post-Deployment Checklist

### Functional Testing
- [ ] User registration works
- [ ] User login works
- [ ] Meal plan generation works
- [ ] Progress tracking works
- [ ] Subscription flow works
- [ ] All pages load correctly
- [ ] Mobile responsiveness works

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Images load quickly
- [ ] No console errors

### Security Testing
- [ ] HTTPS enforced
- [ ] No sensitive data exposed
- [ ] Authentication required for protected routes
- [ ] Rate limiting working

### Monitoring Setup
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring enabled
- [ ] Alert notifications configured

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews
- Database cleanup and optimization

### Backup Strategy
- Daily database backups
- Weekly full system backups
- Monthly backup restoration tests

### Incident Response
1. Identify and assess the issue
2. Implement immediate fixes
3. Communicate with users
4. Conduct post-incident review
5. Update procedures

---

For additional support, contact the development team or refer to the [API Documentation](./API.md).
