import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check admin exists
    const admin = await prisma.admin.findUnique({
      where: { tenDangNhap: 'admin' }
    })
    
    console.log('Admin exists:', admin ? 'Yes' : 'No')
    
    if (!admin) {
      return NextResponse.json({
        status: 'error',
        message: 'Admin account not found',
        suggestion: 'Need to run seed script on production database'
      })
    }
      // Count records
    const counts = {
      admin: await prisma.admin.count(),
      socialMedia: await prisma.socialMedia.count(),
      thuoc: await prisma.thuoc.count(),
      tinTuc: await prisma.tinTuc.count(),
      danhMuc: await prisma.danhMuc.count()
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      admin: {
        id: admin.id,
        tenDangNhap: admin.tenDangNhap,
        email: admin.email,
        hoTen: admin.hoTen,
        vaiTro: admin.vaiTro
      },
      counts,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
