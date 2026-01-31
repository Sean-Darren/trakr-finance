import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT update an investment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { symbol, name, quantity, buyPrice, currentPrice, purchaseDate } =
      await request.json()

    // Check if investment exists and belongs to user
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        id,
        userId: userPayload.userId,
      },
    })

    if (!existingInvestment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      )
    }

    const investment = await prisma.investment.update({
      where: { id },
      data: {
        ...(symbol && { symbol: symbol.toUpperCase() }),
        ...(name && { name }),
        ...(quantity && { quantity: parseFloat(quantity) }),
        ...(buyPrice && { buyPrice: parseFloat(buyPrice) }),
        ...(currentPrice !== undefined && { currentPrice: parseFloat(currentPrice) }),
        ...(purchaseDate && { purchaseDate: new Date(purchaseDate) }),
      },
    })

    return NextResponse.json({ investment })
  } catch (error) {
    console.error('Update investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE an investment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userPayload = await getUserFromToken()
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if investment exists and belongs to user
    const existingInvestment = await prisma.investment.findFirst({
      where: {
        id,
        userId: userPayload.userId,
      },
    })

    if (!existingInvestment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      )
    }

    await prisma.investment.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Investment deleted successfully' })
  } catch (error) {
    console.error('Delete investment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
