import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { pickerSx, promotionsTypeData } from "../../data/data";
import { SubmitHandler, useForm } from "react-hook-form";
import { IImage, IPromotionFields, ImageFile } from "../../types/types";
import Radiobox from "../../components/ui/radiobox/Radiobox";
import Categories from "../../components/promotionPublicationPage/categories/Categories";
import Input from "../../components/ui/input/Input";
import clsx from "clsx";
import Addreses from "../../components/promotionPublicationPage/addreses/Addreses";
import Modal from "../../components/ui/modal/Modal";
import PromotionCard from "../../components/promotionCard/PromotionCard";
import { useMutation } from "@tanstack/react-query";
import promotionService from "../../services/promotionService";
import Images from "../../components/promotionPublicationPage/images/Images";
import { useAppDispatch } from "../../store/store";
import {
  setErrorNotification,
  setNotification,
} from "../../store/slices/notificationSlice";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import Company from "../../components/promotionPublicationPage/company/Company";
import Loading from "../../components/ui/loading/Loading";
import basketIcon from "../../assets/images/icons/basket.svg";
import { useProfile } from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useClearCategory } from "../../hooks/useClearCategory";

const getPercentFromNumber = (firstNumber: number, secondNumber: number) =>
  Math.floor((firstNumber / secondNumber) * 100);

const promotionTypes = {
  Скидка: "Discount",
  Бонус: "Bonus",
  Сертификат: "Certificate",
  Розыгрыш: "Draw",
};

const PromotionPublicationPage: FC = memo(() => {
  useClearCategory();
  const {
    reset,
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IPromotionFields>({
    mode: "all",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<ImageFile[] | null>(null);
  const [isIndicateOldPrice, setIsIndicateOldPrice] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);

  const { data: profile, status } = useProfile();

  useEffect(() => {
    if (status !== "pending" && !profile?.id) {
      navigate("/");
      dispatch(
        setErrorNotification("Для текущей страницы требуется авторизация")
      );
    }
  }, [profile, status]);


  // ...

  const { mutate: publicate, isPending } = useMutation({
    mutationFn: promotionService.create,
    onSuccess: () => {
      dispatch(setNotification("Акция успешно добавлена!"));
      reset();
      setImages([]);
      setEndDate(null);
      setEndDateTime(null);
      navigate("/"); // Переход на главную страницу после успешной публикации
    },
    onError: (error: any) => {
      dispatch(setErrorNotification(error.response.data?.[0]));
    },
  });


  const onClickPublicate: SubmitHandler<IPromotionFields> = ({
    type,
    title,
    slider_image,
    price,
    address,
    oldPrice,
    category,
    description,
    company,
  }) => {
    const form = new FormData();

    form.append("title", title);
    form.append("slider_image", slider_image!.file);
    form.append("description", description);
    form.append("new_price", price + "");
    form.append(
      "end_date",
      `${dayjs(endDate).format("YYYY-MM-DD")}${
        dayjs(endDateTime).isValid()
          ? "T" + dayjs(endDateTime).format("HH:mm:ss")
          : ""
      }`
    );
    form.append("company", company + "");
    images?.forEach((image, key) => {
      form.append(`upload_images[${key}]`, image.file);
    });

    category && form.append("category", category + "");
    type && form.append("type", promotionTypes[type]);
    oldPrice && form.append("old_price", oldPrice + "");
    address && form.append("address", address);

    publicate(form);
  };

  const setAddress = (value: string) => {
    setValue("address", value);
  };

  const onChangeSliderImage = ({
    target: { files },
  }: ChangeEvent<HTMLInputElement>) => {
    const file = files![0];
    setValue("slider_image", { file, imageUrl: URL.createObjectURL(file) });
  };

  return (
    <>
      <div className="container pt-80 pb-[120px] max-w-[1064px]">
        <h2>Опубликовать акцию</h2>
        <form
          id="publicate-promotion-form"
          onSubmit={(e) => e.preventDefault()}
          className={clsx("pl-[16px] *:mt-40", { "blur-sm": isPending })}
        >
          <div>
            <h3 className="mb-[8px] title-3">Заголовок</h3>
            <Input
              {...register("title", {
                required: "Заголовок не должен быть пустым!",
              })}
              placeholder="Введите заголовок"
              error={errors.title}
            />
          </div>
          <Images images={images} setImages={setImages} />
          <div>
            {watch("slider_image") && (
              <button
                onClick={() => setValue("slider_image", null)}
                className="mb-20 relative rounded-[10px] w-[100px] h-[100px] flex justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:trans-def hover:before:bg-[rgba(210,50,50,0.57)] *:hover:opacity-100"
                style={{
                  backgroundImage: `url(${watch("slider_image.imageUrl")})`,
                }}
              >
                <img
                  alt="basket"
                  src={basketIcon}
                  className="w-[40px] h-[40px] opacity-0 trans-def"
                />
              </button>
            )}
            <label
              htmlFor="promotion-slider-image"
              className="box-btn block w-fit text-green"
            >
               Добавить обложку
              <input
                type="file"
                className="hidden"
                accept=".jpg, .jpeg, .png"
                id="promotion-slider-image"
                onChange={onChangeSliderImage}
              />
            </label>
          </div>
          <div>
            <h3 className="mb-[8px] title-3">Описание</h3>
            <div
              className={clsx("box-input h-[240px] has-[:focus]:border-green", {
                "border-red": errors.description,
              })}
            >
              <textarea
                cols={30}
                rows={9}
                placeholder="Введите описание"
                className="w-full h-full outline-none scroll-small"
                {...register("description", {
                  required: "Описание не должен быть пустым!",
                })}
              ></textarea>
            </div>
            <span className="block mt-[5px] text-red">
              {errors.description?.message}
            </span>
          </div>
          <Company
            company={watch("company")}
            setCompany={(value: number) => setValue("company", value)}
          />
          <div>
            <h3 className="mb-[8px] title-3">Дата окончания</h3>
            <DatePicker
              sx={pickerSx}
              value={endDate}
              onChange={(value) => setEndDate(value)}
            />
            <TimePicker
              views={["hours", "minutes", "seconds"]}
              ampm={false}
              sx={pickerSx}
              value={endDateTime}
              onChange={(value) => setEndDateTime(value)}
            />
          </div>
          <Categories
            category={watch("category")}
            setCategory={(value: number) => setValue("category", value)}
          />
          <div>
            <h3 className="mb-[8px] title-3">Тип акции</h3>
            {promotionsTypeData.map((type) => (
              <Radiobox
                id={type.value}
                key={type.value}
                name="promotion-type"
                className="mt-[16px]"
              >
                <span>{type.name}</span>
              </Radiobox>
            ))}
          </div>
          <div>
            <h3 className="mb-[8px] title-3">Цена</h3>
            <Input
              {...register("price", {
                required: "Цена не должна быть пустым!",
              })}
              error={errors.price}
              type="number"
              placeholder="Напишите цену"
            />
            {isIndicateOldPrice && (
              <Input
                {...register("oldPrice", {
                  required: "Цена не должна быть пустым!",
                })}
                error={errors.oldPrice}
                type="number"
                inputClassName="mt-[8px]"
                placeholder="Напишите старую цену"
              />
            )}
            <Radiobox
              isCheckbox
              className="mt-[16px]"
              id="indicate-old-price"
              name="indicate-radio"
              checked={isIndicateOldPrice}
              onChange={() => setIsIndicateOldPrice((prev) => !prev)}
            >
              <span>Указать старую цену (перечеркнуто)</span>
            </Radiobox>
          </div>
          <Addreses address={watch("address")} setAddress={setAddress} />
        </form>
        <div className="mt-[87px] flex gap-[16px]">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="box-btn py-[22px] flex-grow text-center"
          >
            Предпросмотр
          </button>
          <button
            disabled={
              !isValid ||
              !images?.length ||
              !endDate ||
              !watch("slider_image.file")
            }
            onClick={handleSubmit(onClickPublicate)}
            className="btn rounded-[24px] py-[22px] flex-grow text-center"
          >
            Опубликовать
          </button>
        </div>
      </div>
      <Modal
        contentStyle="p-20 bg-white w-full max-w-[580px]"
        isOpen={isPreviewOpen}
        close={() => setIsPreviewOpen(false)}
      >
        <PromotionCard
          id={1}
          disabled
          title={watch("title")}
          new_price={watch("price")}
          old_price={watch("oldPrice")}
          images={
            images?.map((image) => ({ image: image.imageUrl })) as IImage[]
          }
          discount={
            watch("oldPrice")
              ? getPercentFromNumber(watch("price"), watch("oldPrice"))
              : 0
          }
          likes={[]}
        />
      </Modal>
      {isPending && <Loading className="!fixed" />}
    </>
  );
});

export default PromotionPublicationPage;
