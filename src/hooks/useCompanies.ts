import { useQuery } from "@tanstack/react-query";
import companiesService from "../services/companiesService";

export const useCompanies = () =>
  useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesService.getAll(),
    select: ({ data }) => data,
  });