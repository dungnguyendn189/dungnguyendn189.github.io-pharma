-- Xóa dữ liệu cũ (theo thứ tự để tránh lỗi foreign key)
TRUNCATE TABLE tuyen_dung CASCADE;
TRUNCATE TABLE tin_tuc CASCADE;
TRUNCATE TABLE thuoc CASCADE;
TRUNCATE TABLE danh_muc CASCADE;
TRUNCATE TABLE lien_he CASCADE;

-- Reset sequences
ALTER SEQUENCE danh_muc_id_seq RESTART WITH 1;
ALTER SEQUENCE thuoc_id_seq RESTART WITH 1;
ALTER SEQUENCE tin_tuc_id_seq RESTART WITH 1;
ALTER SEQUENCE tuyen_dung_id_seq RESTART WITH 1;
ALTER SEQUENCE lien_he_id_seq RESTART WITH 1;

-- Insert Danh Muc data (thay emoji bang text)
INSERT INTO danh_muc (ten_danh_muc, mo_ta, icon, mau_sac, thu_tu, trang_thai, tao_luc, cap_nhat_luc) VALUES
('Thuoc ke don', 'Cac loai thuoc can co don bac si', 'pill', '#3B82F6', 1, 'hoat_dong', NOW(), NOW()),
('Thuoc khong ke don', 'Thuoc OTC co the mua tu do', 'hospital', '#10B981', 2, 'hoat_dong', NOW(), NOW()),
('Thuc pham chuc nang', 'Vitamin, khoang chat, thuc pham bo sung', 'leaf', '#F59E0B', 3, 'hoat_dong', NOW(), NOW()),
('Dung cu y te', 'Thiet bi y te, dung cu cham soc suc khoe', 'medical', '#EF4444', 4, 'hoat_dong', NOW(), NOW()),
('My pham', 'San pham cham soc da, lam dep', 'cosmetic', '#8B5CF6', 5, 'hoat_dong', NOW(), NOW());

-- Insert Thuoc data
INSERT INTO thuoc (ten_thuoc, mo_ta, gia, so_luong, danh_muc_id, hang_san_xuat, xuat_xu, hinh_anh, trang_thai, han_su_dung, cach_dung, than_phan, cong_dung, luot_xem, tao_luc, cap_nhat_luc) VALUES
-- Thuoc ke don
('Amoxicillin 500mg', 'Khang sinh dieu tri nhiem khuan', 45000, 100, 1, 'Imexpharm', 'Viet Nam', 'https://via.placeholder.com/300x300/3B82F6/white?text=Amoxicillin', 'con_hang', '2025-12-31', 'Uong 1 vien x 3 lan/ngay sau an', 'Amoxicillin trihydrate 500mg', 'Dieu tri nhiem khuan duong ho hap, tiet nieu', 1250, NOW(), NOW()),

('Cephalexin 250mg', 'Khang sinh nhom Cephalosporin', 38000, 80, 1, 'DHG Pharma', 'Viet Nam', 'https://via.placeholder.com/300x300/3B82F6/white?text=Cephalexin', 'con_hang', '2025-10-15', 'Uong 1-2 vien x 4 lan/ngay', 'Cephalexin 250mg', 'Dieu tri nhiem khuan da, mo mem', 890, NOW(), NOW()),

('Metformin 500mg', 'Thuoc dieu tri tieu duong type 2', 25000, 150, 1, 'Traphaco', 'Viet Nam', 'https://via.placeholder.com/300x300/3B82F6/white?text=Metformin', 'con_hang', '2026-03-20', 'Uong 1 vien x 2 lan/ngay voi bua an', 'Metformin HCl 500mg', 'Kiem soat duong huyet o benh nhan tieu duong', 2100, NOW(), NOW()),

-- Thuoc khong ke don
('Paracetamol 500mg', 'Thuoc giam dau, ha sot', 15000, 200, 2, 'Traphaco', 'Viet Nam', 'https://via.placeholder.com/300x300/10B981/white?text=Paracetamol', 'con_hang', '2025-12-31', 'Uong 1-2 vien/lan, toi da 8 vien/ngay', 'Paracetamol 500mg', 'Giam dau, ha sot', 3200, NOW(), NOW()),

('Ibuprofen 400mg', 'Thuoc chong viem, giam dau', 28000, 0, 2, 'Boston', 'Viet Nam', 'https://via.placeholder.com/300x300/10B981/white?text=Ibuprofen', 'het_hang', '2025-09-15', 'Uong 1-2 vien/lan, toi da 3 lan/ngay', 'Ibuprofen 400mg', 'Giam dau, chong viem, ha sot', 1800, NOW(), NOW()),

('Aspirin 100mg', 'Thuoc chong dong mau', 35000, 90, 2, 'Pymepharco', 'Viet Nam', 'https://via.placeholder.com/300x300/10B981/white?text=Aspirin', 'con_hang', '2025-11-20', 'Uong 1 vien/ngay sau an', 'Aspirin 100mg', 'Phong ngua tai bien mach mau', 950, NOW(), NOW()),

-- Thuc pham chuc nang
('Vitamin C 1000mg', 'Tang cuong suc de khang', 85000, 75, 3, 'DHG Pharma', 'Viet Nam', 'https://via.placeholder.com/300x300/F59E0B/white?text=VitaminC', 'con_hang', '2026-06-30', 'Uong 1 vien/ngay sau an', 'Vitamin C 1000mg, chat phu gia', 'Tang cuong mien dich, chong oxy hoa', 2500, NOW(), NOW()),

('Omega-3 Fish Oil', 'Bo sung omega-3 cho tim mach', 180000, 60, 3, 'Blackmores', 'Uc', 'https://via.placeholder.com/300x300/F59E0B/white?text=Omega3', 'con_hang', '2026-03-15', 'Uong 1-2 vien/ngay voi bua an', 'Dau ca giau EPA 180mg, DHA 120mg', 'Tot cho tim mach, nao bo, mat', 1800, NOW(), NOW()),

-- Dung cu y te
('Nhiet ke dien tu', 'Do nhiet do co the chinh xac', 150000, 25, 4, 'Omron', 'Nhat Ban', 'https://via.placeholder.com/300x300/EF4444/white?text=Thermometer', 'con_hang', NULL, 'Dat duoi luoi 1-2 phut', 'Cam bien nhiet dien tu', 'Do nhiet do co the', 450, NOW(), NOW()),

('May do huyet ap', 'Do huyet ap tu dong', 850000, 15, 4, 'Omron', 'Nhat Ban', 'https://via.placeholder.com/300x300/EF4444/white?text=BloodPressure', 'con_hang', NULL, 'Quan bang quanh canh tay, bam nut do', 'Man hinh LCD, bom tu dong', 'Do huyet ap va nhip tim', 320, NOW(), NOW()),

-- My pham
('Kem chong nang SPF 50', 'Kem chong nang pho rong', 220000, 40, 5, 'La Roche Posay', 'Phap', 'https://via.placeholder.com/300x300/8B5CF6/white?text=Sunscreen', 'con_hang', '2025-08-20', 'Thoa deu truoc khi ra nang 15-30 phut', 'Zinc oxide, Titanium dioxide, Vitamin E', 'Bao ve da khoi tia UV, chong lao hoa', 890, NOW(), NOW()),

('Serum Vitamin C', 'Serum duong da sang min', 350000, 30, 5, 'The Ordinary', 'Canada', 'https://via.placeholder.com/300x300/8B5CF6/white?text=Serum', 'con_hang', '2025-10-15', 'Thoa 2-3 giot len da buoi sang', 'Vitamin C 10%, Hyaluronic acid', 'Lam sang da, mo tham, chong oxy hoa', 720, NOW(), NOW());

-- Insert Tin Tuc data
INSERT INTO tin_tuc (tieu_de, tom_tat, noi_dung, hinh_anh, tac_gia, trang_thai, luot_xem, xuat_ban_luc, tags, tao_luc, cap_nhat_luc) VALUES
('Cach su dung thuoc khang sinh dung cach', 'Huong dan su dung khang sinh an toan va hieu qua', 
'<h2>Nguyen tac su dung khang sinh</h2>
<p>Khang sinh la loai thuoc quan trong trong dieu tri nhiem khuan, nhung can su dung dung cach de tranh khang thuoc.</p>
<h3>1. Chi dung khi co chi dinh cua bac si</h3>
<p>Khong tu y mua va su dung khang sinh ma khong co don thuoc cua bac si.</p>
<h3>2. Tuan thu lieu luong va thoi gian</h3>
<p>Uong dung lieu, dung gio va du ngay theo chi dinh, khong ngung som khi thay khoi.</p>',
'https://via.placeholder.com/600x400/3B82F6/white?text=Khang+Sinh', 'BS. Nguyen Van Duoc', 'xuat_ban', 2500, NOW(), 'khang sinh,duoc hoc,suc khoe', NOW(), NOW()),

('Tam quan trong cua Vitamin D voi suc khoe', 'Vitamin D dong vai tro quan trong trong viec hap thu canxi va tang cuong mien dich',
'<h2>Vitamin D - Vitamin cua anh nang</h2>
<p>Vitamin D duoc tong hop khi da tiep xuc voi anh nang mat troi va co vai tro quan trong voi suc khoe.</p>
<h3>Cong dung cua Vitamin D</h3>
<ul>
<li>Giup hap thu canxi va phospho</li>
<li>Tang cuong he mien dich</li>
<li>Ho tro phat trien xuong va rang</li>
<li>Dieu hoa tam trang</li>
</ul>',
'https://via.placeholder.com/600x400/F59E0B/white?text=Vitamin+D', 'DS. Tran Thi Minh', 'xuat_ban', 1800, NOW(), 'vitamin D,dinh duong,xuong khop', NOW(), NOW()),

('Cham soc da mua kho hanh', 'Nhung luu y quan trong khi cham soc da trong mua kho',
'<h2>Da kho - Van de pho bien mua hanh kho</h2>
<p>Mua kho hanh lam da mat do am, can co che do cham soc phu hop.</p>
<h3>Cach cham soc da kho</h3>
<ol>
<li>Su dung sua rua mat diu nhe</li>
<li>Thoa kem duong am thuong xuyen</li>
<li>Uong du nuoc</li>
<li>Tranh tam nuoc qua nong</li>
</ol>',
'https://via.placeholder.com/600x400/8B5CF6/white?text=Cham+Soc+Da', 'BS. Le Thi Huong', 'xuat_ban', 1200, NOW(), 'cham soc da,my pham,mua kho', NOW(), NOW());

-- Insert Tuyen Dung data
INSERT INTO tuyen_dung (tieu_de, vi_tri, mo_ta_cong_viec, yeu_cau, quyen_loi, muc_luong, dia_diem, loai_hinh_lam_viec, kinh_nghiem, han_nop, hinh_anh, trang_thai, luot_xem, tao_luc, cap_nhat_luc) VALUES
('Tuyen Duoc si ban hang', 'Duoc si', 
'- Tu van thuoc cho khach hang theo don bac si
- Ban thuoc va san pham cham soc suc khoe
- Kiem tra, quan ly chat luong thuoc
- Huong dan khach hang su dung thuoc dung cach
- Bao cao doanh so ban hang hang ngay',
'- Tot nghiep Dai hoc Duoc
- Co bang hanh nghe Duoc si
- Ky nang giao tiep tot
- Chiu duoc ap luc cong viec
- Co kinh nghiem ban hang la mot loi the',
'- Luong co ban + hoa hong hap dan
- BHXH, BHYT, BHTN day du
- Thuong hieu suat lam viec
- Duoc dao tao chuyen mon thuong xuyen
- Moi truong lam viec than thien',
'8-12 trieu', 'Ha Noi', 'toan_thoi_gian', '1-2 nam', '2024-12-31', 'https://via.placeholder.com/400x300/3B82F6/white?text=Duoc+Si', 'dang_tuyen', 245, NOW(), NOW()),

('Nhan vien kho thuoc', 'Nhan vien kho',
'- Quan ly xuat nhap kho thuoc
- Kiem tra han su dung thuoc dinh ky
- Sap xep, bao quan thuoc theo dung quy dinh
- Lap bao cao ton kho hang thang
- Phoi hop voi bo phan ban hang de cung cap hang hoa',
'- Tot nghiep THPT tro len
- Co kinh nghiem lam viec trong kho
- Can than, ti mi trong cong viec
- Suc khoe tot, chiu duoc ap luc
- Biet su dung may tinh co ban',
'- Luong on dinh 6-8 trieu
- Moi truong lam viec tot
- BHXH day du
- Thuong le tet
- Duoc dao tao nghiep vu',
'6-8 trieu', 'TP.HCM', 'toan_thoi_gian', 'Khong yeu cau', '2024-12-15', 'https://via.placeholder.com/400x300/10B981/white?text=Nhan+Vien+Kho', 'dang_tuyen', 156, NOW(), NOW()),

('Nhan vien tu van khach hang', 'Nhan vien tu van',
'- Tu van san pham cho khach hang qua dien thoai va truc tiep
- Ho tro khach hang giai dap thac mac ve thuoc
- Xu ly khieu nai cua khach hang
- Cham soc khach hang than thiet
- Cap nhat thong tin san pham moi',
'- Tot nghiep Cao dang/Dai hoc
- Ky nang giao tiep xuat sac
- Giong noi hay, ro rang
- Kien nhan, nhiet tinh
- Co kinh nghiem customer service la loi the',
'- Luong co ban 7-9 trieu + thuong
- Lam viec trong moi truong nang dong
- Co hoi thang tien ro rang
- Dao tao ky nang chuyen nghiep
- Phu cap an trua',
'7-9 trieu', 'Da Nang', 'toan_thoi_gian', '6 thang - 1 nam', '2024-12-20', 'https://via.placeholder.com/400x300/F59E0B/white?text=Tu+Van', 'dang_tuyen', 89, NOW(), NOW());

-- Insert Lien He data
INSERT INTO lien_he (ten, so_dien_thoai, email, loai, mo_ta, thu_tu, trang_thai, tao_luc, cap_nhat_luc) VALUES
('Hotline tu van', '1900-1234', 'tuvan@pharmar.com', 'hotline', 'Tu van su dung thuoc 24/7', 1, 'hoat_dong', NOW(), NOW()),
('Chi nhanh Ha Noi', '024-3456-7890', 'hanoi@pharmar.com', 'chi_nhanh', '123 Pho Hue, Hai Ba Trung, Ha Noi', 2, 'hoat_dong', NOW(), NOW()),
('Chi nhanh TP.HCM', '028-3456-7890', 'hcm@pharmar.com', 'chi_nhanh', '456 Nguyen Van Cu, Q.5, TP.HCM', 3, 'hoat_dong', NOW(), NOW()),
('Chi nhanh Da Nang', '0236-3456-789', 'danang@pharmar.com', 'chi_nhanh', '789 Le Duan, Hai Chau, Da Nang', 4, 'hoat_dong', NOW(), NOW()),
('Zalo ho tro', '0987-654-321', NULL, 'mang_xa_hoi', 'Zalo: Pharmar Support', 5, 'hoat_dong', NOW(), NOW()),
('Facebook Page', NULL, NULL, 'mang_xa_hoi', 'fb.com/PharmarVietnam', 6, 'hoat_dong', NOW(), NOW());