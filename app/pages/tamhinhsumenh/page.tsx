import React from 'react';

// === Icon Components ===
const PlantIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 5.06l.005-.005a2 2 0 112.824 2.834l-.006.005a2 2 0 11-2.823-2.834zM16.116 5.06l-.005-.005a2 2 0 10-2.824 2.834l.006.005a2 2 0 102.823-2.834zM12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

// Icons cho phần giá trị cốt lõi
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

const TrustIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

const ResponsibilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const HandshakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const QualityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

// === Data for the cards ===
const cardData = [
    {
        id: 'vision',
        icon: <PlantIcon />,
        title: 'Tầm nhìn',
        content: (
            <p className="text-gray-700 text-center leading-relaxed">
                Tầm nhìn 3 năm (2027): Top 10 doanh nghiệp TPBVSK tại Việt Nam. Tầm nhìn 5 năm (2029): Xây dựng hệ sinh thái sức khỏe, top 10 doanh nghiệp TPBVSK uy tín. Tầm nhìn dài hạn: Duy trì Top 10 đơn vị TPBVSK Việt với sản phẩm chất lượng với sự kết hợp dược liệu và y học hiện đại.
            </p>
        )
    },
    {
        id: 'mission',
        icon: <ChartIcon />,
        title: 'Sứ mệnh',
        content: (
            <ul className="text-gray-700 space-y-3 text-left w-full pl-2 sm:pl-5">
                <li className="flex items-start">
                    <span className="mr-3 text-green-600 font-bold">*</span>
                    <span>Cung cấp các sản phẩm thực phẩm chức năng, thực phẩm bảo vệ sức khỏe, thực phẩm bổ sung, mỹ phẩm chất lượng cao, giúp làm đẹp, bảo vệ và nâng cao sức khỏe con người.</span>
                </li>
                <li className="flex items-start">
                    <span className="mr-3 text-green-600 font-bold">*</span>
                    <span>Cam kết 100% sản phẩm an toàn cho người sử dụng.</span>
                </li>
            </ul>
        )
    }
];

// Data cho phần giá trị cốt lõi
const coreValuesData = [
    {
        id: 'tam',
        icon: <HeartIcon />,
        title: 'Tâm',
        description: 'Làm bằng Tâm'
    },
    {
        id: 'tin',
        icon: <TrustIcon />,
        title: 'Tín',
        description: 'Chữ Tín hàng đầu.'
    },
    {
        id: 'responsibility',
        icon: <ResponsibilityIcon />,
        title: 'Trung thực và trách nhiệm',
        description: 'Trung thực với mình, trung thực với khách hàng. Có trách nhiệm với sản phẩm dịch vụ mình cung cấp và có trách nhiệm với cộng đồng'
    },
    {
        id: 'commitment',
        icon: <HandshakeIcon />,
        title: 'Tự duy tích cực',
        description: 'Luôn có tư duy tích cực khi giải quyết vấn đề.'
    },
    {
        id: 'quality',
        icon: <QualityIcon />,
        title: 'Chất lượng',
        description: 'Chất lượng sản phẩm, chất lượng dịch vụ là sự sống còn'
    }
];

// === Reusable Card Component ===
type InfoCardProps = {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
};

const InfoCard = ({ icon, title, content }: InfoCardProps) => (
    <div className="relative w-full max-w-md lg:max-w-lg">
        {/* Green Swoosh Border (SVG) - The magic part! */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'scale(1.15)' }}>
                <path
                    d="M 90,50 A 40,40 0 1 1 50,10"
                    stroke="#013b17"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
        </div>

        {/* Content Box */}
        <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-[4rem] p-8 lg:p-10 h-full flex flex-col items-center shadow-lg">
            <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mb-5 shadow-md">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-amber-500 mb-5 text-center">{title}</h2>
            {content}
        </div>
    </div>
);

// === Core Value Card Component ===
type CoreValueCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const CoreValueCard = ({ icon, title, description }: CoreValueCardProps) => (
    <div className="flex flex-col items-center text-center p-6">
        <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-amber-500 mb-3">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line max-w-xs">
            {description}
        </p>
    </div>
);

// === Core Values Section ===
const CoreValuesSection = () => (
    <section className="relative w-full py-16 bg-white">
        <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                    <div className="h-1 bg-amber-500 w-12 mr-4"></div>
                    <h2 className="text-4xl font-bold text-green-600">GIÁ TRỊ CỐT LÕI</h2>
                    <div className="h-1 bg-amber-500 w-12 ml-4"></div>
                </div>
                <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                    EQ PHARMA thực hiện sứ mệnh của mình bằng việc duy trì 4 giá trị cốt lõi (4T & 1C)
                </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {coreValuesData.map((value) => (
                    <CoreValueCard
                        key={value.id}
                        icon={value.icon}
                        title={value.title}
                        description={value.description}
                    />
                ))}
            </div>
        </div>
    </section>
);

// === Main Component ===
const VisionMission = () => {
    return (
        <div className="w-full">
            {/* Vision & Mission Section */}
            <section className="relative w-full min-h-screen flex items-center justify-center p-4 lg:p-8 bg-gray-50 overflow-hidden">
                <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-center gap-14 lg:gap-20">
                    {cardData.map((data) => (
                        <InfoCard
                            key={data.id}
                            icon={data.icon}
                            title={data.title}
                            content={data.content}
                        />
                    ))}
                </div>
            </section>

            {/* Core Values Section */}
            <CoreValuesSection />
        </div>
    );
};

export default VisionMission;