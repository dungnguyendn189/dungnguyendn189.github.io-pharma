'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DanhMuc } from '@prisma/client'



export default function QuanLyDanhMucPage() {
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingDanhMuc, setEditingDanhMuc] = useState<DanhMuc | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    // Form state
    const [formData, setFormData] = useState({
        tenDanhMuc: '',
        moTa: '',
        icon: '',
        mauSac: '#3B82F6',
        thuTu: '',
        trangThai: 'hoat_dong'
    })

    // Predefined icons
    const iconOptions = [
        { value: '💊', label: '💊 Thuốc viên' },
        { value: '🧴', label: '🧴 Thuốc nước' },
        { value: '💉', label: '💉 Thuốc tiêm' },
        { value: '🩹', label: '🩹 Băng gạc' },
        { value: '🌡️', label: '🌡️ Nhiệt kế' },
        { value: '🧪', label: '🧪 Thuốc thử' },
        { value: '⚕️', label: '⚕️ Y tế' },
        { value: '🏥', label: '🏥 Bệnh viện' },
        { value: '💝', label: '💝 Chăm sóc' },
        { value: '🌿', label: '🌿 Thảo dược' },
        { value: '👶', label: '👶 Trẻ em' },
        { value: '👴', label: '👴 Người già' },
        { value: '❤️', label: '❤️ Tim mạch' },
        { value: '🧠', label: '🧠 Thần kinh' },
        { value: '👁️', label: '👁️ Mắt' }
    ]

    // Predefined colors
    const colorOptions = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
        '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
        '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
    ]

    // Kiểm tra đăng nhập
    useEffect(() => {
        const admin = localStorage.getItem('admin')
        if (!admin) {
            router.push('/admin/dang-nhap')
            return
        }
    }, [router])

    // Load dữ liệu
    useEffect(() => {
        loadDanhMucs()
    }, [])

    const loadDanhMucs = async () => {
        try {
            const response = await fetch('/api/danhmuc')
            const data = await response.json()
            if (response.ok) {
                setDanhMucs(data.danhMucs || [])
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách danh mục:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitting form with data:', formData)
        if (!formData.tenDanhMuc.trim()) {
            alert('Vui lòng nhập tên danh mục')
            return
        }


        try {
            const url = editingDanhMuc ? `/api/danhmuc/${editingDanhMuc.id}` : '/api/danhmuc'
            const method = editingDanhMuc ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    thuTu: formData.thuTu ? parseInt(formData.thuTu) : 0
                })
            })

            if (response.ok) {
                loadDanhMucs()
                resetForm()
                setShowModal(false)
                alert(editingDanhMuc ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!')
            } else {
                const data = await response.json()
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            alert('Có lỗi xảy ra, vui lòng thử lại')
            console.log(error)
        }
    }

    const handleEdit = (danhMuc: DanhMuc) => {
        setEditingDanhMuc(danhMuc)
        setFormData({
            tenDanhMuc: danhMuc.tenDanhMuc,
            moTa: danhMuc.moTa || '',
            icon: danhMuc.icon || '',
            mauSac: danhMuc.mauSac || '#3B82F6',
            thuTu: danhMuc.thuTu.toString(),
            trangThai: danhMuc.trangThai
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?\nLưu ý: Tất cả thuốc trong danh mục này cũng sẽ bị ảnh hưởng.')) return

        try {
            const response = await fetch(`/api/danhmuc/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                loadDanhMucs()
                alert('Xóa danh mục thành công!')
            } else {
                const data = await response.json()
                alert('Lỗi: ' + data.error)
            }
        } catch (error) {
            alert('Có lỗi xảy ra, vui lòng thử lại')
            console.log(error)
        }
    }

    const resetForm = () => {
        setFormData({
            tenDanhMuc: '',
            moTa: '',
            icon: '',
            mauSac: '#3B82F6',
            thuTu: '',
            trangThai: 'hoat_dong'
        })
        setEditingDanhMuc(null)
    }

    const filteredDanhMucs = danhMucs.filter(danhMuc =>
        danhMuc.tenDanhMuc.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
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
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
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
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                + Thêm danh mục
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">📁</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng danh mục
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {danhMucs.length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Đang hoạt động
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {danhMucs.filter(dm => dm.trangThai === 'hoat_dong').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✗</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tạm ngưng
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {danhMucs.filter(dm => dm.trangThai === 'tam_ngung').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                    {filteredDanhMucs.map((danhMuc) => (
                        <div key={danhMuc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                                        style={{ backgroundColor: danhMuc.mauSac || '#3B82F6' }}
                                    >
                                        {danhMuc.icon || '📁'}
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${danhMuc.trangThai === 'hoat_dong'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {danhMuc.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Tạm ngưng'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {danhMuc.tenDanhMuc}
                                </h3>

                                {danhMuc.moTa && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {danhMuc.moTa}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <span>Thứ tự: {danhMuc.thuTu}</span>
                                    <span>{new Date(danhMuc.taoLuc).toLocaleDateString('vi-VN')}</span>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(danhMuc)}
                                        className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(danhMuc.id)}
                                        className="flex-1 bg-red-600 text-white px-3 py-2 text-sm rounded hover:bg-red-700"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDanhMucs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'Không tìm thấy danh mục nào' : 'Chưa có danh mục nào'}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingDanhMuc ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên danh mục *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.tenDanhMuc}
                                        onChange={(e) => setFormData({ ...formData, tenDanhMuc: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Nhập tên danh mục"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Icon
                                    </label>
                                    <select
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Chọn icon</option>
                                        {iconOptions.map(icon => (
                                            <option key={icon.value} value={icon.value}>{icon.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Màu sắc
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {colorOptions.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mauSac: color })}
                                                className={`w-8 h-8 rounded-full border-2 ${formData.mauSac === color ? 'border-gray-800' : 'border-gray-300'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        value={formData.mauSac}
                                        onChange={(e) => setFormData({ ...formData, mauSac: e.target.value })}
                                        className="w-full h-10 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.moTa}
                                        onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Mô tả về danh mục (tùy chọn)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thứ tự hiển thị
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.thuTu}
                                        onChange={(e) => setFormData({ ...formData, thuTu: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Số nhỏ sẽ hiển thị trước</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={formData.trangThai}
                                        onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="hoat_dong">Hoạt động</option>
                                        <option value="tam_ngung">Tạm ngưng</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            resetForm()
                                        }}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        {editingDanhMuc ? 'Cập nhật' : 'Thêm mới'}
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