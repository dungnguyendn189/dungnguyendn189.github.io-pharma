export interface Thuoc {
    id: number;
    tenThuoc: string;
    moTa?: string;
    gia: number;
    soLuong: number;
    danhMucId: number;
    hangSanXuat: string;
    xuatXu: string;
    hinhAnh?: string;
    trangThai: string; // ví dụ: "con_hang", "het_hang", v.v.
    hanSuDung?: Date;
    cachDung?: string;
    thanPhan?: string;
    congDung?: string;
    taoLuc: Date;
    capNhatLuc: Date;
    danhMuc: DanhMuc;
}

export interface DanhMuc {
    id: number
    tenDanhMuc: string
    moTa?: string
    icon?: string
    mauSac?: string
    thuTu: number
    trangThai: string
    taoLuc: string
    capNhatLuc: string
    thuocs?: Thuoc[]
}