'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Image } from 'lucide-react'
import Link from 'next/link'

interface SocialMedia {
    id: number
    tenMangXaHoi: string
    url: string
    icon: string
    thuTu: number
    trangThai: string
    taoLuc: string
    capNhatLuc: string
}

export default function SocialMediaManagement() {
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState<SocialMedia | null>(null)
    const [formData, setFormData] = useState({
        tenMangXaHoi: '',
        url: '',
        icon: '',
        thuTu: 0,
        trangThai: 'hien_thi'
    })
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchSocialMedias()
    }, [])

    const fetchSocialMedias = async () => {
        try {
            const response = await fetch('/api/social')
            const data = await response.json()

            if (data.success) {
                setSocialMedias(data.data)
            }
        } catch (error) {
            console.error('Error fetching social medias:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingItem ? `/api/social/${editingItem.id}` : '/api/social'
            const method = editingItem ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                await fetchSocialMedias()
                setShowForm(false)
                setEditingItem(null)
                setFormData({
                    tenMangXaHoi: '',
                    url: '',
                    icon: '',
                    thuTu: 0,
                    trangThai: 'hien_thi'
                })
                alert(data.message)
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error('Error saving social media:', error)
            alert('Có lỗi xảy ra khi lưu dữ liệu')
        }
    }

    // Handle delete
    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa mạng xã hội này?')) {
            try {
                const response = await fetch(`/api/social/${id}`, {
                    method: 'DELETE'
                })

                const data = await response.json()

                if (data.success) {
                    await fetchSocialMedias()
                    alert(data.message)
                } else {
                    alert(data.message)
                }
            } catch (error) {
                console.error('Error deleting social media:', error)
                alert('Có lỗi xảy ra khi xóa dữ liệu')
            }
        }
    }

    // Handle edit
    const handleEdit = (item: SocialMedia) => {
        setEditingItem(item)
        setFormData({
            tenMangXaHoi: item.tenMangXaHoi,
            url: item.url,
            icon: item.icon,
            thuTu: item.thuTu,
            trangThai: item.trangThai
        })
        setShowForm(true)
    }

    // Handle file upload
    const handleFileUpload = async (file: File) => {
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setFormData(prev => ({ ...prev, icon: data.url }))
            } else {
                alert('Upload thất bại: ' + data.message)
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Có lỗi xảy ra khi upload file')
        } finally {
            setUploading(false)
        }
    }

    // Toggle status
    const toggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'hien_thi' ? 'an_di' : 'hien_thi'

        try {
            const response = await fetch(`/api/social/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trangThai: newStatus })
            })

            if (response.ok) {
                await fetchSocialMedias()
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Về Dashboard
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Social Media</h1>
                        <p className="text-gray-600 mt-1">Quản lý các liên kết mạng xã hội</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Thêm mạng xã hội
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingItem ? 'Chỉnh sửa' : 'Thêm'} mạng xã hội
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tên mạng xã hội */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên mạng xã hội *
                                </label>
                                <input
                                    type="text"
                                    value={formData.tenMangXaHoi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tenMangXaHoi: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: Facebook"
                                    required
                                />
                            </div>

                            {/* URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL liên kết *
                                </label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://facebook.com/your-page"
                                    required
                                />
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon *
                                </label>

                                {/* Current icon preview */}
                                {formData.icon && (
                                    <div className="mb-2">
                                        <img
                                            src={formData.icon}
                                            alt="Icon preview"
                                            className="w-12 h-12 object-cover rounded border"
                                        />
                                    </div>
                                )}

                                {/* URL input */}
                                <input
                                    type="url"
                                    value={formData.icon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                                    placeholder="https://example.com/icon.png"
                                />

                                {/* File upload */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">hoặc</span>
                                    <label className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                                        <Image className="w-4 h-4 mr-2" />
                                        {uploading ? 'Đang upload...' : 'Upload ảnh'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) handleFileUpload(file)
                                            }}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Thứ tự */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thứ tự hiển thị
                                </label>
                                <input
                                    type="number"
                                    value={formData.thuTu}
                                    onChange={(e) => setFormData(prev => ({ ...prev, thuTu: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.trangThai}
                                    onChange={(e) => setFormData(prev => ({ ...prev, trangThai: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="hien_thi">Hiển thị</option>
                                    <option value="an_di">Ẩn đi</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingItem ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditingItem(null)
                                        setFormData({
                                            tenMangXaHoi: '',
                                            url: '',
                                            icon: '',
                                            thuTu: 0,
                                            trangThai: 'hien_thi'
                                        })
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên mạng xã hội
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    URL
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thứ tự
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : socialMedias.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Chưa có dữ liệu nào
                                    </td>
                                </tr>
                            ) : (
                                socialMedias.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={item.icon}
                                                alt={item.tenMangXaHoi}
                                                className="w-10 h-10 object-cover rounded"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.src = '/placeholder-icon.png'
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.tenMangXaHoi}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-xs block"
                                            >
                                                {item.url}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.thuTu}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleStatus(item.id, item.trangThai)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.trangThai === 'hien_thi'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {item.trangThai === 'hien_thi' ? (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Hiển thị
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Ẩn
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}