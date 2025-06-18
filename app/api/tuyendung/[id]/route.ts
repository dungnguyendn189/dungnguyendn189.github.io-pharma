import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy chi tiết tuyển dụng + tăng lượt xem
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        // Update view count
        await prisma.tuyenDung.update({
            where: { id },
            data: {
                luotXem: {
                    increment: 1
                }
            }
        })

        const tuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!tuyenDung) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tuyển dụng' },
                { status: 404 }
            )
        }

        return NextResponse.json({ tuyenDung })
    } catch (error) {
        console.error('Error fetching tuyen dung:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải thông tin tuyển dụng' },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật tuyển dụng
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)
        const data = await request.json()

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tuyển dụng' },
                { status: 404 }
            )
        }

        // Check duplicate title (exclude current)
        if (data.tieuDe) {
            const duplicateTuyenDung = await prisma.tuyenDung.findFirst({
                where: {
                    tieuDe: {
                        equals: data.tieuDe,
                        mode: 'insensitive'
                    },
                    NOT: { id }
                }
            })

            if (duplicateTuyenDung) {
                return NextResponse.json(
                    { error: 'Tiêu đề tuyển dụng đã tồn tại' },
                    { status: 400 }
                )
            }
        }

        const tuyenDung = await prisma.tuyenDung.update({
            where: { id },
            data: {
                ...(data.tieuDe && { tieuDe: data.tieuDe }),
                ...(data.viTri && { viTri: data.viTri }),
                ...(data.moTaCongViec && { moTaCongViec: data.moTaCongViec }),
                ...(data.yeuCau && { yeuCau: data.yeuCau }),
                ...(data.quyenLoi !== undefined && { quyenLoi: data.quyenLoi || null }),
                ...(data.mucLuong && { mucLuong: data.mucLuong }),
                ...(data.diaDiem && { diaDiem: data.diaDiem }),
                ...(data.loaiHinhLamViec && { loaiHinhLamViec: data.loaiHinhLamViec }),
                ...(data.kinhNghiem && { kinhNghiem: data.kinhNghiem }),
                ...(data.hanNop && { hanNop: new Date(data.hanNop) }),
                ...(data.trangThai && { trangThai: data.trangThai })
            }
        })

        return NextResponse.json({ tuyenDung })
    } catch (error) {
        console.error('Error updating tuyen dung:', error)
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật tuyển dụng' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa tuyển dụng
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tuyển dụng' },
                { status: 404 }
            )
        }

        await prisma.tuyenDung.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Xóa tin tuyển dụng thành công' })
    } catch (error) {
        console.error('Error deleting tuyen dung:', error)
        return NextResponse.json(
            { error: 'Lỗi khi xóa tin tuyển dụng' },
            { status: 500 }
        )
    }
}