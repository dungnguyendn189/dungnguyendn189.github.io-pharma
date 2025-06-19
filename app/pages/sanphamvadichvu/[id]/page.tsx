/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

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
    capNhatLuc: string;
    danhMuc: DanhMuc;
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [thuoc, setThuoc] = useState<Thuoc | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Thuoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const handleContactClick = () => {
        router.push('/pages/thongtinlienhe') // Chuyển đến trang liên hệ
    }

    const handleCallClick = () => {
        window.open('tel:0376640406', '_self') // Mở ứng dụng gọi điện
    }


    // Fetch chi tiết thuốc
    const fetchThuocDetail = async (thuocId: string) => {
        try {
            setError(null);
            console.log('Fetching thuoc with ID:', thuocId);

            const response = await fetch(`/api/thuoc/${thuocId}`);

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error data:', errorData);
                setError(errorData.error || 'Không tìm thấy sản phẩm');
                return;
            }

            const data = await response.json();
            console.log('Parsed response data:', data);

            if (data.thuoc) {
                setThuoc(data.thuoc);
                console.log('Set thuoc:', data.thuoc.tenThuoc);

                // Set related products từ API response
                if (data.thuocLienQuan && Array.isArray(data.thuocLienQuan)) {
                    setRelatedProducts(data.thuocLienQuan);
                    console.log('Set related products:', data.thuocLienQuan.length);
                }
            } else {
                console.log('No thuoc in response');
                setError('Không tìm thấy sản phẩm');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Có lỗi xảy ra khi tải dữ liệu: ' + (error as Error).message);
        }
    };
    console.log('Render state:', { loading, error, thuoc: thuoc?.tenThuoc });

    useEffect(() => {
        if (id) {
            console.log('useEffect triggered with id:', id);
            setLoading(true);
            fetchThuocDetail(id)
                .finally(() => {
                    console.log('Fetch completed, setting loading to false');
                    setLoading(false);
                });
        }
    }, [id]);

    // Tạo placeholder image
    const getPlaceholderImage = (tenThuoc: string) => {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8fafc"/>
                <rect x="20" y="20" width="360" height="260" fill="#e2e8f0" rx="12"/>
                <circle cx="120" cy="100" r="20" fill="#cbd5e1"/>
                <rect x="160" y="85" width="180" height="12" fill="#cbd5e1" rx="6"/>
                <rect x="160" y="105" width="120" height="8" fill="#e2e8f0" rx="4"/>
                <rect x="40" y="160" width="320" height="6" fill="#e2e8f0" rx="3"/>
                <rect x="40" y="175" width="280" height="6" fill="#e2e8f0" rx="3"/>
                <rect x="40" y="190" width="240" height="6" fill="#e2e8f0" rx="3"/>
                <text x="200" y="230" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14" font-weight="bold">
                    ${tenThuoc.length > 25 ? tenThuoc.substring(0, 25) + '...' : tenThuoc}
                </text>
                <text x="200" y="250" text-anchor="middle" fill="#94a3b8" font-family="Arial" font-size="12">
                    Sản phẩm Dược Aphar CM
                </text>
            </svg>
        `)}`;
    };


    if (loading) {
        console.log('Rendering loading state');
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="text-lg">Đang tải...</div>
                        <div className="mt-4">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        console.log('Rendering error state:', error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {error}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/pages/sanphamvadichvu"
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ← Quay lại danh sách sản phẩm
                        </Link>
                        <br />
                        <Link
                            href="/"
                            className="inline-block text-green-600 hover:underline"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!thuoc) {
        console.log('Rendering no thuoc state');
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Không tìm thấy sản phẩm
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/pages/sanphamvadichvu"
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            ← Quay lại danh sách sản phẩm
                        </Link>
                        <br />
                        <Link
                            href="/"
                            className="inline-block text-green-600 hover:underline"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-green-600 text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <div>Hotline: 0376640406 | Email: apharcm1709@gmail.com</div>
                        <div className="flex gap-4">
                            <span>VN</span>
                            <span>EN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-gray-100 py-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Link href="/" className="hover:text-green-600">Trang chủ</Link>
                        <span className="mx-2">›</span>
                        <Link href="/pages/sanphamvadichvu" className="hover:text-green-600">Sản phẩm</Link>
                        <span className="mx-2">›</span>
                        <Link
                            href={`/pages/sanphamvadichvu?category=${thuoc.danhMuc.tenDanhMuc.toLowerCase().replace(/\s+/g, '-')}`}
                            className="hover:text-green-600"
                        >
                            {thuoc.danhMuc.tenDanhMuc}
                        </Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-800">{thuoc.tenThuoc}</span>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Product Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{thuoc.tenThuoc}</h1>
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="px-3 py-1 rounded-full text-sm text-white"
                                    style={{ backgroundColor: thuoc.danhMuc.mauSac || '#10B981' }}
                                >
                                    {thuoc.danhMuc.icon} {thuoc.danhMuc.tenDanhMuc}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${thuoc.soLuong > 10 ? 'bg-green-100 text-green-800' :
                                    thuoc.soLuong > 0 ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {thuoc.soLuong > 0 ? `Còn ${thuoc.soLuong} sản phẩm` : 'Hết hàng'}
                                </span>
                            </div>
                            {thuoc.moTa && (
                                <p className="text-gray-600 mb-4">{thuoc.moTa}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Ngày tạo: {new Date(thuoc.taoLuc).toLocaleDateString('vi-VN')}</span>
                                <span>|</span>
                                <span>Hãng: {thuoc.hangSanXuat}</span>
                                <span>|</span>
                                <span>Lượt xem: {(thuoc.luotXem ?? 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="mb-6">
                            <div className="relative w-full h-96 bg-green-50 rounded-lg overflow-hidden">
                                <img
                                    src={thuoc.hinhAnh || getPlaceholderImage(thuoc.tenThuoc)}
                                    alt={thuoc.tenThuoc}
                                    className="w-full h-full object-contain"

                                />
                            </div>
                        </div>

                        {/* Product Content */}
                        <div className="prose max-w-none">
                            {thuoc.moTa && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả sản phẩm:</h3>
                                    <p className="text-gray-700 leading-relaxed">{thuoc.moTa}</p>
                                </div>
                            )}

                            {thuoc.thanPhan && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Thành phần:</h3>
                                    <p className="text-gray-700">{thuoc.thanPhan}</p>
                                </div>
                            )}

                            {thuoc.congDung && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Công dụng:</h3>
                                    <p className="text-gray-700">{thuoc.congDung}</p>
                                </div>
                            )}

                            {thuoc.cachDung && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Cách sử dụng:</h3>
                                    <p className="text-gray-700">{thuoc.cachDung}</p>
                                </div>
                            )}

                            {thuoc.hanSuDung && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Hạn sử dụng:</h3>
                                    <p className="text-gray-700">
                                        {new Date(thuoc.hanSuDung).toLocaleDateString('vi-VN')}
                                        {new Date(thuoc.hanSuDung) < new Date() && (
                                            <span className="ml-2 text-red-600 font-medium">(Đã hết hạn)</span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">
                                    Sản phẩm cùng danh mục ({thuoc.danhMuc.tenDanhMuc})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {relatedProducts.map((item) => (
                                        <Link key={item.id} href={`/pages/sanphamvadichvu/${item.id}`}>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="aspect-square relative mb-3">
                                                    <img
                                                        src={item.hinhAnh || getPlaceholderImage(item.tenThuoc)}
                                                        alt={item.tenThuoc}
                                                        className="w-full h-full object-cover rounded"
                                                        onError={(e) => {
                                                            e.currentTarget.src = getPlaceholderImage(item.tenThuoc);
                                                        }}
                                                    />
                                                </div>
                                                {/* SỬA: Thay line-clamp-2 bằng CSS tùy chỉnh */}
                                                <h4 className="text-sm font-medium text-gray-800 text-center mb-2 overflow-hidden"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        height: '2.5rem'
                                                    }}>
                                                    {item.tenThuoc}
                                                </h4>
                                                <div className="text-center text-xs text-green-600 font-bold mb-2">
                                                    {item.gia.toLocaleString()}đ
                                                </div>
                                                <button className="w-full bg-green-600 text-white py-1 px-3 rounded text-xs hover:bg-green-700">
                                                    XEM CHI TIẾT
                                                </button>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giá bán:</span>
                                    <span className="text-green-600 font-bold text-lg">{thuoc.gia.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Hãng sản xuất:</span>
                                    <span className="text-gray-800">{thuoc.hangSanXuat}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Xuất xứ:</span>
                                    <span className="text-gray-800">{thuoc.xuatXu}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tình trạng:</span>
                                    <span className={`${thuoc.trangThai === 'con_hang' ? 'text-green-600' : 'text-red-600'
                                        } font-medium`}>
                                        {thuoc.trangThai === 'con_hang' ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số lượng:</span>
                                    <span className="text-gray-800">{thuoc.soLuong}</span>
                                </div>
                                {thuoc.hanSuDung && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Hạn sử dụng:</span>
                                        <span className="text-gray-800">
                                            {new Date(thuoc.hanSuDung).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <hr className="my-4" />

                            <div className="text-center">
                                <div className="space-y-2">
                                    <button
                                        onClick={handleContactClick}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-700 transition-colors"
                                    >
                                        LIÊN HỆ MUA HÀNG
                                    </button>

                                    <button
                                        onClick={handleCallClick}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition-colors"
                                    >
                                        GỌI TƯ VẤN: 0376640406
                                    </button>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="text-center text-sm text-gray-600">
                                <p className="mb-2">🚚 Giao hàng toàn quốc</p>
                                <p className="mb-2">💳 Thanh toán khi nhận hàng</p>
                                <p>🔒 Bảo mật thông tin 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}