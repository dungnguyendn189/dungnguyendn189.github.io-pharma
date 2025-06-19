"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import logo from "@/public/logo.png";
import Link from "next/link";
import SearchDropdown from "./SearchDropDown";

interface DanhMuc {
    id: number;
    tenDanhMuc: string;
    icon?: string;
    mauSac?: string;
    trangThai: string;
}

interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
}

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fetch danh mục từ API
    const fetchDanhMucs = async () => {
        try {
            const response = await fetch('/api/danhmuc');
            const data = await response.json();

            if (data.danhMucs) {
                const activeDanhMucs = data.danhMucs.filter(
                    (dm: DanhMuc) => dm.trangThai === 'hoat_dong'
                );
                setDanhMucs(activeDanhMucs);
            }
        } catch (error) {
            console.error('Error fetching danh mucs:', error);
        }
    };

    // Tạo slug từ tên danh mục
    const createSlug = (tenDanhMuc: string) => {
        return tenDanhMuc
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
            .replace(/\s+/g, '-') // Thay space = dash
            .replace(/-+/g, '-') // Bỏ dash duplicate
            .trim();
    };



    useEffect(() => {
        // Tạo menu mặc định trước
        const defaultMenuItems: MenuItem[] = [
            { label: "TRANG CHỦ", href: "/" },
            {
                label: "GIỚI THIỆU",
                href: "/pages/gioithieu",
                children: [
                    { label: "Về chúng tôi", href: "/pages/gioithieu" },
                    { label: "Tầm nhìn sứ mệnh", href: "/pages/tamhinhsumenh" },
                ]
            },
            {
                label: "SẢN PHẨM & DỊCH VỤ",
                href: "/pages/sanphamvadichvu?category=all",

            },
            { label: "CHỨNG NHẬN", href: "/pages/chungnhan" },
            { label: "TIN TỨC", href: "/pages/tintuc" },
            { label: "ĐẠI LÝ NHÀ PHÂN PHỐI", href: "/pages/dailyphanphoi" },
            { label: "TUYỂN DỤNG", href: "/pages/tuyendung" },
            { label: "LIÊN HỆ", href: "/pages/thongtinlienhe" },
        ];

        if (danhMucs.length > 0) {
            // Nếu có API data, tạo menu động
            const productChildren = danhMucs.map(dm => ({
                label: dm.tenDanhMuc,
                href: `/pages/sanphamvadichvu?category=${createSlug(dm.tenDanhMuc)}&id=${dm.id}`
            }));

            const dynamicMenuItems: MenuItem[] = [
                { label: "TRANG CHỦ", href: "/" },
                {
                    label: "GIỚI THIỆU",
                    href: "/pages/gioithieu",
                    children: [
                        { label: "Về chúng tôi", href: "/pages/gioithieu" },
                        { label: "Tầm nhìn sứ mệnh", href: "/pages/tamhinhsumenh" },
                    ]
                },
                {
                    label: "SẢN PHẨM & DỊCH VỤ",
                    href: "/pages/sanphamvadichvu?category=all",
                    children: [
                        ...productChildren // Thêm categories từ API
                    ]
                },
                { label: "CHỨNG NHẬN", href: "/pages/chungnhan" },
                { label: "TIN TỨC", href: "/pages/tintuc" },
                { label: "ĐẠI LÝ NHÀ PHÂN PHỐI", href: "/pages/dailyphanphoi" },
                { label: "TUYỂN DỤNG", href: "/pages/tuyendung" },
                { label: "LIÊN HỆ", href: "/pages/thongtinlienhe" },
            ];

            setMenuItems(dynamicMenuItems);
        } else {
            // Nếu không có API data hoặc API lỗi, dùng menu mặc định
            setMenuItems(defaultMenuItems);
        }
    }, [danhMucs]);

    const handleOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.stopPropagation();
        setMenuOpen(false);
    };

    useEffect(() => {
        setMounted(true);
        fetchDanhMucs(); // Fetch danh mục khi component mount

        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll);

        const handleClickOutside = (e: MouseEvent) => {
            if (searchOpen && searchInputRef.current &&
                !searchInputRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchOpen]);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    if (!mounted) return null;

    return (
        <div className="w-full">
            {/* Top header */}
            <div className="h-[70px] w-full flex justify-center items-center bg-white border-b">
                <div className="flex justify-between items-center w-full max-w-7xl px-4">
                    {/* Logo */}
                    <Link className="flex items-center gap-4" href="/">
                        <Image src={logo} width={48} height={48} alt="Logo" className="cursor-pointer" />
                        <span className="hidden md:block font-bold">Dược Aphar CM </span>
                    </Link>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2">
                        {/* Mobile search with animation */}
                        <div className="md:hidden flex items-center relative">
                            {/* <button className="mr-[6px]" >
                                <Image src={vi} alt="VN" width={32} height={20} />
                            </button>
                            <button className="mr-[6px]">
                                <Image src={uk} alt="EN" width={32} height={20} />
                            </button> */}
                            {searchOpen ? (
                                <div className="absolute right-0 animate-fadeIn">
                                    <div className="border-2 border-green-500 rounded-full flex items-center px-3 py-1 bg-white">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Tìm kiếm..."
                                            className="outline-none bg-transparent px-2 text-sm w-[150px]"
                                        />
                                        <button onClick={() => setSearchOpen(false)}>
                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <SearchDropdown
                                    placeholder="Tìm kiếm thuốc..."
                                    className="w-full"
                                />
                            )}
                        </div>

                        {/* Hamburger menu */}
                        <button
                            className="md:hidden"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop search + flags */}
                    <div className="hidden md:flex items-center gap-4">
                        <SearchDropdown
                            placeholder="Tìm kiếm thuốc..."
                            className="w-[300px]"
                        />
                        {/* <button>
                            <Image src={vi} alt="VN" width={32} height={20} />
                        </button>
                        <button>
                            <Image src={uk} alt="EN" width={32} height={20} />
                        </button> */}
                    </div>
                </div>
            </div>

            {/* Desktop menu */}
            <div className={`bg-green-600 w-full h-[50px] hidden md:flex items-center ${scrolled ? 'fixed top-0 left-0 z-50 shadow-md' : ''}`}>
                <div className="flex items-center justify-between px-4 w-full max-w-7xl mx-auto">
                    <ul className="flex w-full justify-between">
                        {menuItems.map((item) => (
                            <li key={item.href} className="relative group">
                                <Link
                                    href={item.href}
                                    className="text-white font-bold py-3 px-4 hover:underline flex items-center"
                                >
                                    {item.label}
                                    {item.children && (
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </Link>
                                {/* Dropdown for desktop */}
                                {item.children && (
                                    <ul className="absolute left-0 top-full min-w-[220px] bg-white text-green-600 shadow-lg rounded-b z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        {item.children.map((child) => (
                                            <li key={child.href}>
                                                <Link
                                                    href={child.href}
                                                    className="block px-5 py-3 text-gray-800 hover:bg-gray-100 border-b last:border-b-0"
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-50" onClick={() => setMenuOpen(false)}>
                    <div
                        className="absolute inset-0 bg-green-600 bg-opacity-95 transition-opacity duration-300"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div
                        className={`${menuOpen ? "animate-fadeIn" : "animate-fadeOut"} relative w-full h-full flex flex-col transition-transform duration-300 ease-in-out transform scale-100 opacity-100`}
                        style={{ zIndex: 60 }}
                        onClick={e => handleOverlay(e)}
                    >
                        {/* Search in overlay */}


                        {/* Menu items */}
                        <ul className="flex-1 overflow-y-auto">
                            {menuItems.map((item) => (
                                <li key={item.href} className="border-b border-green-500">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={item.href}
                                            className="block text-white font-bold py-3 px-6 w-full transition-colors duration-200 hover:bg-green-700"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                        {item.children && (
                                            <button
                                                className="px-4 focus:outline-none"
                                                onClick={() =>
                                                    setOpenSubMenu(openSubMenu === item.href ? null : item.href)
                                                }
                                            >
                                                <svg className={`w-4 h-4 text-white transform transition-transform duration-300 ${openSubMenu === item.href ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {/* Submenu for mobile with animation */}
                                    {item.children && (
                                        <ul className={`bg-green-500 transition-all duration-300 overflow-hidden ${openSubMenu === item.href ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                                            {item.children.map((child) => (
                                                <li key={child.href}>
                                                    <Link
                                                        href={child.href}
                                                        className="block px-10 py-3 text-white hover:bg-green-400 border-b last:border-b-0 transition-colors duration-200"
                                                        onClick={() => setMenuOpen(false)}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            {/* <div className="flex gap-4 px-6 py-4">
                                <button>
                                    <Image src={vi} alt="VN" width={32} height={20} />
                                </button>
                                <button>
                                    <Image src={uk} alt="EN" width={32} height={20} />
                                </button>
                            </div> */}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}