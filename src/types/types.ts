import { Dayjs } from "dayjs";

export interface IResults<T> {
  count: number;
  results: T[];
}

export interface ICompany {
  id: number;
  image: string;
  promotions_count: number;
  name: string;
  discounts: number;
  description: string;
  owner: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  website: string;
  category:string;
}

export type ICompanyCard = Pick<
  ICompany,
  "id" | "image" | "name" | "discounts" | "promotions_count"
>;

export interface ICategory {
  id: number;
  title: string;
  image: string;
  icon: string;
  parent_category: string;
  count_category: string;
}

export interface IImage {
  id: number;
  promotions_count: number;
  name: string;
  image: string;
  discounts: number;
  description: string;
  owner: string;
  owner_username: string;
}

export interface IWorkSchedule {
  monday_start?: string;
  monday_end?: string;
  tuesday_start?: string;
  tuesday_end?: string;
  wednesday_start?: string;
  wednesday_end?: string;
  thursday_start?: string;
  thursday_end?: string;
  friday_start?: string;
  friday_end?: string;
  saturday_start?: string;
  saturday_end?: string;
  sunday_start?: string;
  sunday_end?: string;
}

export interface IPromotion {
  id: number;
  title: string;
  old_price?: number;
  new_price: number;
  discount?: number;
  likes: string[];
  images: IImage[];
  slider_image: string;
  company_work_schedule: IWorkSchedule;
  end_date: string;
  description: string;
  address: string;
  company: number;
  category_name: string;
  company_name: string;
  data:[],
}

export type PromotionType = "Скидка" | "Бонус" | "Сертификат" | "Розыгрыш";

export type IPromotionCard = Pick<
  IPromotion,
  "title" | "old_price" | "new_price" | "discount" | "likes" | "images" | "id"
>;

export interface IAddress {
  lat: string;
  lon: string;
  display_name: string;
}

export interface IReview {
  id: number;
  created_time: string;
  body: number;
  author: { username: string; image: string };
  likes: string[];
}

export interface IUser {
  username: string;
  fullname: string;
  id: string;
  email: string;
  image: string;
}

export interface IContact {
  id: number;
  title: string;
  value: string;
  company: number;
}

export interface MyKnownError {
  errorMessage: string;
}

export type AuthType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";

export interface ImageFile {
  file: File;
  imageUrl: string;
}

export interface IAuthFields {
  email: string;
  password: string;
  isRemember: boolean;
}

export interface IPromotionFields {
  title: string;
  slider_image: ImageFile | null;
  description: string;
  company: number;
  category: number;
  type: PromotionType;
  price: number;
  oldPrice: number;
  address: string;
}

export interface IAddCompanyFields {
  name: string;
  discounts: number;
  description: string;
  owner: string;
  image: ImageFile | null;
  instagram: string;
  facebook: string;
  whatsapp: string;
  website: string;
}

export interface IAddReviewFields {
  body: string;
}

export interface IValidationError {
  message: string;
  type: string;
}

export interface IProfileFields {
  image: File | null;
  imageUrl: string;
  username: string;
  fullname: string;
  email: string;
}

export interface IChangePasswordFields {
  newPassword: string;
  reNewPassword: string;
  currentPassword: string;
}

export interface IRegisterResponse {
  message: string;
  tokens: { access: string; refresh: string };
}

export interface IScheduleWeekDay {
  day: { value: string; label: string };
  isActive: boolean;
  time: { from: Dayjs; to: Dayjs };
}

export type ILoginResponse = Omit<IRegisterResponse, "message">;
