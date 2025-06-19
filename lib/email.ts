// lib/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gmail của bạn
        pass: process.env.EMAIL_PASSWORD, // App password
    },
})

// lib/email.ts - thêm function này
type LoaiContact = 'tu_van' | 'ho_tro' | 'khieu_nai' | 'hop_tac';

export const sendContactNotification = async (contactData: {
    hoTen: string
    email: string
    soDienThoai: string
    noiDung: string
    loai: LoaiContact
}) => {
    const loaiMap: Record<LoaiContact, string> = {
        'tu_van': 'Tư vấn',
        'ho_tro': 'Hỗ trợ',
        'khieu_nai': 'Khiếu nại',
        'hop_tac': 'Hợp tác'
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // Gmail nhận thông báo
        subject: `📞 Liên hệ mới: ${loaiMap[contactData.loai]} - Pharma App`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📞 Thông tin liên hệ mới!</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 20px; background: #f9fafb;">
            <div style="background: #dbeafe; border-left: 4px solid #3B82F6; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
              <h2 style="color: #1e40af; margin: 0; font-size: 18px;">
                📋 ${loaiMap[contactData.loai]}
              </h2>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">👤 Họ tên:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${contactData.hoTen}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📧 Email:</td>
                  <td style="padding: 8px 0; color: #1f2937;">
                    <a href="mailto:${contactData.email}" style="color: #3B82F6; text-decoration: none;">
                      ${contactData.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📱 Điện thoại:</td>
                  <td style="padding: 8px 0; color: #1f2937;">
                    <a href="tel:${contactData.soDienThoai}" style="color: #3B82F6; text-decoration: none;">
                      ${contactData.soDienThoai}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">📅 Thời gian:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${new Date().toLocaleString('vi-VN')}</td>
                </tr>
              </table>
            </div>
            
            <!-- Nội dung -->
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-top: 15px;">
              <h3 style="color: #374151; margin-top: 0; margin-bottom: 10px;">💬 Nội dung:</h3>
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 3px solid #3B82F6;">
                <p style="margin: 0; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${contactData.noiDung}</p>
              </div>
            </div>
            
            <!-- Actions -->
            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${contactData.email}" 
                 style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">
                ✉️ Trả lời email
              </a>
              <a href="tel:${contactData.soDienThoai}" 
                 style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                📞 Gọi điện
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #e5e7eb; padding: 15px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              Email này được gửi tự động từ form liên hệ Pharma App<br>
              Thời gian: ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('✅ Contact notification sent to:', process.env.ADMIN_EMAIL)
        return true
    } catch (error) {
        console.error('❌ Error sending contact email:', error)
        return false
    }
}