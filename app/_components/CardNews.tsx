/* eslint-disable @next/next/no-img-element */
// import Image from "next/image";
import Link from "next/link";

export interface NewsCardProps {
    title: string;
    date: string;
    description: string;
    image: string;
    link: string;
}

export default function CardNews({
    title,
    date,
    description,
    image,
    link,
}: NewsCardProps) {
    return (
        <Link href={link} className="block group">
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                <div className="w-40 h-28 relative flex-shrink-0">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Badge góc nghiêng */}
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded transform -rotate-12 font-bold">
                        SARS-CoV-2
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{date}</p>
                    <h3 className="text-md font-semibold text-black group-hover:text-green-700 transition-colors duration-200 mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {description}
                    </p>
                    <span className="text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors duration-200">
                        Xem chi tiết →
                    </span>
                </div>
            </div>
        </Link>
    );
}