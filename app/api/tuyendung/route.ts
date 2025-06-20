import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy danh sách tuyển dụng
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const trangThai = searchParams.get('trangThai')
        const diaDiem = searchParams.get('diaDiem')
        const loaiHinhLamViec = searchParams.get('loaiHinhLamViec')
        const kinhNghiem = searchParams.get('kinhNghiem')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const whereClause: Record<string, unknown> = {}

        // Filter by status
        if (trangThai && trangThai !== 'all') {
            whereClause.trangThai = trangThai
        }

        // Filter by location
        if (diaDiem && diaDiem !== 'all') {
            whereClause.diaDiem = {
                contains: diaDiem,
                mode: 'insensitive'
            }
        }

        // Filter by work type
        if (loaiHinhLamViec && loaiHinhLamViec !== 'all') {
            whereClause.loaiHinhLamViec = loaiHinhLamViec
        }

        // Filter by experience
        if (kinhNghiem && kinhNghiem !== 'all') {
            whereClause.kinhNghiem = kinhNghiem
        }

        // Search by title, position, description
        if (search) {
            whereClause.OR = [
                {
                    tieuDe: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    viTri: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    moTaCongViec: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    yeuCau: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        const skip = (page - 1) * limit
        const totalCount = await prisma.tuyenDung.count({ where: whereClause })
        const totalPages = Math.ceil(totalCount / limit)

        const tuyenDungs = await prisma.tuyenDung.findMany({
            where: whereClause,
            orderBy: { taoLuc: 'desc' },
            skip,
            take: limit,
            select: {
                id: true,
                tieuDe: true,
                viTri: true,
                moTaCongViec: true,
                yeuCau: true,
                quyenLoi: true,
                mucLuong: true,
                diaDiem: true,
                loaiHinhLamViec: true,
                kinhNghiem: true,
                hanNop: true,
                hinhAnh: true, // ✅ Thêm field hinhAnh
                trangThai: true,
                luotXem: true, // ✅ Thêm field luotXem  
                taoLuc: true,
                capNhatLuc: true
            }
        })

        return NextResponse.json({
            success: true,
            data: tuyenDungs, // ✅ Wrap trong data
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })
    } catch (error) {
        console.error('Error fetching tuyen dungs:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi tải danh sách tuyển dụng'
            },
            { status: 500 }
        )
    }
}

// POST - Thêm tuyển dụng mới
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // ✅ Validate required fields đầy đủ
        const requiredFields = [
            'tieuDe', 'viTri', 'moTaCongViec', 'yeuCau',
            'mucLuong', 'diaDiem', 'loaiHinhLamViec',
            'kinhNghiem', 'hanNop'
        ]

        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Thiếu thông tin bắt buộc: ${field}`
                    },
                    { status: 400 }
                )
            }
        }

        // ✅ Validate date
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

        // ✅ Check date in future
        if (hanNopDate <= new Date()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Hạn nộp phải sau ngày hiện tại'
                },
                { status: 400 }
            )
        }

        // Check duplicate title
        const existingTuyenDung = await prisma.tuyenDung.findFirst({
            where: {
                tieuDe: {
                    equals: data.tieuDe,
                    mode: 'insensitive'
                }
            }
        })

        if (existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tiêu đề tuyển dụng đã tồn tại'
                },
                { status: 400 }
            )
        }

        // ✅ Create với đầy đủ fields
        const tuyenDung = await prisma.tuyenDung.create({
            data: {
                tieuDe: data.tieuDe.trim(),
                viTri: data.viTri.trim(),
                moTaCongViec: data.moTaCongViec.trim(),
                yeuCau: data.yeuCau.trim(),
                quyenLoi: data.quyenLoi?.trim() || null,
                mucLuong: data.mucLuong.trim(),
                diaDiem: data.diaDiem.trim(),
                loaiHinhLamViec: data.loaiHinhLamViec,
                kinhNghiem: data.kinhNghiem,
                hanNop: hanNopDate,
                hinhAnh: data.hinhAnh || null, // ✅ Thêm hinhAnh
                trangThai: data.trangThai || 'dang_tuyen',
                luotXem: 0 // ✅ Default luotXem = 0
            }
        })

        return NextResponse.json({
            success: true,
            data: tuyenDung,
            message: 'Thêm tuyển dụng thành công'
        })
    } catch (error) {
        console.error('Error creating tuyen dung:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi thêm tuyển dụng'
            },
            { status: 500 }
        )
    }
}

// ✅ PUT - Cập nhật tuyển dụng
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const { id, ...updateData } = data

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Thiếu ID tuyển dụng'
                },
                { status: 400 }
            )
        }

        // Check if exists
        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tuyển dụng'
                },
                { status: 404 }
            )
        }

        // Validate date if provided
        if (updateData.hanNop) {
            const hanNopDate = new Date(updateData.hanNop)
            if (isNaN(hanNopDate.getTime())) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Hạn nộp không hợp lệ'
                    },
                    { status: 400 }
                )
            }
            updateData.hanNop = hanNopDate
        }

        // Trim text fields
        const textFields = ['tieuDe', 'viTri', 'moTaCongViec', 'yeuCau', 'quyenLoi', 'mucLuong', 'diaDiem']
        textFields.forEach(field => {
            if (updateData[field]) {
                updateData[field] = updateData[field].trim()
            }
        })

        const updatedTuyenDung = await prisma.tuyenDung.update({
            where: { id: parseInt(id) },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            data: updatedTuyenDung,
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

// ✅ DELETE - Xóa tuyển dụng
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Thiếu ID tuyển dụng'
                },
                { status: 400 }
            )
        }

        // Check if exists
        const existingTuyenDung = await prisma.tuyenDung.findUnique({
            where: { id: parseInt(id) }
        })

        if (!existingTuyenDung) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy tuyển dụng'
                },
                { status: 404 }
            )
        }

        const deletedTuyenDung = await prisma.tuyenDung.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            data: deletedTuyenDung,
            message: 'Xóa tuyển dụng thành công'
        })
    } catch (error) {
        console.error('Error deleting tuyen dung:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi khi xóa tuyển dụng'
            },
            { status: 500 }
        )
    }
}