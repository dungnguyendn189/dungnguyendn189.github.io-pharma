'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DanhMuc {
    id: number;
    tenDanhMuc: string;
    moTa?: string;
    icon?: string;
    mauSac?: string;
    thuTu: number;
    trangThai: string;
    taoLuc?: string;
    capNhatLuc?: string;
    _count?: {
        thuoc: number;
    };
}

export default function Greeen() {
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu danh mục từ API
    const fetchDanhMuc = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/danhmuc');
            const data = await response.json();

            if (data.danhMucs) {
                // Lọc chỉ lấy danh mục đang hoạt động và sắp xếp theo thứ tự
                const activeDanhMucs = data.danhMucs
                    .filter((dm: DanhMuc) => dm.trangThai === 'hoat_dong')
                    .slice(0, 8); // Chỉ lấy 8 danh mục đầu tiên

                setDanhMucs(activeDanhMucs);
            }
        } catch (error) {
            console.error('Error fetching danh muc:', error);
            // Fallback data nếu API lỗi
            setDanhMucs([
                {
                    id: 1,
                    tenDanhMuc: 'Vitamin Khoáng chất',
                    moTa: 'Bổ sung vitamin và khoáng chất',
                    icon: '💊',
                    mauSac: '#10B981',
                    thuTu: 1,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 25 }
                },
                {
                    id: 2,
                    tenDanhMuc: 'Thực phẩm chức năng',
                    moTa: 'Hỗ trợ sức khỏe tổng quát',
                    icon: '🌿',
                    mauSac: '#059669',
                    thuTu: 2,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 18 }
                },
                {
                    id: 3,
                    tenDanhMuc: 'Dụng cụ y tế',
                    moTa: 'Thiết bị y tế gia đình',
                    icon: '🩺',
                    mauSac: '#0D9488',
                    thuTu: 3,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 12 }
                },
                {
                    id: 4,
                    tenDanhMuc: 'Mỹ phẩm',
                    moTa: 'Chăm sóc da và làm đẹp',
                    icon: '💄',
                    mauSac: '#7C3AED',
                    thuTu: 4,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 22 }
                },
                {
                    id: 5,
                    tenDanhMuc: 'Thuốc kê đơn',
                    moTa: 'Thuốc theo toa bác sĩ',
                    icon: '💉',
                    mauSac: '#DC2626',
                    thuTu: 5,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 35 }
                },
                {
                    id: 6,
                    tenDanhMuc: 'Thuốc không kê đơn',
                    moTa: 'Thuốc mua tự do',
                    icon: '🏥',
                    mauSac: '#2563EB',
                    thuTu: 6,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 28 }
                },
                {
                    id: 7,
                    tenDanhMuc: 'Sản phẩm trẻ em',
                    moTa: 'Chăm sóc sức khỏe trẻ em',
                    icon: '👶',
                    mauSac: '#F59E0B',
                    thuTu: 7,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 15 }
                },
                {
                    id: 8,
                    tenDanhMuc: 'Sản phẩm cao tuổi',
                    moTa: 'Chăm sóc người già',
                    icon: '👴',
                    mauSac: '#8B5CF6',
                    thuTu: 8,
                    trangThai: 'hoat_dong',
                    _count: { thuoc: 20 }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDanhMuc();
    }, []);

    // Tạo URL slug từ tên danh mục
    const createSlug = (tenDanhMuc: string) => {
        return tenDanhMuc
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
            .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
            .replace(/\s+/g, '-') // Thay space bằng -
            .replace(/-+/g, '-') // Thay nhiều - thành một -
            .trim();
    };

    // Loading skeleton
    if (loading) {
        return (
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-8 bg-yellow-500 rounded-sm"></span>
                            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse mt-2"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 animate-pulse mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Tiêu đề */}
                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-8 bg-yellow-500 rounded-sm"></span>
                        <h2 className="text-3xl md:text-4xl font-bold text-green-500 uppercase">
                            SẢN PHẨM XANH
                        </h2>
                    </div>
                    <p className="text-gray-600 text-center mt-2">
                        Khám phá {danhMucs.length} danh mục sản phẩm chăm sóc sức khỏe
                    </p>
                </div>

                {/* Danh sách danh mục */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    {danhMucs.map(danhMuc => (
                        <Link
                            key={danhMuc.id}
                            href={`/products/${createSlug(danhMuc.tenDanhMuc)}`}
                            className="group"
                        >
                            <div className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                                <div
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 mb-3 flex items-center justify-center transition-all duration-300 hover:shadow-lg relative"
                                    style={{
                                        borderColor: danhMuc.mauSac || '#10B981',
                                        backgroundColor: `${danhMuc.mauSac || '#10B981'}15`
                                    }}
                                >
                                    {/* Icon hoặc emoji */}
                                    <div className="text-2xl md:text-3xl">
                                        {danhMuc.icon || '📦'}
                                    </div>

                                    {/* Fallback image nếu có */}
                                    <Image
                                        src={`/catelogryItemgreen/${danhMuc.id}.png`}
                                        alt={danhMuc.tenDanhMuc}
                                        width={80}
                                        height={80}
                                        className="w-16 h-16 md:w-20 md:h-20 object-contain absolute opacity-0 hover:opacity-100 transition-opacity duration-300"
                                        onError={(e) => {
                                            // Ẩn image nếu không tồn tại
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />

                                    {/* Badge số lượng sản phẩm */}
                                    {danhMuc._count && danhMuc._count.thuoc > 0 && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                            {danhMuc._count.thuoc}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-gray-700 font-medium text-center text-sm md:text-base group-hover:text-green-600 transition-colors duration-300">
                                    {danhMuc.tenDanhMuc}
                                </h3>

                                {/* Mô tả ngắn */}
                                {danhMuc.moTa && (
                                    <p className="text-xs text-gray-500 text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {danhMuc.moTa.length > 30
                                            ? `${danhMuc.moTa.substring(0, 30)}...`
                                            : danhMuc.moTa
                                        }
                                    </p>
                                )}

                                {/* Số lượng sản phẩm */}
                                {danhMuc._count && (
                                    <p className="text-xs text-green-600 font-medium mt-1">
                                        {danhMuc._count.thuoc} sản phẩm
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Nút xem tất cả */}
                <div className="text-center mt-10">
                    <Link
                        href="/products"
                        className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        <span>Xem tất cả sản phẩm</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}