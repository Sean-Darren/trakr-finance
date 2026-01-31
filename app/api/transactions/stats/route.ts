import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET transaction statistics for the authenticated user
export async function GET(request: Request) {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter: any = {}
    if (startDate) dateFilter.gte = new Date(startDate)
    if (endDate) dateFilter.lte = new Date(endDate)

    const where: any = { userId: userPayload.userId }
    if (startDate || endDate) {
      where.date = dateFilter
    }

    // Get all transactions for the period
    const transactions = await prisma.transaction.findMany({
      where,
    })

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    // Group by category
    const categoryBreakdown: { [key: string]: number } = {}
    transactions.forEach((t) => {
      if (t.type === 'EXPENSE') {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount
      }
    })

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId: userPayload.userId },
      orderBy: { date: 'desc' },
      take: 10,
    })

    return NextResponse.json({
      totalIncome,
      totalExpense,
      netIncome: totalIncome - totalExpense,
      categoryBreakdown,
      recentTransactions,
      transactionCount: transactions.length,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
