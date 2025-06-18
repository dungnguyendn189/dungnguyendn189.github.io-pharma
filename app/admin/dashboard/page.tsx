'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Admin {
    hoTen: string
    // Add other properties as needed
}

export default function AdminDashboard() {
    const [admin, setAdmin] = useState<Admin | null>(null)
    const router = useRouter()

    useEffect(() => {
        const adminData = localStorage.getItem('admin')
        if (!adminData) {
            router.push('/admin/dangnhap')
            return
        }
        setAdmin(JSON.parse(adminData))
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin')
        router.push('/admin/dangnhap')
    }

    if (!admin) {
        return <div>Đang tải...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Dashboard Admin
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span>Hello, {admin.hoTen}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/thuoc')}>
                            <h3 className="text-lg font-medium text-gray-900">Quản lý thuốc</h3>
                            <p className="text-gray-600">Thêm, sửa, xóa thuốc</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/tintuc')}>
                            <h3 className="text-lg font-medium text-gray-900">Tin tức</h3>
                            <p className="text-gray-600">Quản lý bài viết</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/tuyendung')}>
                            <h3 className="text-lg font-medium text-gray-900">Tuyển dụng</h3>
                            <p className="text-gray-600">Đăng tin tuyển dụng</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/lienhe')}>
                            <h3 className="text-lg font-medium text-gray-900">Liên hệ</h3>
                            <p className="text-gray-600">Quản lý thông tin liên hệ</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/danhmuc')}>
                            <h3 className="text-lg font-medium text-gray-900">Danh Mục</h3>
                            <p className="text-gray-600">Thêm, sửa, xóa Danh Mục</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/dailyphanphoi')}>
                            <h3 className="text-lg font-medium text-gray-900">Đại Lý Phân Phối</h3>
                            <p className="text-gray-600">Thêm, sửa, xóa Danh Mục</p>
                        </button>
                        <button className="bg-white p-6 rounded-lg shadow hover:cursor-pointer" onClick={() => router.push('/admin/social')}>
                            <h3 className="text-lg font-medium text-gray-900">SOCIAL</h3>
                            <p className="text-gray-600">Thêm, sửa, xóa Danh Mục</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}