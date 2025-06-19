'use client'

import { useState } from 'react'
import {
    User,
    MapPin,
    Building2,
    MessageSquare,
    Send,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react'

export default function DangKyDaiLyPage() {
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        noiDungDangKy: '',
        diaChi: '',
        tinhThanhPho: '',
        quanHuyen: '',
        phuongXa: '',
        loiNhan: ''
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', content: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.hoTen.trim()) {
            newErrors.hoTen = 'Vui lòng nhập họ và tên'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email'
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ'
            }
        }

        if (!formData.soDienThoai.trim()) {
            newErrors.soDienThoai = 'Vui lòng nhập số điện thoại'
        } else {
            const phoneRegex = /^[0-9]{10,11}$/
            if (!phoneRegex.test(formData.soDienThoai.replace(/\s/g, ''))) {
                newErrors.soDienThoai = 'Số điện thoại không hợp lệ (10-11 số)'
            }
        }

        if (!formData.noiDungDangKy) {
            newErrors.noiDungDangKy = 'Vui lòng chọn loại đăng ký'
        }

        if (!formData.diaChi.trim()) {
            newErrors.diaChi = 'Vui lòng nhập địa chỉ'
        }

        if (!formData.tinhThanhPho.trim()) {
            newErrors.tinhThanhPho = 'Vui lòng nhập tỉnh/thành phố'
        }

        if (!formData.quanHuyen.trim()) {
            newErrors.quanHuyen = 'Vui lòng nhập quận/huyện'
        }

        if (!formData.phuongXa.trim()) {
            newErrors.phuongXa = 'Vui lòng nhập phường/xã'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Clear message when user makes changes
        if (message.content) {
            setMessage({ type: '', content: '' })
        }
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            setMessage({
                type: 'error',
                content: 'Vui lòng kiểm tra lại thông tin đã nhập'
            })
            return
        }

        setLoading(true)
        setMessage({ type: '', content: '' })

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('access_key', '9a9dd9f8-0324-4c10-95f5-a4fe7c909c50') // 🔥 THAY BẰNG ACCESS KEY THẬT
            formDataToSend.append('subject', `🏢 Đăng ký đại lý mới - ${formData.noiDungDangKy}`)
            formDataToSend.append('from_name', formData.hoTen)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('message', `
    THÔNG TIN ĐĂNG KÝ ĐẠI LÝ PHÂN PHỐI
    
    👤 Thông tin cá nhân:
    - Họ tên: ${formData.hoTen}
    - Email: ${formData.email}
    - Số điện thoại: ${formData.soDienThoai}
    - Loại đăng ký: ${formData.noiDungDangKy}
    
    📍 Địa chỉ kinh doanh:
    - Địa chỉ: ${formData.diaChi}
    - Phường/Xã: ${formData.phuongXa}
    - Quận/Huyện: ${formData.quanHuyen}
    - Tỉnh/Thành phố: ${formData.tinhThanhPho}
    
    💬 Lời nhắn:
    ${formData.loiNhan || 'Không có'}
    
    📅 Thời gian đăng ký: ${new Date().toLocaleString('vi-VN')}
            `)

            // Gửi qua Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json()

            if (data.success) {
                setMessage({
                    type: 'success',
                    content: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
                })

                // Reset form
                setFormData({
                    hoTen: '',
                    email: '',
                    soDienThoai: '',
                    noiDungDangKy: '',
                    diaChi: '',
                    tinhThanhPho: '',
                    quanHuyen: '',
                    phuongXa: '',
                    loiNhan: ''
                })
                setErrors({})
            } else {
                setMessage({
                    type: 'error',
                    content: data.message || 'Có lỗi xảy ra, vui lòng thử lại'
                })
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            setMessage({
                type: 'error',
                content: 'Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Building2 className="w-6 h-6 mr-2" />
                            Đăng ký làm đại lý phân phối
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Tham gia hệ thống phân phối dược phẩm EQ Pharma
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Message Alert */}
                {message.content && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <p className="text-sm font-medium">{message.content}</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Thông tin cá nhân */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                Thông tin cá nhân
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="hoTen"
                                        value={formData.hoTen}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.hoTen ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập họ và tên"
                                    />
                                    {errors.hoTen && (
                                        <p className="mt-1 text-sm text-red-600">{errors.hoTen}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="example@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="soDienThoai"
                                        value={formData.soDienThoai}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.soDienThoai ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="0901234567"
                                    />
                                    {errors.soDienThoai && (
                                        <p className="mt-1 text-sm text-red-600">{errors.soDienThoai}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại đăng ký <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="noiDungDangKy"
                                        value={formData.noiDungDangKy}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.noiDungDangKy ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Chọn loại đăng ký</option>
                                        <option value="quay_thuoc_phan_phoi">Quầy thuốc phân phối</option>
                                        <option value="cua_hang_ban_le">Cửa hàng bán lẻ</option>
                                        <option value="dai_ly_cap_1">Đại lý cấp 1</option>
                                        <option value="dai_ly_cap_2">Đại lý cấp 2</option>
                                        <option value="nha_phan_phoi">Nhà phân phối</option>
                                    </select>
                                    {errors.noiDungDangKy && (
                                        <p className="mt-1 text-sm text-red-600">{errors.noiDungDangKy}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Địa chỉ kinh doanh
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ chi tiết <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="diaChi"
                                        value={formData.diaChi}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.diaChi ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Số nhà, tên đường..."
                                    />
                                    {errors.diaChi && (
                                        <p className="mt-1 text-sm text-red-600">{errors.diaChi}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="tinhThanhPho"
                                            value={formData.tinhThanhPho}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.tinhThanhPho ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Hà Nội, TP.HCM..."
                                        />
                                        {errors.tinhThanhPho && (
                                            <p className="mt-1 text-sm text-red-600">{errors.tinhThanhPho}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quận/Huyện <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="quanHuyen"
                                            value={formData.quanHuyen}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.quanHuyen ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Quận/Huyện"
                                        />
                                        {errors.quanHuyen && (
                                            <p className="mt-1 text-sm text-red-600">{errors.quanHuyen}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phường/Xã <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="phuongXa"
                                            value={formData.phuongXa}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent ${errors.phuongXa ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Phường/Xã"
                                        />
                                        {errors.phuongXa && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phuongXa}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lời nhắn */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Lời nhắn
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả về cửa hàng/doanh nghiệp của bạn (tùy chọn)
                                </label>
                                <textarea
                                    name="loiNhan"
                                    value={formData.loiNhan}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent resize-none"
                                    placeholder="Ví dụ: Tôi đang kinh doanh cửa hàng thuốc tại địa phương được 5 năm..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Gửi đăng ký</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Note */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <div className="flex">
                                <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-yellow-700">
                                        <strong>Lưu ý:</strong> Sau khi gửi đăng ký, chúng tôi sẽ xem xét và liên hệ với bạn trong vòng 24-48 giờ.
                                        Vui lòng đảm bảo thông tin liên hệ chính xác.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}