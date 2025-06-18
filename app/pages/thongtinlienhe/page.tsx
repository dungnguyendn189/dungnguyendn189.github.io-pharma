"use client";
import { useState } from "react";

interface ContactForm {
    hoTen: string;
    email: string;
    soDienThoai: string;
    noiDung: string;
    loai: string;
}

export default function ThongTinLienHe() {
    const [formData, setFormData] = useState<ContactForm>({
        hoTen: "",
        email: "",
        soDienThoai: "",
        noiDung: "",
        loai: "tu_van"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/lienhe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Gửi thông tin liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
                });
                // Reset form
                setFormData({
                    hoTen: "",
                    email: "",
                    soDienThoai: "",
                    noiDung: "",
                    loai: "tu_van"
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.message || 'Có lỗi xảy ra khi gửi thông tin'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({
                type: 'error',
                message: 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4 text-green-600">THÔNG TIN LIÊN HỆ</h1>
                <p className="text-gray-600">
                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Địa chỉ */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl mb-4">📍</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Địa chỉ</h3>
                    <p className="text-gray-600 text-sm">
                        Lô G6, Tầng 6, Tòa Nhà Việt Á<br />
                        Số 9 Phố Duy Tân, Phường Dịch Vọng Hậu<br />
                        Quận Cầu Giấy, Hà Nội
                    </p>
                </div>

                {/* Hotline */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl mb-4">📞</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Điện thoại</h3>
                    <p className="text-gray-600">
                        <strong className="text-green-600">0964.172.803</strong><br />
                        (Thời gian làm việc: 8:00 - 17:00)
                    </p>
                </div>

                {/* Email */}
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-4xl mb-4">✉️</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Email</h3>
                    <p className="text-gray-600">
                        <strong className="text-blue-600">eq01pharma@gmail.com</strong><br />
                        <span className="text-sm">(Phản hồi trong 24h)</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side - Company Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        CÔNG TY CỔ PHẦN DƯỢC PHẨM EQ PHARMA
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">🏢</span>
                            <div>
                                <p className="font-medium text-gray-800">Trụ sở chính:</p>
                                <p className="text-gray-600">Lô G6, Tầng 6, Tòa Nhà Việt Á, Số 9 Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">📋</span>
                            <div>
                                <p className="font-medium text-gray-800">Mã số thuế:</p>
                                <p className="text-gray-600">0109532550</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">⏰</span>
                            <div>
                                <p className="font-medium text-gray-800">Giờ làm việc:</p>
                                <p className="text-gray-600">
                                    Thứ 2 - Thứ 6: 8:00 - 17:00<br />
                                    Thứ 7: 8:00 - 12:00<br />
                                    Chủ nhật: Nghỉ
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-green-600 mt-1">🌐</span>
                            <div>
                                <p className="font-medium text-gray-800">Website:</p>
                                <p className="text-blue-600">https://eqpharma.vn</p>
                            </div>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="text-center mt-6">
                        <div className="w-24 h-24 mx-auto bg-green-600 rounded-full flex items-center justify-center">
                            <div className="text-white font-bold text-xl">EQ</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Tự hào là một trong những đơn vị dược phẩm uy tín trên thị trường Việt Nam
                        </p>
                    </div>
                </div>

                {/* Right side - Contact Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Gửi tin nhắn cho chúng tôi</h2>

                    {/* Status Message */}
                    {submitStatus.type && (
                        <div className={`mb-4 p-4 rounded-lg ${submitStatus.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            <div className="flex items-center gap-2">
                                <span>{submitStatus.type === 'success' ? '✅' : '❌'}</span>
                                <span>{submitStatus.message}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Loại liên hệ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại liên hệ <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="loai"
                                value={formData.loai}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="tu_van">Tư vấn sản phẩm</option>
                                <option value="hop_tac">Hợp tác kinh doanh</option>
                                <option value="tuyen_dung">Tuyển dụng</option>
                                <option value="khieu_nai">Khiếu nại/Góp ý</option>
                                <option value="khac">Khác</option>
                            </select>
                        </div>

                        {/* Họ tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="hoTen"
                                placeholder="Nhập họ và tên của bạn"
                                value={formData.hoTen}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập địa chỉ email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="soDienThoai"
                                placeholder="Nhập số điện thoại (10-11 số)"
                                value={formData.soDienThoai}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Nội dung */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="noiDung"
                                placeholder="Nhập nội dung cần tư vấn hoặc liên hệ..."
                                value={formData.noiDung}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Vui lòng mô tả chi tiết nhu cầu của bạn để chúng tôi hỗ trợ tốt nhất
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 rounded-md font-medium transition-colors duration-200 ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                    } text-white`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </div>
                                ) : (
                                    'Gửi tin nhắn'
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Bằng cách gửi form này, bạn đồng ý cho EQ Pharma liên hệ lại với bạn.
                        </p>
                    </form>
                </div>
            </div>

            {/* Google Maps */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Vị trí trên bản đồ</h2>
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096909825968!2d105.78825731472588!3d21.02881928599511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0x3c1d1b3b0a1b1b1b!2zVmnhu4d0IMOBIFRvd2Vy!5e0!3m2!1svi!2s!4v1634567890123!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Bản đồ Việt Á Tower"
                    />
                </div>
            </div>
        </div>
    );
}