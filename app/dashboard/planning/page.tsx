"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Target, AlertTriangle } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
  startDate: string;
  endDate: string;
  alertThreshold: number;
  spent?: number;
  percentage?: number;
  remaining?: number;
  isOverBudget?: boolean;
  nearingLimit?: boolean;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  type: string;
  progress?: number;
  remaining?: number;
}

const categories = [
  "Food",
  "Rent",
  "Entertainment",
  "Transportation",
  "Healthcare",
  "Shopping",
  "Utilities",
  "Other",
];

export default function PlanningPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    amount: "",
    period: "MONTHLY",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    alertThreshold: "0.8",
  });

  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    type: "SHORT_TERM",
  });

  useEffect(() => {
    fetchBudgets();
    fetchGoals();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      const data = await response.json();

      if (response.ok) {
        setBudgets(data.budgets);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not load budgets",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      const data = await response.json();

      if (response.ok) {
        setGoals(data.goals);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not load goals",
        duration: 5000,
      });
    }
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetForm),
      });

      if (response.ok) {
        toast.error("Error", {
          description: "Could not create budget",
          duration: 5000,
        });
        setIsBudgetDialogOpen(false);
        fetchBudgets();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not create budget",
        duration: 5000,
      });
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalForm),
      });

      if (response.ok) {
        toast.success("Success", {
          description: "Goal created successfully",
          duration: 3000,
        });
        setIsGoalDialogOpen(false);
        fetchGoals();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not create goal",
        duration: 5000,
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Deleted", {
          description: "Budget deleted",
          duration: 3000,
        });
        fetchBudgets();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not delete budget",
        duration: 5000,
      });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Deleted", {
          description: "Goal deleted",
          duration: 3000,
        });
        fetchGoals();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not delete goal",
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Planning</h1>
        <p className="text-muted-foreground">
          Manage your budgets and financial goals
        </p>
      </div>

      {/* Budgets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Budgets</h2>
          <Dialog
            open={isBudgetDialogOpen}
            onOpenChange={setIsBudgetDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-green-900 hover:bg-green-950">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
                <DialogDescription>
                  Set spending limits for a category
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={budgetForm.category}
                    onValueChange={(value) =>
                      setBudgetForm({ ...budgetForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={budgetForm.amount}
                    onChange={(e) =>
                      setBudgetForm({ ...budgetForm, amount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Select
                    value={budgetForm.period}
                    onValueChange={(value) =>
                      setBudgetForm({ ...budgetForm, period: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={budgetForm.startDate}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={budgetForm.endDate}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-900 hover:bg-green-950"
                >
                  Create Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => (
            <Card key={budget.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBudget(budget.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
                <CardDescription>
                  {budget.period.toLowerCase()} • $
                  {budget.spent?.toFixed(2) || 0} / ${budget.amount.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={budget.percentage || 0} />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {budget.percentage?.toFixed(1)}% used
                    </span>
                    <span
                      className={
                        budget.isOverBudget ? "text-red-600 font-medium" : ""
                      }
                    >
                      ${budget.remaining?.toFixed(2)} remaining
                    </span>
                  </div>
                  {budget.nearingLimit && !budget.isOverBudget && (
                    <div className="flex items-center gap-2 text-orange-600 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Approaching budget limit
                    </div>
                  )}
                  {budget.isOverBudget && (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Budget exceeded!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Financial Goals</h2>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-900 hover:bg-green-950">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Financial Goal</DialogTitle>
                <DialogDescription>
                  Set a savings or investment goal
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Goal Name</Label>
                  <Input
                    placeholder="e.g., Emergency Fund"
                    value={goalForm.name}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={goalForm.targetAmount}
                    onChange={(e) =>
                      setGoalForm({
                        ...goalForm,
                        targetAmount: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={goalForm.currentAmount}
                    onChange={(e) =>
                      setGoalForm({
                        ...goalForm,
                        currentAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <Select
                    value={goalForm.type}
                    onValueChange={(value) =>
                      setGoalForm({ ...goalForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_TERM">Short-term</SelectItem>
                      <SelectItem value="LONG_TERM">Long-term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline (Optional)</Label>
                  <Input
                    type="date"
                    value={goalForm.deadline}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, deadline: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-900 hover:bg-green-950"
                >
                  Create Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal.id} className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
                <CardDescription>
                  {goal.type === "SHORT_TERM" ? "Short-term" : "Long-term"} goal
                  {goal.deadline &&
                    ` • Due ${new Date(goal.deadline).toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      ${goal.currentAmount.toFixed(2)} / $
                      {goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={goal.progress || 0} />
                  <div className="text-sm text-muted-foreground">
                    {goal.progress?.toFixed(1)}% complete • $
                    {goal.remaining?.toFixed(2)} to go
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
