import clsx from "clsx";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import crossIcon from "../../assets/images/icons/cross-bold.svg";
import Accordeon from "../ui/accordeon/Accordeon";
import { promotionsTypeData, sortData } from "../../data/data";
import { RootState, useAppDispatch } from "../../store/store";
import {
  setDiscountPercentage,
  setSort,
  setCategories,
  setPromotionTypes,
} from "../../store/slices/filterSlice";
import { useSelector } from "react-redux";
import Checkbox from "../ui/checkbox/Checkbox";
import Range from "../ui/range/Range";
import { useQuery } from "@tanstack/react-query";
import categoryService from "../../services/categoryService";

interface IFilterProps {
  isOpen: boolean;
  close: () => void;
}

const Filter: FC<IFilterProps> = ({ isOpen, close }) => {
  const dispatch = useAppDispatch();
  const { categories, promotionTypes, discountPercentage, sortValue } =
    useSelector((state: RootState) => state.filter);
  const [categoriesT, setCategoriesT] = useState<string[]>(categories);
  const [promotionTypesT, setPromotionTypesT] =
    useState<string[]>(promotionTypes);
  const [discountPercentageT, setDiscountPercentageT] =
    useState(discountPercentage);
  const [sortValueT, setSortValueT] = useState(sortValue);

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
    select: ({ data }) => data,
    enabled: false,
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  useEffect(() => {
    setCategoriesT(categories);
  }, [categories]);

  useEffect(() => {
    setPromotionTypesT(promotionTypes);
  }, [promotionTypes]);

  useEffect(() => {
    setDiscountPercentageT(discountPercentage);
  }, [discountPercentage]);

  useEffect(() => {
    setSortValueT(sortValue);
  }, [sortValue]);

  const handleCategory = (category: string) => {
    setCategoriesT((prev) =>
      prev.includes(category)
        ? prev.filter((prevC) => prevC !== category)
        : [...prev, category]
    );
  };

  const handlePromotionType = (type: string) => {
    setPromotionTypesT((prev) =>
      prev.includes(type)
        ? prev.filter((prevT) => prevT !== type)
        : [...prev, type]
    );
  };

  const handleDiscountPercentage = (event: ChangeEvent<HTMLInputElement>) =>
    setDiscountPercentageT(+event.target.value);

  const onChangeDiscountInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    !isNaN(+value) && value.length <= 2 && setDiscountPercentageT(+value);
  };

  const clearCategoriesFunc = () => {
    setCategoriesT([]);
    setPromotionTypesT([]);
    setDiscountPercentageT(0);
    setSortValueT("По умолчанию");
  };

  const apply = () => {
    dispatch(setCategories(categoriesT));
    dispatch(setPromotionTypes(promotionTypesT));
    dispatch(setDiscountPercentage(discountPercentageT));
    dispatch(setSort(sortValueT));
    close();
  };

  return (
    <Transition in={isOpen} timeout={500} mountOnEnter unmountOnExit>
      {(state) => (
        <div
          onClick={() => state === "entered" && close()}
          className={clsx(
            "fixed top-0 bottom-0 left-0 right-0 flex justify-end bg-[rgba(0,0,0,0.25)] z-[60]",
            {
              "animate-[open-modal-wrapper_0.5s_forwards]":
                state === "entering",
              "animate-[open-modal-wrapper_0.5s_forwards_reverse]":
                state === "exiting",
            }
          )}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "pt-[16px] pb-70 px-[16px] max-w-[540px] w-full bg-white h-screen overflow-y-scroll scroll-hidden",
              {
                "animate-[open-filter_0.5s_forwards]": state === "entering",
                "animate-[open-filter_0.5s_forwards_reverse]":
                  state === "exiting",
              }
            )}
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-18 font-bold">Фильтры</h3>
                  <div className="flex gap-[8px] items-center">
                    <button
                      onClick={clearCategoriesFunc}
                      className="underline text-[12px] leading-[16px]"
                    >
                      Очистить
                    </button>
                    <button
                      onClick={() => state === "entered" && close()}
                      className="w-[24px] h-[24px] flex justify-center items-center"
                    >
                      <img src={crossIcon} alt="cross" />
                    </button>
                  </div>
                </div>
                <div className="mt-[32px] flex flex-wrap gap-x-[8px] gap-y-[12px]">
                  {categoriesT.map((category) => (
                    <div
                      key={category}
                      className="rounded-[200px] px-[16px] py-[6px] flex justify-between items-center h-[36px] bg-gray text-[18px] leading-[24px] font-medium"
                    >
                      <span>{category}</span>
                      <button
                        onClick={() => handleCategory(category)}
                        className="w-[24px] h-[24px] flex justify-center items-center"
                      >
                        <img
                          src={crossIcon}
                          alt="cross"
                          className="w-[10px] h-[10px]"
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <h3 className="my-[24px] text-18 font-bold">Категории</h3>
                <Accordeon
                  style="border border-[#DDDDDF] rounded-[24px] py-[12px] px-[16px] font-mulish"
                  bodyStyle="duration-[.2s]"
                  maxHeight="fit-content"
                >
                  {data?.results?.map((category) => (
                    <Checkbox
                      style="mt-20"
                      key={category.title}
                      name={category.title}
                      icon={
                        <div
                          style={{
                            maskImage: `url(${category.icon})`,
                          }}
                          className="w-[16px] h-[16px] bg-[#4F4F4F] opacity-50"
                        ></div>
                      }
                      checked={categoriesT.includes(category.title)}
                      onChange={() => handleCategory(category.title)}
                    />
                  ))}
                </Accordeon>
                <h3 className="my-[24px] text-18 font-bold">Тип акции</h3>
                <Accordeon
                  style="border border-[#DDDDDF] rounded-[24px] py-[12px] px-[16px] font-mulish"
                  bodyStyle="duration-[.13s]"
                  maxHeight={298}
                >
                  {promotionsTypeData.map((type) =>
                    type.name === "Скидка" ? (
                      <Accordeon
                        key={type.name}
                        style="mt-20"
                        bodyStyle="px-[16px]"
                        button={
                          <Checkbox
                            name={type.name}
                            checked={promotionTypesT.includes(type.name)}
                            onChange={() => handlePromotionType(type.name)}
                          />
                        }
                      >
                        <div className="mt-[12px] rounded-[24px] py-[8px] pl-[16px] pr-[45px] w-full flex gap-[16px] items-center bg-gray">
                          <Range
                            max={99}
                            value={discountPercentageT}
                            onChange={handleDiscountPercentage}
                          />
                          <div className="border border-[#DDDDDF] rounded-[24px] py-[12px] px-[16px] flex justify-center items-center w-[90px] bg-white text-center text-[20px] font-bold leadong-[24px] text-[#1D1D1F]">
                            <input
                              type="text"
                              value={discountPercentageT}
                              onChange={onChangeDiscountInput}
                              className="w-[25px] text-end"
                            />
                            <span>%</span>
                          </div>
                        </div>
                        {type.sub?.map((subtype) => (
                          <Checkbox
                            style="mt-[14px] pl-10"
                            key={subtype.name}
                            name={subtype.name}
                            checked={discountPercentageT >= 40}
                            onChange={() => setDiscountPercentageT(40)}
                          />
                        ))}
                      </Accordeon>
                    ) : (
                      <Checkbox
                        style="mt-20"
                        key={type.name}
                        name={type.name}
                        checked={promotionTypesT.includes(type.name)}
                        onChange={() => handlePromotionType(type.name)}
                      />
                    )
                  )}
                </Accordeon>
<h3 className="my-[24px] text-18 font-bold">Сортировка</h3>
{sortData.map((sort) => (
  <button
    key={sort.label}
    // @ts-ignore
    onClick={() => setSortValueT(sort.label)}
    className={clsx(
      "mb-[8px] rounded-[200px] px-[16px] py-[6px] flex justify-between items-center w-fit h-[36px] bg-gray text-[18px] leading-[24px] hover:bg-green hover:text-white trans-def",
      { "bg-green text-white": sort.label === sortValueT }
    )}
  >
    <span>{sort.label}</span>
  </button>
))}

              </div>
              <button
                onClick={apply}
                className="mt-[24px] btn w-full text-center"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default Filter;
