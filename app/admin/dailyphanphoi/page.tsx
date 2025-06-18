'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    Mail,
    Phone,
    MapPin,
    Building2,
    Search,
    Filter,
    Eye,
    Check,
    X,
    Trash2,
    RefreshCw,
    Calendar,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
} from 'lucide-react'

interface DaiLyPhanPhoi {
    id: number
    hoTen: string
    email: string
    soDienThoai: string
    noiDungDangKy: string
    diaChi: string
    tinhThanhPho: string
    quanHuyen: string
    phuongXa: string
    loiNhan?: string
    trangThai: string
    ghiChu?: string
    taoLuc: string
    capNhatLuc: string
}

export default function DaiLyPhanPhoiPage() {
    const [daiLy, setDaiLy] = useState<DaiLyPhanPhoi[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterTrangThai, setFilterTrangThai] = useState('')
    const [filterNoiDung, setFilterNoiDung] = useState('')
    const [filterTinhThanh, setFilterTinhThanh] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Modal states
    const [selectedDaiLy, setSelectedDaiLy] = useState<DaiLyPhanPhoi | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [approvalData, setApprovalData] = useState({
        id: 0,
        action: '',
        ghiChu: ''
    })

    // Fetch data
    const fetchDaiLy = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(filterTrangThai && { trangThai: filterTrangThai }),
                ...(filterNoiDung && { noiDungDangKy: filterNoiDung }),
                ...(filterTinhThanh && { tinhThanhPho: filterTinhThanh }),
                ...(searchTerm && { search: searchTerm })
            })

            const response = await fetch(`/api/dailyphanphoi?${params}`)
            const data = await response.json()

            if (data.success) {
                setDaiLy(data.data)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching dai ly:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDaiLy()
    }, [page, filterTrangThai, filterNoiDung, filterTinhThanh])

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== '') {
                setPage(1)
                fetchDaiLy()
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    // View detail
    const viewDetail = (item: DaiLyPhanPhoi) => {
        setSelectedDaiLy(item)
        setShowDetailModal(true)
    }

    // Open approval modal
    const openApprovalModal = (id: number, action: string) => {
        setApprovalData({ id, action, ghiChu: '' })
        setShowApprovalModal(true)
    }

    // Handle approval
    const handleApproval = async () => {
        try {
            const response = await fetch('/api/dailyphanphoi', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: approvalData.id,
                    trangThai: approvalData.action,
                    ghiChu: approvalData.ghiChu
                })
            })

            const data = await response.json()
            if (data.success) {
                fetchDaiLy()
                setShowApprovalModal(false)
                alert('Cập nhật trạng thái thành công!')
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Có lỗi xảy ra!')
        }
    }

    // Delete
    const handleDelete = async (id: number, hoTen: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa đại lý "${hoTen}"?`)) return

        try {
            const response = await fetch(`/api/dailyphanphoi?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                fetchDaiLy()
                if (selectedDaiLy?.id === id) {
                    setShowDetailModal(false)
                }
                alert('Xóa thành công!')
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error('Error deleting:', error)
            alert('Có lỗi xảy ra!')
        }
    }

    // Get status info
    const getStatusInfo = (trangThai: string) => {
        switch (trangThai) {
            case 'cho_duyet':
                return {
                    icon: <Clock className="w-4 h-4" />,
                    text: 'Chờ duyệt',
                    className: 'bg-yellow-100 text-yellow-800'
                }
            case 'da_duyet':
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: 'Đã duyệt',
                    className: 'bg-green-100 text-green-800'
                }
            case 'tu_choi':
                return {
                    icon: <AlertCircle className="w-4 h-4" />,
                    text: 'Từ chối',
                    className: 'bg-red-100 text-red-800'
                }
            default:
                return {
                    icon: <Clock className="w-4 h-4" />,
                    text: trangThai,
                    className: 'bg-gray-100 text-gray-800'
                }
        }
    }

    // Get registration type
    const getNoiDungDangKy = (noiDung: string) => {
        const map: Record<string, string> = {
            'quay_thuoc_phan_phoi': 'Quầy thuốc phân phối',
            'cua_hang_ban_le': 'Cửa hàng bán lẻ',
            'dai_ly_cap_1': 'Đại lý cấp 1',
            'dai_ly_cap_2': 'Đại lý cấp 2',
            'nha_phan_phoi': 'Nhà phân phối'
        }
        return map[noiDung] || noiDung
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN')
    }
    const router = useRouter()
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Users className="w-6 h-6 mr-2" />
                                Quản lý Đại lý Phân phối
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Quản lý danh sách đăng ký đại lý phân phối
                            </p>
                        </div>
                        <div className='flex gap-4'>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                            >
                                ← Dashboard
                            </button>
                            <button
                                onClick={fetchDaiLy}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Làm mới</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Trạng thái */}
                        <select
                            value={filterTrangThai}
                            onChange={(e) => setFilterTrangThai(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="cho_duyet">Chờ duyệt</option>
                            <option value="da_duyet">Đã duyệt</option>
                            <option value="tu_choi">Từ chối</option>
                        </select>

                        {/* Filter Nội dung đăng ký */}
                        <select
                            value={filterNoiDung}
                            onChange={(e) => setFilterNoiDung(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả loại đăng ký</option>
                            <option value="quay_thuoc_phan_phoi">Quầy thuốc phân phối</option>
                            <option value="cua_hang_ban_le">Cửa hàng bán lẻ</option>
                            <option value="dai_ly_cap_1">Đại lý cấp 1</option>
                            <option value="dai_ly_cap_2">Đại lý cấp 2</option>
                            <option value="nha_phan_phoi">Nhà phân phối</option>
                        </select>

                        {/* Filter Tỉnh/Thành phố */}
                        <input
                            type="text"
                            placeholder="Tỉnh/Thành phố"
                            value={filterTinhThanh}
                            onChange={(e) => setFilterTinhThanh(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        {/* Clear filters */}
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilterTrangThai('')
                                setFilterNoiDung('')
                                setFilterTinhThanh('')
                                setPage(1)
                            }}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Xóa bộ lọc</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thông tin đại lý
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại đăng ký
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa chỉ
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
                                        <td colSpan={6} className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                                                Đang tải...
                                            </div>
                                        </td>
                                    </tr>
                                ) : daiLy.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    daiLy.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.hoTen}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {item.id} • {formatDate(item.taoLuc)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                        {item.soDienThoai}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="truncate max-w-xs">{item.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-900">
                                                        {getNoiDungDangKy(item.noiDungDangKy)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                    <div>
                                                        <div>{item.tinhThanhPho}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {item.quanHuyen}, {item.phuongXa}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(() => {
                                                    const status = getStatusInfo(item.trangThai)
                                                    return (
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                            {status.icon}
                                                            <span>{status.text}</span>
                                                        </span>
                                                    )
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => viewDetail(item)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {item.trangThai === 'cho_duyet' && (
                                                        <>
                                                            <button
                                                                onClick={() => openApprovalModal(item.id, 'da_duyet')}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Duyệt"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openApprovalModal(item.id, 'tu_choi')}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Từ chối"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.hoTen)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Xóa"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Trang <span className="font-medium">{page}</span> trong{' '}
                                        <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === page
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedDaiLy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Chi tiết đại lý phân phối
                            </h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Thông tin cơ bản */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <Users className="w-5 h-5 mr-2" />
                                        Thông tin cơ bản
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Họ và tên
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.hoTen}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Số điện thoại
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.soDienThoai}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại đăng ký
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {getNoiDungDangKy(selectedDaiLy.noiDungDangKy)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Địa chỉ */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        Địa chỉ
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Địa chỉ chi tiết
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.diaChi}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phường/Xã
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.phuongXa}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quận/Huyện
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.quanHuyen}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tỉnh/Thành phố
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedDaiLy.tinhThanhPho}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lời nhắn */}
                                {selectedDaiLy.loiNhan && (
                                    <div className="lg:col-span-2 bg-green-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <MessageSquare className="w-5 h-5 mr-2" />
                                            Lời nhắn
                                        </h3>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                {selectedDaiLy.loiNhan}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Trạng thái & Ghi chú */}
                                <div className="lg:col-span-2 bg-yellow-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Thông tin hệ thống
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Trạng thái
                                            </label>
                                            <div className="bg-white p-2 rounded border">
                                                {(() => {
                                                    const status = getStatusInfo(selectedDaiLy.trangThai)
                                                    return (
                                                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                            {status.icon}
                                                            <span>{status.text}</span>
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày đăng ký
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {formatDate(selectedDaiLy.taoLuc)}
                                            </p>
                                        </div>
                                        {selectedDaiLy.ghiChu && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ghi chú của admin
                                                </label>
                                                <div className="bg-white p-3 rounded border">
                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                                        {selectedDaiLy.ghiChu}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                            <div className="flex space-x-2">
                                {selectedDaiLy.trangThai === 'cho_duyet' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false)
                                                openApprovalModal(selectedDaiLy.id, 'da_duyet')
                                            }}
                                            className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Duyệt</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false)
                                                openApprovalModal(selectedDaiLy.id, 'tu_choi')
                                            }}
                                            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Từ chối</span>
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false)
                                        handleDelete(selectedDaiLy.id, selectedDaiLy.hoTen)
                                    }}
                                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa</span>
                                </button>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                {approvalData.action === 'da_duyet' ? 'Duyệt đại lý' : 'Từ chối đại lý'}
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ghi chú {approvalData.action === 'tu_choi' ? '(bắt buộc)' : '(tùy chọn)'}
                                </label>
                                <textarea
                                    value={approvalData.ghiChu}
                                    onChange={(e) => setApprovalData({ ...approvalData, ghiChu: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={
                                        approvalData.action === 'da_duyet'
                                            ? 'Ghi chú về việc duyệt (nếu có)...'
                                            : 'Lý do từ chối đăng ký...'
                                    }
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowApprovalModal(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleApproval}
                                    disabled={approvalData.action === 'tu_choi' && !approvalData.ghiChu.trim()}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${approvalData.action === 'da_duyet'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                >
                                    {approvalData.action === 'da_duyet' ? 'Duyệt' : 'Từ chối'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}