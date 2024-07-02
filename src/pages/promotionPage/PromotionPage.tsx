import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { textLimit } from "../../data/data";
import Promotion from "../../components/promotionPage/promotion/Promotion";
import Reviews from "../../components/promotionPage/reviews/Reviews";
import PopularPromotions from "../../components/promotionPage/popularPromotions/PopularPromotions";
import { useQuery } from "@tanstack/react-query";
import promotionService from "../../services/promotionService";
import { useClearCategory } from "../../hooks/useClearCategory";
import { useTopScroll } from "../../hooks/useTopScroll";
import { useAppDispatch } from "../../store/store";
import { setCategories } from "../../store/slices/filterSlice";

const PromotionPage: FC = () => {
  useClearCategory();
  useTopScroll();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { data: promotion } = useQuery({
    queryKey: ["promotions", id],
    queryFn: () => promotionService.getById(+(id || 0)),
    select: ({ data }) => data,
  });
console.log(promotion);
  if (!promotion) return <div></div>;


  return (
    <>
      <div className="container-two pt-[52px] flex gap-[12px] items-center text-[14px]">
        <Link to="/" className="hover:text-green trans-def">
          Главная
        </Link>{" "}
        {promotion.category_name && (
          <>
            <span>{">"}</span>{" "}
            <Link
              to="/promotions"
              className="hover:text-green trans-def"
              onClick={() => dispatch(setCategories([promotion.category_name]))}
            >
              {promotion.category_name}
            </Link>
          </>
        )}
        <span>{">"}</span> <span>{textLimit(promotion?.title, 21)}</span>
      </div>
    
      <Promotion {...promotion } />
      <Reviews promotionId={+(id || 0)} />
      <PopularPromotions promotionId={+(id || 0) } />
    </>
  );
};

export default PromotionPage;
