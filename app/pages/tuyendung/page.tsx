/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
    hinhAnh?: string; // ✅ Thêm field hinhAnh
    trangThai: string;
    taoLuc: string;
    luotXem?: number;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export default function TuyenDung() {
    const [tuyenDungs, setTuyenDungs] = useState<TuyenDung[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // ✅ Fix fetchTuyenDungs để khớp với API response format
    const fetchTuyenDungs = async (page = 1, append = false) => {
        try {
            if (page === 1) setLoading(true);
            else setIsLoadingMore(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '6',
                trangThai: 'dang_tuyen' // Chỉ lấy vị trí đang tuyển
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            console.log('Fetching with params:', params.toString());

            const response = await fetch(`/api/tuyendung?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            // ✅ Check API response format
            if (result.success && result.data) {
                if (append) {
                    setTuyenDungs(prev => [...prev, ...result.data]);
                } else {
                    setTuyenDungs(result.data);
                }
                setPagination(result.pagination);
                setCurrentPage(page);
                setError(null);
            } else {
                // Handle API error response
                console.error('API Error:', result.error);
                setError(result.error || 'Không thể tải danh sách tuyển dụng');
                if (!append) {
                    setTuyenDungs([]);
                    setPagination(null);
                }
            }
        } catch (error) {
            console.error('Error fetching tuyen dungs:', error);
            setError('Có lỗi xảy ra khi tải thông tin tuyển dụng');
            if (!append) {
                setTuyenDungs([]);
                setPagination(null);
            }
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Load more tuyển dụng
    const loadMore = () => {
        if (pagination?.hasNext && !isLoadingMore) {
            fetchTuyenDungs(currentPage + 1, true);
        }
    };

    // Handle search with debounce
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

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

    // ✅ Improved image handling với hinhAnh từ database
    const getJobImage = (item: TuyenDung) => {
        // Nếu có hình ảnh từ database (base64 hoặc URL)
        if (item.hinhAnh && item.hinhAnh.trim()) {
            return item.hinhAnh;
        }

        // Fallback to placeholder
        return getPlaceholderImage(item.tieuDe, item.viTri);
    };

    // Tạo placeholder image
    const getPlaceholderImage = (tieuDe: string, viTri: string) => {
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
                    ${viTri.length > 30 ? viTri.substring(0, 30) + '...' : viTri}
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

    // ✅ Debounce search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTuyenDungs(1, false);
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // ✅ Better loading state
    if (loading && tuyenDungs.length === 0) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-8 text-center text-green-600">TUYỂN DỤNG</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // ✅ Better error state
    if (error && tuyenDungs.length === 0) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchTuyenDungs(1, false);
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-green-600">TUYỂN DỤNG</h2>
                <p className="text-gray-600 mb-6">
                    Cơ hội nghề nghiệp tại Dược Aphar CM - Nơi phát triển sự nghiệp của bạn
                </p>

                {/* Search */}
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm vị trí, công việc..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        {/* ✅ Loading indicator for search */}
                        {loading && searchTerm && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Results info */}
            {pagination && (
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Hiển thị {tuyenDungs.length} / {pagination.totalCount} vị trí tuyển dụng
                        {searchTerm && ` cho "${searchTerm}"`}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="text-green-600 hover:underline flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            )}

            {/* ✅ Show error message if loading failed but still have data */}
            {error && tuyenDungs.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-yellow-600 hover:text-yellow-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Jobs Grid */}
            {tuyenDungs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {tuyenDungs.map((item) => (
                            <Link
                                key={item.id}
                                href={`/pages/tuyendung/${item.id}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
                            >
                                <div className="relative h-48">
                                    {/* ✅ Better image handling */}
                                    <img
                                        src={getJobImage(item)}
                                        alt={item.viTri}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            // Fallback to placeholder if image fails to load
                                            e.currentTarget.src = getPlaceholderImage(item.tieuDe, item.viTri);
                                        }}
                                    />

                                    {/* Status badges */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                                        {isDeadlinePassed(item.hanNop) ? (
                                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                                Hết hạn
                                            </span>
                                        ) : isDeadlineNear(item.hanNop) ? (
                                            <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                                Sắp hết hạn
                                            </span>
                                        ) : (
                                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm">
                                                Đang tuyển
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                        Hạn: {formatDate(item.hanNop)}
                                    </div>

                                    {/* ✅ View count if available */}
                                    {item.luotXem !== undefined && item.luotXem > 0 && (
                                        <div className="absolute bottom-2 right-2 bg-green-600 bg-opacity-80 text-white px-2 py-1 rounded text-xs">
                                            Lượt xem: {item.luotXem}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="mb-2">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                            {item.loaiHinhLamViec}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg mb-1 text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors">
                                        {item.viTri}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3 font-medium line-clamp-1">
                                        {item.tieuDe}
                                    </p>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                                        {item.moTaCongViec.length > 100
                                            ? item.moTaCongViec.substring(0, 100) + '...'
                                            : item.moTaCongViec
                                        }
                                    </p>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center text-sm text-green-600">
                                            <span>💰</span>
                                            <span className="ml-1 font-medium">{item.mucLuong}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>📍</span>
                                            <span className="ml-1">{item.diaDiem}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-blue-600">
                                            <span>⏰</span>
                                            <span className="ml-1">{item.kinhNghiem}</span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center group-hover:bg-green-700">
                                        Xem chi tiết & ứng tuyển
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {pagination?.hasNext && (
                        <div className="text-center">
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <span>Tải thêm vị trí ({pagination.totalCount - tuyenDungs.length} còn lại)</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Empty State
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">💼</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {searchTerm ? 'Không tìm thấy vị trí tuyển dụng' : 'Chưa có vị trí tuyển dụng'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm
                            ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác.`
                            : 'Hiện tại chưa có vị trí tuyển dụng nào được đăng.'
                        }
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            ← Xem tất cả vị trí
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}