# Trakr Finance - Personal Finance Management

A full-stack personal finance management application.

### Core Features
- 🔐 **Secure Authentication**: JWT tokens stored in HTTP-only cookies with bcrypt password hashing and session management
- 📊 **Smart Transaction Management**: Log, categorize, and filter income/expenses with custom categories, payment methods, dates, and recurring transaction support
- 🎯 **Adaptive Budgeting**: Create time-bound budgets (weekly/monthly) with real-time progress bars, overspend alerts, and category-wise analytics
- 📈 **Investment Portfolio Tracker**: Monitor holdings with live profit/loss calculations, allocation charts, performance trends, and diversification insights
- 🚀 **Goal Tracker**: Visualize progress toward short/long-term goals (e.g., emergency fund, vacation) with milestone tracking and completion forecasts
- 🤖 **AI Financial Advisor**: Context-aware chat interface delivering personalized advice on spending patterns, savings strategies, and debt reduction

### Dashboard Pages
- **Home Dashboard**: Overview of income, expenses, savings goals, and recent activity
- **Transactions**: Full transaction management with filtering and search
- **Financial Planning**: Budget creation and goal tracking
- **Investment Portfolio**: Stock tracking with visual charts
- **AI Advisor**: Chat interface for personalized financial guidance

## Tech Stack
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: shadcn/ui, Recharts for data visualization
- **Styling**: TailwindCSS

## Database Schema

The application uses the following main models:
- **User**: User accounts with authentication
- **Transaction**: Income and expense records
- **Budget**: Budget limits per category
- **Investment**: Stock portfolio tracking
- **Goal**: Financial goals (short-term and long-term)

## API Routes

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Transactions
- GET /api/transactions - Get all transactions
- POST /api/transactions - Create transaction
- PUT /api/transactions/[id] - Update transaction
- DELETE /api/transactions/[id] - Delete transaction
- GET /api/transactions/stats - Get transaction statistics

### Budgets
- GET /api/budgets - Get all budgets with spending data
- POST /api/budgets - Create budget
- PUT /api/budgets/[id] - Update budget
- DELETE /api/budgets/[id] - Delete budget

### Investments
- GET /api/investments - Get all investments with portfolio summary
- POST /api/investments - Add investment
- PUT /api/investments/[id] - Update investment
- DELETE /api/investments/[id] - Delete investment

### Goals
- \`GET /api/goals\` - Get all goals
- \`POST /api/goals\` - Create goal
- \`PUT /api/goals/[id]\` - Update goal
- \`DELETE /api/goals/[id]\` - Delete goal
