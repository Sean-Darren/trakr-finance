import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all budgets for the authenticated user
export async function GET() {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: userPayload.userId },
      orderBy: { createdAt: 'desc' },
    })

    // Get spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await prisma.transaction.findMany({
          where: {
            userId: userPayload.userId,
            category: budget.category,
            type: 'EXPENSE',
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        })

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
        const percentage = (spent / budget.amount) * 100
        const remaining = budget.amount - spent
        const isOverBudget = spent > budget.amount
        const nearingLimit =
          budget.alertThreshold && percentage >= budget.alertThreshold * 100

        return {
          ...budget,
          spent,
          percentage,
          remaining,
          isOverBudget,
          nearingLimit,
        }
      })
    )

    return NextResponse.json({ budgets: budgetsWithSpending })
  } catch (error) {
    console.error('Get budgets error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create a new budget
export async function POST(request: Request) {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category, amount, period, startDate, endDate, alertThreshold } =
      await request.json()

    // Validate required fields
    if (!category || !amount || !period || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const budget = await prisma.budget.create({
      data: {
        userId: userPayload.userId,
        category,
        amount: parseFloat(amount),
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        alertThreshold: alertThreshold ? parseFloat(alertThreshold) : 0.8,
      },
    })

    return NextResponse.json({ budget }, { status: 201 })
  } catch (error) {
    console.error('Create budget error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
