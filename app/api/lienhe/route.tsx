import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Lấy danh sách liên hệ
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const loai = searchParams.get('loai')
        const trangThai = searchParams.get('trangThai')

        const skip = (page - 1) * limit

        // Tạo where condition
        const where: Record<string, unknown> = {}
        if (loai) where.loai = loai
        if (trangThai) where.trangThai = trangThai

        const [lienHe, total] = await Promise.all([
            prisma.lienHe.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    taoLuc: 'desc' // Sắp xếp theo thời gian tạo mới nhất
                }
            }),
            prisma.lienHe.count({ where })
        ])

        return NextResponse.json({
            success: true,
            data: lienHe,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching lien he:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi lấy danh sách liên hệ' },
            { status: 500 }
        )
    }
}

// POST - Tạo liên hệ mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { hoTen, soDienThoai, email, noiDung, loai } = body

        // Validation - chỉ cần ten, soDienThoai, email, moTa theo schema
        if (!hoTen || !soDienThoai || !noiDung) {
            return NextResponse.json(
                { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
                { status: 400 }
            )
        }

        // Validate email nếu có
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { success: false, message: 'Email không hợp lệ' },
                    { status: 400 }
                )
            }
        }

        // Validate phone number (simple check for Vietnamese phone)
        const phoneRegex = /^[0-9]{10,11}$/
        if (!phoneRegex.test(soDienThoai.replace(/\s/g, ''))) {
            return NextResponse.json(
                { success: false, message: 'Số điện thoại không hợp lệ' },
                { status: 400 }
            )
        }

        // Tạo liên hệ mới - khớp với schema Prisma
        const newLienHe = await prisma.lienHe.create({
            data: {
                ten: hoTen.trim(), // Dùng field 'ten' thay vì 'hoTen'
                soDienThoai: soDienThoai.trim(),
                email: email ? email.trim().toLowerCase() : null, // email có thể null
                moTa: noiDung.trim(), // Dùng field 'moTa' thay vì 'noiDung'
                loai: loai || 'tu_van', // Default là tư vấn
                trangThai: 'hoat_dong', // Default theo schema
                thuTu: 0 // Default thứ tự
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
            data: newLienHe
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating lien he:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi gửi thông tin liên hệ' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa liên hệ
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID liên hệ là bắt buộc' },
                { status: 400 }
            )
        }

        // Kiểm tra liên hệ có tồn tại không
        const existingLienHe = await prisma.lienHe.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingLienHe) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy thông tin liên hệ' },
                { status: 404 }
            )
        }

        // Xóa liên hệ
        await prisma.lienHe.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            message: 'Xóa thông tin liên hệ thành công'
        })

    } catch (error) {
        console.error('Error deleting lien he:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi xóa thông tin liên hệ' },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật liên hệ
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, trangThai } = body

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'ID liên hệ là bắt buộc' },
                { status: 400 }
            )
        }

        // Kiểm tra liên hệ có tồn tại không
        const existingLienHe = await prisma.lienHe.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingLienHe) {
            return NextResponse.json(
                { success: false, message: 'Không tìm thấy thông tin liên hệ' },
                { status: 404 }
            )
        }

        // Cập nhật liên hệ
        const updatedLienHe = await prisma.lienHe.update({
            where: { id: parseInt(id) },
            data: { trangThai }
        })

        return NextResponse.json({
            success: true,
            message: 'Cập nhật thông tin liên hệ thành công',
            data: updatedLienHe
        })

    } catch (error: unknown) {
        console.error('Error updating lien he:', error)
        return NextResponse.json(
            { success: false, message: 'Lỗi server khi cập nhật thông tin liên hệ' },
            { status: 500 }
        )
    }
}