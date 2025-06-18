import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy danh sách thuốc
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const danhMucId = searchParams.get('danhMucId')
        const search = searchParams.get('search')
        const trangThai = searchParams.get('trangThai')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const whereClause: Record<string, unknown> = {}

        // Filter by category
        if (danhMucId && danhMucId !== 'all') {
            whereClause.danhMucId = parseInt(danhMucId)
        }

        // Filter by status
        if (trangThai && trangThai !== 'all') {
            whereClause.trangThai = trangThai
        }

        // Search by name, manufacturer, origin
        if (search) {
            whereClause.OR = [
                {
                    tenThuoc: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    hangSanXuat: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    xuatXu: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalCount = await prisma.thuoc.count({
            where: whereClause
        })

        const totalPages = Math.ceil(totalCount / limit)

        const thuocs = await prisma.thuoc.findMany({
            where: whereClause,
            include: {
                danhMuc: {
                    select: {
                        id: true,
                        tenDanhMuc: true,
                        icon: true,
                        mauSac: true
                    }
                }
            },
            orderBy: {
                taoLuc: 'desc'
            },
            skip,
            take: limit
        })

        return NextResponse.json({
            thuocs,
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
        console.error('Error fetching thuocs:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải danh sách thuốc' },
            { status: 500 }
        )
    }
}

// POST - Thêm thuốc mới
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields
        if (!data.tenThuoc || !data.soLuong || !data.danhMucId || !data.hangSanXuat || !data.xuatXu) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc: tên thuốc, số lượng, danh mục, hãng sản xuất, xuất xứ' },
                { status: 400 }
            )
        }

        // Validate price and quantity
        if (data.gia && data.gia <= 0) {
            return NextResponse.json(
                { error: 'Giá phải lớn hơn 0' },
                { status: 400 }
            )
        }

        if (data.soLuong < 0) {
            return NextResponse.json(
                { error: 'Số lượng không được âm' },
                { status: 400 }
            )
        }

        // Check if danhMuc exists
        const danhMuc = await prisma.danhMuc.findUnique({
            where: { id: parseInt(data.danhMucId) }
        })

        if (!danhMuc) {
            return NextResponse.json(
                { error: 'Danh mục không tồn tại' },
                { status: 400 }
            )
        }

        // Check duplicate name
        const existingThuoc = await prisma.thuoc.findFirst({
            where: {
                tenThuoc: {
                    equals: data.tenThuoc,
                    mode: 'insensitive'
                }
            }
        })

        if (existingThuoc) {
            return NextResponse.json(
                { error: 'Tên thuốc đã tồn tại' },
                { status: 400 }
            )
        }

        const thuoc = await prisma.thuoc.create({
            data: {
                tenThuoc: data.tenThuoc,
                moTa: data.moTa || null,
                gia: data.gia ? parseFloat(data.gia) : 0,
                soLuong: parseInt(data.soLuong),
                danhMucId: parseInt(data.danhMucId),
                hangSanXuat: data.hangSanXuat,
                xuatXu: data.xuatXu,
                hinhAnh: data.hinhAnh || null, // ← Hỗ trợ upload hình ảnh
                trangThai: data.trangThai || 'con_hang',
                hanSuDung: data.hanSuDung ? new Date(data.hanSuDung) : null,
                cachDung: data.cachDung || null,
                thanPhan: data.thanPhan || null,
                congDung: data.congDung || null
            },
            include: {
                danhMuc: {
                    select: {
                        id: true,
                        tenDanhMuc: true,
                        icon: true,
                        mauSac: true
                    }
                }
            }
        })

        return NextResponse.json({ thuoc })
    } catch (error) {
        console.error('Error creating thuoc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi thêm thuốc', details: error },
            { status: 500 }
        )
    }
}