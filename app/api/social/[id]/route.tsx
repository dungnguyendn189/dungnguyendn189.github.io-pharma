// app/api/social-media/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Lấy social media theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params  // ← AWAIT PARAMS
        const id = parseInt(idParam)

        const socialMedia = await prisma.socialMedia.findUnique({
            where: { id }
        })

        if (!socialMedia) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy social media'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: socialMedia
        })
    } catch (error) {
        console.error('Error fetching social media:', error)
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi lấy thông tin social media'
        }, { status: 500 })
    }
}

// PUT - Cập nhật social media
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params  // ← AWAIT PARAMS
        const id = parseInt(idParam)
        const body = await request.json()
        const { tenMangXaHoi, url, icon, thuTu, trangThai } = body

        // Validation
        if (!tenMangXaHoi || !url || !icon) {
            return NextResponse.json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
            }, { status: 400 })
        }

        const socialMedia = await prisma.socialMedia.update({
            where: { id },
            data: {
                tenMangXaHoi,
                url,
                icon,
                thuTu,
                trangThai
            }
        })

        return NextResponse.json({
            success: true,
            data: socialMedia,
            message: 'Cập nhật social media thành công'
        })
    } catch (error) {
        console.error('Error updating social media:', error)
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi cập nhật social media'
        }, { status: 500 })
    }
}

// DELETE - Xóa social media
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params  // ← AWAIT PARAMS
        const id = parseInt(idParam)

        // Kiểm tra xem social media có tồn tại không
        const existingSocialMedia = await prisma.socialMedia.findUnique({
            where: { id }
        })

        if (!existingSocialMedia) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy social media để xóa'
            }, { status: 404 })
        }

        // Xóa social media
        await prisma.socialMedia.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Xóa social media thành công'
        })
    } catch (error) {
        console.error('Error deleting social media:', error)
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi xóa social media'
        }, { status: 500 })
    }
}