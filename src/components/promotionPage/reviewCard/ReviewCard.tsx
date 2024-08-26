import { FC, useEffect, useState, MouseEvent } from "react";
import { IReview } from "../../../types/types";
import likeIcon from "../../../assets/images/icons/likes.svg";
import likeGreenIcon from "../../../assets/images/icons/liked.svg";
import avaIcon from "../../../assets/images/icons/ava.svg";
import { useProfile } from "../../../hooks/useProfile";
import { useMutation } from "@tanstack/react-query";
import promotionService from "../../../services/promotionService";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { setIsAuthOpen } from "../../../store/slices/authSlice";

const ReviewCard: FC<IReview> = ({ id, author, created_time, body, likes }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const [localLikes, setLocalLikes] = useState<string[]>([]);

  const { data: profile } = useProfile();

  const { mutate: likeReview } = useMutation({
    mutationFn: promotionService.likeReview,
  });

  useEffect(() => {
    setLocalLikes(likes);
  }, [likes]);

  const handleLike = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!profile?.id) {
      dispatch(setIsAuthOpen(true));
      return;
    }

    if (localLikes.includes(profile.id)) {
      likeReview(id);
      setLocalLikes((prev) => prev.filter((like) => like !== profile.id));
    } else {
      likeReview(id);
      setLocalLikes((prev) => [...prev, profile.id]);
    }
  };

  const isLiked = profile && localLikes.includes(profile.id);

  return (
    <div className="mt-[32px] rounded-[24px] p-[24px] flex justify-between items-end bg-white">
      <div className="flex gap-[20px]">
        <img
          alt="ava"
          src={author.image.replace('https://wemay.kg/', 'http://176.126.166.197:8000') || avaIcon}
          className="w-[36px] h-[36px] rounded-full"
        />
        <div>
          <strong className="mr-[8px] text-18 leading-[21px]">
            {author.username}
          </strong>
          <span>{created_time.split("T")[0].replace(/-/g, ".")}</span>
          <span className="mt-[8px] block text-18 leading-[23px]">{body}</span>
        </div>
      </div>
      <div className="flex gap-[4px] items-center">
        <span className="text-14">{localLikes.length}</span>
        <button
          onClick={handleLike}
          className={clsx(
            "w-[20px] h-[18px] bg-center bg-no-repeat",
          )}
        >
          <img src={`${isLiked && isAuth ? likeGreenIcon : likeIcon}`} alt="image" />
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;