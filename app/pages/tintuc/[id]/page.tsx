/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TinTuc {
    id: number;
    tieuDe: string;
    tomTat?: string;
    noiDung: string;
    hinhAnh?: string;
    taoLuc: string;
    tacGia: string;
    luotXem: number;
    trangThai: string;
}

export default function NewsDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [tinTuc, setTinTuc] = useState<TinTuc | null>(null);
    const [tinTucLienQuan, setTinTucLienQuan] = useState<TinTuc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Format ngày tháng
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Tạo placeholder image
    const getPlaceholderImage = (tieuDe: string) => {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8fafc"/>
                <rect x="50" y="50" width="700" height="300" fill="#e2e8f0" rx="12"/>
                <circle cx="200" cy="150" r="30" fill="#cbd5e1"/>
                <rect x="260" y="130" width="300" height="20" fill="#cbd5e1" rx="10"/>
                <rect x="260" y="160" width="200" height="15" fill="#e2e8f0" rx="7"/>
                <rect x="100" y="220" width="600" height="10" fill="#e2e8f0" rx="5"/>
                <rect x="100" y="240" width="500" height="10" fill="#e2e8f0" rx="5"/>
                <rect x="100" y="260" width="400" height="10" fill="#e2e8f0" rx="5"/>
                <text x="400" y="320" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="18" font-weight="bold">
                    ${tieuDe.length > 50 ? tieuDe.substring(0, 50) + '...' : tieuDe}
                </text>
                <text x="400" y="350" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="14">
                    EQ Pharma News
                </text>
            </svg>
        `)}`;
    };

    // Fetch tin tức chi tiết
    const fetchTinTuc = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/tintuc/${id}`);

            if (!response.ok) {
                throw new Error('Không thể tải tin tức');
            }

            const data = await response.json();

            if (data.tinTuc) {
                setTinTuc(data.tinTuc);
                // Nếu API trả về tin tức liên quan
                if (data.tinTucLienQuan) {
                    setTinTucLienQuan(data.tinTucLienQuan);
                }
            } else {
                setError('Không tìm thấy tin tức');
            }
        } catch (error) {
            console.error('Error fetching tin tuc:', error);
            setError('Có lỗi xảy ra khi tải tin tức');
        } finally {
            setLoading(false);
        }
    };

    // Fetch tin tức liên quan (nếu API không trả về)
    const fetchTinTucLienQuan = async () => {
        try {
            const response = await fetch(`/api/tintuc?limit=4&sortBy=luotXem&sortOrder=desc`);
            const data = await response.json();

            if (data.tinTucs) {
                // Loại bỏ tin tức hiện tại khỏi danh sách liên quan
                const filtered = data.tinTucs.filter((item: TinTuc) => item.id.toString() !== id);
                setTinTucLienQuan(filtered.slice(0, 4));
            }
        } catch (error) {
            console.error('Error fetching related news:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTinTuc();
        }
    }, [id]);

    // Fetch tin tức liên quan nếu chưa có
    useEffect(() => {
        if (tinTuc && tinTucLienQuan.length === 0) {
            fetchTinTucLienQuan();
        }
    }, [tinTuc, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                                <div className="p-6 border-b">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-20 h-6 bg-gray-200 rounded"></div>
                                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="w-3/4 h-8 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-64 bg-gray-200"></div>
                                <div className="p-6 space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-full h-4 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                                <div className="w-24 h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-16 h-12 bg-gray-200 rounded"></div>
                                            <div className="flex-1">
                                                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="w-16 h-3 bg-gray-200 rounded"></div>
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

    if (error || !tinTuc) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {error || 'Không tìm thấy tin tức'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/pages/tintuc"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ← Quay lại trang tin tức
                        </Link>
                        <button
                            onClick={() => {
                                setError(null);
                                fetchTinTuc();
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm text-gray-600">
                        <Link href="/" className="hover:text-green-600">Trang chủ</Link>
                        <span className="mx-2">›</span>
                        <Link href="/pages/tintuc" className="hover:text-green-600">Tin tức</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-800">{tinTuc.tieuDe}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Article Header */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Tin tức
                                    </span>
                                    <span>📅 {formatDate(tinTuc.taoLuc)}</span>
                                    <span>👁️ {tinTuc.luotXem.toLocaleString()} lượt xem</span>
                                    <span>✍️ {tinTuc.tacGia}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{tinTuc.tieuDe}</h1>
                                {tinTuc.tomTat && (
                                    <p className="text-xl text-green-600 font-medium">{tinTuc.tomTat}</p>
                                )}
                            </div>

                            {/* Featured Image */}
                            {tinTuc.hinhAnh && (
                                <div className="relative">
                                    <img
                                        src={tinTuc.hinhAnh}
                                        alt={tinTuc.tieuDe}
                                        className="w-full h-64 md:h-96 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = getPlaceholderImage(tinTuc.tieuDe);
                                        }}
                                    />
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="p-6">
                                <div
                                    className="prose max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-strong:text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: tinTuc.noiDung }}
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="p-6 bg-gray-50 border-t">
                                <div className="text-center">
                                    <p className="text-gray-700 mb-2">
                                        🏢 <strong>CÔNG TY CỔ PHẦN DƯỢC PHẨM EQ PHARMA</strong>
                                    </p>
                                    <p className="text-gray-700">
                                        📞 Hotline: <strong>0964.172.803</strong> |
                                        ✉️ Email: <strong>eq01pharma@gmail.com</strong>
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Share buttons */}

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                TIN TỨC LIÊN QUAN
                            </h3>

                            <div className="space-y-4">
                                {tinTucLienQuan.length > 0 ? (
                                    tinTucLienQuan.map((item) => (
                                        <Link key={item.id} href={`/pages/tintuc/${item.id}`}>
                                            <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
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
                                        <p>Không có tin tức liên quan</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-medium text-gray-800 mb-3">Liên hệ tư vấn</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>📞 <strong>0964.172.803</strong></p>
                                    <p>✉️ eq01pharma@gmail.com</p>
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