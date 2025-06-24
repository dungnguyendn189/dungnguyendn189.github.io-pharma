import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAdmin() {
  try {
    console.log('🔍 Testing admin account...')
      // Tìm admin user
    const admin = await prisma.admin.findUnique({
      where: { tenDangNhap: 'admin' }
    })
    
    if (!admin) {
      console.log('❌ Admin user not found!')
      return
    }
      console.log('✅ Admin user found:', {
      id: admin.id,
      tenDangNhap: admin.tenDangNhap,
      email: admin.email,
      hoTen: admin.hoTen,
      vaiTro: admin.vaiTro,
      taoLuc: admin.taoLuc
    })
    
    // Test password
    const testPassword = 'admin123'
    const isValidPassword = await bcrypt.compare(testPassword, admin.matKhau)
    
    console.log(`🔐 Password test (${testPassword}):`, isValidPassword ? '✅ Valid' : '❌ Invalid')
    
    if (!isValidPassword) {
      console.log('🔧 Updating admin password...')
      const hashedPassword = await bcrypt.hash(testPassword, 10)
      
      await prisma.admin.update({
        where: { id: admin.id },
        data: { matKhau: hashedPassword }
      })
      
      console.log('✅ Admin password updated successfully!')
    }
    
  } catch (error) {
    console.error('❌ Error testing admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAdmin()
