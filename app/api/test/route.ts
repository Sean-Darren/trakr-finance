import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test connection first
    await prisma.$connect()
    
    // Query users
    const users = await prisma.user.findMany()
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      count: users.length,
      users 
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Ensure disconnect even on error
    await prisma.$disconnect().catch(() => {})
    
    return NextResponse.json(
      { 
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}