import { FC, useEffect, useState } from "react";
// @ts-ignore
import useMatchMedia from "use-match-media";
import geoIcon from "../../assets/images/icons/geo.svg";
import filterIcon from "../../assets/images/icons/filter.svg";
import PromotionCard from "../promotionCard/PromotionCard"; 
import Filter from "../filter/Filter";
import Map from "../map/Map";
import clsx from "clsx";
import promotionService from "../../services/promotionService";
import Loading from "../ui/loading/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { IPromotion } from "../../types/types";
import { useQuery } from '@tanstack/react-query';
const typesSlug: { [key: string]: string } = {
  Скидка: "Discount",
  Бонус: "Bonus",
  Сертификат: "Certificate",
  Розыгрыш: "Draw",
};

interface IPromotions {
  isPagination?: boolean;
  title?: string;
  style?: string;
  companyName?: string;
  promotionsType?: "daily" | "endSoon" | "free";
  data?: IPromotion[];
 
}

const Promotions: FC<IPromotions> = ({
  title = "Все акции",
  style = "",
  companyName = "",
  promotionsType,

  
}) => {
  const { categories, promotionTypes, discountPercentage, sortValue } =
    useSelector((state: RootState) => state.filter);
  const [page] = useState(1);
  const [limit, setLimit] = useState(6);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const categoryName = categories[0];
  const discount = discountPercentage + "";
  const type = typesSlug[promotionTypes[0]];

const params = {
  page,
  page_size: limit,
  company_name: companyName,
  category_name: categoryName, // Use categories directly as an array
  type: promotionTypes.map(type => typesSlug[type]), // Map promotionTypes to corresponding slugs
  ...(+discount ? { min_discount: discount } : {}),
  ...(promotionsType === "daily" ? { is_daily: true } : {}),
  ...(sortValue === "Самые популярные"
    ? { popular: "likes" }
    : sortValue === "Сначала новые"
    ? { new: true }
    : sortValue === "По цене (высокая-низкая)"
    ? { highest_price: "new_price" }
    : sortValue === "По цене (низкая-высокая)"
    ? { lowest_price: "new_price" }
    : {}),
};
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["promotion"],
    queryFn: () =>
      promotionService[
        promotionsType === "endSoon"
          ? "getEndSoon"
          : promotionsType === "free"
          ? "getFree"
          : "getAll"
          // @ts-ignoret
      ](params),
    select: ({ data }) => data,
    enabled: false,
  });
console.log(data?.results);


  useEffect(() => {
    refetch();
  }, [page, limit, categoryName, companyName, type, discount, sortValue]);

  const showMore = () => {
    setLimit((prev) => prev * 2);
  };

  return (
    <>
      <Map isOpen={isMapOpen} close={() => setIsMapOpen(false)} />
      <section className={clsx("container py-80", style)}>
        <div className="flex justify-between items-end tb:items-center">
          <h2>{title}</h2>
          <div className="flex gap-[16px] items-center">
            <button
              onClick={() => setIsMapOpen(true)}
              className="box-secondary rounded-[8px] border-[#DDDDDF] py-10 px-[12px] flex gap-[8px] items-center text-[#333333] tb:p-0 tb:w-[48px] tb:h-[43px] tb:justify-center"
            >
              <img src={geoIcon} alt="geo" />
              <span className="tb:hidden">Акции на карте</span>
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="box-secondary rounded-[8px] border-[#DDDDDF] py-10 px-[12px] flex gap-[8px] items-center text-[#333333] tb:p-0 tb:w-[48px] tb:h-[43px] tb:justify-center"
            >
              <span className="tb:hidden">Фильтр и сортировка</span>
              <img src={filterIcon} alt="filter" />
            </button>
          </div>
        </div>
        <div className="relative mt-40 mb-80 grid grid-cols-2 justify-between gap-x-[20px] gap-y-[80px] lt:grid-cols-1 lt:justify-center stb:gap-y-[40px]">
          {isLoading ? (
            <Loading />
          ) : !data?.results.length ? (
            <div className="absolute top-0 left-0 right-0 bottom-0 text-center">
              <span>Не найдено акций</span>
            </div>
          ) : (
            data?.results?.map((promotion) => (
              <PromotionCard key={promotion.id} {...promotion} />
            ))
          )}
        </div>
        {page * limit < (data?.count || 0) && (
          <button onClick={showMore} className="btn block mx-auto">
            Показать ещё
          </button>
        )}

      </section>
      <Filter isOpen={isFilterOpen} close={() => setIsFilterOpen(false)} />
    </>
  );
};

export default Promotions;
