import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Lấy danh sách tuyển dụng
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const trangThai = searchParams.get('trangThai')
        const diaDiem = searchParams.get('diaDiem')
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
            take: limit
        })

        return NextResponse.json({
            tuyenDungs,
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
            { error: 'Lỗi khi tải danh sách tuyển dụng' },
            { status: 500 }
        )
    }
}

// POST - Thêm tuyển dụng mới
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields theo schema của bạn
        if (!data.tieuDe || !data.viTri || !data.moTaCongViec || !data.yeuCau || !data.mucLuong || !data.diaDiem || !data.loaiHinhLamViec || !data.kinhNghiem || !data.hanNop) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc' },
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
                { error: 'Tiêu đề tuyển dụng đã tồn tại' },
                { status: 400 }
            )
        }

        const tuyenDung = await prisma.tuyenDung.create({
            data: {
                tieuDe: data.tieuDe,
                viTri: data.viTri,
                moTaCongViec: data.moTaCongViec,
                yeuCau: data.yeuCau,
                quyenLoi: data.quyenLoi || null,
                mucLuong: data.mucLuong,
                diaDiem: data.diaDiem,
                loaiHinhLamViec: data.loaiHinhLamViec,
                kinhNghiem: data.kinhNghiem,
                hanNop: new Date(data.hanNop),
                trangThai: data.trangThai || 'dang_tuyen'
            }
        })

        return NextResponse.json({ tuyenDung })
    } catch (error) {
        console.error('Error creating tuyen dung:', error)
        return NextResponse.json(
            { error: 'Lỗi khi thêm tuyển dụng' },
            { status: 500 }
        )
    }
}