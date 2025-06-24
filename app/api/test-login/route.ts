import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenDangNhap, matKhau } = body
    
    console.log('=== DEBUG LOGIN TEST ===')
    console.log('Username:', tenDangNhap)
    console.log('Password:', matKhau)
    
    // Tìm admin
    const admin = await prisma.admin.findUnique({
      where: { tenDangNhap }
    })
    
    console.log('Admin found:', admin ? 'YES' : 'NO')
    
    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin not found',
        debug: {
          searchedUsername: tenDangNhap,
          adminExists: false
        }
      })
    }
    
    console.log('Admin data:', {
      id: admin.id,
      tenDangNhap: admin.tenDangNhap,
      email: admin.email,
      passwordLength: admin.matKhau.length,
      passwordStart: admin.matKhau.substring(0, 10)
    })
    
    // Test password với bcrypt
    const isValidPassword = await bcrypt.compare(matKhau, admin.matKhau)
    console.log('Password valid:', isValidPassword)
    
    // Test password trực tiếp (để debug)
    const directMatch = matKhau === admin.matKhau
    console.log('Direct password match:', directMatch)
      return NextResponse.json({
      success: isValidPassword,
      debug: {
        adminFound: true,
        adminId: admin.id,
        adminUsername: admin.tenDangNhap,
        passwordLength: admin.matKhau.length,
        bcryptValid: isValidPassword,
        directMatch: directMatch,
        inputPassword: matKhau,
        storedPasswordPreview: admin.matKhau.substring(0, 20) + '...'
      },
      admin: isValidPassword ? {
        id: admin.id,
        tenDangNhap: admin.tenDangNhap,
        hoTen: admin.hoTen,
        email: admin.email,
        vaiTro: admin.vaiTro
      } : null
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('❌ Login test error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debug: {
        errorType: error instanceof Error ? error.constructor.name : typeof error
      }
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Lấy tất cả admin để debug
    const admins = await prisma.admin.findMany()
    
    return NextResponse.json({
      success: true,
      totalAdmins: admins.length,
      admins: admins.map(admin => ({
        id: admin.id,
        tenDangNhap: admin.tenDangNhap,
        email: admin.email,
        hoTen: admin.hoTen,
        vaiTro: admin.vaiTro,
        passwordLength: admin.matKhau.length,
        passwordPreview: admin.matKhau.substring(0, 10) + '...',
        createdAt: admin.taoLuc
      }))
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
