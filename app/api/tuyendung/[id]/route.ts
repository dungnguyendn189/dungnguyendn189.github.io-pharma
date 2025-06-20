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
                {
                    success: false,
                    error: 'ID không hợp lệ'
                },
                { status: 400 }
            )
        }

        // ✅ Check if record exists first
        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tin tuyển dụng'
                },
                { status: 404 }
            )
        }

        // ✅ Update view count and get updated data in one transaction
        const tuyenDung = await prisma.tuyenDung.update({
            where: { id },
            data: {
                luotXem: {
                    increment: 1
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: tuyenDung,
            message: 'Lấy thông tin tuyển dụng thành công'
        })
    } catch (error) {
        console.error('Error fetching tuyen dung:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi tải thông tin tuyển dụng'
            },
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
                {
                    success: false,
                    error: 'ID không hợp lệ'
                },
                { status: 400 }
            )
        }

        // ✅ Check if record exists
        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tin tuyển dụng'
                },
                { status: 404 }
            )
        }

        // ✅ Check duplicate title (exclude current)
        if (data.tieuDe && data.tieuDe.trim() !== existingTuyenDung.tieuDe) {
            const duplicateTuyenDung = await prisma.tuyenDung.findFirst({
                where: {
                    tieuDe: {
                        equals: data.tieuDe.trim(),
                        mode: 'insensitive'
                    },
                    NOT: { id }
                }
            })

            if (duplicateTuyenDung) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Tiêu đề tuyển dụng đã tồn tại'
                    },
                    { status: 400 }
                )
            }
        }

        // ✅ Validate date if provided
        if (data.hanNop) {
            const hanNopDate = new Date(data.hanNop)
            if (isNaN(hanNopDate.getTime())) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Hạn nộp không hợp lệ'
                    },
                    { status: 400 }
                )
            }

            if (hanNopDate <= new Date()) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Hạn nộp phải sau ngày hiện tại'
                    },
                    { status: 400 }
                )
            }
        }

        // ✅ Prepare update data with proper handling
        const updateData: Record<string, unknown> = {}

        // Text fields - trim whitespace
        const textFields = ['tieuDe', 'viTri', 'moTaCongViec', 'yeuCau', 'mucLuong', 'diaDiem']
        textFields.forEach(field => {
            if (data[field]) {
                updateData[field] = data[field].trim()
            }
        })

        // Optional text field
        if (data.quyenLoi !== undefined) {
            updateData.quyenLoi = data.quyenLoi ? data.quyenLoi.trim() : null
        }

        // Select fields
        if (data.loaiHinhLamViec) updateData.loaiHinhLamViec = data.loaiHinhLamViec
        if (data.kinhNghiem) updateData.kinhNghiem = data.kinhNghiem
        if (data.trangThai) updateData.trangThai = data.trangThai

        // Date field
        if (data.hanNop) updateData.hanNop = new Date(data.hanNop)

        // ✅ Image field - add hinhAnh support
        if (data.hinhAnh !== undefined) {
            updateData.hinhAnh = data.hinhAnh
        }

        const tuyenDung = await prisma.tuyenDung.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            data: tuyenDung,
            message: 'Cập nhật tuyển dụng thành công'
        })
    } catch (error) {
        console.error('Error updating tuyen dung:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi cập nhật tuyển dụng'
            },
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
                {
                    success: false,
                    error: 'ID không hợp lệ'
                },
                { status: 400 }
            )
        }

        // ✅ Check if record exists
        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tin tuyển dụng'
                },
                { status: 404 }
            )
        }

        // ✅ Check if job posting has applications (if you have applications table)
        // const applications = await prisma.ungTuyen.count({
        //     where: { tuyenDungId: id }
        // })
        // 
        // if (applications > 0) {
        //     return NextResponse.json(
        //         { 
        //             success: false,
        //             error: 'Không thể xóa tin tuyển dụng đã có người ứng tuyển' 
        //         },
        //         { status: 400 }
        //     )
        // }

        const deletedTuyenDung = await prisma.tuyenDung.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            data: deletedTuyenDung,
            message: 'Xóa tin tuyển dụng thành công'
        })
    } catch (error) {
        console.error('Error deleting tuyen dung:', error)

        // ✅ Handle foreign key constraint errors
        if (error instanceof Error && error.message.includes('Foreign key constraint')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không thể xóa tin tuyển dụng vì có dữ liệu liên quan'
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi xóa tin tuyển dụng'
            },
            { status: 500 }
        )
    }
}

// ✅ PATCH - Chỉ cập nhật lượt xem (không tăng khi admin xem)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)
        const { action } = await request.json()

        if (isNaN(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'ID không hợp lệ'
                },
                { status: 400 }
            )
        }

        if (action === 'view') {
            const tuyenDung = await prisma.tuyenDung.update({
                where: { id },
                data: {
                    luotXem: {
                        increment: 1
                    }
                },
                select: {
                    id: true,
                    luotXem: true
                }
            })

            return NextResponse.json({
                success: true,
                data: tuyenDung,
                message: 'Cập nhật lượt xem thành công'
            })
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Action không hợp lệ'
            },
            { status: 400 }
        )
    } catch (error) {
        console.error('Error updating view count:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi cập nhật lượt xem'
            },
            { status: 500 }
        )
    }
}