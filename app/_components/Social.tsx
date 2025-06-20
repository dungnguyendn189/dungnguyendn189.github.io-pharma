/* eslint-disable @next/next/no-img-element */
// components/SocialMediaLinks.tsx
'use client'

import { useState, useEffect } from 'react'

interface SocialMedia {
    id: number
    tenMangXaHoi: string
    url: string
    icon: string
    thuTu: number
    trangThai: string
}

export default function SocialMediaLinks() {
    const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSocialMedias()
    }, [])

    const fetchSocialMedias = async () => {
        try {
            const response = await fetch('/api/social?trangThai=hien_thi')
            const data = await response.json()

            if (data.success) {
                setSocialMedias(data.data.sort((a: SocialMedia, b: SocialMedia) => a.thuTu - b.thuTu))
            }
        } catch (error) {
            console.error('Error fetching social medias:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div>
                <h3 className="text-lg font-bold uppercase mb-4">WEBSITE LIÊN KẾT</h3>
                <ul className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <li key={i} className="flex items-center animate-pulse">
                            <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div>
            <ul className="space-y-3">
                {socialMedias.map((social) => (
                    <li key={social.id}>
                        {social.tenMangXaHoi.toLocaleLowerCase() === "apharcm1709@gmail.com" ?
                            <div
                                rel="noopener noreferrer"
                                className="flex items-center transition-colors "
                            >
                                <img
                                    src={social.icon}
                                    alt={social.tenMangXaHoi}
                                    width={24}
                                    height={24}
                                    className="mr-2"

                                />
                                <span>{social.tenMangXaHoi}</span>
                            </div> : <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center transition-colors hover:text-gray-500"
                            >
                                <img
                                    src={social.icon}
                                    alt={social.tenMangXaHoi}
                                    width={24}
                                    height={24}
                                    className="mr-2"

                                />
                                <span>{social.tenMangXaHoi}</span>
                            </a>}
                    </li>
                ))}
            </ul>
        </div>
    )
}