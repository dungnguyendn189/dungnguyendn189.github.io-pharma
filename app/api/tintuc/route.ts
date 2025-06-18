import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const trangThai = searchParams.get('trangThai')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const sortBy = searchParams.get('sortBy') || 'taoLuc'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        const whereClause: Record<string, unknown> = {}

        // Filter By Status
        if (trangThai && trangThai !== 'all') {
            whereClause.trangThai = trangThai
        }

        // Search by title or content
        if (search) {
            whereClause.OR = [
                {
                    tieuDe: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    tomTat: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    noiDung: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        const skip = (page - 1) * limit

        // Get total count for pagination
        const totalCount = await prisma.tinTuc.count({
            where: whereClause
        })

        const totalPages = Math.ceil(totalCount / limit)

        const tinTucs = await prisma.tinTuc.findMany({
            where: whereClause,
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limit
        })

        return NextResponse.json({
            tinTucs,
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
        console.error('Error fetching tintucs:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải danh sách tin tức' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields - Chỉ cần tiêu đề, nội dung và tác giả
        if (!data.tieuDe || !data.noiDung || !data.tacGia) {
            return NextResponse.json(
                { error: 'Thiếu thông tin bắt buộc: tiêu đề, nội dung, tác giả' },
                { status: 400 }
            )
        }

        // Check duplicate title
        const existingTinTuc = await prisma.tinTuc.findFirst({
            where: {
                tieuDe: {
                    equals: data.tieuDe,
                    mode: 'insensitive'
                }
            }
        })

        if (existingTinTuc) {
            return NextResponse.json(
                { error: 'Tiêu đề tin tức đã tồn tại' },
                { status: 400 }
            )
        }

        const tinTuc = await prisma.tinTuc.create({
            data: {
                tieuDe: data.tieuDe,
                tomTat: data.tomTat || null,
                noiDung: data.noiDung,
                hinhAnh: data.hinhAnh || null,
                tacGia: data.tacGia,
                trangThai: data.trangThai || 'ban_nhap'
            }
        })

        return NextResponse.json({ tinTuc })
    } catch (error) {
        console.error('Error creating tin tuc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi thêm tin tức' },
            { status: 500 }
        )
    }
}