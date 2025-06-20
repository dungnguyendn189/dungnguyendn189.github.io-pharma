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
    console.log('📱 Seeding social media data...')
    // Kiểm tra social media đã tồn tại chưa
    const existingSocial = await prisma.socialMedia.findMany()

    if (existingSocial.length === 0) {
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
        console.log('📘 Facebook: https://www.facebook.com/DuocphamApharCM')
        console.log('💬 Zalo: https://zalo.me/0376640406')
        console.log('📧 Messenger: https://m.me/DuocphamApharCM')
        console.log('📞 Phone: tel:0376640406')
        console.log('✉️ Email: mailto:admin@pharma.com')
        console.log(`📊 Total records created: ${socialMediaData.count}`)
    } else {
        console.log('ℹ️ Social media data already exists, skipping...')
        console.log(`📊 Found ${existingSocial.length} existing records`)
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