import { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import promotionService from "../../../services/promotionService";
import { SubmitHandler, useForm } from "react-hook-form";
import { IAddReviewFields } from "../../../types/types";
import { useProfile } from "../../../hooks/useProfile";
import { useAppDispatch } from "../../../store/store";
import { setNotification } from "../../../store/slices/notificationSlice";
import ReviewCard from "../reviewCard/ReviewCard";
import { setIsAuthOpen } from "../../../store/slices/authSlice";

interface Props {
  promotionId: number;
}

const Reviews: FC<Props> = ({ promotionId }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IAddReviewFields>({ mode: "onBlur" });
  const dispatch = useAppDispatch();
  const [limit, setLimit] = useState(6);

  const { data: profile } = useProfile();
  const { data: reviews, refetch } = useQuery({
    queryKey: ["reviews", promotionId],
    queryFn: () => promotionService.getReviews(promotionId, { limit }),
    select: ({ data }) => data,
    enabled: false,
  });

  const { mutate: createReview } = useMutation({
    mutationFn: promotionService.createReview,
    onSuccess: () => {
      reset();
      refetch();
      dispatch(setNotification("Комментарий успешно отправлен!"));
    },
  });

  useEffect(() => {
    refetch();
  }, [limit]);

  const onClickSendReview: SubmitHandler<IAddReviewFields> = ({ body }) => {
    profile
      ? createReview({
          body,
          promotion: promotionId,
        })
      : dispatch(setIsAuthOpen(true));
  };

  return (
    <div className="bg-gray">
      <div className="pt-[32px] pb-80 container-two">
        <div className="max-w-[848px]">
          <h2>Отзывы</h2>
          {reviews?.results.length ? (
            reviews.results.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))
          ) : (
            <span className="mt-20 block text-center text-[18px] font-bold p-[30px]">Пока нет отзывов</span>
          )}
          {(reviews?.count || 0) + 3 > limit ? (
            <button
              onClick={() => setLimit((prev) => prev + 3)}
              className="box-secondary mx-auto mt-[32px] mb-80 border-green py-[12px] max-w-[416px] block w-full text-center text-green hover:brightness-75 active:brightness-110"
            >
              Показать ещё
            </button>
          ) : (
            <div className="my-40"></div>
          )}
          <div className="pt-[16px] px-[16px] pb-[24px] rounded-[16px] bg-white">
            <h3 className="text-18 font-bold">Добавить комментарий</h3>
            <div className="my-[16px] border border-[#DDDDDF] rounded-[24px] py-[16px] px-[24px] h-[60px]">
              <textarea
                placeholder="Ваш комментарий..."
                className="outline-none w-full h-full resize-none" 

                {...register("body", { required: true })}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                disabled={!isValid}
                onClick={handleSubmit(onClickSendReview)}
                className="btn py-[12px] max-w-[380px] w-full text-center"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
