import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy chi tiết tin tức
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
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
        await prisma.tinTuc.update({
            where: { id },
            data: {
                luotXem: {
                    increment: 1
                }
            }
        })

        const tinTuc = await prisma.tinTuc.findUnique({
            where: { id }
        })

        if (!tinTuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tức' },
                { status: 404 }
            )
        }

        return NextResponse.json({ tinTuc })
    } catch (error) {
        console.error('Error fetching tin tuc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải thông tin tin tức' },
            { status: 500 }
        )
    }
}

// PUT - Cập nhật tin tức
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const data = await request.json()

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        const existingTinTuc = await prisma.tinTuc.findUnique({
            where: { id }
        })

        if (!existingTinTuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tức' },
                { status: 404 }
            )
        }

        // Check duplicate title (exclude current tin tuc)
        if (data.tieuDe) {
            const duplicateTinTuc = await prisma.tinTuc.findFirst({
                where: {
                    tieuDe: {
                        equals: data.tieuDe,
                        mode: 'insensitive'
                    },
                    NOT: {
                        id: id
                    }
                }
            })

            if (duplicateTinTuc) {
                return NextResponse.json(
                    { error: 'Tiêu đề tin tức đã tồn tại' },
                    { status: 400 }
                )
            }
        }

        const tinTuc = await prisma.tinTuc.update({
            where: { id },
            data: {
                ...(data.tieuDe && { tieuDe: data.tieuDe }),
                ...(data.tomTat !== undefined && { tomTat: data.tomTat || null }),
                ...(data.noiDung && { noiDung: data.noiDung }),
                ...(data.hinhAnh !== undefined && { hinhAnh: data.hinhAnh || null }),
                ...(data.tacGia && { tacGia: data.tacGia }),
                ...(data.trangThai && { trangThai: data.trangThai }),
                ...(data.tags !== undefined && { tags: data.tags || null })
            }
        })

        return NextResponse.json({ tinTuc })
    } catch (error) {
        console.error('Error updating tin tuc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi cập nhật tin tức' },
            { status: 500 }
        )
    }
}

// DELETE - Xóa tin tức
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'ID không hợp lệ' },
                { status: 400 }
            )
        }

        const existingTinTuc = await prisma.tinTuc.findUnique({
            where: { id }
        })

        if (!existingTinTuc) {
            return NextResponse.json(
                { error: 'Không tìm thấy tin tức' },
                { status: 404 }
            )
        }

        await prisma.tinTuc.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Xóa tin tức thành công' })
    } catch (error) {
        console.error('Error deleting tin tuc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi xóa tin tức' },
            { status: 500 }
        )
    }
}