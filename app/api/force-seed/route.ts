import { NextResponse } from 'next/server'
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

export async function POST() {
  try {
    console.log('🌱 Force seeding production database...')
    
    // Xóa admin cũ nếu có
    await prisma.admin.deleteMany({
      where: { tenDangNhap: 'admin' }
    })
    
    console.log('🗑️ Old admin deleted')
    
    // Tạo password hash
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Tạo admin mới với bcrypt hash
    const admin = await prisma.admin.create({
      data: {
        tenDangNhap: 'admin',
        matKhau: hashedPassword,
        email: 'admin@pharma.com',
        hoTen: 'Administrator',
        vaiTro: 'admin',
        trangThai: 'hoat_dong'
      }
    })

    console.log('✅ Admin created with hashed password!')
    
    // Kiểm tra social media
    const socialCount = await prisma.socialMedia.count()
    if (socialCount === 0) {
      await prisma.socialMedia.createMany({
        data: [
          {
            tenMangXaHoi: 'Facebook',
            url: 'https://www.facebook.com/DuocphamApharCM',
            icon: '/socialicon/fb.png',
            thuTu: 1,
            trangThai: 'hien_thi'
          },
          {
            tenMangXaHoi: 'Zalo',
            url: 'https://zalo.me/0376640406',
            icon: '/socialicon/zalo.png',
            thuTu: 2,
            trangThai: 'hien_thi'
          },
          {
            tenMangXaHoi: 'Messenger',
            url: 'https://m.me/DuocphamApharCM',
            icon: '/socialicon/messenger.png',
            thuTu: 3,
            trangThai: 'hien_thi'
          },
          {
            tenMangXaHoi: 'Email',
            url: 'mailto:apharcm1709@gmail.com',
            icon: '/socialicon/email.png',
            thuTu: 4,
            trangThai: 'hien_thi'
          },
          {
            tenMangXaHoi: 'Phone',
            url: 'tel:0376640406',
            icon: '/socialicon/phone.png',
            thuTu: 5,
            trangThai: 'hien_thi'
          }
        ]
      })
      console.log('✅ Social media created!')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully!',
      admin: {
        id: admin.id,
        tenDangNhap: admin.tenDangNhap,
        email: admin.email,
        hoTen: admin.hoTen,
        vaiTro: admin.vaiTro
      },
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('❌ Error seeding production:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500, headers: corsHeaders })
  }
}
