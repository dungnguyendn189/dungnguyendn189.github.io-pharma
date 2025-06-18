'use client'

import { useState } from 'react'

interface ImageUploadProps {
    onImageUpload: (imageUrl: string) => void
    currentImage?: string
    className?: string
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string>(currentImage || '')

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                onImageUpload(data.imageUrl)
                // Clean up preview URL and use server URL
                URL.revokeObjectURL(previewUrl)
                setPreview(data.imageUrl)
            } else {
                alert(data.error || 'Lỗi khi upload hình ảnh')
                setPreview(currentImage || '')
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Lỗi khi upload hình ảnh')
            setPreview(currentImage || '')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setPreview('')
        onImageUpload('')
    }

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
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
                        <div className="text-sm text-blue-600">Đang upload...</div>
                    )}
                </div>

                {/* Image Preview */}
                {preview && (
                    <div className="relative inline-block">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Help Text */}
                <p className="text-xs text-gray-500">
                    Chấp nhận file: JPG, PNG, GIF, WebP. Tối đa 5MB.
                </p>
            </div>
        </div>
    )
}