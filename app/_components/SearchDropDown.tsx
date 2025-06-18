// components/SearchDropdown.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Pill, Package, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Thuoc {
    id: number
    tenThuoc: string
    moTa?: string
    gia: number
    soLuong: number
    danhMucId: number
    hangSanXuat: string
    xuatXu: string
    hinhAnh?: string
    trangThai: string
    hanSuDung?: string
    cachDung?: string
    thanPhan?: string
    congDung?: string
    luotXem: number
    taoLuc: string
    capNhatLuc: string
    danhMuc?: {
        id: number
        tenDanhMuc: string
        icon: string
        mauSac: string
    }
}

interface SearchDropdownProps {
    placeholder?: string
    className?: string
    isMobile?: boolean
}

export default function SearchDropdown({
    placeholder = "Tìm kiếm thuốc...",
    className = "",
    isMobile = false
}: SearchDropdownProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<Thuoc[]>([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Debounced search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([])
            setShowDropdown(false)
            return
        }

        const timer = setTimeout(async () => {
            await searchThuoc(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
                setSelectedIndex(-1)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Search API
    const searchThuoc = async (query: string) => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                search: query,
                limit: isMobile ? '5' : '8'
            })

            const response = await fetch(`/api/thuoc?${params}`)
            const data = await response.json()

            if (data.thuocs && Array.isArray(data.thuocs)) {
                const availableThuocs = data.thuocs.filter((thuoc: Thuoc) =>
                    thuoc.trangThai === 'con_hang' && thuoc.soLuong > 0
                )
                setResults(availableThuocs)
                setShowDropdown(true)
            } else {
                setResults([])
                setShowDropdown(false)
            }
        } catch (error) {
            console.error('Error searching thuoc:', error)
            setResults([])
            setShowDropdown(false)
        } finally {
            setLoading(false)
        }
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || results.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleSelectThuoc(results[selectedIndex])
                }
                break
            case 'Escape':
                setShowDropdown(false)
                setSelectedIndex(-1)
                inputRef.current?.blur()
                break
        }
    }

    // Handle select drug
    const handleSelectThuoc = (thuoc: Thuoc) => {
        setSearchTerm(thuoc.tenThuoc)
        setShowDropdown(false)
        setSelectedIndex(-1)
        router.push(`/pages/sanphamvadichvu/${thuoc.id}`)
    }

    // Clear search
    const clearSearch = () => {
        setSearchTerm('')
        setResults([])
        setShowDropdown(false)
        setSelectedIndex(-1)
        inputRef.current?.focus()
    }

    // Format price
    const formatPrice = (price: number) => {
        if (isMobile) {
            // Format ngắn gọn cho mobile
            if (price >= 1000000) {
                return (price / 1000000).toFixed(1) + 'M'
            } else if (price >= 1000) {
                return (price / 1000).toFixed(0) + 'K'
            }
            return price.toString()
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Format number
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num)
    }

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} />
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (results.length > 0) {
                            setShowDropdown(true)
                        }
                    }}
                    placeholder={placeholder}
                    className={`w-full border-2 border-green-600 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors ${isMobile
                        ? 'pl-9 pr-9 py-2.5 text-sm'
                        : 'pl-10 pr-10 py-3 text-base'
                        }`}
                />

                {/* Clear button */}
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${isMobile ? 'right-2' : 'right-3'
                            }`}
                    >
                        <X className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                    </button>
                )}

                {/* Loading indicator */}
                {loading && (
                    <div className={`absolute top-1/2 transform -translate-y-1/2 ${isMobile ? 'right-2' : 'right-3'
                        }`}>
                        <div className={`border-2 border-blue-500 border-t-transparent rounded-full animate-spin ${isMobile ? 'w-4 h-4' : 'w-5 h-5'
                            }`}></div>
                    </div>
                )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto ${isMobile ? 'max-h-64' : 'max-h-96'
                    }`}>
                    {results.length === 0 ? (
                        <div className={`text-center text-gray-500 ${isMobile ? 'p-3' : 'p-4'
                            }`}>
                            <Package className={`mx-auto mb-2 text-gray-300 ${isMobile ? 'w-8 h-8' : 'w-12 h-12'
                                }`} />
                            <p className={isMobile ? 'text-sm' : 'text-base'}>
                                Không tìm thấy sản phẩm
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Thử từ khóa khác
                            </p>
                        </div>
                    ) : (
                        <div className="py-1">
                            {/* Search header */}
                            <div className={`border-b border-gray-100 ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'
                                }`}>
                                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'
                                    }`}>
                                    {results.length} sản phẩm
                                </p>
                            </div>

                            {/* Results */}
                            {results.map((thuoc, index) => (
                                <button
                                    key={thuoc.id}
                                    onClick={() => handleSelectThuoc(thuoc)}
                                    className={`w-full text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${index === selectedIndex ? 'bg-blue-50 border-blue-100' : ''
                                        } ${isMobile ? 'px-3 py-2' : 'px-4 py-3'
                                        }`}
                                >
                                    <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'
                                        }`}>
                                        {/* Drug image */}
                                        <div className="flex-shrink-0">
                                            {thuoc.hinhAnh ? (
                                                <img
                                                    src={thuoc.hinhAnh}
                                                    alt={thuoc.tenThuoc}
                                                    className={`object-cover rounded border border-gray-200 ${isMobile ? 'w-8 h-8' : 'w-12 h-12'
                                                        }`}
                                                />
                                            ) : (
                                                <div className={`bg-blue-100 rounded flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-12 h-12'
                                                    }`}>
                                                    <Pill className={`text-blue-600 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'
                                                        }`} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Drug info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 pr-2">
                                                    <h4 className={`font-medium text-gray-900 truncate ${isMobile ? 'text-xs' : 'text-sm'
                                                        }`}>
                                                        {thuoc.tenThuoc}
                                                    </h4>

                                                    {/* Mobile: Chỉ hiện hãng sản xuất */}
                                                    {isMobile ? (
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {thuoc.hangSanXuat}
                                                        </p>
                                                    ) : (
                                                        <div className="mt-1 flex items-center space-x-2">
                                                            <span className="text-xs text-gray-500">
                                                                {thuoc.hangSanXuat}
                                                            </span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">
                                                                {thuoc.xuatXu}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price and stock */}
                                                <div className="text-right">
                                                    <div className={`font-semibold text-green-600 ${isMobile ? 'text-xs' : 'text-sm'
                                                        }`}>
                                                        {formatPrice(thuoc.gia)}
                                                        {isMobile && <span className="text-xs ml-1">đ</span>}
                                                    </div>

                                                    {/* Stock - chỉ hiện desktop */}
                                                    {!isMobile && (
                                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                                            Còn {formatNumber(thuoc.soLuong)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Category - chỉ hiện desktop */}
                                            {!isMobile && thuoc.danhMuc && (
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span
                                                        className="text-xs px-2 py-1 rounded-full text-white"
                                                        style={{ backgroundColor: thuoc.danhMuc.mauSac }}
                                                    >
                                                        {thuoc.danhMuc.tenDanhMuc}
                                                    </span>

                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        <span>{formatNumber(thuoc.luotXem)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}

                            {/* View all results */}

                        </div>
                    )}
                </div>
            )}
        </div>
    )
}