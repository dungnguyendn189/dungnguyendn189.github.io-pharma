import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Lấy danh sách đại lý phân phối
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const trangThai = searchParams.get('trangThai')
        const noiDungDangKy = searchParams.get('noiDungDangKy')
        const tinhThanhPho = searchParams.get('tinhThanhPho')
        const search = searchParams.get('search') // Thêm search

        const skip = (page - 1) * limit

        // Tạo where condition
        const where: Record<string, unknown> = {}
        if (trangThai) where.trangThai = trangThai
        if (noiDungDangKy) where.noiDungDangKy = noiDungDangKy
        if (tinhThanhPho) where.tinhThanhPho = tinhThanhPho

        // Search theo hoTen, email, soDienThoai
        if (search) {
            where.OR = [
                { hoTen: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { soDienThoai: { contains: search } }
            ]
        }

        const [daiLy, total] = await Promise.all([
            prisma.daiLyPhanPhoi.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    taoLuc: 'desc' // Sắp xếp theo thời gian tạo mới nhất
                }
            }),
            prisma.daiLyPhanPhoi.count({ where })
        ])

        return NextResponse.json({
            success: true,
            data: daiLy,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching dai ly phan phoi:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi lấy danh sách đại lý phân phối' },
            { status: 500 }
        )
    }
}

// POST - Tạo đại lý phân phối mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            hoTen,
            email,
            soDienThoai,
            noiDungDangKy,
            diaChi,
            tinhThanhPho,
            quanHuyen,
            phuongXa,
            loiNhan
        } = body

        // Validation - các trường bắt buộc theo schema
        if (!hoTen || !email || !soDienThoai || !noiDungDangKy || !diaChi || !tinhThanhPho || !quanHuyen || !phuongXa) {
            return NextResponse.json(
                { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            )
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Email không hợp lệ' },
                { status: 400 }
            )
        }

        // Validate phone number (Vietnamese phone)
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(soDienThoai.replace(/\s/g, ''))) {
            return NextResponse.json(
                { success: false, message: 'Số điện thoại không hợp lệ' },
                { status: 400 }
            )
        }

        // Kiểm tra email đã tồn tại
        const existingEmail = await prisma.daiLyPhanPhoi.findFirst({
            where: { email: email.toLowerCase() }
        })

        if (existingEmail) {
            return NextResponse.json(
                { success: false, message: 'Email này đã được đăng ký' },
                { status: 400 }
            )
        }

        // Kiểm tra số điện thoại đã tồn tại
        const existingPhone = await prisma.daiLyPhanPhoi.findFirst({
            where: { soDienThoai: soDienThoai.trim() }
        })

        if (existingPhone) {
            return NextResponse.json(
                { success: false, message: 'Số điện thoại này đã được đăng ký' },
                { status: 400 }
            )
        }

        // Tạo đại lý phân phối mới - khớp với schema Prisma
        const newDaiLy = await prisma.daiLyPhanPhoi.create({
            data: {
                hoTen: hoTen.trim(),
                email: email.trim().toLowerCase(),
                soDienThoai: soDienThoai.trim(),
                noiDungDangKy,
                diaChi: diaChi.trim(),
                tinhThanhPho: tinhThanhPho.trim(),
                quanHuyen: quanHuyen.trim(),
                phuongXa: phuongXa.trim(),
                loiNhan: loiNhan?.trim() || null, // Optional field
                trangThai: 'cho_duyet' // Default theo schema
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Đăng ký đại lý phân phối thành công! Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.',
            data: newDaiLy
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating dai ly phan phoi:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi đăng ký đại lý phân phối' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa đại lý phân phối
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID đại lý phân phối là bắt buộc' },
                { status: 400 }
            )
        }

        // Kiểm tra đại lý có tồn tại không
        const existingDaiLy = await prisma.daiLyPhanPhoi.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingDaiLy) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy thông tin đại lý phân phối' },
                { status: 404 }
            )
        }

        // Xóa đại lý
        await prisma.daiLyPhanPhoi.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'Xóa thông tin đại lý phân phối thành công'
        })

    } catch (error) {
        console.error('Error deleting dai ly phan phoi:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi xóa thông tin đại lý phân phối' },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật đại lý phân phối (chủ yếu cho admin duyệt/từ chối)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, trangThai, ghiChu } = body

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID đại lý phân phối là bắt buộc' },
                { status: 400 }
            )
        }

        // Validate trạng thái
        const validStates = ['cho_duyet', 'da_duyet', 'tu_choi']
        if (trangThai && !validStates.includes(trangThai)) {
            return NextResponse.json(
                { success: false, message: 'Trạng thái không hợp lệ' },
                { status: 400 }
            )
        }

        // Kiểm tra đại lý có tồn tại không
        const existingDaiLy = await prisma.daiLyPhanPhoi.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingDaiLy) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy thông tin đại lý phân phối' },
                { status: 404 }
            )
        }

        // Chuẩn bị data để update
        const dataToUpdate: Record<string, unknown> = {}
        if (trangThai) dataToUpdate.trangThai = trangThai
        if (ghiChu !== undefined) dataToUpdate.ghiChu = ghiChu

        // Cập nhật đại lý
        const updatedDaiLy = await prisma.daiLyPhanPhoi.update({
            where: { id: parseInt(id) },
            data: dataToUpdate
        })

        return NextResponse.json({
            success: true,
            message: 'Cập nhật thông tin đại lý phân phối thành công',
            data: updatedDaiLy
        })

    } catch (error: unknown) {
        console.error('Error updating dai ly phan phoi:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi cập nhật thông tin đại lý phân phối' },
            { status: 500 }
        )
    }
}