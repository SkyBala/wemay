import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PromotionCard from "../../promotionCard/PromotionCard";
import arrowRight from "../../../assets/images/icons/Vectorright.svg"
import arrowLeft from "../../../assets/images/icons/Vectorleft.svg"

import "swiper/css";
import { Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import promotionService from "../../../services/promotionService";
interface Props {
  promotionId: number;
}

const PopularPromotions: FC<Props> = ({ promotionId }) => {
  const { data: promotions } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => promotionService.getAll(),
    select: ({ data }) => ({
      ...data,
      results: data.results.filter((promotion) => promotion.id !== promotionId),
    }),
  });

  if (!promotions?.results.length) return <></>;

  return (
    <div className="py-80 container-two">
      <h2 className="mb-40">Популярные акции</h2>
      <div className="relative popular-promotions-slider">
        <button className="slider-prev group absolute top-[114px] left-[16px] border-2 border-white rounded-[8px] py-[6px] px-[10px] bg-white z-10 trans-def hover:border-green hover:bg-[rgba(243,243,243,1)] ">
          <img
            style={{ maskImage: `url(${arrowLeft})` }}
            className="w-[12px] h-[20px] trans-def bg-black group-hover:bg-[rgba(8,148,73,1)]"
          />
        </button>
        <Swiper
          grabCursor
          slidesPerView="auto"
          spaceBetween={62}
          modules={[Navigation]}
          navigation={{
            prevEl: ".popular-promotions-slider .slider-prev",
            nextEl: ".popular-promotions-slider .slider-next",
          }}
        >
          {promotions?.results.map((promotion) => (
            <SwiperSlide key={promotion.id} className="max-w-[540px]">
              <PromotionCard {...promotion} />
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="slider-next group absolute top-[114px] right-[16px] border-2 border-white rounded-[8px] py-[6px] px-[10px] bg-white z-10 trans-def hover:border-green hover:bg-[rgba(243,243,243,1)] ">
          <img
            style={{ maskImage: `url(${arrowRight})` }}
            className="w-[12px] h-[20px] trans-def bg-black group-hover:bg-[rgba(8,148,73,1)]"
          />
        </button>
      </div>
    </div>
  );
};

export default PopularPromotions;
