/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface DanhMuc {
    id: number;
    tenDanhMuc: string;
    icon?: string;
    mauSac?: string;
}

interface Thuoc {
    id: number;
    tenThuoc: string;
    moTa?: string;
    gia: number;
    soLuong: number;
    danhMucId: number;
    hangSanXuat: string;
    xuatXu: string;
    hinhAnh?: string;
    trangThai: string;
    hanSuDung?: string;
    cachDung?: string;
    thanPhan?: string;
    congDung?: string;
    luotXem: number;
    taoLuc: string;
    danhMuc: DanhMuc;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Component chính chứa useSearchParams
function ProductsPageContent() {
    const searchParams = useSearchParams();

    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    const [thuocs, setThuocs] = useState<Thuoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<string>('default');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState<Record<number | 'all', number>>({} as Record<number | 'all', number>);

    // ✅ Debounce search term
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // ✅ Memoized fetch functions
    const fetchCategoryCounts = useCallback(async () => {
        if (danhMucs.length === 0) return;

        try {
            // Get total count
            const allResponse = await fetch('/api/thuoc?limit=0&trangThai=con_hang');
            const allData = await allResponse.json();

            const counts: Record<number | 'all', number> = {
                'all': allData.pagination?.totalCount || 0
            };

            // Get count for each category
            for (const danhMuc of danhMucs) {
                const categoryResponse = await fetch(`/api/thuoc?limit=0&trangThai=con_hang&danhMucId=${danhMuc.id}`);
                const categoryData = await categoryResponse.json();
                counts[danhMuc.id] = categoryData.pagination?.totalCount || 0;
            }

            setCategoryCounts(counts);
        } catch (error) {
            console.error('Error fetching category counts:', error);
        }
    }, [danhMucs]);

    // ✅ Memoized fetch thuocs function
    const fetchThuocs = useCallback(async (page = 1, append = false) => {
        try {
            if (page === 1) setLoading(true);
            else setIsLoadingMore(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                trangThai: 'con_hang'
            });

            if (selectedCategory !== 'all') {
                params.append('danhMucId', selectedCategory.toString());
            }

            if (debouncedSearchTerm.trim()) {
                params.append('search', debouncedSearchTerm.trim());
            }

            const response = await fetch(`/api/thuoc?${params}`);
            const data = await response.json();
            console.log(data);

            if (data.thuocs) {
                if (append) {
                    setThuocs(prev => [...prev, ...data.thuocs]);
                } else {
                    setThuocs(data.thuocs);
                }
                setPagination(data.pagination);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching thuocs:', error);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [selectedCategory, debouncedSearchTerm]);

    // Fetch dữ liệu danh mục
    const fetchDanhMuc = async () => {
        try {
            const response = await fetch('/api/danhmuc');
            const data = await response.json();

            if (data.danhMucs) {
                const activeDanhMucs = data.danhMucs.filter(
                    (dm: DanhMuc & { trangThai?: string }) => dm.trangThai === 'hoat_dong'
                );
                setDanhMucs(activeDanhMucs);
            }
        } catch (error) {
            console.error('Error fetching danh muc:', error);
        }
    };

    // ✅ Initial data fetch - only once
    useEffect(() => {
        fetchDanhMuc();
    }, []);

    // ✅ Fetch category counts when danhMucs change
    useEffect(() => {
        if (danhMucs.length > 0) {
            fetchCategoryCounts();
        }
    }, [danhMucs, fetchCategoryCounts]);

    // ✅ Fetch thuocs when dependencies change
    useEffect(() => {
        if (danhMucs.length > 0) {
            fetchThuocs(1, false);
        }
    }, [danhMucs, fetchThuocs]);

    // ✅ Handle URL params change
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const categoryId = searchParams.get('id');

        if (categoryParam && danhMucs.length > 0) {
            if (categoryId) {
                const validCategory = danhMucs.find(dm => dm.id === parseInt(categoryId));
                if (validCategory) {
                    setSelectedCategory(validCategory.id);
                    return;
                }
            }

            const validCategory = danhMucs.find(dm =>
                dm.tenDanhMuc.toLowerCase().replace(/\s+/g, '-') === categoryParam
            );
            if (validCategory) {
                setSelectedCategory(validCategory.id);
            } else {
                setSelectedCategory('all');
            }
        }
    }, [searchParams, danhMucs]);

    // ✅ Memoized sorted thuocs
    const sortedThuocs = useCallback(() => {
        return [...thuocs].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.tenThuoc.localeCompare(b.tenThuoc);
                case 'name-desc':
                    return b.tenThuoc.localeCompare(a.tenThuoc);
                case 'price-asc':
                    return a.gia - b.gia;
                case 'price-desc':
                    return b.gia - a.gia;
                case 'popular':
                    return b.luotXem - a.luotXem;
                case 'newest':
                    return new Date(b.taoLuc).getTime() - new Date(a.taoLuc).getTime();
                default:
                    return 0;
            }
        });
    }, [thuocs, sortBy])();

    const handleCategorySelect = useCallback((categoryId: number | 'all') => {
        setSelectedCategory(categoryId);
        setShowCategoryModal(false);
        setCurrentPage(1);
    }, []);

    // ✅ Fix search change - no immediate API call
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const loadMore = useCallback(() => {
        if (pagination?.hasNext && !isLoadingMore) {
            fetchThuocs(currentPage + 1, true);
        }
    }, [pagination?.hasNext, isLoadingMore, currentPage, fetchThuocs]);

    const getCurrentCategoryName = useCallback(() => {
        if (selectedCategory === 'all') return 'Tất cả sản phẩm';
        const category = danhMucs.find(dm => dm.id === selectedCategory);
        return category?.tenDanhMuc || 'Tất cả sản phẩm';
    }, [selectedCategory, danhMucs]);

    const getCategoryCount = useCallback((categoryId: number | 'all') => {
        return categoryCounts[categoryId] || 0;
    }, [categoryCounts]);

    // Tạo placeholder image nếu không có hình ảnh
    const getPlaceholderImage = useCallback((tenThuoc: string) => {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <rect x="10" y="10" width="280" height="180" fill="#e5e7eb" rx="8"/>
                <circle cx="100" cy="70" r="15" fill="#d1d5db"/>
                <rect x="130" y="60" width="120" height="8" fill="#d1d5db" rx="4"/>
                <rect x="130" y="75" width="80" height="6" fill="#e5e7eb" rx="3"/>
                <rect x="30" y="120" width="240" height="4" fill="#e5e7eb" rx="2"/>
                <rect x="30" y="130" width="200" height="4" fill="#e5e7eb" rx="2"/>
                <rect x="30" y="140" width="160" height="4" fill="#e5e7eb" rx="2"/>
                <text x="150" y="170" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">
                    ${tenThuoc.length > 20 ? tenThuoc.substring(0, 20) + '...' : tenThuoc}
                </text>
            </svg>
        `)}`;
    }, []);

    if (loading && thuocs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="hidden lg:block lg:w-1/4">
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
                                <div className="space-y-3">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-3/4">
                            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4">
                                        <div className="h-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:w-1/4 border border-green-600 rounded-2xl h-fit">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
                            <div className="border-b-2 border-green-500 pb-3 mb-6">
                                <h2 className="text-xl font-bold text-green-600 uppercase tracking-wide">
                                    Danh mục sản phẩm
                                </h2>
                            </div>

                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>

                                    {/* ✅ Loading indicator when searching */}
                                    {searchTerm !== debouncedSearchTerm && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleCategorySelect('all')}
                                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${selectedCategory === 'all'
                                        ? 'bg-green-500 text-white'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📋</span>
                                        <span className="text-sm font-medium">Tất cả sản phẩm</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === 'all'
                                        ? 'bg-green-400 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {getCategoryCount('all')}
                                    </span>
                                </button>

                                {danhMucs.map((danhMuc) => (
                                    <button
                                        key={danhMuc.id}
                                        onClick={() => handleCategorySelect(danhMuc.id)}
                                        className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-colors ${selectedCategory === danhMuc.id
                                            ? 'bg-green-500 text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded flex items-center justify-center text-sm text-white"
                                                style={{ backgroundColor: danhMuc.mauSac || '#0a5e42' }}
                                            >
                                                {danhMuc.icon || '📦'}
                                            </div>
                                            <span className="text-sm font-medium text-left">{danhMuc.tenDanhMuc}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === danhMuc.id
                                            ? 'bg-green-400 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {getCategoryCount(danhMuc.id)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-3/4">
                        {/* Mobile Category Button */}
                        <div className="lg:hidden mb-6">
                            <button
                                onClick={() => setShowCategoryModal(true)}
                                className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between border-2 border-green-500"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <span className="font-medium text-green-600">{getCurrentCategoryName()}</span>
                                </div>
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <div className="lg:hidden mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                {/* ✅ Loading indicator when searching */}
                                {searchTerm !== debouncedSearchTerm && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    {getCurrentCategoryName()}
                                </h1>
                                <p className="text-gray-600">
                                    Hiển thị {sortedThuocs.length} / {pagination?.totalCount || 0} sản phẩm
                                    {searchTerm && ` cho "${searchTerm}"`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 whitespace-nowrap">Sắp xếp:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="default">Mặc định</option>
                                    <option value="name">Tên A-Z</option>
                                    <option value="name-desc">Tên Z-A</option>
                                    <option value="price-asc">Giá thấp đến cao</option>
                                    <option value="price-desc">Giá cao đến thấp</option>
                                    <option value="popular">Phổ biến nhất</option>
                                    <option value="newest">Mới nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedThuocs.map((thuoc) => (
                                <Link key={thuoc.id} href={`/pages/sanphamvadichvu/${thuoc.id}`}>
                                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
                                        <div className="relative">
                                            <img
                                                src={thuoc.hinhAnh || getPlaceholderImage(thuoc.tenThuoc)}
                                                alt={thuoc.tenThuoc}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = getPlaceholderImage(thuoc.tenThuoc);
                                                }}
                                            />

                                            {/* Status badges */}
                                            {thuoc.soLuong <= 5 && thuoc.soLuong > 0 && (
                                                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                                    Sắp hết
                                                </div>
                                            )}
                                            {thuoc.soLuong === 0 && (
                                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                    Hết hàng
                                                </div>
                                            )}
                                            {thuoc.hanSuDung && new Date(thuoc.hanSuDung) < new Date() && (
                                                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                                                    Hết hạn
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                                                {thuoc.tenThuoc}
                                            </h3>

                                            <p className="text-sm text-gray-600 mb-2">
                                                {thuoc.hangSanXuat}
                                            </p>

                                            <p className="text-sm text-gray-500 mb-3">
                                                Xuất xứ: {thuoc.xuatXu}
                                            </p>

                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-green-600 font-bold text-lg">
                                                    {thuoc.gia.toLocaleString()}đ
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {thuoc.luotXem} lượt xem
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                                                <span>Còn: {thuoc.soLuong}</span>
                                                {thuoc.hanSuDung && (
                                                    <span>HSD: {new Date(thuoc.hanSuDung).toLocaleDateString('vi-VN')}</span>
                                                )}
                                            </div>

                                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {pagination?.hasNext && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải...
                                        </>
                                    ) : (
                                        <>
                                            <span>Tải thêm sản phẩm</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {sortedThuocs.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm'}
                                </h3>
                                <p className="text-gray-500">
                                    {searchTerm
                                        ? `Không có kết quả cho "${searchTerm}". Thử từ khóa khác hoặc chọn danh mục khác.`
                                        : 'Danh mục này chưa có sản phẩm nào.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-white z-50 lg:hidden animate-fadeIn">
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-green-600 uppercase tracking-wide">
                                Danh mục sản phẩm
                            </h2>
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleCategorySelect('all')}
                                    className={`w-full flex items-center justify-between gap-3 p-4 rounded-lg transition-colors ${selectedCategory === 'all'
                                        ? 'bg-green-500 text-white'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">📋</span>
                                        <span className="font-medium">Tất cả sản phẩm</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === 'all'
                                        ? 'bg-green-400 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {getCategoryCount('all')}
                                    </span>
                                </button>

                                {danhMucs.map((danhMuc) => (
                                    <button
                                        key={danhMuc.id}
                                        onClick={() => handleCategorySelect(danhMuc.id)}
                                        className={`w-full flex items-center justify-between gap-3 p-4 rounded-lg transition-colors ${selectedCategory === danhMuc.id
                                            ? 'bg-green-500 text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded flex items-center justify-center text-sm text-white"
                                                style={{ backgroundColor: danhMuc.mauSac || '#10B981' }}
                                            >
                                                {danhMuc.icon || '📦'}
                                            </div>
                                            <span className="font-medium">{danhMuc.tenDanhMuc}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === danhMuc.id
                                            ? 'bg-green-400 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {getCategoryCount(danhMuc.id)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Component wrapper với Suspense
export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải...</p>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}