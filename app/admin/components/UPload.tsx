'use client'

import { useState } from 'react'

interface ImageUploadProps {
    onImageUpload: (imageUrl: string) => void
    currentImage?: string
    className?: string
    maxSize?: number // MB
    quality?: number // 0.1 - 1.0 cho compression
}

export default function ImageUpload({
    onImageUpload,
    currentImage,
    className = '',
    maxSize = 2,
    quality = 0.8
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string>(currentImage || '')
    const [error, setError] = useState<string>('')

    // Hàm compress ảnh
    const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const img = new Image()

            img.onload = () => {
                // Tính toán kích thước mới (max 800x800)
                const maxDimension = 800
                let { width, height } = img

                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width
                        width = maxDimension
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height
                        height = maxDimension
                    }
                }

                canvas.width = width
                canvas.height = height

                // Draw và compress
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        const compressedFile = new File([blob!], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        })
                        resolve(compressedFile)
                    },
                    file.type,
                    quality
                )
            }

            img.src = URL.createObjectURL(file)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError('')

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)')
            return
        }

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)

        setUploading(true)

        try {
            // Compress ảnh nếu cần
            let processedFile = file
            if (file.size > maxSize * 1024 * 1024) {
                processedFile = await compressImage(file, quality)
                console.log(`Compressed: ${file.size} → ${processedFile.size} bytes`)
            }

            const formData = new FormData()
            formData.append('file', processedFile)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                onImageUpload(data.imageUrl) // Base64 data URL
                // Clean up preview URL và dùng base64
                URL.revokeObjectURL(previewUrl)
                setPreview(data.imageUrl)
            } else {
                setError(data.error || 'Lỗi khi upload hình ảnh')
                setPreview(currentImage || '')
            }
        } catch (error) {
            console.error('Upload error:', error)
            setError('Lỗi khi upload hình ảnh')
            setPreview(currentImage || '')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setPreview('')
        setError('')
        onImageUpload('')
    }

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh sản phẩm
            </label>

            <div className="space-y-3">
                {/* Upload Input */}
                <div className="flex items-center space-x-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />

                    {uploading && (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-600">Đang xử lý...</span>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Image Preview */}
                {preview && !error && (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                            onError={() => {
                                setError('Không thể hiển thị ảnh')
                                setPreview('')
                            }}
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm"
                            title="Xóa ảnh"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Help Text */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Chấp nhận file: JPG, PNG, GIF, WebP</p>
                    <p>• Kích thước tối đa: {maxSize}MB</p>
                    <p>• Ảnh sẽ được tự động tối ưu kích thước</p>
                    <p>• Khuyến nghị: Ảnh vuông 800x800px</p>
                </div>
            </div>
        </div>
    )
}