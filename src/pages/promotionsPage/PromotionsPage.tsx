import { FC } from "react";
import Promotions from "../../components/promotions/Promotions";
import Slider from "../../components/promotionPage/sliderPromotion/Slider";
import Companies from "../../components/promotionPage/companiesPromotion/Companies";
import { useCompanies } from "../../hooks/useCompanies";
import { useQuery } from "@tanstack/react-query";
import promotionService from "../../services/promotionService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { ICompany, IPromotion } from "../../types/types";

const PromotionsPage: FC = () => {
  // Using custom hook for companies
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies();
  const { categories } = useSelector((state: RootState) => state.filter);
  console.log(categories);

  // Using useQuery for promotions data
  const { data: promotionsData, isLoading: isLoadingPromotions } = useQuery({
    queryKey: ["promotion"],
    queryFn: () => promotionService.getAll(),
    select: ({ data }) => data,
  })
  // Filter companies based on selected categories
  const filteredCompanies = companiesData?.results?.filter((company: ICompany) =>
    categories.includes(company.category)
  );
  console.log(companiesData?.results);

  // Get the filtered company names
  const filteredCompanyNames = filteredCompanies?.map((company: ICompany) => company?.category) || [];

    console.log(filteredCompanyNames);

  // Filter promotions based on filtered company names
  const filteredPromotions = promotionsData?.results?.filter((promotion: IPromotion) =>
    filteredCompanyNames?.includes(promotion?.category_name)
  ) ;
  console.log(promotionsData?.results);
  console.log(filteredPromotions);
  

  return (
    <div>
      <Slider data={filteredPromotions || []} isLoading={isLoadingPromotions} />
      <Companies data={filteredCompanies} isLoading={isLoadingCompanies} />
      <Promotions data={filteredPromotions} isPagination={true} />
    </div>
  );
};

export default PromotionsPage;
