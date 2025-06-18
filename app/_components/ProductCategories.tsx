'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Cập nhật danh sách sản phẩm với đường dẫn chính xác
const PRODUCT_CATEGORIES = [
    {
        id: 1,
        name: 'Bào chế Siro',
        image: '/icocatelogry/1.jpg'
    },
    {
        id: 2,
        name: 'Dạng bào viên sủi',
        image: '/icocatelogry/2.jpg'
    },
    {
        id: 3,
        name: 'Bào chế viên nang mềm',
        image: '/icocatelogry/3.png'
    },
    {
        id: 4,
        name: 'Bào chế viên nang cứng',
        image: '/icocatelogry/4.jpg'
    },
    {
        id: 5,
        name: 'Dạng bào chế cốm',
        image: '/icocatelogry/5.webp'
    },
    {
        id: 6,
        name: 'Dạng bào chế thực phẩm',
        image: '/icocatelogry/6.jpg'
    }
];

export default function ProductCategories() {
    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Tiêu đề */}
                <div className="relative mb-8">
                    <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 rounded-sm"></span>
                    <h2 className="text-3xl md:text-4xl font-bold text-green-500 uppercase pl-6">
                        Dạng bào chế sản phẩm
                    </h2>
                </div>

                {/* Swiper Carousel với nút điều hướng custom nằm ngoài */}
                <div className="relative px-4 md:px-16">
                    {/* Nút Previous - đặt bên ngoài Swiper */}
                    <div className="swiper-button-prev custom-swiper-button !left-0 md:!left-2 !text-white !bg-green-500 hover:!bg-green-600 !w-10 !h-10 !rounded-full !flex !items-center !justify-center !shadow-lg"></div>

                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                        }}
                        breakpoints={{
                            640: { // sm
                                slidesPerView: 2,
                            },
                            768: { // md
                                slidesPerView: 3,
                            },
                            1024: { // lg
                                slidesPerView: 5,
                            },
                        }}
                        className="productCategoriesSwiper"
                    >
                        {PRODUCT_CATEGORIES.map((category) => (
                            <SwiperSlide key={category.id}>
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-2 border-gray-200">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-center font-medium text-gray-800">
                                        {category.name}
                                    </h3>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Nút Next - đặt bên ngoài Swiper */}
                    <div className="swiper-button-next custom-swiper-button !right-0 md:!right-2 !text-white !bg-green-500 hover:!bg-green-600 !w-10 !h-10 !rounded-full !flex !items-center !justify-center !shadow-lg"></div>

                    {/* Pagination dots */}
                    <div className="swiper-pagination mt-6 flex justify-center"></div>
                </div>
            </div>


        </div>
    );
}