/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TuyenDung {
    id: number;
    tieuDe: string;
    viTri: string;
    moTaCongViec: string;
    yeuCau: string;
    quyenLoi?: string;
    mucLuong: string;
    diaDiem: string;
    loaiHinhLamViec: string;
    kinhNghiem: string;
    hanNop: string;
    hinhAnh: string; // ✅ Thêm field hinhAnh
    trangThai: string;
    taoLuc: string;
    luotXem: number;
}

interface TinTuc {
    id: number;
    tieuDe: string;
    hinhAnh?: string;
    taoLuc: string;
    luotXem: number;
}

export default function RecruitmentDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [tuyenDung, setTuyenDung] = useState<TuyenDung | null>(null);
    const [tinTucLienQuan, setTinTucLienQuan] = useState<TinTuc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Format ngày tháng
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    // Check if deadline is near (within 7 days)
    const isDeadlineNear = (hanNop: string) => {
        try {
            const deadline = new Date(hanNop);
            const now = new Date();
            const diffTime = deadline.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays > 0;
        } catch {
            return false;
        }
    };

    // Check if deadline is passed
    const isDeadlinePassed = (hanNop: string) => {
        try {
            const deadline = new Date(hanNop);
            const now = new Date();
            return deadline < now;
        } catch {
            return false;
        }
    };

    // Tạo placeholder image
    const getPlaceholderImage = (tieuDe: string, viTri?: string) => {
        const title = viTri || tieuDe;
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0fdf4"/>
                <rect x="20" y="20" width="360" height="210" fill="#dcfce7" rx="12"/>
                <circle cx="100" cy="80" r="20" fill="#16a34a"/>
                <rect x="140" y="65" width="200" height="12" fill="#16a34a" rx="6"/>
                <rect x="140" y="85" width="150" height="8" fill="#22c55e" rx="4"/>
                <rect x="40" y="130" width="320" height="6" fill="#22c55e" rx="3"/>
                <rect x="40" y="145" width="280" height="6" fill="#22c55e" rx="3"/>
                <rect x="40" y="160" width="240" height="6" fill="#22c55e" rx="3"/>
                <text x="200" y="190" text-anchor="middle" fill="#15803d" font-family="Arial" font-size="12" font-weight="bold">
                    ${title.length > 30 ? title.substring(0, 30) + '...' : title}
                </text>
                <text x="200" y="210" text-anchor="middle" fill="#166534" font-family="Arial" font-size="10">
                    ${tieuDe.length > 40 ? tieuDe.substring(0, 40) + '...' : tieuDe}
                </text>
                <text x="200" y="230" text-anchor="middle" fill="#16a34a" font-family="Arial" font-size="10">
                    Aphar CM Careers
                </text>
            </svg>
        `)}`;
    };

    // ✅ Fix fetchTuyenDung để khớp với API response format
    const fetchTuyenDung = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching tuyen dung detail for ID:', id);

            const response = await fetch(`/api/tuyendung/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            // ✅ Check API response format { success: true, data: {...} }
            if (result.success && result.data) {
                setTuyenDung(result.data);
                setError(null);
            } else {
                console.error('API Error:', result.error);
                setError(result.error || 'Không tìm thấy thông tin tuyển dụng');
                setTuyenDung(null);
            }
        } catch (error) {
            console.error('Error fetching tuyen dung:', error);
            setError('Có lỗi xảy ra khi tải thông tin tuyển dụng');
            setTuyenDung(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fix fetchTinTucLienQuan để khớp với API response format
    const fetchTinTucLienQuan = async () => {
        try {
            const response = await fetch(`/api/tintuc?limit=6&sortBy=luotXem&sortOrder=desc`);

            if (!response.ok) {
                console.warn('Failed to fetch related news');
                return;
            }

            const result = await response.json();
            console.log('Related news response:', result);

            // ✅ Check API response format for tin tuc
            if (result.success && result.data) {
                setTinTucLienQuan(result.data.slice(0, 6));
            } else if (result.tinTucs) {
                // Fallback cho format cũ nếu có
                setTinTucLienQuan(result.tinTucs.slice(0, 6));
            } else {
                console.warn('No related news found');
                setTinTucLienQuan([]);
            }
        } catch (error) {
            console.error('Error fetching related news:', error);
            setTinTucLienQuan([]);
        }
    };

    // ✅ Function to increment view count
    const incrementViewCount = async () => {
        try {
            // Call API to increment view count
            await fetch(`/api/tuyendung/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'view' })
            });
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTuyenDung();
            fetchTinTucLienQuan();

            // ✅ Increment view count when page loads
            const timer = setTimeout(() => {
                incrementViewCount();
            }, 2000); // Delay 2s để đảm bảo user thực sự xem

            return () => clearTimeout(timer);
        }
    }, [id]);

    // ✅ Share functions
    const shareOnFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`${tuyenDung?.viTri} - ${tuyenDung?.tieuDe}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
    };

    const shareOnTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`${tuyenDung?.viTri} - ${tuyenDung?.tieuDe} tại Aphar CM`);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    };

    const shareOnLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`${tuyenDung?.viTri} - ${tuyenDung?.tieuDe} tại Aphar CM`);
        window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                                <div className="p-6 border-b">
                                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-16 h-12 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tuyenDung) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {error || 'Không tìm thấy thông tin tuyển dụng'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Vị trí tuyển dụng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/pages/tuyendung"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ← Quay lại trang tuyển dụng
                        </Link>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchTuyenDung();
                            }}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const deadlineStatus = isDeadlinePassed(tuyenDung.hanNop) ? 'expired' :
        isDeadlineNear(tuyenDung.hanNop) ? 'near' : 'active';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm text-gray-600">
                        <Link href="/" className="hover:text-green-600">Trang chủ</Link>
                        <span className="mx-2">›</span>
                        <Link href="/pages/tuyendung" className="hover:text-green-600">Tuyển dụng</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-800">{tuyenDung.viTri}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* ✅ Hero Image nếu có */}
                            {tuyenDung.hinhAnh && (
                                <div className="h-64 relative overflow-hidden">
                                    <img
                                        src={tuyenDung.hinhAnh}
                                        alt={tuyenDung.viTri}
                                        className="w-full h-full object-cover"
                                        onLoad={() => console.log('✅ Image loaded')}
                                        onError={(e) => {
                                            console.error('❌ Image error:', e);
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0  bg-opacity-40 flex items-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                                        <div className="p-6 text-white">
                                            <h1 className="text-3xl font-bold mb-2">{tuyenDung.viTri}</h1>
                                            <p className="text-lg opacity-90">{tuyenDung.tieuDe}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Article Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                                        {tuyenDung.loaiHinhLamViec}
                                    </span>
                                    {deadlineStatus === 'expired' ? (
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium">
                                            Hết hạn
                                        </span>
                                    ) : deadlineStatus === 'near' ? (
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium">
                                            Sắp hết hạn
                                        </span>
                                    ) : (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                                            Đang tuyển
                                        </span>
                                    )}
                                </div>

                                {/* Chỉ hiện title nếu không có hero image */}
                                {!tuyenDung.hinhAnh && (
                                    <>
                                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{tuyenDung.viTri}</h1>
                                        <h2 className="text-lg text-green-600 font-medium mb-4">{tuyenDung.tieuDe}</h2>
                                    </>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>💰</span>
                                        <div>
                                            <p className="text-gray-500">Mức lương</p>
                                            <p className="font-medium text-green-600">{tuyenDung.mucLuong}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📍</span>
                                        <div>
                                            <p className="text-gray-500">Địa điểm</p>
                                            <p className="font-medium">{tuyenDung.diaDiem}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>⏰</span>
                                        <div>
                                            <p className="text-gray-500">Kinh nghiệm</p>
                                            <p className="font-medium">{tuyenDung.kinhNghiem}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📅</span>
                                        <div>
                                            <p className="text-gray-500">Hạn nộp</p>
                                            <p className={`font-medium ${deadlineStatus === 'expired' ? 'text-red-600' : deadlineStatus === 'near' ? 'text-orange-600' : 'text-blue-600'}`}>
                                                {formatDate(tuyenDung.hanNop)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-4 pt-4 border-t">
                                    <span>📅 Đăng ngày: {formatDate(tuyenDung.taoLuc)}</span>
                                    <span>👁️ {tuyenDung.luotXem.toLocaleString()} lượt xem</span>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="p-6">
                                <div className="prose max-w-none">
                                    {/* Mô tả công việc */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>💼</span>
                                            Mô tả công việc
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div
                                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: tuyenDung.moTaCongViec }}
                                            />
                                        </div>
                                    </div>

                                    {/* Yêu cầu */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>📋</span>
                                            Yêu cầu công việc
                                        </h3>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div
                                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ __html: tuyenDung.yeuCau }}
                                            />
                                        </div>
                                    </div>

                                    {/* Quyền lợi */}
                                    {tuyenDung.quyenLoi && (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <span>🎁</span>
                                                Quyền lợi được hưởng
                                            </h3>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div
                                                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                                    dangerouslySetInnerHTML={{ __html: tuyenDung.quyenLoi }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Thông tin liên hệ */}
                                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span>📞</span>
                                            Thông tin liên hệ
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 mb-2">🏢 <strong>DƯỢC APHAR CM</strong></p>
                                                <p className="text-gray-600 mb-2">📍 80/31/15, Đường Dương Quảng Hàm, Phường 5, Quận Gò Vấp, TP HCM, VN</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 mb-2">📞 Hotline: <strong className="text-green-600">0376640406</strong></p>
                                                <p className="text-gray-600 mb-2">✉️ Email: <strong className="text-blue-600">apharcm1709@gmail.com</strong></p>
                                                <p className="text-gray-600">🌐 Website: <strong className="text-blue-600">https://eqpharma.vn</strong></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Apply button */}
                                    <div className="mt-8 text-center">
                                        {deadlineStatus === 'expired' ? (
                                            <div className="bg-red-100 text-red-800 py-3 px-6 rounded-lg inline-block">
                                                <span className="font-medium">Vị trí này đã hết hạn nộp hồ sơ</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-green-600 text-white py-4 px-8 rounded-lg inline-block font-medium text-lg">
                                                    📧 Gửi CV đến: apharcm1709@gmail.com
                                                </div>
                                                <p className="text-gray-600 text-sm">
                                                    Hoặc liên hệ trực tiếp qua Hotline: <strong className="text-green-600">0376640406</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ Social Share với functions thực tế */}
                                    <div className="mt-8 flex items-center justify-center gap-4 pt-6 border-t">
                                        <span className="text-gray-600">Chia sẻ vị trí tuyển dụng:</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={shareOnFacebook}
                                                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                                                title="Chia sẻ trên Facebook"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={shareOnTwitter}
                                                className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                                                title="Chia sẻ trên Twitter"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={shareOnLinkedIn}
                                                className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                                                title="Chia sẻ trên LinkedIn"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={shareOnWhatsApp}
                                                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                                                title="Chia sẻ qua WhatsApp"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                TIN TỨC NỔI BẬT
                            </h3>

                            <div className="space-y-4">
                                {tinTucLienQuan.length > 0 ? (
                                    tinTucLienQuan.map((item) => (
                                        <Link key={item.id} href={`/pages/tintuc/${item.id}`}>
                                            <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.hinhAnh || getPlaceholderImage(item.tieuDe)}
                                                        alt={item.tieuDe}
                                                        className="w-16 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.src = getPlaceholderImage(item.tieuDe);
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                                                        {item.tieuDe}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{formatDate(item.taoLuc)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        <p>Chưa có tin tức</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-medium text-gray-800 mb-3">Liên hệ tuyển dụng</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>📞 <strong>0376640406</strong></p>
                                    <p>✉️ apharcm1709@gmail.com</p>
                                    <p>🌐 https://eqpharma.vn</p>
                                </div>

                                <Link
                                    href="/pages/thongtinlienhe"
                                    className="block w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-center"
                                >
                                    LIÊN HỆ NGAY
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}