import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function POST(request: NextRequest) {
    try {
        console.log('=== Login API called ===')

        const body = await request.json()
        console.log('Request body:', body)

        const { tenDangNhap, matKhau } = body

        if (!tenDangNhap || !matKhau) {
            console.log('Missing credentials')
            return NextResponse.json(
                { error: 'Vui lòng nhập đầy đủ thông tin' },
                { status: 400 }
            )
        }

        console.log('Looking for admin with username:', tenDangNhap)

        const admin = await prisma.admin.findUnique({
            where: { tenDangNhap }
        })

        console.log('Admin found:', admin ? 'Yes' : 'No')

        if (!admin) {
            return NextResponse.json(
                { error: 'Thông tin đăng nhập không đúng' },
                { status: 401 }
            )
        }

        console.log('Comparing passwords...')
        const isValidPassword = matKhau === admin.matKhau // ✅ So sánh trực tiếp
        console.log('Password valid:', isValidPassword)

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Thông tin đăng nhập không đúng' },
                { status: 401 }
            )
        }

        console.log('Login successful!')
        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                tenDangNhap: admin.tenDangNhap,
                hoTen: admin.hoTen,
                email: admin.email,
                vaiTro: admin.vaiTro
            }
        })

    } catch (error) {
        console.error('=== LOGIN ERROR ===')
        console.error('Error details:', error)
        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        } else {
            console.error('Error is not an instance of Error:', error)
        }

        return NextResponse.json({
            error: 'Có lỗi xảy ra, vui lòng thử lại',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}