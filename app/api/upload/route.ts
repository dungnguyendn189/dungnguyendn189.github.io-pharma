import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('file') as unknown as File

        if (!file) {
            return NextResponse.json({ error: 'Không có file được upload' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'
            }, { status: 400 })
        }

        // Validate file size (2MB max cho base64)
        const maxSize = 2 * 1024 * 1024 // 2MB (base64 sẽ tăng ~33% kích thước)
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File quá lớn. Tối đa 2MB cho base64'
            }, { status: 400 })
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Convert to base64
        const base64String = buffer.toString('base64')
        const mimeType = file.type
        const base64DataUrl = `data:${mimeType};base64,${base64String}`

        return NextResponse.json({
            success: true,
            imageUrl: base64DataUrl, // Trả về base64 data URL
            originalName: file.name,
            size: file.size,
            mimeType: mimeType,
            message: 'Upload thành công'
        })

    } catch (error) {
        console.error('Error processing file:', error)
        return NextResponse.json({
            error: `Lỗi khi xử lý file: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 })
    }
}