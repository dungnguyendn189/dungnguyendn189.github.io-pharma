'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function FooterHome() {
    return (
        <footer className="relative py-12 bg-[#f9fdf9] ">
            <div className="container mx-auto px-4">
                {/* Tiêu đề chính */}


                {/* Phần chính - bản đồ và thống kê */}
                <div className=" grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Bản đồ Việt Nam - chỉ hiển thị trên màn hình lớn */}
                    <div className="hidden md:block md:col-span-7 ">
                        <div className="md:h-[500px] w-full relative ">
                            <Image
                                src="/all/homefooter.png"
                                alt="Bản đồ Việt Nam"
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Thống kê */}
                    <div className="md:absolute md:right-[300] col-span-1 md:col-span-5 flex flex-col justify-center space-y-8 items-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-orange-500">
                            HỆ THỐNG PHÂN PHỐI
                        </h3>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                            {/* Kho hàng */}
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-orange-500">03</p>
                                <div className="w-full h-px bg-gray-300 my-2"></div>
                                <p className="text-gray-700 text-sm">Kho hàng</p>
                            </div>

                            {/* Hệ thống đại lý */}
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-orange-500">&gt; 20</p>
                                <div className="w-full h-px bg-gray-300 my-2"></div>
                                <p className="text-gray-700 text-sm">Hệ thống đại lý</p>
                            </div>

                            {/* Chi nhánh */}
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-orange-500">03</p>
                                <div className="w-full h-px bg-gray-300 my-2"></div>
                                <p className="text-gray-700 text-sm">Chi nhánh</p>
                            </div>

                            {/* Đối tác khách hàng */}
                            <div>
                                <p className="text-3xl sm:text-4xl font-bold text-orange-500">&gt; 100</p>
                                <div className="w-full h-px bg-gray-300 my-2"></div>
                                <p className="text-gray-700 text-sm">Đối tác khách hàng</p>
                            </div>

                            {/* Tỉnh thành */}
                            <div className="col-span-2 max-w-[180px]">
                                <p className="text-3xl sm:text-4xl font-bold text-orange-500">63</p>
                                <div className="w-full h-px bg-gray-300 my-2"></div>
                                <p className="text-gray-700 text-sm">Tỉnh thành trên Toàn Quốc</p>
                            </div>
                        </div>

                        {/* Nút liên hệ */}
                        <div className="mt-6">
                            <Link href="/pages/thongtinlienhe" className="inline-block">
                                <span className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                    Liên Hệ Để Trở Thành Đối Tác
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}