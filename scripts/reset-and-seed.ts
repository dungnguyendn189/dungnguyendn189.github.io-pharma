import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAndSeed() {
  try {
    console.log('🗑️ Clearing existing data...')
    
    // Xóa dữ liệu cũ (theo thứ tự để tránh foreign key constraints)
    await prisma.admin.deleteMany()
    await prisma.socialMedia.deleteMany()
    
    console.log('✅ Old data cleared')
    
    console.log('🌱 Creating fresh admin account...')
    
    // Tạo password hash
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Tạo admin mới
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
    console.log('📧 Username: admin')
    console.log('📧 Email: admin@pharma.com')
    console.log('🔐 Password: admin123')
    console.log('👤 Role: admin')

    console.log('📱 Creating social media data...')
    
    // Tạo dữ liệu social media
    const socialMediaData = await prisma.socialMedia.createMany({
      data: [
        {
          tenMangXaHoi: 'Facebook',
          url: 'https://www.facebook.com/DuocphamApharCM',
          icon: '/socialicon/fb.png',
          thuTu: 1,
          trangThai: 'hien_thi',
          taoLuc: new Date(),
          capNhatLuc: new Date()
        },
        {
          tenMangXaHoi: 'Zalo',
          url: 'https://zalo.me/0376640406',
          icon: '/socialicon/zalo.png',
          thuTu: 2,
          trangThai: 'hien_thi',
          taoLuc: new Date(),
          capNhatLuc: new Date()
        },
        {
          tenMangXaHoi: 'Messenger',
          url: 'https://m.me/DuocphamApharCM',
          icon: '/socialicon/messenger.png',
          thuTu: 3,
          trangThai: 'hien_thi',
          taoLuc: new Date(),
          capNhatLuc: new Date()
        },
        {
          tenMangXaHoi: 'apharcm1709@gmail.com',
          url: '',
          icon: '/socialicon/email.png',
          thuTu: 4,
          trangThai: 'hien_thi',
          taoLuc: new Date(),
          capNhatLuc: new Date()
        },
        {
          tenMangXaHoi: 'Phone',
          url: 'tel:0376640406',
          icon: '/socialicon/phone.png',
          thuTu: 5,
          trangThai: 'hien_thi',
          taoLuc: new Date(),
          capNhatLuc: new Date()
        }
      ]
    })

    console.log('✅ Social Media created successfully!')
    console.log(`📊 Total records created: ${socialMediaData.count}`)
    
  } catch (error) {
    console.error('❌ Error resetting and seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAndSeed()
