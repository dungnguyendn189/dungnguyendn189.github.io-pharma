'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../components/UPload'

interface TinTuc {
    id: number
    tieuDe: string
    tomTat: string | null
    noiDung: string
    hinhAnh: string | null
    tacGia: string
    trangThai: 'ban_nhap' | 'da_xuat_ban' | 'da_an'
    luotXem: number
    tags: string | null
    taoLuc: string
    capNhatLuc: string
}

interface FormData {
    tieuDe: string
    tomTat: string
    noiDung: string
    hinhAnh: string
    tacGia: string
    trangThai: 'ban_nhap' | 'da_xuat_ban' | 'da_an'
    tags: string
}

export default function QuanLyTinTucPage() {
    const router = useRouter()
    const [tinTucs, setTinTucs] = useState<TinTuc[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTinTuc, setEditingTinTuc] = useState<TinTuc | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [formData, setFormData] = useState<FormData>({
        tieuDe: '',
        tomTat: '',
        noiDung: '',
        hinhAnh: '',
        tacGia: '',
        trangThai: 'ban_nhap',
        tags: ''
    })

    useEffect(() => {
        loadTinTucs()
    }, [currentPage, searchTerm, statusFilter])

    const loadTinTucs = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { trangThai: statusFilter })
            })

            const response = await fetch(`/api/tintuc?${params}`)
            const data = await response.json()

            if (response.ok) {
                setTinTucs(data.tinTucs || [])
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error('Lỗi khi tải tin tức:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = editingTinTuc ? `/api/tintuc/${editingTinTuc.id}` : '/api/tintuc'
            const method = editingTinTuc ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                alert(editingTinTuc ? 'Cập nhật tin tức thành công!' : 'Thêm tin tức thành công!')
                setShowModal(false)
                resetForm()
                loadTinTucs()
            } else {
                alert(data.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (tinTuc: TinTuc) => {
        setEditingTinTuc(tinTuc)
        setFormData({
            tieuDe: tinTuc.tieuDe,
            tomTat: tinTuc.tomTat || '',
            noiDung: tinTuc.noiDung,
            hinhAnh: tinTuc.hinhAnh || '',
            tacGia: tinTuc.tacGia,
            trangThai: tinTuc.trangThai,
            tags: tinTuc.tags || ''
        })
        setShowModal(true)
    }
    const handleImageUpload = (imageUrl: string) => {
        setFormData({ ...formData, hinhAnh: imageUrl })
    }
    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tin tức này?')) return

        try {
            const response = await fetch(`/api/tintuc/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                alert('Xóa tin tức thành công!')
                loadTinTucs()
            } else {
                const data = await response.json()
                alert(data.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Có lỗi xảy ra')
        }
    }

    const resetForm = () => {
        setFormData({
            tieuDe: '',
            tomTat: '',
            noiDung: '',
            hinhAnh: '',
            tacGia: '',
            trangThai: 'ban_nhap',
            tags: ''
        })
        setEditingTinTuc(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'da_xuat_ban':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đã xuất bản</span>
            case 'ban_nhap':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Bản nháp</span>
            case 'da_an':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Đã ẩn</span>
            default:
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading && currentPage === 1) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-xl">Đang tải...</div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                ← Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    resetForm()
                                    setShowModal(true)
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                + Thêm tin tức
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tin tức..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="ban_nhap">Bản nháp</option>
                        <option value="da_xuat_ban">Đã xuất bản</option>
                        <option value="da_an">Đã ẩn</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tin tức
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tác giả
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lượt xem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tinTucs && tinTucs.length > 0 ? (
                                    tinTucs.map((tinTuc) => (
                                        <tr key={tinTuc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {tinTuc.hinhAnh && (
                                                        <img
                                                            src={tinTuc.hinhAnh}
                                                            alt=""
                                                            className="h-12 w-12 rounded-lg object-cover mr-4"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                            {tinTuc.tieuDe}
                                                        </div>
                                                        {tinTuc.tomTat && (
                                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                                {tinTuc.tomTat}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tinTuc.tacGia}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(tinTuc.trangThai)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tinTuc.luotXem.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatDate(tinTuc.taoLuc)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(tinTuc)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tinTuc.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            {loading ? 'Đang tải...' : 'Chưa có tin tức nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingTinTuc ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tiêu đề *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tieuDe}
                                            onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tác giả *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tacGia}
                                            onChange={(e) => setFormData({ ...formData, tacGia: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tóm tắt
                                    </label>
                                    <textarea
                                        value={formData.tomTat}
                                        onChange={(e) => setFormData({ ...formData, tomTat: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nội dung *
                                    </label>
                                    <textarea
                                        value={formData.noiDung}
                                        onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                                        rows={8}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Replace URL input with Image Upload Component */}
                                <ImageUpload
                                    onImageUpload={handleImageUpload}
                                    currentImage={formData.hinhAnh}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            value={formData.trangThai}
                                            onChange={(e) => setFormData({ ...formData, trangThai: e.target.value as FormData['trangThai'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="ban_nhap">Bản nháp</option>
                                            <option value="da_xuat_ban">Đã xuất bản</option>
                                            <option value="da_an">Đã ẩn</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags (phân cách bằng dấu phẩy)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="VD: sức khỏe, y tế, thuốc"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            resetForm()
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang xử lý...' : (editingTinTuc ? 'Cập nhật' : 'Thêm mới')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}