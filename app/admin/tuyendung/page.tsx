'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../components/UPload'

interface TuyenDung {
    id: number
    tieuDe: string
    viTri: string
    moTaCongViec: string
    yeuCau: string
    quyenLoi: string | null
    mucLuong: string
    diaDiem: string
    loaiHinhLamViec: string
    kinhNghiem: string
    hanNop: string
    hinhAnh: string | null
    trangThai: string
    luotXem: number
    taoLuc: string
    capNhatLuc: string
}

interface FormData {
    tieuDe: string
    viTri: string
    moTaCongViec: string
    yeuCau: string
    quyenLoi: string
    mucLuong: string
    diaDiem: string
    loaiHinhLamViec: string
    kinhNghiem: string
    hanNop: string
    hinhAnh: string
    trangThai: string
}

export default function QuanLyTuyenDungPage() {
    const router = useRouter()
    const [tuyenDungs, setTuyenDungs] = useState<TuyenDung[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingTuyenDung, setEditingTuyenDung] = useState<TuyenDung | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const [formData, setFormData] = useState<FormData>({
        tieuDe: '',
        viTri: '',
        moTaCongViec: '',
        yeuCau: '',
        quyenLoi: '',
        mucLuong: '',
        diaDiem: '',
        loaiHinhLamViec: 'Toàn thời gian',
        kinhNghiem: '',
        hanNop: '',
        hinhAnh: '',
        trangThai: 'dang_tuyen'
    })

    useEffect(() => {
        loadTuyenDungs()
    }, [currentPage, searchTerm, statusFilter])

    // ✅ Fix loadTuyenDungs để khớp với API response
    const loadTuyenDungs = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { trangThai: statusFilter })
            })

            const response = await fetch(`/api/tuyendung?${params}`)
            const result = await response.json()

            if (response.ok && result.success) {
                // ✅ API trả về { success: true, data: [], pagination: {} }
                setTuyenDungs(result.data || [])
                if (result.pagination) {
                    setTotalPages(result.pagination.totalPages || 1)
                    setTotalCount(result.pagination.totalCount || 0)
                }
            } else {
                console.error('Lỗi API:', result.error)
                setTuyenDungs([])
                setTotalPages(1)
                setTotalCount(0)
            }
        } catch (error) {
            console.error('Lỗi khi tải tuyển dụng:', error)
            setTuyenDungs([])
            setTotalPages(1)
            setTotalCount(0)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Fix handleSubmit để khớp với API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate required fields
            const requiredFields = [
                { field: 'tieuDe', label: 'Tiêu đề' },
                { field: 'viTri', label: 'Vị trí' },
                { field: 'moTaCongViec', label: 'Mô tả công việc' },
                { field: 'yeuCau', label: 'Yêu cầu' },
                { field: 'mucLuong', label: 'Mức lương' },
                { field: 'diaDiem', label: 'Địa điểm' },
                { field: 'kinhNghiem', label: 'Kinh nghiệm' },
                { field: 'hanNop', label: 'Hạn nộp' }
            ]

            for (const { field, label } of requiredFields) {
                if (!formData[field as keyof FormData]?.trim()) {
                    alert(`Vui lòng nhập ${label}`)
                    return
                }
            }

            // Validate date
            const hanNopDate = new Date(formData.hanNop)
            if (hanNopDate <= new Date()) {
                alert('Hạn nộp phải sau ngày hiện tại')
                return
            }

            const url = editingTuyenDung ? `/api/tuyendung/${editingTuyenDung.id}` : '/api/tuyendung'
            const method = editingTuyenDung ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert(result.message || (editingTuyenDung ? 'Cập nhật tin tuyển dụng thành công!' : 'Thêm tin tuyển dụng thành công!'))
                setShowModal(false)
                resetForm()
                await loadTuyenDungs() // Reload data
            } else {
                alert(result.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Có lỗi xảy ra khi xử lý yêu cầu')
        } finally {
            setLoading(false)
        }
    }

    // ✅ Fix handleEdit để format date đúng
    const handleEdit = (tuyenDung: TuyenDung) => {
        setEditingTuyenDung(tuyenDung)

        // Format date for input[type="date"]
        const hanNopFormatted = new Date(tuyenDung.hanNop).toISOString().split('T')[0]

        setFormData({
            tieuDe: tuyenDung.tieuDe,
            viTri: tuyenDung.viTri,
            moTaCongViec: tuyenDung.moTaCongViec,
            yeuCau: tuyenDung.yeuCau,
            quyenLoi: tuyenDung.quyenLoi || '',
            mucLuong: tuyenDung.mucLuong,
            diaDiem: tuyenDung.diaDiem,
            loaiHinhLamViec: tuyenDung.loaiHinhLamViec,
            kinhNghiem: tuyenDung.kinhNghiem,
            hanNop: hanNopFormatted,
            hinhAnh: tuyenDung.hinhAnh || '',
            trangThai: tuyenDung.trangThai
        })
        setShowModal(true)
    }

    // ✅ Fix handleDelete để khớp với API
    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return

        try {
            const response = await fetch(`/api/tuyendung/${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert(result.message || 'Xóa tin tuyển dụng thành công!')
                await loadTuyenDungs() // Reload data
            } else {
                alert(result.error || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Có lỗi xảy ra khi xóa')
        }
    }

    const resetForm = () => {
        setFormData({
            tieuDe: '',
            viTri: '',
            moTaCongViec: '',
            yeuCau: '',
            quyenLoi: '',
            mucLuong: '',
            diaDiem: '',
            loaiHinhLamViec: 'Toàn thời gian',
            kinhNghiem: '',
            hanNop: '',
            hinhAnh: '',
            trangThai: 'dang_tuyen'
        })
        setEditingTuyenDung(null)
    }

    const handleImageUpload = (imageUrl: string) => {
        setFormData({ ...formData, hinhAnh: imageUrl })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'dang_tuyen':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đang tuyển</span>
            case 'tam_dung':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Tạm dừng</span>
            case 'da_dong':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Đã đóng</span>
            default:
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    // ✅ Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1) // Reset to first page when searching
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchTerm, statusFilter])

    if (loading && currentPage === 1 && tuyenDungs.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-3 text-xl">Đang tải...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý tuyển dụng</h1>
                            {totalCount > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Tổng cộng: {totalCount} tin tuyển dụng
                                </p>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                ← Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    resetForm()
                                    setShowModal(true)
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                + Thêm tin tuyển dụng
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
                        placeholder="Tìm kiếm tuyển dụng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="dang_tuyen">Đang tuyển</option>
                        <option value="tam_dung">Tạm dừng</option>
                        <option value="da_dong">Đã đóng</option>
                    </select>
                    <div className="flex items-center text-sm text-gray-500">
                        {loading ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Đang tải...
                            </span>
                        ) : (
                            <span>Hiển thị {tuyenDungs.length} / {totalCount} kết quả</span>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tin tuyển dụng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mức lương
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa điểm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hạn nộp
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lượt xem
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tuyenDungs && tuyenDungs.length > 0 ? (
                                    tuyenDungs.map((tuyenDung) => (
                                        <tr key={tuyenDung.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {/* ✅ Better image handling */}
                                                    {tuyenDung.hinhAnh && (
                                                        <img
                                                            src={tuyenDung.hinhAnh}
                                                            alt=""
                                                            className="h-12 w-12 rounded-lg object-cover mr-4 flex-shrink-0"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-gray-900 truncate">
                                                            {tuyenDung.tieuDe}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {tuyenDung.viTri} • {tuyenDung.loaiHinhLamViec}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tuyenDung.mucLuong}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tuyenDung.diaDiem}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className={`${new Date(tuyenDung.hanNop) < new Date() ? 'text-red-600 font-medium' : ''}`}>
                                                    {formatDate(tuyenDung.hanNop)}
                                                    {new Date(tuyenDung.hanNop) < new Date() && (
                                                        <div className="text-xs text-red-500">Đã hết hạn</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(tuyenDung.trangThai)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tuyenDung.luotXem.toLocaleString()} lượt
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(tuyenDung)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tuyenDung.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-500">
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                                                    Đang tải...
                                                </div>
                                            ) : searchTerm || statusFilter !== 'all' ? (
                                                <div>
                                                    <p className="text-lg">Không tìm thấy kết quả</p>
                                                    <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-lg">Chưa có tin tuyển dụng nào</p>
                                                    <button
                                                        onClick={() => {
                                                            resetForm()
                                                            setShowModal(true)
                                                        }}
                                                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Thêm tin tuyển dụng đầu tiên →
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-700">
                            Trang {currentPage} / {totalPages} (Tổng: {totalCount} tin)
                        </div>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ««
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ‹
                            </button>

                            {/* Page numbers */}
                            {(() => {
                                const pages = []
                                const maxVisible = 5
                                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                                const end = Math.min(totalPages, start + maxVisible - 1)

                                if (end - start + 1 < maxVisible) {
                                    start = Math.max(1, end - maxVisible + 1)
                                }

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${currentPage === i
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    )
                                }
                                return pages
                            })()}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                »»
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal - Giữ nguyên phần modal code cũ */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingTuyenDung ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng mới'}
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Vị trí *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.viTri}
                                            onChange={(e) => setFormData({ ...formData, viTri: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả công việc *
                                    </label>
                                    <textarea
                                        value={formData.moTaCongViec}
                                        onChange={(e) => setFormData({ ...formData, moTaCongViec: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yêu cầu *
                                    </label>
                                    <textarea
                                        value={formData.yeuCau}
                                        onChange={(e) => setFormData({ ...formData, yeuCau: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quyền lợi
                                    </label>
                                    <textarea
                                        value={formData.quyenLoi}
                                        onChange={(e) => setFormData({ ...formData, quyenLoi: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mức lương *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.mucLuong}
                                            onChange={(e) => setFormData({ ...formData, mucLuong: e.target.value })}
                                            placeholder="VD: 10-15 triệu"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa điểm *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.diaDiem}
                                            onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại hình làm việc *
                                        </label>
                                        <select
                                            value={formData.loaiHinhLamViec}
                                            onChange={(e) => setFormData({ ...formData, loaiHinhLamViec: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="Toàn thời gian">Toàn thời gian</option>
                                            <option value="Bán thời gian">Bán thời gian</option>
                                            <option value="Thực tập">Thực tập</option>
                                            <option value="Hợp đồng">Hợp đồng</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kinh nghiệm *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.kinhNghiem}
                                            onChange={(e) => setFormData({ ...formData, kinhNghiem: e.target.value })}
                                            placeholder="VD: 1-2 năm"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hạn nộp *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.hanNop}
                                            onChange={(e) => setFormData({ ...formData, hanNop: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            value={formData.trangThai}
                                            onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="dang_tuyen">Đang tuyển</option>
                                            <option value="tam_dung">Tạm dừng</option>
                                            <option value="da_dong">Đã đóng</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <ImageUpload
                                    onImageUpload={handleImageUpload}
                                    currentImage={formData.hinhAnh}
                                />

                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            resetForm()
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            editingTuyenDung ? 'Cập nhật' : 'Thêm mới'
                                        )}
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