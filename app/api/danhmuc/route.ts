import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const danhMucs = await prisma.danhMuc.findMany({
            include: {
                _count: {
                    select: {
                        thuoc: true
                    }
                }
            },
            orderBy: [
                { thuTu: 'asc' },
                { tenDanhMuc: 'asc' }
            ]
        })

        return NextResponse.json({ danhMucs })
    } catch (error) {
        console.error('Error fetching danh mucs:', error)
        return NextResponse.json(
            { error: 'Lỗi khi tải danh sách danh mục' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Kiểm tra tên danh mục đã tồn tại chưa
        const existingDanhMuc = await prisma.danhMuc.findFirst({
            where: {
                tenDanhMuc: {
                    equals: data.tenDanhMuc,
                    mode: 'insensitive'
                }
            }
        })

        if (existingDanhMuc) {
            return NextResponse.json(
                { error: 'Tên danh mục đã tồn tại' },
                { status: 400 }
            )
        }

        const danhMuc = await prisma.danhMuc.create({
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
        console.error('Error creating danh muc:', error)
        return NextResponse.json(
            { error: 'Lỗi khi thêm danh mục' },
            { status: 500 }
        )
    }
}