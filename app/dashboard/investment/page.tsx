"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  purchaseDate: string;
  totalCost: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface Portfolio {
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function InvestmentPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    quantity: "",
    buyPrice: "",
    currentPrice: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await fetch("/api/investments");
      const data = await response.json();

      if (response.ok) {
        setInvestments(data.investments);
        setPortfolio(data.portfolio);
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not load investments",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/investments/${editingId}`
        : "/api/investments";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Success", {
          description: `Investment ${editingId ? "updated" : "added"} successfully`,
          duration: 3000,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchInvestments();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not save investment",
        duration: 5000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Deleted", {
          description: "Investment deleted successfully",
          duration: 3000,
        });
        fetchInvestments();
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not delete investment",
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: "",
      name: "",
      quantity: "",
      buyPrice: "",
      currentPrice: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
  };

  const handleEdit = (investment: Investment) => {
    setFormData({
      symbol: investment.symbol,
      name: investment.name,
      quantity: String(investment.quantity),
      buyPrice: String(investment.buyPrice),
      currentPrice: String(investment.currentPrice),
      purchaseDate: new Date(investment.purchaseDate)
        .toISOString()
        .split("T")[0],
    });
    setEditingId(investment.id);
    setIsDialogOpen(true);
  };

  const chartData = investments.map((inv) => ({
    name: inv.symbol,
    value: inv.currentValue,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investment Portfolio</h1>
          <p className="text-muted-foreground">
            Track your stock investments and performance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-green-900 hover:bg-green-950"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Investment" : "Add New Investment"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update investment details"
                  : "Add a stock to your portfolio"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Stock Symbol</Label>
                <Input
                  placeholder="e.g., AAPL"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      symbol: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="e.g., Apple Inc."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity (Shares)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Buy Price (per share)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.buyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, buyPrice: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Current Price (per share)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.currentPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPrice: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-900 hover:bg-green-950"
              >
                {editingId ? "Update" : "Add"} Investment
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio.totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${portfolio.totalCost.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profit/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  portfolio.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {portfolio.profitLoss >= 0 ? "+" : ""}$
                {portfolio.profitLoss.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold flex items-center gap-1 ${
                  portfolio.profitLossPercentage >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {portfolio.profitLossPercentage >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {portfolio.profitLossPercentage >= 0 ? "+" : ""}
                {portfolio.profitLossPercentage.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portfolio Allocation Chart */}
        {investments.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Portfolio Allocation
              </CardTitle>
              <CardDescription>Distribution by investment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      value != null ? `$${Number(value).toFixed(2)}` : "N/A"
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Holdings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>All investments in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading...
              </p>
            ) : investments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No investments yet. Add your first investment!
              </p>
            ) : (
              <div className="space-y-3">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{investment.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {investment.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {investment.quantity} shares @ $
                        {investment.buyPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${investment.currentValue.toFixed(2)}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          investment.profitLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {investment.profitLoss >= 0 ? "+" : ""}$
                        {investment.profitLoss.toFixed(2)} (
                        {investment.profitLossPercentage.toFixed(2)}%)
                      </div>
                      <div className="flex gap-1 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(investment)}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(investment.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
