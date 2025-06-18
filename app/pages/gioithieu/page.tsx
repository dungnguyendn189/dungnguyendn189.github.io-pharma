import Image from 'next/image';

export default function GioiThieu() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Section 1: Giới thiệu công ty */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Phần hình ảnh bên trái */}
                <div className="relative max-h-[700px] w-full h-[500px]">
                    <Image
                        src="/introduct/1.png" // Đặt đúng đường dẫn đến hình ảnh tòa nhà
                        alt="Tòa nhà EQ Pharma"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Phần nội dung bên phải */}
                <div>
                    <div className="bg-green-700 text-white p-4 inline-block mb-6 relative">
                        <h1 className="text-2xl md:text-3xl font-bold">VỀ CHÚNG TÔI</h1>
                        <div className="absolute top-0 right-0 h-full w-24 bg-green-600 -skew-x-12 -z-10 translate-x-16"></div>
                    </div>

                    <div className="space-y-4 text-gray-700">
                        <p>
                            Tự hào là một trong những đơn vị dược phẩm uy tín trên thị trường Việt Nam
                            hiện nay, Công ty cổ phần dược phẩm <span className="font-bold">EQ PHARMA</span> là lựa chọn tin cậy của
                            nhiều đối tác và người tiêu dùng.
                        </p>

                        <p>
                            Các sản phẩm của <span className="font-bold">EQ PHARMA</span> mang đến sứ mệnh chăm sóc bảo vệ sức khỏe
                            cho trẻ em, người già, phụ nữ và nam giới – <span className="font-bold">với chất lượng vượt trội và giá
                                thành phù hợp cho mọi gia đình</span>.
                        </p>

                        <p>
                            Với khát khao sẽ trở thành công ty hàng đầu trong ngành <span className="font-bold">Dược – TPCN,
                                TPBVSK, EQ PHARMA</span> luôn nỗ lực hết mình với phương châm <span className="font-bold">&ldquo;LUÔN TỐT
                                    HƠN&ldquo;</span> !
                        </p>

                        <p>
                            Với đội ngũ chuyên viên, kỹ thuật viên là các dược sĩ, bác sĩ lâu năm trong
                            ngành, luôn năng động, sáng tạo, cập nhật kiến thức, công nghệ mới liên tục,
                            đồng thời, các sản phẩm được sản xuất tại nhà máy trang bị đầy chuyên sản
                            xuất hiện đại, khép kín, tuân thủ nghiêm ngặt theo Tiêu chuẩn GMP của Bộ Y tế,
                            hệ thống Quản lý chất lượng ISO 13485:2016, hệ thống Quản lý an toàn thực
                            phẩm ISO 22000: 2018, điều này giúp EQ PHARMA cung cấp cho khách hàng
                            nhiều dòng sản phẩm thực phẩm chức năng, thực phẩm bảo vệ sức khỏe, thực
                            phẩm bổ sung, mỹ phẩm, vật tư y tế, chiết xuất dược liệu chất lượng cao được
                            kết hợp giữa y học cổ truyền và công nghệ hiện đại, đóng góp 1 phần vào công
                            cuộc đổi mới ngành dược phẩm và thực phẩm giúp nâng cao, bảo vệ sức khỏe
                            cho mọi người.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Cam kết chất lượng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                {/* Nội dung bên trái */}
                <div className="bg-green-700 text-white p-8 rounded-lg">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Cam kết chất lượng</h2>
                    <p className="leading-relaxed">
                        100% sản phẩm công ty cam kết kiểm soát chất lượng và tuân thủ theo các quy định nhà máy
                        đạt tiêu chuẩn GMP, ISO. Hệ thống nhà máy, trang bị đầy chuyên sản xuất hiện đại, khép kín,
                        tuân thủ nghiêm ngặt theo Tiêu chuẩn GMP, hệ thống Quản lý chất lượng ISO 13485:2016, hệ
                        thống Quản lý an toàn thực phẩm ISO 22000:2018, điều này giúp EQ Pharma cung cấp cho
                        khách hàng nhiều dòng sản phẩm chất lượng bảo vệ sức khỏe, mỹ phẩm, vật tư y tế, chiết xuất
                        dược liệu chất lượng.
                    </p>
                </div>

                {/* Hình ảnh bên phải */}
                <div className="relative w-full h-[400px]">
                    <Image
                        src="/introduct/2.png" // Thay thế bằng đường dẫn đến hình ảnh bác sĩ của bạn
                        alt="Cam kết chất lượng"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            </div>

            {/* Section 3: Đội ngũ chuyên môn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                {/* Hình ảnh bên trái */}
                <div className="relative w-full h-[400px]">
                    <Image
                        src="/introduct/3.png" // Thay thế bằng đường dẫn đến hình ảnh đội ngũ của bạn
                        alt="Đội ngũ chuyên môn"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Nội dung bên phải */}
                <div>
                    <div className="bg-green-700 text-white p-4 inline-block mb-6 relative">
                        <h2 className="text-2xl md:text-3xl font-bold">Đội ngũ chuyên môn lành nghề</h2>
                        <div className="absolute top-0 right-0 h-full w-24 bg-green-600 -skew-x-12 -z-10 translate-x-16"></div>
                    </div>
                    <div className="space-y-4 text-gray-700">
                        <p className="leading-relaxed">
                            Với đội ngũ chuyên viên, kỹ thuật viên là các dược sĩ, bác sĩ lâu năm trong ngành sẽ hỗ trợ khách
                            hàng kịp thời và hiệu quả trong việc tư vấn chuyên sâu về sản phẩm như cách sử dụng sản phẩm
                            hiệu quả nhất, các lưu ý khi sử dụng sản phẩm và các dịch vụ công ty cung cấp.
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Dịch vụ khách hàng tận tâm</h2>
                        <p className="leading-relaxed text-gray-700">
                            Chúng tôi có nhân viên chuyên trách cung cấp mọi thông tin liên quan đến sản phẩm bao gồm: Tiến
                            độ cấp hàng, chất lượng sản phẩm, chất lượng dịch vụ, xử lý các vấn đề phát sinh trong và sau khi
                            giao hàng, cung cấp kịp thời các tài liệu khách hàng cần.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 4: Các tiêu chuẩn chất lượng */}
            <div className="mt-16 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-10">Các tiêu chuẩn chất lượng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Sản xuất tốt – GMP</h3>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Kiểm tra chất lượng tốt – GLP</h3>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Bảo quản tốt – GSP</h3>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Phân phối tốt – GDP</h3>
                    </div>
                </div>
            </div>
            {/* Section 4: Các tiêu chuẩn chất lượng */}

            <div className="rounded-2xl mt-16 flex flex-col md:flex-row items-center justify-center  bg-gray-300 p-6">
                {/* Left Section: Text and CTA */}
                <div className="md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        Sản phẩm thân thuộc của người Việt
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Nhiều sản phẩm của EQ Pharma đã trở thành thuốc và vị thuốc Việt rất quen thuộc: Bổ Khớp NewJoint TTPHA, Siro ho LAPCOUGH, Canxi Caneq Plus, Bổ não Ginkgo Smart, Dạ dày EQ, Canxi Bones...
                    </p>
                    <div className="bg-green-700 text-white rounded-full py-3 px-6 inline-flex items-center space-x-2">
                        <span className="text-2xl font-bold">100+</span>
                        <p className="text-sm">
                            sản phẩm TPCN, thực phẩm bảo vệ sức khỏe, vị thuốc đang được chế biến, phân phối khắp cả nước.
                        </p>
                    </div>
                </div>

                {/* Right Section: Product Images */}
                <div className="md:w-1/2 p-6 flex flex-wrap justify-center items-center gap-4">
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="/introduct/4.png" // Thay thế bằng đường dẫn đến hình ảnh đội ngũ của bạn
                            alt="Đội ngũ chuyên môn"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}