import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import arrowLeftIcon from "../../../assets/images/icons/arrow-left.svg";
import { Navigation } from "swiper/modules";
import CompanyCard from "../../companyCard/CompanyCard";
import "swiper/css";
import { useQuery } from "@tanstack/react-query";
import companiesService from "../../../services/companiesService";
import Loading from "../../ui/loading/Loading";

const Companies: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesService.getAll(),
    select: ({ data }) => data,
  });

  return (
    <section className="pt-60">
      <h2 className="container">Компании</h2>
      <div className="container company mt-[24px] mb-[4px] max-w-[1355px] flex justify-between items-center">
        <button className="px-10 h-full slider-prev group">
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
            {data?.results?.map((company, key) => (
              <SwiperSlide key={key} className="w-fit">
                <CompanyCard {...company} />
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
      {/* <button className="block mx-auto text-[#2F80ED]">Показать ещё</button> */}
    </section>
  );
};

export default Companies;
