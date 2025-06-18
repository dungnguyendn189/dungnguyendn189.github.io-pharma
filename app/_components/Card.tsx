'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
    image: string;
    title: string;
    url: string;
    alt?: string;
}

const Card: React.FC<CardProps> = ({ image, title, url, alt = "Product image" }) => {
    return (
        <div className="mx-auto product-card shadow-2xl border-1 border-gray-200 max-w-[300px] transition-all duration-300 hover:shadow-md rounded-lg overflow-hidden group">
            <div className="border-3 border-transparent hover:border-green-500 rounded-lg h-full flex flex-col transition-all duration-300">
                <div className="relative overflow-hidden">
                    <div className="h-[200px] w-full overflow-hidden">
                        <Image
                            src={image}
                            alt={alt}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 p-4"
                        />
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-gray-700 font-medium text-lg mb-4 line-clamp-2 flex-grow">
                        {title}
                    </h3>

                    <div className="flex justify-center mt-2">
                        <Link href={url}>
                            <span className="bg-green-500 text-white text-sm font-medium py-2 px-6 rounded-full uppercase tracking-wide hover:bg-green-600 transition-colors duration-300">
                                XEM TIẾP
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;