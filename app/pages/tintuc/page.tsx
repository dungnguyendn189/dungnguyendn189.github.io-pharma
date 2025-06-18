/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link' // THÊM: Import Link

// import CardNews from '@/app/_components/CardNews'

interface TinTuc {
    id: number;
    tieuDe: string;
    tomTat: string;
    noiDung: string;
    hinhAnh?: string;
    ngayDang?: string;
    taoLuc: string;
    tacGia: string;
    luotXem: number;
    trangThai: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export default function NewsList() {
    const [tinTucs, setTinTucs] = useState<TinTuc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Fetch tin tức từ API
    const fetchTinTucs = async (page = 1, append = false) => {
        try {
            if (page === 1) setLoading(true);
            else setIsLoadingMore(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '6', // 6 tin tức mỗi trang
                sortBy: 'taoLuc',
                sortOrder: 'desc'
            });

            if (searchTerm.trim()) {
                params.append('search', searchTerm.trim());
            }

            const response = await fetch(`/api/tintuc?${params}`);
            const data = await response.json();

            if (data.tinTucs) {
                if (append) {
                    setTinTucs(prev => [...prev, ...data.tinTucs]);
                } else {
                    setTinTucs(data.tinTucs);
                }
                setPagination(data.pagination);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching tin tucs:', error);
            setError('Có lỗi xảy ra khi tải tin tức');
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Load more tin tức
    const loadMore = () => {
        if (pagination?.hasNext && !isLoadingMore) {
            fetchTinTucs(currentPage + 1, true);
        }
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Format ngày tháng
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Tạo placeholder image
    const getPlaceholderImage = (tieuDe: string) => {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8fafc"/>
                <rect x="20" y="20" width="360" height="210" fill="#e2e8f0" rx="12"/>
                <circle cx="100" cy="80" r="20" fill="#cbd5e1"/>
                <rect x="140" y="65" width="200" height="12" fill="#cbd5e1" rx="6"/>
                <rect x="140" y="85" width="150" height="8" fill="#e2e8f0" rx="4"/>
                <rect x="40" y="130" width="320" height="6" fill="#e2e8f0" rx="3"/>
                <rect x="40" y="145" width="280" height="6" fill="#e2e8f0" rx="3"/>
                <rect x="40" y="160" width="240" height="6" fill="#e2e8f0" rx="3"/>
                <text x="200" y="200" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">
                    ${tieuDe.length > 30 ? tieuDe.substring(0, 30) + '...' : tieuDe}
                </text>
                <text x="200" y="220" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="12">
                    Tin tức EQ Pharma
                </text>
            </svg>
        `)}`;
    };

    useEffect(() => {
        fetchTinTucs(1, false);
    }, [searchTerm]);

    if (loading && tinTucs.length === 0) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-8 text-center text-green-600">TIN TỨC</h2>
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

    if (error) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchTinTucs(1, false);
                        }}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
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
                <h2 className="text-3xl font-bold mb-4 text-green-600">TIN TỨC</h2>
                <p className="text-gray-600 mb-6">
                    Cập nhật những thông tin mới nhất về sức khỏe và dược phẩm
                </p>

                {/* Search */}
                <div className="max-w-md mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tin tức..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Results info */}
            {pagination && (
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                        Hiển thị {tinTucs.length} / {pagination.totalCount} tin tức
                        {searchTerm && ` cho "${searchTerm}"`}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="text-green-600 hover:underline flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            )}

            {/* News Grid */}
            {tinTucs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {tinTucs.map((item) => (
                            <Link
                                key={item.id}
                                href={`/pages/tintuc/${item.id}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer group"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={item.hinhAnh || getPlaceholderImage(item.tieuDe)}
                                        alt={item.tieuDe}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"

                                    />
                                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                                        {item.luotXem} lượt xem
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 h-14 group-hover:text-green-600 transition-colors">
                                        {item.tieuDe}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3 h-16">
                                        {item.tomTat || item.noiDung.substring(0, 120) + '...'}
                                    </p>

                                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                        <span>📅 {formatDate(item.taoLuc)}</span>
                                        <span>✍️ {item.tacGia}</span>
                                    </div>

                                    <div className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center group-hover:bg-green-700">
                                        Đọc tiếp
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
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang tải...
                                    </>
                                ) : (
                                    <>
                                        <span>Tải thêm tin tức</span>
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
                    <div className="text-6xl mb-4">📰</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {searchTerm ? 'Không tìm thấy tin tức' : 'Chưa có tin tức'}
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác.`
                            : 'Hiện tại chưa có tin tức nào được đăng.'
                        }
                    </p>
                </div>
            )}
        </section>
    );
}