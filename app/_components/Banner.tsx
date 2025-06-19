/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface BannerItem {
    id: number;
    image: string;
    link: string;
    alt: string;
    aspectRatio?: string; // Thêm tỷ lệ khung hình (ví dụ: "16/9" hoặc "4/3")
}

export default function Banner() {
    const banners: BannerItem[] = [
        { id: 1, image: '/banner1.png', link: '/pages/sanphamvadichvu', alt: 'Banner 1', aspectRatio: '16/9' },
    ]

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null;
    }

    return (
        <div className='relative w-full'>
            <Swiper
                className="w-full h-auto" // Sử dụng aspect-ratio thay vì chiều cao cố định
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <Link href={banner.link} className="block w-full">
                            <div className="relative w-full overflow-hidden">
                                <img
                                    src={banner.image}
                                    alt={banner.alt}
                                    className="w-full h-auto  object-cover"
                                    loading="eager"
                                />
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}