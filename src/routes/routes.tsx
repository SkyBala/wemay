import Password from "../components/profilePage/password/Password";
import Profile from "../components/profilePage/profile/Profile";
import AboutPage from "../pages/aboutPage/AboutPage";
import AddCompanyPage from "../pages/addCompanePage/AddCompanyPage";
import CompaniesPage from "../pages/companiesPage/CompaniesPage";
import CompanyPage from "../pages/companyPage/CompanyPage";
import EndSoonPage from "../pages/endSoonPage/EndSoonPage";
import ErrorPage from "../pages/errorPage/ErrorPage";
import FavouritesPage from "../pages/favouritesPage/FavouritesPage";
import LikedPromotionsPage from "../pages/likedPromotionsPage/LikedPromotionsPage";
import MainPage from "../pages/mainPage/MainPage";
import MyPromotionsPage from "../pages/myPromotionsPage/MyPromotionsPage";
import ProfilePage from "../pages/profilePage/ProfilePage";
import PromotionPage from "../pages/promotionPage/PromotionPage";
import PromotionPublicationPage from "../pages/promotionPublicationPage/PromotionPublicationPage";
import PromotionsDayPage from "../pages/promotionsDayPage/PromotionsDayPage";
import PromotionsFreePage from "../pages/promotionsFreePage/PromotionsFreePage";
import PromotionsPage from "../pages/promotionsPage/PromotionsPage";

export const routes = [
  {
    path: "*",
    element: <ErrorPage message="Упс, по вашему запросу ничего не найдено   🥺" />,
  },
  { path: "/", element: <MainPage /> },
  { path: "/auth?/*", element: <MainPage /> },
  { path: "/promotions", element: <PromotionsPage /> },
  { path: "/promotion/:id", element: <PromotionPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/companies", element: <CompaniesPage /> },
  { path: "/company/:id", element: <CompanyPage /> },
  { path: "/profile/*", element: <ProfilePage /> },
  { path: "/favourites/", element: <FavouritesPage /> },
  { path: "/liked-promotions/", element: <LikedPromotionsPage /> },
  { path: "/my-promotions/", element: <MyPromotionsPage /> },
  { path: "/promotion-publicate/", element: <PromotionPublicationPage /> },
  { path: "/add-company/", element: <AddCompanyPage /> },
  { path: "/promotions-daily/", element: <PromotionsDayPage /> },
  { path: "/promotions-end-soon/", element: <EndSoonPage /> },
  { path: "/promotions-free/", element: <PromotionsFreePage /> },
];

export const profileRoutes = [
  { path: "/", element: <Profile /> },
  { path: "/password", element: <Password /> },
];
