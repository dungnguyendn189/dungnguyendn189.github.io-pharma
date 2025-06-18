-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "ten_dang_nhap" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ho_ten" TEXT NOT NULL,
    "vai_tro" TEXT NOT NULL DEFAULT 'admin',
    "trang_thai" TEXT NOT NULL DEFAULT 'hoat_dong',
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thuoc" (
    "id" SERIAL NOT NULL,
    "ten_thuoc" TEXT NOT NULL,
    "mo_ta" TEXT,
    "gia" DOUBLE PRECISION NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "danh_muc_id" INTEGER NOT NULL,
    "hang_san_xuat" TEXT NOT NULL,
    "xuat_xu" TEXT NOT NULL,
    "hinh_anh" TEXT,
    "trang_thai" TEXT NOT NULL DEFAULT 'con_hang',
    "han_su_dung" TIMESTAMP(3),
    "cach_dung" TEXT,
    "than_phan" TEXT,
    "cong_dung" TEXT,
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thuoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tin_tuc" (
    "id" SERIAL NOT NULL,
    "tieu_de" TEXT NOT NULL,
    "tom_tat" TEXT,
    "noi_dung" TEXT NOT NULL,
    "hinh_anh" TEXT,
    "tac_gia" TEXT NOT NULL,
    "danh_muc" TEXT NOT NULL,
    "trang_thai" TEXT NOT NULL DEFAULT 'nhap',
    "luot_xem" INTEGER NOT NULL DEFAULT 0,
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,
    "xuat_ban_luc" TIMESTAMP(3),

    CONSTRAINT "tin_tuc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "danh_muc" (
    "id" SERIAL NOT NULL,
    "ten_danh_muc" TEXT NOT NULL,
    "mo_ta" TEXT,
    "icon" TEXT,
    "mau_sac" TEXT,
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "trang_thai" TEXT NOT NULL DEFAULT 'hoat_dong',
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "danh_muc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuyen_dung" (
    "id" SERIAL NOT NULL,
    "tieu_de" TEXT NOT NULL,
    "vi_tri" TEXT NOT NULL,
    "mo_ta_cong_viec" TEXT NOT NULL,
    "yeu_cau" TEXT NOT NULL,
    "quyen_loi" TEXT,
    "muc_luong" TEXT NOT NULL,
    "dia_diem" TEXT NOT NULL,
    "loai_hinh_lam_viec" TEXT NOT NULL,
    "kinh_nghiem" TEXT NOT NULL,
    "han_nop" TIMESTAMP(3) NOT NULL,
    "trang_thai" TEXT NOT NULL DEFAULT 'dang_tuyen',
    "luot_xem" INTEGER NOT NULL DEFAULT 0,
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tuyen_dung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ung_tuyen" (
    "id" SERIAL NOT NULL,
    "tuyen_dung_id" INTEGER NOT NULL,
    "ho_ten" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "so_dien_thoai" TEXT NOT NULL,
    "dia_chi" TEXT,
    "ho_so" TEXT,
    "ghi_chu" TEXT,
    "trang_thai" TEXT NOT NULL DEFAULT 'moi',
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ung_tuyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lien_he" (
    "id" SERIAL NOT NULL,
    "ten" TEXT NOT NULL,
    "so_dien_thoai" TEXT NOT NULL,
    "email" TEXT,
    "loai" TEXT NOT NULL,
    "mo_ta" TEXT,
    "thu_tu" INTEGER NOT NULL DEFAULT 0,
    "trang_thai" TEXT NOT NULL DEFAULT 'hoat_dong',
    "tao_luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lien_he_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cau_hinh" (
    "id" SERIAL NOT NULL,
    "khoa" TEXT NOT NULL,
    "gia_tri" TEXT NOT NULL,
    "mo_ta" TEXT,
    "cap_nhat_luc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cau_hinh_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_ten_dang_nhap_key" ON "admin"("ten_dang_nhap");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "danh_muc_ten_danh_muc_key" ON "danh_muc"("ten_danh_muc");

-- CreateIndex
CREATE UNIQUE INDEX "cau_hinh_khoa_key" ON "cau_hinh"("khoa");

-- AddForeignKey
ALTER TABLE "thuoc" ADD CONSTRAINT "thuoc_danh_muc_id_fkey" FOREIGN KEY ("danh_muc_id") REFERENCES "danh_muc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ung_tuyen" ADD CONSTRAINT "ung_tuyen_tuyen_dung_id_fkey" FOREIGN KEY ("tuyen_dung_id") REFERENCES "tuyen_dung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
