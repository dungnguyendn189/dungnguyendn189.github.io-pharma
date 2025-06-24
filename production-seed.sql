-- Migration script for production database
-- Run this after first deployment

-- Create admin user (optional)
INSERT INTO admin (ten_dang_nhap, mat_khau, email, ho_ten, vai_tro, trang_thai)
VALUES (
  'admin',
  '$2a$10$hash_password_here', -- Use bcrypt to hash your password
  'admin@pharma.com',
  'Administrator',
  'admin',
  'hoat_dong'
);

-- Create default categories
INSERT INTO danh_muc (ten_danh_muc, mo_ta, thu_tu, trang_thai)
VALUES 
  ('Thuốc kháng sinh', 'Các loại thuốc kháng sinh', 1, 'hoat_dong'),
  ('Thuốc giảm đau', 'Các loại thuốc giảm đau, hạ sốt', 2, 'hoat_dong'),
  ('Vitamin & Khoáng chất', 'Thực phẩm bổ sung dinh dưỡng', 3, 'hoat_dong'),
  ('Thuốc tiêu hóa', 'Thuốc hỗ trợ tiêu hóa', 4, 'hoat_dong');
