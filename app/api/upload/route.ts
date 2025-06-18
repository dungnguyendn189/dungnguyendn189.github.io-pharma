import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs' // ← Thêm import này

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

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File quá lớn. Tối đa 5MB'
            }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const timestamp = Date.now()
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${timestamp}_${originalName}`

        // Save to public/uploads folder
        const uploadsDir = join(process.cwd(), 'public', 'uploads')
        const filepath = join(uploadsDir, filename)

        // Create uploads directory if it doesn't exist
        // const fs = require('fs') ← Xóa dòng này
        if (!existsSync(uploadsDir)) { // ← Sử dụng import thay vì fs.existsSync
            mkdirSync(uploadsDir, { recursive: true }) // ← Sử dụng import thay vì fs.mkdirSync
        }

        await writeFile(filepath, buffer)

        // Return the public URL
        const imageUrl = `/uploads/${filename}`

        return NextResponse.json({
            success: true,
            imageUrl,
            message: 'Upload thành công'
        })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({
            error: 'Lỗi khi upload file'
        }, { status: 500 })
    }
}