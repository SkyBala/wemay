import { FC, useEffect, useState } from "react";
import { IPromotion } from "../../../types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { customMarkerIcon } from "../../../data/data";
import Modal from "../../ui/modal/Modal";
import likeIcon from "../../../assets/images/icons/like.svg";
import likedIcon from "../../../assets/images/icons/liked.svg";
import likeGreenIcon from "../../../assets/images/icons/like-green.svg";
import timeIcon from "../../../assets/images/icons/time.svg";
import telIcon from "../../../assets/images/icons/tel.svg";
import instagramIcon from "../../../assets/images/icons/instagram.svg";
import facebookIcon from "../../../assets/images/icons/facebook.svg";
import whatsappIcon from "../../../assets/images/icons/whatsapp.svg";
import websiteIcon from "../../../assets/images/icons/website.svg";
import crossIcon from "../../../assets/images/icons/cross.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mapService from "../../../services/mapService";
import promotionService from "../../../services/promotionService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { setErrorNotification } from "../../../store/slices/notificationSlice";
import clsx from "clsx";
import { useProfile } from "../../../hooks/useProfile";
import companiesService from "../../../services/companiesService";
import "swiper/css";

const daysFormat = {
  monday: "Пн",
  tuesday: "Вт",
  wednesday: "Ср",
  thursday: "Чт",
  friday: "Пт",
  saturday: "Сб",
  sunday: "Вс",
};

const getPercentFromNumber = (firstNumber: number, secondNumber: number) =>
  Math.floor((firstNumber / secondNumber) * 100);

const Promotion: FC<IPromotion> = ({
  id,
  title,
  images,
  old_price,
  new_price,
  likes,
  company_work_schedule,
  end_date,
  description,
  address,
  company,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const [restTime, setRestTime] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const { data: profile } = useProfile();

  const { data: marker } = useQuery({
    queryKey: ["marker", id],
    queryFn: () => mapService.getByName(address),
    select: ({ data }) => data,
    enabled: !!address,
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  const { data: companyData } = useQuery({
    queryKey: ["company", company],
    queryFn: () => companiesService.getById(company),
    select: ({ data }) => data,
  });

  const { data: contacts } = useQuery({
    queryKey: ["contacts", company],
    queryFn: () => companiesService.getContacts(company),
    select: ({ data }) => data,
  });
console.log(contacts);

  const [localLikes, setLocalLikes] = useState(likes);

  const { mutate: like } = useMutation({
    mutationFn: promotionService.like,
    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["liked-promotions"] });
    },
  });

  useEffect(() => {
    setCurrentImage(images[0]?.image);
  }, [images]);

  useEffect(() => {
    const date = end_date.split(" ")[0];
    const hours = end_date.split(" ")[1];
    const hour = +hours.split(":")[0].slice(1);
    const minutes = +hours.split(":")[1];
    const seconds = +hours.split(":")[2];

    let timer = setTimeout(function tick() {
      const restDate = new Date(date);
      restDate.setHours(hour);
      restDate.setMinutes(minutes);
      restDate.setSeconds(seconds);

      const restTime = +restDate - +new Date();

      if (restTime <= 0) {
        navigate("/", { replace: true });
        dispatch(setErrorNotification("Вышло время текущей акции"));
      }

      const restDays = Math.floor(restTime / 1000 / 60 / 60 / 24);
      const restHours = Math.floor(restTime / 1000 / 60 / 60) % 24;
      const restMinutes = Math.floor(restTime / 1000 / 60) % 60;
      const restSeconds = Math.floor(restTime / 1000) % 60;

      setRestTime(
        `${restDays}д ${restHours}ч ${
          (restMinutes + "").length === 1 ? "0" : ""
        }${restMinutes}:${
          (restSeconds + "").length === 1 ? "0" : ""
        }${restSeconds}`
      );
      timer = setTimeout(tick, 1000);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const onClickLike = () => {
    like(id);
    setLocalLikes((prev) =>
      prev.includes(profile?.id!)
        ? prev.filter((id) => id !== profile?.id)
        : [...prev, profile?.id!]
    );3
  };

  const addressCoordinates = marker?.[0]
    ? [marker[0]?.lat, marker[0].lon]
    : null;

  const workSchedule: any = company_work_schedule
    ? Object.keys(company_work_schedule).reduce((prev, day) => {
        const currDay = day.split("_")[0];
        const currFromOrTo = day.split("_")[1];
        // @ts-ignore
        const currTime = company_work_schedule[day]
          ?.split(":")
          .slice(0, 2)
          .join(":");

        return {
          ...prev,
          //@ts-ignore
          [currDay]: { ...(prev?.[currDay] || {}), [currFromOrTo]: currTime },
        };
      }, {})
    : null;

  // console.log(
  //   workSchedule,
  //   Object.keys(workSchedule)?.reduce((prev, day) => {
  //     let currTime: string;
  //     let prevArray = Object.keys(prev)

  //     return prevArray.some((time) => {
  //       let isExist: boolean;

  //       isExist = (prev[time].start === workSchedule[day].start &&
  //         prev[time].end === workSchedule[day].end) ||
  //       !workSchedule[day].start

  //       if(isExist) currTime = time

  //       return isExist
  //     })
  //       ? prevArray[prevArray.findIndex((key) => key === day)]
  //       : { ...prev, [day]: workSchedule[day] };
  //   }, {})
  // );

  return (
    <section className="container-two pt-[44px] pb-80">
      <h1 className="title">{title}</h1>
      <div className="mt-[32px] flex justify-between gap-[32px] items-start blt:flex-col blt:items-stretch">
        <div className="flex-[0_0_740px] blt:flex-auto">
          <div
            onClick={() => setViewImage(currentImage)}
            style={{ backgroundImage: `url(${currentImage})` }}
            className="rounded-[24px] w-full h-[454px] flex items-end justify-between bg-cover bg-center bg-no-repeat text-white overflow-hidden trans-def cursor-pointer stb:h-[200px]"
          >
            {old_price ? (
              <b className="rounded-[0_16px_0_16px] p-[12px] bg-[linear-gradient(90deg,#2F80ED_0%,rgba(47,128,237,0)_100%)] text-[24px] leading-[24px]">
                -{getPercentFromNumber(new_price, old_price)}%
              </b>
            ) : (
              <div></div>
            )}
            <div className="rounded-[24px,0px,24px,0px] py-[12px] px-[24px] bg-[linear-gradient(270deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_96.11%)] flex gap-[8px] items-center">
              <img
                alt="like"
                src={localLikes.includes(profile?.id!) ? likedIcon : likeIcon}
              />
              <span>{localLikes?.length || 0}</span>
            </div>
          </div>
          <div className="mt-[24px] flex justify-between items-center tb:flex-col tb:items-start tb:gap-[24px]">
            <Swiper
              spaceBetween={21}
              slidesPerView="auto"
              className="m-0 max-w-[595px]"
            >
              {images.map((image, key) => (
                <SwiperSlide
                  key={key}
                  className="w-[135px] h-[80px] rounded-[16px] overflow-hidden"
                >
                  <button
                    className="w-full h-full"
                    onClick={() => setCurrentImage(image.image)}
                  >
                    <img
                      src={image.image}
                      alt={`promotion ${image} ${key + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            <div></div>
        
          </div>
        </div>
        <div className="rounded-[24px] p-[32px] bg-gray flex-[0_1_508px] font-mulish">
          {old_price && (
            <span className="relative text-[24px] text-[rgba(130,130,130,1)]">
              от {old_price} сом{" "}
              <div className="absolute top-[calc(50%+1px)] left-[-3px] w-full h-[1px] bg-[rgba(130,130,130,1)]"></div>
            </span>
          )}
          <b
            className={clsx("text-[24px]", {
              "ml-[15px]": old_price,
            })}
          >
            от {new_price} сом
          </b>
          {old_price && (
            <span className="block mt-[8px] mb-[24px] text-18 leading-[23px] text-[#4F4F4F]">
              Экономия {old_price - new_price} сом
            </span>
          )}
          <div
            className={clsx(
              "mb-[24px] flex justify-between items-center gap-[8px] blt:justify-start",
              { "mt-[24px]": !old_price }
            )}
          >
            <button
              onClick={() => setIsContactsOpen(true)}
              className="btn flex-[0_1_630px] text-center"
            >
              Связаться
            </button>
            <button
              onClick={onClickLike}
              disabled={!profile?.id}
              className="box-secondary border-green rounded-[100px] py-[7.5px] px-[24px] text-center text-14 leading-[19px] text-green disabled:pointer-events-none"
            >
              <img
                src={
                  localLikes.includes(profile?.id!) ? likedIcon : likeGreenIcon
                }
                alt="like-green"
                className="mb-[2px] block min-w-[18px] h-[16px]"
              />
              <span className="">{localLikes?.length || 0}</span>
            </button>
          </div>
      
        
          <div className="my-[21px] max-w-[255px] w-full h-[1px] bg-[#D7D7D7]"></div>
         <span className="text-grey cursor-pointer" onClick={toggleAccordion}>
        Часы работы
      </span>
      {isOpen && (
        <div>
          {workSchedule &&
            Object.keys(workSchedule).map(
              (key) =>
                workSchedule[key].start &&
                workSchedule[key].end && (
                  <span
                    key={key}
                    className="mt-[8px] block text-18 text-grey leading-[24px]"
                  >
                    {
                      // @ts-ignore
                      daysFormat[key]
                    }
                    : {workSchedule[key].start} - {workSchedule[key].end}
                  </span>
                )
            )}
        </div>
        
      )}
          <div className="font-mulish flex justify-center items-end flex-col">
              <div className="flex gap-[6px] items-center text-14 leading-[19px] text-[#4F4F4F]">
                <img src={timeIcon} alt="clock" />
                <span>До конца акции</span>
              </div>
              <span className="text-grey mr-[20px]">{restTime}</span>
            </div>
        </div>
        <Modal
          isOpen={isContactsOpen}
          close={() => setIsContactsOpen(false)}
          modalStyle="z-[60]"
          contentStyle="pt-20 px-40 pb-[32px] relative text-[20px] leading-[24px]"
        >
          <div className="flex flex-row justify-between items-center mb-20">
            
          <h2 >Связаться</h2>
            <button
            onClick={() => setIsContactsOpen(false)}
          className="pl-[20px]"
          >
            <img src={crossIcon} alt="cross" />
          </button>
          </div>
        
          {contacts?.results.map((tel) => (
            <a
              key={tel.id}
              href={`tel:${tel.value}`}
              className="btn my-10 flex justify-center gap-[8px] items-center w-[520px]"
            >
              <img src={telIcon} alt="tel" />
              <span> {tel.title}</span>
            </a>
          ))}
          <div className="flex gap-[16px] justify-center items-center">
            {companyData?.instagram && (
              <a href={companyData.instagram} target="_blank" className="h-[40px] w-[40px]">
                <img src={instagramIcon} alt="instagram" />
              </a>
            )}
            {companyData?.facebook && (
              <a href={companyData.facebook} target="_blank" className="h-[40px] w-[40px]">
                <img src={facebookIcon} alt="facebook" />
              </a>
            )}
            {companyData?.whatsapp && (
              <a href={companyData.whatsapp} target="_blank" className="h-[40px] w-[40px]">
                <img src={whatsappIcon} alt="whatsapp" />
              </a>
            )}
            {companyData?.website && (
              <a href={companyData.website} target="_blank" className="h-[40px] w-[40px]">
                <img src={websiteIcon} alt="website" />
              </a>
            )}
          </div>
        </Modal>
      </div>
      <h2 className="mt-80 mb-[32px]">Описание</h2>
      <p>{description}</p>
      {marker?.[0] && (
        <>
          <h2 className="mt-80 mb-[32px]">Адреса</h2>
          <span className="text-[18px] leading-[23px]">Адрес</span>
          <span className="mt-[8px] mb-[32px] block text-[18px] leading-[23px]">
            {address}
          </span>
          <MapContainer
            // @ts-ignore
            center={addressCoordinates}
            className="rounded-[24px] max-w-[848px] w-full h-[374px]"
            zoom={16}
          >
            <TileLayer
              // @ts-ignore
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              // @ts-ignore
              position={addressCoordinates}
              icon={customMarkerIcon()}
            ></Marker>
          </MapContainer>
        </>
      )}
      <Modal
        modalStyle="z-[100]"
        isOpen={!!viewImage}
        contentStyle="bg-transparent relative"
        close={() => setViewImage("")}
      >
        <button
          onClick={() => setViewImage("")}
          className="absolute top-0 right-0 p-[5px] bg-green rounded-[0_0_0_12px]"
        >
          <div
            className="w-[24px] h-[24px] bg-white"
            style={{
              maskImage: `url(${crossIcon})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
            }}
          ></div>
        </button>
        <img
          src={viewImage}
          alt="view-image"
          className="max-w-[80vw] max-h-[80vh]"
        />
      </Modal>
    </section>
  );
};

export default Promotion;
