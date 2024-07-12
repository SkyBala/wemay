import  { FC, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import arrowLeftIcon from "../../../assets/images/icons/arrow-left.svg";
import { Navigation } from "swiper/modules";
import  CompanyCard  from "../../companyCard/CompanyCard";
import Loading from "../../ui/loading/Loading";
import "swiper/css";
import { ICompany } from "../../../types/types";


interface CompaniesProps {
  data?: ICompany[];
  isLoading: boolean;
}


const Companies: FC<CompaniesProps> = ({ data = [], isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
console.log(data);

  // Function to filter companies based on selected category
  const filteredCompanies = selectedCategory
    ? data.filter(company => company.category === selectedCategory)
    : data;

  return (
    <section>
        <h2 className="container p-[20px] mt-[20px]">Компании</h2>
    <div className="container company  mb-[4px] max-w-[1355px] flex justify-between items-center">
      <button
        className="px-10 h-full slider-prev group"
        onClick={() => setSelectedCategory("someCategory")}
      >
        {/* Add your category filter logic here */}
        <img
          src={arrowLeftIcon}
          alt="arrow-left"
          className="trans-def group-disabled:opacity-50"
        />
      </button>
      {isLoading ? (
        <div className="relative">
          <Loading />
        </div>
      ) : (
        <Swiper
          grabCursor
          slidesPerView={"auto"}
          spaceBetween={16}
          modules={[Navigation]}
          className="container max-w-[1169px] pl-[12px] py-[16px]"
          breakpoints={{ 425: { spaceBetween: 31 } }}
          navigation={{
            prevEl: ".company .slider-prev",
            nextEl: ".company .slider-next",
          }}
        >
          {filteredCompanies.map((company) => (
            <SwiperSlide key={company.id} className="w-fit">
              < CompanyCard {...company} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <button className="px-10 h-full slider-next group">
        <img
          src={arrowLeftIcon}
          alt="arrow-right"
          className="rotate-180 trans-def group-disabled:opacity-50"
        />
      </button>
    </div>
    </section>
  );
};

export default Companies;
