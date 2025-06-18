'use client';

import React from 'react';
import Image from 'next/image';
import ico1 from "@/public/ico1.png";


export default function CoreValues() {
    // Giá trị cố định dành riêng cho hiển thị một lần
    const title = "GIÁ TRỊ CỐT LÕI";
    const centerText = "GIÁ TRỊ CỐT LÕI";

    return (
        <div className="">
            {/* Tiêu đề có border vàng bên trái */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-green-500 uppercase relative pl-4 md:pl-6">
                    <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 rounded-sm"></span>
                    {title}
                </h2>
            </div>

            {/* Sơ đồ giá trị cốt lõi */}
            <div className="max-w-5xl mx-auto px-4 my-9 h-[480px] md:h-[520px]">
                <div className="relative h-full">
                    {/* Vòng tròn ở giữa */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-64 md:h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg z-10">
                        <span className="text-white text-xl md:text-2xl font-bold text-center px-4">
                            {centerText}
                        </span>
                    </div>

                    {/* Trung Thực - Vị trí phía trên */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center p-4 mb-2">
                            <Image
                                src={ico1.src}
                                alt="Trung Thực"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h3 className="text-gray-800 font-medium text-center">
                            Trung Thực
                        </h3>
                    </div>

                    {/* Tư Duy Tích Cực - Vị trí phía trên bên phải */}
                    <div className="absolute top-[15%] right-[10%] flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center p-4 mb-2">
                            <Image
                                src={ico1.src}
                                alt="Tư Duy Tích Cực"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h3 className="text-gray-800 font-medium text-center">
                            Tư Duy Tích Cực
                        </h3>
                    </div>

                    {/* Chất Lượng - Vị trí phía dưới bên phải */}
                    <div className="absolute bottom-[15%] right-[10%] flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center p-4 mb-2">
                            <Image
                                src={ico1.src}
                                alt="Chất Lượng"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h3 className="text-gray-800 font-medium text-center">
                            Chất Lượng
                        </h3>
                    </div>

                    {/* Tâm - Vị trí phía dưới bên trái */}
                    <div className="absolute bottom-[15%] left-[10%] flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center p-4 mb-2">
                            <Image
                                src={ico1.src}
                                alt="Tâm"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h3 className="text-gray-800 font-medium text-center">
                            Tâm
                        </h3>
                    </div>

                    {/* Tín - Vị trí phía trên bên trái */}
                    <div className="absolute top-[15%] left-[10%] flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-amber-400 flex items-center justify-center p-4 mb-2">
                            <Image
                                src={ico1.src} alt="Tín"
                                width={48}
                                height={48}
                                className="w-12 h-12 object-contain"
                            />
                        </div>
                        <h3 className="text-gray-800 font-medium text-center">
                            Tín
                        </h3>
                    </div>

                    {/* Các đường kết nối giữa giá trị và trung tâm (tùy chọn) - có thể bỏ phần này nếu không cần */}
                </div>
            </div>
        </div>
    );
}