'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
        { id: 1, image: '/banner1.png', link: '/link-to-page-1', alt: 'Banner 1', aspectRatio: '16/9' },
        { id: 2, image: '/banner2.png', link: '/link-to-page-2', alt: 'Banner 2', aspectRatio: '16/9' },
        { id: 3, image: '/banner3.png', link: '/link-to-page-3', alt: 'Banner 3', aspectRatio: '16/9' },
        { id: 4, image: '/banner4.png', link: '/link-to-page-4', alt: 'Banner 4', aspectRatio: '16/9' },
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
                className="w-full h-[600px]" // Sử dụng aspect-ratio thay vì chiều cao cố định
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
                        <Link href={banner.link} className="block w-full h-full">
                            <div className="relative w-full h-full">
                                <Image
                                    src={banner.image}
                                    alt={banner.alt}
                                    fill
                                    priority
                                    sizes="100vw"
                                    className="fited object-cover" // Thay "fitted" bằng "object-cover" để ảnh luôn lấp đầy khung
                                />
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}