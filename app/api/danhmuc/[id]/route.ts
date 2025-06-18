import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy chi tiết một danh mục
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params  // ← AWAIT PARAMS
        const id = parseInt(idParam)

        const danhMuc = await prisma.danhMuc.findUnique({
            where: { id },
            include: {
                thuoc: {
                    select: {
                        id: true,
                        tenThuoc: true,
                        trangThai: true
                    }
                },
                _count: {
                    select: {
                        thuoc: true
                    }
                }
            }
        })

        if (!danhMuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy danh mục' },
                { status: 404 }
            )
        }

        return NextResponse.json({ danhMuc })
    } catch (error) {
        console.error('Error fetching danh muc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải thông tin danh mục' },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật danh mục
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params  // ← AWAIT PARAMS
        const id = parseInt(idParam)
        const data = await request.json()

        // Kiểm tra danh mục có tồn tại không
        const existingDanhMuc = await prisma.danhMuc.findUnique({
            where: { id }
        })

        if (!existingDanhMuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy danh mục' },
                { status: 404 }
            )
        }

        // Kiểm tra tên danh mục đã tồn tại chưa (trừ chính nó)
        const duplicateDanhMuc = await prisma.danhMuc.findFirst({
            where: {
                tenDanhMuc: {
                    equals: data.tenDanhMuc,
                    mode: 'insensitive'
                },
                NOT: {
                    id: id
                }
            }
        })

        if (duplicateDanhMuc) {
            return NextResponse.json(
                { error: 'Tên danh mục đã tồn tại' },
                { status: 400 }
            )
        }

        const danhMuc = await prisma.danhMuc.update({
            where: { id },
            data: {
                tenDanhMuc: data.tenDanhMuc,
                moTa: data.moTa || null,
                icon: data.icon || null,
                mauSac: data.mauSac || null,
                thuTu: data.thuTu || 0,
                trangThai: data.trangThai || 'hoat_dong'
            }
        })

        return NextResponse.json({ danhMuc })
    } catch (error) {
        console.error('Error updating danh muc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật danh mục' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa danh mục
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        // Kiểm tra danh mục có tồn tại không
        const existingDanhMuc = await prisma.danhMuc.findUnique({
            where: { id }
        })

        if (!existingDanhMuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy danh mục' },
                { status: 404 }
            )
        }

        // Kiểm tra xem có thuốc nào đang sử dụng danh mục này không
        const thuocCount = await prisma.thuoc.count({
            where: { danhMucId: id }
        })

        if (thuocCount > 0) {
            return NextResponse.json(
                { error: `Không thể xóa danh mục này vì có ${thuocCount} thuốc đang sử dụng. Vui lòng di chuyển hoặc xóa các thuốc trước.` },
                { status: 400 }
            )
        }

        await prisma.danhMuc.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Xóa danh mục thành công' })
    } catch (error) {
        console.error('Error deleting danh muc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi xóa danh mục' },
            { status: 500 }
        )
    }
}