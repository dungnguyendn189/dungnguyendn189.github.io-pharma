import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function createAdmin() {
    const matKhauMaHoa = await bcrypt.hash('admin123', 10)

    await prisma.admin.create({
        data: {
            tenDangNhap: 'admin',
            matKhau: matKhauMaHoa,
            email: 'admin@eqpharma.com',
            hoTen: 'Quản trị viên',
            vaiTro: 'super_admin'
        }
    })

    console.log('✅ Đã tạo admin thành công!')
    console.log('📧 Tên đăng nhập: admin')
    console.log('🔑 Mật khẩu: admin123')
}

createAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect())