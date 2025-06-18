'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

interface TitleProps {
    // Tiêu đề chính hiển thị với màu xanh lá
    title?: string;

    // Hình ảnh minh họa (tùy chọn)
    image?: string;

    // Alt text cho hình ảnh
    imageAlt?: string;

    // Nội dung mô tả (có thể bỏ qua)
    description?: string | ReactNode;

    // Link khi click vào XEM CHI TIẾT (có thể bỏ qua)
    detailLink?: string;

    // Text hiển thị cho nút "Xem chi tiết" (mặc định là "XEM CHI TIẾT")
    detailText?: string;

    // Có hiển thị nút xem chi tiết hay không (mặc định là true)
    showDetailButton?: boolean;

    // Alignment của tiêu đề: left, center hoặc right (mặc định là left)
    align?: 'left' | 'center' | 'right';

    // Màu sắc của tiêu đề (mặc định là xanh lá)
    titleColor?: string;

    // Border màu vàng bên trái và phải (mặc định là true)
    showBorder?: boolean;

    // Border màu vàng bên trái (mặc định là true)
    showLeftBorder?: boolean;

    // CSS classes tùy chỉnh thêm
    className?: string;

    // Layout: 'default' là mặc định, 'image-showcase' là layout với hình lớn ở giữa
    layout?: 'default' | 'image-showcase';

    // Chiều rộng tối đa của phần content
    maxWidth?: string;
}

export default function Title({
    title,
    image,
    imageAlt = "Hình minh họa",
    description,
    detailLink,
    detailText = "XEM CHI TIẾT",
    showDetailButton = true,
    align = 'left',
    titleColor = 'text-green-500',
    showLeftBorder = true,
    showBorder = false,
    className = '',
    layout = 'default',
    maxWidth = 'max-w-6xl'
}: TitleProps) {
    // Xác định alignment class
    const alignClass = {
        'left': 'text-left',
        'center': 'text-center mx-auto',
        'right': 'text-right ml-auto'
    }[align];

    // Layout image-showcase có thiết kế đặc biệt
    if (layout === 'image-showcase' && image) {
        return (
            <div className={`mb-10 ${className}`}>
                {/* Phần tiêu đề có border vàng hai bên */}
                <div className="relative flex items-center justify-center mb-8">
                    {showBorder && <span className="hidden md:block absolute left-0 top-1/2 w-[15%] h-2 bg-yellow-500 rounded-full"></span>}
                    <h2 className={`text-2xl md:text-4xl font-bold ${titleColor} uppercase px-4 md:px-10`}>
                        {title}
                    </h2>
                    {showBorder && <span className="hidden md:block absolute right-0 top-1/2 w-[15%] h-2 bg-yellow-500 rounded-full"></span>}
                </div>

                {/* Hình ảnh minh họa lớn ở giữa */}
                {image && <div className="w-full flex justify-center mb-6">
                    <div className="relative w-full aspect-square md:aspect-[4/3]">
                        <Image
                            src={image}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>}

                {/* Phần mô tả */}
                {description && (
                    <div className={`${maxWidth} mx-auto text-gray-700 ${align === 'center' ? 'text-center' : ''} px-4 text-xl leading-20`}>
                        {description}
                    </div>
                )}

                {/* Nút xem chi tiết */}
                {showDetailButton && detailLink && (
                    <div className={`mt-6 ${align === 'center' ? 'flex justify-center' : ''}`}>
                        <Link
                            href={detailLink}
                            className="inline-flex items-center border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 rounded-full px-8 py-2 font-medium"
                        >
                            {detailText}
                            {/* Mũi tên */}
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    // Layout mặc định
    return (
        <div className={`${className}`}>
            <div className={`flex flex-col ${alignClass} ${maxWidth} ${align === 'center' ? 'mx-auto' : ''}`}>
                {/* Tiêu đề với border màu vàng bên trái */}
                <h2 className={`text-2xl md:text-4xl font-bold ${titleColor} uppercase relative ${showLeftBorder ? 'pl-4 md:pl-6' : ''}`}>
                    {showLeftBorder && (
                        <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 rounded-sm"></span>
                    )}
                    {title}
                </h2>

                {/* Hình ảnh minh họa (nếu có và layout mặc định) */}
                {image && (
                    <div className="w-full mt-6">
                        <div className="relative w-full aspect-[16/9]">
                            <Image
                                src={image}
                                alt={imageAlt}
                                fill
                                sizes="(max-width: 768px) 100vw, 80vw"
                                className="object-cover rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Phần mô tả */}
                {description && (
                    <div className="mt-16 text-gray-700 max-w-3xl">
                        {description}
                    </div>
                )}

                {/* Nút xem chi tiết */}
                {showDetailButton && detailLink && (
                    <div className="mt-6">
                        <Link
                            href={detailLink}
                            className="inline-flex items-center border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 rounded-full px-8 py-2 font-medium"
                        >
                            {detailText}
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}