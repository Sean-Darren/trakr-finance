"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  PieChart,
  Plus,
} from "lucide-react";
import TextPressure from "@/components/TextPressure";

//Example Data
const mockData = {
  user: { name: "Sean Darren" },
  totalIncome: 8500,
  totalOutcome: 6200,
  monthlyChange: { income: 12, outcome: -8 },
  savingsGoal: { current: 2300, target: 5000 },
  recentTransactions: [
    {
      id: 1,
      type: "income",
      amount: 3500,
      description: "Salary",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "outcome",
      amount: -120,
      description: "Groceries",
      date: "2024-01-14",
    },
    {
      id: 3,
      type: "outcome",
      amount: -80,
      description: "Gas",
      date: "2024-01-13",
    },
  ],
};

export default function DashboardPage() {
  const netIncome = mockData.totalIncome - mockData.totalOutcome;
  const savingsProgress =
    (mockData.savingsGoal.current / mockData.savingsGoal.target) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">
          Hi {mockData.user.name}! Welcome to Trakr
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's your financial overview
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockData.totalIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />+
              {mockData.monthlyChange.income}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockData.totalOutcome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              {mockData.monthlyChange.outcome}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Income
            </CardTitle>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${netIncome.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Available for savings
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Goal
            </CardTitle>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockData.savingsGoal.current.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              of ${mockData.savingsGoal.target.toLocaleString()} goal
            </div>
            <Progress
              value={savingsProgress}
              autoPlay
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Financial Planning Quick View */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Financial Planning
            </CardTitle>
            <CardDescription>
              Track your short-term and long-term financial goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Short-term Goals</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Emergency Fund</span>
                    <span className="text-sm font-medium">$2,300 / $5,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Vacation Fund</span>
                    <span className="text-sm font-medium">$800 / $2,000</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Long-term Goals</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">House Down Payment</span>
                    <span className="text-sm font-medium">
                      $15,000 / $50,000
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Retirement Fund</span>
                    <span className="text-sm font-medium">
                      $25,000 / $100,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </CardContent>
        </Card>

        {/* Investment Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Investment Portfolio
            </CardTitle>
            <CardDescription>
              Your current investment performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12.5%</div>
              <div className="text-sm text-muted-foreground">Total Return</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">AAPL</span>
                <span className="text-sm font-medium text-green-600">
                  +8.2%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">GOOGL</span>
                <span className="text-sm font-medium text-green-600">
                  +15.1%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">TSLA</span>
                <span className="text-sm font-medium text-red-600">-3.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">MSFT</span>
                <span className="text-sm font-medium text-green-600">
                  +11.7%
                </span>
              </div>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              View Full Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest income and expense activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.date}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : ""}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-transparent" variant="outline">
            View All Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
