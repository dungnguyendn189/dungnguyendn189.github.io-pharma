'use client';

import Image from 'next/image';
import React from 'react';

export default function WhyChose() {
    return (
        <div className="w-full py-8">
            {/* Tiêu đề */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="relative">
                    <span className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500 rounded-sm"></span>
                    <h2 className="text-3xl md:text-4xl font-bold text-green-500 uppercase pl-6">
                        TẠI SAO CHỌN CHÚNG TÔI
                    </h2>
                </div>
            </div>

            {/* Lý do chọn - hàng 1 */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Lý do 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/1.png"
                            alt="Chất lượng"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Sản phẩm chất lượng – Đạt chuẩn quốc tế</h3>
                    <p className="text-gray-700 text-center">
                        Mọi sản phẩm của EQ Pharma đều được sản xuất trên dây chuyền hiện đại, đạt tiêu chuẩn GMP, ISO 13485:2016 và ISO 22000:2018. Chúng tôi cam kết mang đến các sản phẩm an toàn, hiệu quả, đáp ứng nhu cầu chăm sóc sức khỏe toàn diện.
                    </p>
                </div>

                {/* Lý do 2 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/2.png"
                            alt="Độc quyền"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Công thức độc quyền – Hiệu quả vượt trội</h3>
                    <p className="text-gray-700 text-center">
                        EQ Pharma tiên phong nghiên cứu, phát triển các công thức sản phẩm tối ưu, kết hợp tinh hoa y học cổ truyền và công nghệ hiện đại. Thành phần hàm lượng cao giúp phát huy tác dụng nhanh chóng, mang lại kết quả bền vững.
                    </p>
                </div>

                {/* Lý do 3 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/3.png"
                            alt="Chuyên gia"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Đội ngũ chuyên gia hàng đầu</h3>
                    <p className="text-gray-700 text-center">
                        Sở hữu đội ngũ dược sĩ, bác sĩ, chuyên gia giàu kinh nghiệm, chúng tôi không chỉ cung cấp sản phẩm mà còn mang đến những giải pháp chăm sóc sức khỏe toàn diện, giúp khách hàng sử dụng sản phẩm đúng cách và đạt hiệu quả tốt nhất.
                    </p>
                </div>
            </div>

            {/* Lý do chọn - hàng 2 */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Lý do 4 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/4.png"
                            alt="Dịch vụ khách hàng"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Dịch vụ khách hàng tận tâm, chuyên nghiệp</h3>
                    <p className="text-gray-700 text-center">
                        EQ Pharma luôn đồng hành cùng khách hàng, cung cấp dịch vụ tư vấn kịp thời, hỗ trợ nhanh chóng từ khi mua hàng đến sau khi sử dụng. Chúng tôi đặt trải nghiệm của khách hàng lên hàng đầu, cam kết sự hài lòng tối đa.
                    </p>
                </div>

                {/* Lý do 5 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/5.png"
                            alt="Hệ thống phân phối"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Hệ thống phân phối rộng khắp</h3>
                    <p className="text-gray-700 text-center">
                        Với mạng lưới phân phối phủ rộng khắp các tỉnh thành, sản phẩm EQ Pharma có mặt tại các nhà thuốc, phòng khám và kênh bán hàng trực tuyến, đảm bảo khách hàng dễ dàng tiếp cận và mua sản phẩm chính hãng một cách thuận tiện.
                    </p>
                </div>

                {/* Lý do 6 */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                        <Image
                            src="/icosocial/6.png"
                            alt="Trách nhiệm xã hội"
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-3">Cam kết trách nhiệm với cộng đồng</h3>
                    <p className="text-gray-700 text-center">
                        Không chỉ cung cấp sản phẩm chất lượng, EQ Pharma còn thực hiện nhiều chương trình vì sức khỏe cộng đồng, nâng cao nhận thức về chăm sóc sức khỏe, khẳng định sứ mệnh "LUÔN TỐT HƠN" trong từng sản phẩm và dịch vụ.
                    </p>
                </div>
            </div>
        </div>
    );
}