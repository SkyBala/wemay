import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import arrowLeftIcon from "../../../assets/images/icons/arrow-left.svg";
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import Loading from "../../ui/loading/Loading";
import clsx from "clsx";
import "swiper/css";
import { IPromotion } from "../../../types/types";

interface SliderProps {
  data: IPromotion[];
  isLoading: boolean;
}

const Slider: FC<SliderProps> = ({ data = [], isLoading }) => {
  console.log(data);
  
  return (
    <section className="container main mt-[32px] max-w-[1377px]">
      <div className="rounded-[48px] py-[125px] h-[508px] flex items-center bg-gray lt:py-40 lt:h-auto">
        <button
          className={clsx(
            "pl-[24px] h-full flex-shrink-0 slider-prev tb:pl-0",
            { hidden: data.length <= 1 }
          )}
        >
          <img src={arrowLeftIcon} alt="arrow-left" />
        </button>
        {isLoading ? (
          <div className="relative flex-grow">
            <Loading />
          </div>
        ) : data.length === 0 ? (
          <div className="flex-grow text-center text-[24px] font-bold">
            Нет данных
          </div>
        ) : (
          <Swiper
            grabCursor
            speed={500}
            slidesPerView={1}
            spaceBetween={30}
            modules={[Autoplay, Navigation]}
            loop={data.length > 1}
            navigation={{
              prevEl: ".main .slider-prev",
              nextEl: ".main .slider-next",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className={clsx("mx-[62px] w-full lt:mx-0", {
              "mx-90": data.length <= 1,
            })}
          >
            {data.map((promotion) => (
              <SwiperSlide
                key={promotion?.id}
                className="flex justify-between items-center lt:flex-col lt:gap-[20px]"
              >
                <div className="flex-[0_1_490px] lt:px-20 lt:flex-auto lt:max-w-[595px] lt:order-[2]">
                  <h3 className="text-[48px] font-bold tb:text-[24px] overflow-ellipsis line-clamp-3">
                    {promotion.title}
                  </h3>
                  <span className="mt-20 mb-40 block text-[20px] font-medium tb:mt-[16px] tb:text-18">
                    Покупай прямо сейчас!
                  </span>
                  <Link
                    to={`/promotion/${promotion.id}`}
                    className="box-secondary border-[2px] py-[14px] px-[49px] block w-fit text-18 text-center tb:w-full"
                  >
                    Подробнее
                  </Link>
                </div>
                <div className="bmb:mt-[152px] tb:max-w-[328px]">
                  <img
                    src={promotion.slider_image}
                    alt="promotion-image"
                    className="h-[340px] object-contain lt:h-[190px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <button
          className={clsx(
            "pr-[24px] h-full flex-shrink-0 slider-next tb:pr-0",
            { hidden: data.length <= 1 }
          )}
        >
          <img src={arrowLeftIcon} alt="arrow-left" className="rotate-180" />
        </button>
      </div>
    </section>
  );
};

export default Slider;
