'use client';

import Image from 'next/image';
import React from "react";

export default function ChungNhan() {
    const certificates = [
        {
            id: 1,
            title: 'Giấy chứng nhận dược phẩm APHAR CM',
            image: '/chungnhan/1.png'  // Update path to your image
        },
        {
            id: 2,
            title: 'Giấy chứng nhận dược phẩm PHARDIPHAR CM',
            image: '/chungnhan/2.png'  // Update path to your image
        },

    ];

    return (
        <div className="container mx-auto px-4 py-8 ">
            {/* Header */}
            <div className='flex my-10'>
                <h2 className="mx-auto text-3xl md:text-4xl font-bold text-green-500 uppercase relative pl-4 md:pl-6 ">
                    <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 "></span>
                    Chứng nhận
                </h2>
            </div>


            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-16">
                {certificates.map((cert) => (
                    <div key={cert.id} className="flex flex-col items-center">
                        <div className="relative w-full aspect-square mb-4 hover:scale-105 transition-transform duration-300">
                            <Image
                                src={cert.image}
                                alt={cert.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="mt-8 text-center text-xl font-semibold text-gray-800">
                            {cert.title}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}