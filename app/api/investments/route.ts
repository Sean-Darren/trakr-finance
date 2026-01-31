import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all investments for the authenticated user
export async function GET() {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const investments = await prisma.investment.findMany({
      where: { userId: userPayload.userId },
      orderBy: { purchaseDate: 'desc' },
    })

    // Calculate profit/loss for each investment
    const investmentsWithStats = investments.map((investment) => {
      const currentPrice = investment.currentPrice || investment.buyPrice
      const totalCost = investment.buyPrice * investment.quantity
      const currentValue = currentPrice * investment.quantity
      const profitLoss = currentValue - totalCost
      const profitLossPercentage = ((profitLoss / totalCost) * 100).toFixed(2)

      return {
        ...investment,
        totalCost,
        currentValue,
        profitLoss,
        profitLossPercentage: parseFloat(profitLossPercentage),
      }
    })

    // Calculate portfolio summary
    const portfolioValue = investmentsWithStats.reduce(
      (sum, inv) => sum + inv.currentValue,
      0
    )
    const portfolioCost = investmentsWithStats.reduce(
      (sum, inv) => sum + inv.totalCost,
      0
    )
    const portfolioProfitLoss = portfolioValue - portfolioCost
    const portfolioProfitLossPercentage =
      portfolioCost > 0
        ? ((portfolioProfitLoss / portfolioCost) * 100).toFixed(2)
        : '0.00'

    return NextResponse.json({
      investments: investmentsWithStats,
      portfolio: {
        totalValue: portfolioValue,
        totalCost: portfolioCost,
        profitLoss: portfolioProfitLoss,
        profitLossPercentage: parseFloat(portfolioProfitLossPercentage),
      },
    })
  } catch (error) {
    console.error('Get investments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create a new investment
export async function POST(request: Request) {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { symbol, name, quantity, buyPrice, currentPrice, purchaseDate } =
      await request.json()

    // Validate required fields
    if (!symbol || !name || !quantity || !buyPrice || !purchaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const investment = await prisma.investment.create({
      data: {
        userId: userPayload.userId,
        symbol: symbol.toUpperCase(),
        name,
        quantity: parseFloat(quantity),
        buyPrice: parseFloat(buyPrice),
        currentPrice: currentPrice ? parseFloat(currentPrice) : parseFloat(buyPrice),
        purchaseDate: new Date(purchaseDate),
      },
    })

    return NextResponse.json({ investment }, { status: 201 })
  } catch (error) {
    console.error('Create investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
