import Image from "next/image";
import Banner from "./_components/Banner";
import Title from "./_components/Title";
import city1 from "@/public/city1.png"
import city2 from "@/public/city2.png";
import CoreValues from "./_components/CoreValues";
import WhyChose from "./_components/WhyChose";
import ProductCategories from "./_components/ProductCategories";
import FooterHome from "./_components/FooterHome";


export default function Home() {
  return (
    <div className="w-full">
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto gap-6 py-4 px-4">
        <div className="max-h-[330px]">
          <Image
            src={city1}
            alt="city1"
            height={330}
          />
        </div>
        <Title
          title="Giới thiệu về EQ PHARMA"
          description="Tự hào là một trong những đơn vị dược phẩm uy tín trên thị trường Việt Nam hiện nay, Công ty cổ phần dược phẩm EQ PHARMA là lựa chọn tin cậy của nhiều đối tác và người tiêu dùng. Các sản phẩm của EQ PHARMA mang đến sứ mệnh chăm sóc bảo vệ sức khỏe cho trẻ em, người già, phụ nữ và nam giới – với chất lượng vượt trội và giá thành phù hợp cho mọi gia đình. Với khát khao sẽ trở thành công ty hàng đầu trong ngành Dược – TPCN, TPBVSK, EQ PHARMA luôn nỗ lực hết mình với phương châm “LUÔN TỐT HƠN” !"
          align="left"
          titleColor="text-green-500"
          showBorder={true}
          layout="image-showcase"
          detailLink="/pages/gioithieu"
          className="flex flex-col justify-between items-start gap-4 h-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl  mx-auto gap-6 py-4 px-4">
        <Title
          title="Giới thiệu về EQ PHARMA"
          image={city2.src}
          description="Tự hào là một trong những đơn vị dược phẩm uy tín trên thị trường Việt Nam hiện nay, Công ty cổ phần dược phẩm EQ PHARMA là lựa chọn tin cậy của nhiều đối tác và người tiêu dùng. Các sản phẩm của EQ PHARMA mang đến sứ mệnh chăm sóc bảo vệ sức khỏe cho trẻ em, người già, phụ nữ và nam giới – với chất lượng vượt trội và giá thành phù hợp cho mọi gia đình. Với khát khao sẽ trở thành công ty hàng đầu trong ngành Dược – TPCN, TPBVSK, EQ PHARMA luôn nỗ lực hết mình với phương châm “LUÔN TỐT HƠN” !"
          align="left"
          titleColor="text-green-500"
          showBorder={true}
          detailLink="/pages/gioithieu"
        />
        <CoreValues />
      </div >
      <div className="max-w-7xl py-4 px-4 mx-auto">
        <WhyChose />

      </div>
      {/* Thêm carousel dạng bào chế sản phẩm */}
      <ProductCategories />


      <FooterHome />
    </div>
  );
}
