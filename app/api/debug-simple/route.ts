import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Prisma connection step by step
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$connect()
    const adminCount = await prisma.admin.count()
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      adminCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
