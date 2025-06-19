/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import zalo from '@/public/socialIcon/zalo.png';
import SocialMediaLinks from './Social';

export default function Footer() {
    return (
        <footer className="relative pt-8 pb-4">
            {/* Dải gradient màu xanh ở đầu footer */}
            <div className="h-2 w-full bg-gradient-to-r from-green-500 to-green-300 absolute top-0 left-0"></div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo và thông tin công ty */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="mb-3">
                            <Image
                                src="/logo.png"
                                alt="Dược Aphar CM Logo"
                                width={120}
                                height={120}
                            />
                        </div>
                        <h3 className="font-bold text-sm uppercase">DƯỢC PHẨM Dược Aphar CM</h3>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div>
                        <h3 className="text-lg font-bold uppercase mb-4">THÔNG TIN LIÊN HỆ</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-semibold">Địa chỉ: </span>
                                80/31/15, Đường Dương Quảng Hàm, Phường 5, Quận Gò Vấp, TP HCM, VN

                            </li>
                            <li>
                                <span className="font-semibold">Hotline: </span>
                                <a href="tel:0376640406" className="hover:text-green-600">0376640406</a>
                            </li>
                            <li>
                                <span className="font-semibold">Email: </span>
                                <a href="apharcm1709@gmail.com" className="hover:text-green-600">apharcm1709@gmail.com</a>
                            </li>
                            <li>
                                <span className="font-semibold">Website: </span>
                                <a href="https://eqpharma.vn" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">https://eqpharma.vn</a>
                            </li>
                        </ul>
                    </div>

                    {/* Liên kết nhanh */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-lg font-bold uppercase mb-4">LIÊN KẾT NHANH</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/pages/gioithieu" className="hover:text-green-600">Về Dược Aphar CM</Link></li>
                                <li><Link href="/pages/sanphamvadichvu" className="hover:text-green-600">Sản phẩm</Link></li>
                                <li><Link href="/pages/chungnhan" className="hover:text-green-600">Chứng nhận</Link></li>
                                <li><Link href="/pages/dailyphanphoi" className="hover:text-green-600">Đại lý phân phối</Link></li>
                                <li><Link href="/pages/tintuc" className="hover:text-green-600">Tin tức</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold uppercase mb-4">QUY CHẾ HOẠT ĐỘNG</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/pages/tuyendung" className="hover:text-green-600">Tuyển dụng</Link></li>
                                <li><Link href="/pages/thongtinlienhe" className="hover:text-green-600">Liên hệ</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Website liên kết */}
                    <div>
                        <h3 className="text-lg font-bold uppercase mb-4">WEBSITE LIÊN KẾT</h3>

                        <SocialMediaLinks />
                    </div>
                </div>

                {/* Disclaimer - Thông báo ở dưới cùng */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-center text-gray-500 italic">
                    <p>Dược Aphar CM cam kết chỉ giới thiệu sản phẩm đã được công bố tại Cục An Toàn Thực Phẩm - Bộ Y Tế. Thông tin trên website mang tính tham khảo, không thay thế tư vấn y khoa hoặc điều trị cá nhân.</p>
                </div>

                {/* Back to top button */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-8 h-8 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-100"
                        aria-label="Trở về đầu trang"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Fixed contact buttons */}
            <div className="fixed right-4 bottom-4 flex flex-col space-y-3 z-50">
                {/* Messenger chat button */}
                <a href="https://zalo.me/0376640406" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600">
                    <Image
                        src={zalo}
                        alt="Zalo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                    />
                </a>
                {/* Phone call button */}
                <a href="tel:0935489429" className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                </a>
            </div>
        </footer>
    );
}