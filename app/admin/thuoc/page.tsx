/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../components/UPload'

interface Thuoc {
    id: number
    tenThuoc: string
    moTa?: string
    gia: number
    soLuong: number
    hangSanXuat: string
    xuatXu: string
    hinhAnh?: string
    trangThai: string
    hanSuDung?: string
    cachDung?: string
    thanPhan?: string
    congDung?: string
    luotXem: number
    taoLuc?: string
    danhMuc: {
        id: number
        tenDanhMuc: string
        icon?: string
        mauSac?: string
    }
}

interface DanhMuc {
    id: number
    tenDanhMuc: string
    icon?: string
    mauSac?: string
}

interface FormData {
    tenThuoc: string
    moTa: string
    gia: string
    soLuong: string
    danhMucId: string
    hangSanXuat: string
    xuatXu: string
    hinhAnh: string
    trangThai: string
    hanSuDung: string
    cachDung: string
    thanPhan: string
    congDung: string
}

export default function QuanLyThuocPage() {
    const router = useRouter()
    const [thuocs, setThuocs] = useState<Thuoc[]>([])
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingThuoc, setEditingThuoc] = useState<Thuoc | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)


    const [formData, setFormData] = useState<FormData>({
        tenThuoc: '',
        moTa: '',
        gia: '',
        soLuong: '',
        danhMucId: '',
        hangSanXuat: '',
        xuatXu: '',
        hinhAnh: '',
        trangThai: 'con_hang',
        hanSuDung: '',
        cachDung: '',
        thanPhan: '',
        congDung: ''
    })

    // Kiểm tra đăng nhập
    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/dangnhap')
            return
        }
    }, [router])

    // Load dữ liệu
    useEffect(() => {
        loadThuocs()
        loadDanhMucs()
    }, [currentPage, searchTerm, statusFilter, categoryFilter])

    const loadThuocs = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { trangThai: statusFilter }),
                ...(categoryFilter !== 'all' && { danhMucId: categoryFilter })
            })

            const response = await fetch(`/api/thuoc?${params}`)
            const data = await response.json()

            if (response.ok) {
                setThuocs(data.thuocs || [])
                setTotalPages(data.pagination?.totalPages || 1)
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thuốc:', error)
            setThuocs([])
        } finally {
            setLoading(false)
        }
    }

    const loadDanhMucs = async () => {
        try {
            const response = await fetch('/api/danhmuc')
            const data = await response.json()
            if (response.ok) {
                setDanhMucs(data.danhMucs || [])
            }
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error)
            setDanhMucs([])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = editingThuoc ? `/api/thuoc/${editingThuoc.id}` : '/api/thuoc'
            const method = editingThuoc ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    gia: parseFloat(formData.gia),
                    soLuong: parseInt(formData.soLuong),
                    danhMucId: parseInt(formData.danhMucId)
                })
            })

            const data = await response.json()

            if (response.ok) {
                alert(editingThuoc ? 'Cập nhật thuốc thành công!' : 'Thêm thuốc thành công!')
                setShowModal(false)
                resetForm()
                loadThuocs()
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

    const handleEdit = (thuoc: Thuoc) => {
        setEditingThuoc(thuoc)
        setFormData({
            tenThuoc: thuoc.tenThuoc,
            moTa: thuoc.moTa || '',
            gia: thuoc.gia.toString(),
            soLuong: thuoc.soLuong.toString(),
            danhMucId: thuoc.danhMuc.id.toString(),
            hangSanXuat: thuoc.hangSanXuat,
            xuatXu: thuoc.xuatXu,
            hinhAnh: thuoc.hinhAnh || '',
            trangThai: thuoc.trangThai,
            hanSuDung: thuoc.hanSuDung ? thuoc.hanSuDung.split('T')[0] : '',
            cachDung: thuoc.cachDung || '',
            thanPhan: thuoc.thanPhan || '',
            congDung: thuoc.congDung || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thuốc này?')) return

        try {
            const response = await fetch(`/api/thuoc/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                alert('Xóa thuốc thành công!')
                loadThuocs()
            } else {
                const data = await response.json()
                alert(data.error || 'Lỗi khi xóa thuốc')
            }
        } catch (error) {
            console.error('Lỗi:', error)
            alert('Có lỗi xảy ra')
        }
    }

    const resetForm = () => {
        setFormData({
            tenThuoc: '',
            moTa: '',
            gia: '',
            soLuong: '',
            danhMucId: '',
            hangSanXuat: '',
            xuatXu: '',
            hinhAnh: '',
            trangThai: 'con_hang',
            hanSuDung: '',
            cachDung: '',
            thanPhan: '',
            congDung: ''
        })
        setEditingThuoc(null)
    }

    const handleImageUpload = (imageUrl: string) => {
        setFormData({ ...formData, hinhAnh: imageUrl })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'con_hang':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Còn hàng</span>
            case 'het_hang':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Hết hàng</span>
            case 'ngung_ban':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Ngừng bán</span>
            case 'het_han':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Hết hạn</span>
            default:
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
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
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý thuốc</h1>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                ← Dashboard
                            </button>
                            {/* Chỉ hiện button khi có danh mục */}
                            {danhMucs.length > 0 && (
                                <button
                                    onClick={() => {
                                        resetForm()
                                        setShowModal(true)
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    + Thêm thuốc
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thuốc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="con_hang">Còn hàng</option>
                        <option value="het_hang">Hết hàng</option>
                        <option value="ngung_ban">Ngừng bán</option>
                        <option value="het_han">Hết hạn</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">Tất cả danh mục</option>
                        {danhMucs.map(dm => (
                            <option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thuốc
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
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
                                {thuocs && thuocs.length > 0 ? (
                                    thuocs.map((thuoc) => (
                                        <tr key={thuoc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {thuoc.hinhAnh && (
                                                        <img
                                                            src={thuoc.hinhAnh}
                                                            alt=""
                                                            className="h-12 w-12 rounded-lg object-cover mr-4"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {thuoc.tenThuoc}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {thuoc.hangSanXuat} • {thuoc.xuatXu}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {thuoc.danhMuc?.icon && (
                                                        <span className="mr-2">{thuoc.danhMuc.icon}</span>
                                                    )}
                                                    <span className="text-sm text-gray-900">
                                                        {thuoc.danhMuc?.tenDanhMuc || 'Chưa có danh mục'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatPrice(thuoc.gia || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(thuoc.soLuong || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(thuoc.trangThai)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(thuoc.luotXem || 0).toLocaleString()} {/* ← Sửa dòng này */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(thuoc)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(thuoc.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            {loading ? 'Đang tải...' : 'Chưa có thuốc nào'}
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
                                        ? 'bg-green-600 text-white border-green-600'
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
                                {editingThuoc ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên thuốc *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tenThuoc}
                                            onChange={(e) => setFormData({ ...formData, tenThuoc: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh mục *
                                        </label>
                                        <select
                                            value={formData.danhMucId}
                                            onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {danhMucs.map(dm => (
                                                <option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.gia}
                                            onChange={(e) => setFormData({ ...formData, gia: e.target.value })}
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số lượng *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.soLuong}
                                            onChange={(e) => setFormData({ ...formData, soLuong: e.target.value })}
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="con_hang">Còn hàng</option>
                                            <option value="het_hang">Hết hàng</option>
                                            <option value="ngung_ban">Ngừng bán</option>
                                            <option value="het_han">Hết hạn</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hãng sản xuất *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.hangSanXuat}
                                            onChange={(e) => setFormData({ ...formData, hangSanXuat: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Xuất xứ *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.xuatXu}
                                            onChange={(e) => setFormData({ ...formData, xuatXu: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hạn sử dụng
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.hanSuDung}
                                            onChange={(e) => setFormData({ ...formData, hanSuDung: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={formData.moTa}
                                        onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Cách dùng
                                        </label>
                                        <textarea
                                            value={formData.cachDung}
                                            onChange={(e) => setFormData({ ...formData, cachDung: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Công dụng
                                        </label>
                                        <textarea
                                            value={formData.congDung}
                                            onChange={(e) => setFormData({ ...formData, congDung: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thành phần
                                    </label>
                                    <textarea
                                        value={formData.thanPhan}
                                        onChange={(e) => setFormData({ ...formData, thanPhan: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                {/* Image Upload */}
                                <ImageUpload
                                    onImageUpload={handleImageUpload}
                                    currentImage={formData.hinhAnh}
                                />

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
                                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang xử lý...' : (editingThuoc ? 'Cập nhật' : 'Thêm mới')}
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