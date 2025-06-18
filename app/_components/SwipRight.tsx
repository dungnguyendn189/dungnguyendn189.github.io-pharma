'use client';

import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Card from './Card';
import { VitaminsMineral } from '../interface/interface';

interface SwipRightProps {
    items: VitaminsMineral[];
    title?: string;
}

export default function SwipRight({ items, title = "CẢI THIỆN TĂNG CƯỜNG CHỨC NĂNG" }: SwipRightProps) {
    const [mounted, setMounted] = useState(false);
    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handlePrev = () => {
        swiperRef.current?.swiper.slidePrev();
    };

    const handleNext = () => {
        swiperRef.current?.swiper.slideNext();
    };

    if (!mounted) {
        return null;
    }

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Tiêu đề và nút điều hướng */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-8 bg-yellow-500 rounded-sm"></span>
                        <h2 className="text-2xl md:text-3xl font-bold text-green-500 uppercase">
                            {title}
                        </h2>
                    </div>

                    {/* Nút điều hướng */}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                            aria-label="Previous slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                            aria-label="Next slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <div className='relative w-full '>
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 30 },
                            1024: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={items.length > 4}
                        className="py-4"
                    >
                        {items.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Card
                                    image={item.image}
                                    alt={item.alt}
                                    title={item.title}
                                    url={item.link}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}