// app/api/social-media/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Lấy danh sách social media
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const trangThai = searchParams.get('trangThai') || 'hien_thi'

        const socialMedias = await prisma.socialMedia.findMany({
            where: {
                trangThai: trangThai
            },
            orderBy: {
                thuTu: 'asc'
            }
        })

        return NextResponse.json({
            success: true,
            data: socialMedias
        })
    } catch (error) {
        console.error('Error fetching social media:', error)
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi lấy danh sách social media'
        }, { status: 500 })
    }
}

// POST - Tạo social media mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tenMangXaHoi, url, icon, thuTu, trangThai } = body

        // Validation
        if (!tenMangXaHoi || !url || !icon) {
            return NextResponse.json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin bắt buộc'
            }, { status: 400 })
        }

        const socialMedia = await prisma.socialMedia.create({
            data: {
                tenMangXaHoi,
                url,
                icon,
                thuTu: thuTu || 0,
                trangThai: trangThai || 'hien_thi'
            }
        })

        return NextResponse.json({
            success: true,
            data: socialMedia,
            message: 'Tạo social media thành công'
        })
    } catch (error) {
        console.error('Error creating social media:', error)
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi tạo social media'
        }, { status: 500 })
    }
}