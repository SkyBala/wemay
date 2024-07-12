import { FC } from "react";
// import checkedIcon from "../../../assets/images/icons/checked.svg";
// import checkedWrapperIcon from "../../../assets/images/icons/checked-wrapper.svg";
import { useQuery } from "@tanstack/react-query";
import companiesService from "../../../services/companiesService";
import { Link } from "react-router-dom";
import Select from "../../ui/select/Select";

interface ICompanyProps {
  company: number;
  setCompany: (value: number) => void;
}

const Company: FC<ICompanyProps> = ({ company: companyId, setCompany }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesService.getAll(),
    select: ({ data }) => data,
  });

  return (
    <div>
      <h3 className="mb-[8px] title-3">Выберите компанию</h3>
      <Select
        value={companyId}
        isLoading={isLoading}
        onChange={(value) => setCompany(value as number)}
        customOptions={{ options: data?.results, labelKey: "name" }}      />
      <Link to="/add-company" className="mt-[15px] block text-green">
        Добавить компанию
      </Link>
    </div>
  );
};

export default Company;
