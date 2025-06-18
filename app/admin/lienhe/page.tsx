'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/app/hooks/useNotifications'
import { useRouter } from 'next/navigation'
import {
    Phone,
    Mail,
    Globe,
    Plus,
    Trash2,
    Search,
    Bell,
    Eye,
    EyeOff,
    RefreshCw,
    X,
    User,
    Calendar,
    MessageCircle
} from 'lucide-react'

interface LienHe {
    id: number
    ten: string
    soDienThoai: string
    email?: string
    loai: string
    moTa?: string
    thuTu: number
    trangThai: string
    taoLuc: string
    capNhatLuc: string
}

export default function LienHePage() {
    const [lienHe, setLienHe] = useState<LienHe[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterLoai, setFilterLoai] = useState('')
    const [filterTrangThai, setFilterTrangThai] = useState('')
    const [showNotifications, setShowNotifications] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // State cho modal xem chi tiết
    const [selectedContact, setSelectedContact] = useState<LienHe | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const router = useRouter()
    // Sử dụng hook notifications
    const { notifications, isConnected, clearNotifications } = useNotifications()

    // Fetch dữ liệu liên hệ
    const fetchLienHe = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(filterLoai && { loai: filterLoai }),
                ...(filterTrangThai && { trangThai: filterTrangThai })
            })

            const response = await fetch(`/api/lienhe?${params}`)
            const data = await response.json()

            if (data.success) {
                setLienHe(data.data)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching lien he:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLienHe()
    }, [page, filterLoai, filterTrangThai])

    // Lọc theo search term
    const filteredLienHe = lienHe.filter(item =>
        item.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.soDienThoai.includes(searchTerm) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Xem chi tiết liên hệ
    const viewContactDetail = (contact: LienHe) => {
        setSelectedContact(contact)
        setShowDetailModal(true)
    }

    // Đóng modal chi tiết
    const closeDetailModal = () => {
        setSelectedContact(null)
        setShowDetailModal(false)
    }

    // Xóa liên hệ
    const handleDelete = async (id: number, ten: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa liên hệ "${ten}"?`)) return

        try {
            const response = await fetch(`/api/lienhe?id=${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                fetchLienHe() // Refresh data
                // Đóng modal nếu đang xem contact bị xóa
                if (selectedContact?.id === id) {
                    closeDetailModal()
                }
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error('Error deleting lien he:', error)
            alert('Có lỗi xảy ra khi xóa liên hệ')
        }
    }

    // Cập nhật trạng thái
    const toggleTrangThai = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'hoat_dong' ? 'ngung_hoat_dong' : 'hoat_dong'

        try {
            const response = await fetch('/api/lienhe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, trangThai: newStatus })
            })
            const data = await response.json()

            if (data.success) {
                fetchLienHe() // Refresh data
                // Cập nhật selectedContact nếu đang view
                if (selectedContact?.id === id) {
                    setSelectedContact({ ...selectedContact, trangThai: newStatus })
                }
            } else {
                alert(data.message)
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Có lỗi xảy ra khi cập nhật trạng thái')
        }
    }

    // Get icon cho loại liên hệ
    const getLoaiIcon = (loai: string) => {
        switch (loai) {
            case 'tu_van': return <MessageCircle className="w-4 h-4" />
            case 'hop_tac': return <Globe className="w-4 h-4" />
            case 'tuyen_dung': return <User className="w-4 h-4" />
            case 'khieu_nai': return <Mail className="w-4 h-4" />
            case 'khac': return <Phone className="w-4 h-4" />
            default: return <MessageCircle className="w-4 h-4" />
        }
    }

    // Get tên hiển thị cho loại liên hệ
    const getLoaiDisplayName = (loai: string) => {
        switch (loai) {
            case 'tu_van': return 'Tư vấn sản phẩm'
            case 'hop_tac': return 'Hợp tác kinh doanh'
            case 'tuyen_dung': return 'Tuyển dụng'
            case 'khieu_nai': return 'Khiếu nại/Góp ý'
            case 'khac': return 'Khác'
            default: return loai
        }
    }

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN')
    }

    // Unread notifications count
    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Quản lý Liên hệ
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Quản lý thông tin liên hệ và nhận thông báo real-time
                            </p>
                        </div>

                        {/* Notification Bell */}
                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                                    }`} />
                                <span>{isConnected ? 'Đang kết nối' : 'Mất kết nối'}</span>
                            </div>

                            {/* Notification Button */}
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                ← Dashboard
                            </button>
                            {/* Add Button */}
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                <Plus className="w-4 h-4" />
                                <span>Thêm liên hệ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Filter Loại */}
                                <select
                                    value={filterLoai}
                                    onChange={(e) => setFilterLoai(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả loại</option>
                                    <option value="tu_van">Tư vấn sản phẩm</option>
                                    <option value="hop_tac">Hợp tác kinh doanh</option>
                                    <option value="tuyen_dung">Tuyển dụng</option>
                                    <option value="khieu_nai">Khiếu nại/Góp ý</option>
                                    <option value="khac">Khác</option>
                                </select>

                                {/* Filter Trạng thái */}
                                <select
                                    value={filterTrangThai}
                                    onChange={(e) => setFilterTrangThai(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="hoat_dong">Hoạt động</option>
                                    <option value="ngung_hoat_dong">Ngừng hoạt động</option>
                                </select>

                                {/* Refresh Button */}
                                <button
                                    onClick={fetchLienHe}
                                    disabled={loading}
                                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                    <span>Làm mới</span>
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
                                                Thông tin
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Liên hệ
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
                                                <td colSpan={5} className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                                                        Đang tải...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredLienHe.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLienHe.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.ten}
                                                            </div>
                                                            {item.moTa && (
                                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                                    {item.moTa.length > 50 ? `${item.moTa.substring(0, 50)}...` : item.moTa}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-gray-400">
                                                                {formatDate(item.taoLuc)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            {getLoaiIcon(item.loai)}
                                                            <span className="text-sm text-gray-900">
                                                                {getLoaiDisplayName(item.loai)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-900">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{item.soDienThoai}</span>
                                                            </div>
                                                            {item.email && (
                                                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="truncate max-w-xs">{item.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => toggleTrangThai(item.id, item.trangThai)}
                                                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${item.trangThai === 'hoat_dong'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {item.trangThai === 'hoat_dong' ? (
                                                                <Eye className="w-3 h-3" />
                                                            ) : (
                                                                <EyeOff className="w-3 h-3" />
                                                            )}
                                                            <span>
                                                                {item.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                            </span>
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            {/* View Detail Button */}
                                                            <button
                                                                onClick={() => viewContactDetail(item)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id, item.ten)}
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

                    {/* Notifications Sidebar */}
                    {showNotifications && (
                        <div className="w-80">
                            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
                                {/* Header */}
                                <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Thông báo ({notifications.length})
                                    </h3>
                                    <button
                                        onClick={clearNotifications}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Xóa tất cả
                                    </button>
                                </div>

                                {/* Notifications List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Chưa có thông báo nào
                                        </div>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <div
                                                key={`${notification.timestamp}-${index}`}
                                                className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notification.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    {/* Type indicator */}
                                                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${notification.type === 'new_contact' ? 'bg-green-100 text-green-800' :
                                                        notification.type === 'contact_updated' ? 'bg-blue-100 text-blue-800' :
                                                            notification.type === 'contact_deleted' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {notification.type === 'new_contact' ? 'Mới' :
                                                            notification.type === 'contact_updated' ? 'Sửa' :
                                                                notification.type === 'contact_deleted' ? 'Xóa' : 'Khác'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Chi tiết liên hệ
                            </h2>
                            <button
                                onClick={closeDetailModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4">
                            <div className="space-y-6">
                                {/* Thông tin cơ bản */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Thông tin cơ bản
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Họ và tên
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedContact.ten}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại liên hệ
                                            </label>
                                            <div className="flex items-center space-x-2 bg-white p-2 rounded border">
                                                {getLoaiIcon(selectedContact.loai)}
                                                <span className="text-sm text-gray-900">
                                                    {getLoaiDisplayName(selectedContact.loai)}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Số điện thoại
                                            </label>
                                            <div className="flex items-center space-x-2 bg-white p-2 rounded border">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {selectedContact.soDienThoai}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <div className="flex items-center space-x-2 bg-white p-2 rounded border">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {selectedContact.email || 'Không có'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung */}
                                {selectedContact.moTa && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Nội dung liên hệ
                                        </h3>
                                        <div className="bg-white p-4 rounded border">
                                            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                {selectedContact.moTa}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin hệ thống */}
                                <div className="bg-gray-50 rounded-lg p-4">
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
                                                <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${selectedContact.trangThai === 'hoat_dong'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedContact.trangThai === 'hoat_dong' ? (
                                                        <Eye className="w-3 h-3" />
                                                    ) : (
                                                        <EyeOff className="w-3 h-3" />
                                                    )}
                                                    <span>
                                                        {selectedContact.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Thứ tự
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {selectedContact.thuTu}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày tạo
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {formatDate(selectedContact.taoLuc)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cập nhật lần cuối
                                            </label>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                {formatDate(selectedContact.capNhatLuc)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => toggleTrangThai(selectedContact.id, selectedContact.trangThai)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedContact.trangThai === 'hoat_dong'
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {selectedContact.trangThai === 'hoat_dong' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedContact.id, selectedContact.ten)}
                                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Xóa liên hệ
                                </button>
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}