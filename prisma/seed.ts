/* eslint-disable @typescript-eslint/no-unused-vars */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            OR: [
                { tenDangNhap: 'admin' },
                { email: 'admin@pharma.com' }
            ]
        }
    })

    if (!existingAdmin) {
        // Hash password 123456

        // Tạo admin mặc định
        const admin = await prisma.admin.create({
            data: {
                tenDangNhap: 'admin',
                matKhau: '123456',
                email: 'admin@pharma.com',
                hoTen: 'Administrator',
                vaiTro: 'admin',
                trangThai: 'hoat_dong'
            }
        })

        console.log('✅ Admin created successfully!')
        console.log('📧 Username: admin')
        console.log('📧 Email: admin@pharma.com')
        console.log('🔐 Password: 123456')
        console.log('👤 Role: admin')
    } else {
        console.log('ℹ️ Admin already exists, skipping...')
    }


}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })