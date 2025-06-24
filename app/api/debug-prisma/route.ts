import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== PRISMA DEBUG ===')
    
    // Import Prisma dynamically to catch import errors
    const { PrismaClient } = await import('@prisma/client')
    console.log('✅ Prisma imported successfully')
    
    const prisma = new PrismaClient()
    console.log('✅ Prisma client created')
    
    // Test raw query first
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Raw query successful')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Prisma connected')
    
    // Count admin records
    const adminCount = await prisma.admin.count()
    console.log('✅ Admin count:', adminCount)
    
    await prisma.$disconnect()
    console.log('✅ Prisma disconnected')
    
    return NextResponse.json({
      status: 'success',
      message: 'Prisma debug successful',
      adminCount,
      timestamp: new Date().toISOString()
    })
      } catch (error) {
    console.error('=== PRISMA DEBUG ERROR ===', error)
      const errorDetails: { [key: string]: string | null } = {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? (error.stack || null) : null
    }
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        errorDetails.type = 'CONNECTION_ERROR'
      } else if (error.message.includes('timeout')) {
        errorDetails.type = 'TIMEOUT_ERROR'
      } else if (error.message.includes('authentication')) {
        errorDetails.type = 'AUTH_ERROR'
      } else if (error.message.includes('schema')) {
        errorDetails.type = 'SCHEMA_ERROR'
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Prisma debug failed',
      error: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
