import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import clsx from "clsx";
import searchIcon from "../../assets/images/icons/search.svg";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import promotionService from "../../services/promotionService";
import { useClickOutside } from "../../hooks/useClickOutside";
import Loading from "../ui/loading/Loading";

interface Props {
  isSearchFocus: boolean;
  setIsSearchFocus: Dispatch<SetStateAction<boolean>>;
}

const Search: FC<Props> = ({ isSearchFocus, setIsSearchFocus }) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["promotions-search"],
    queryFn: () => promotionService.getAll({ search }),
    select: ({ data }) => data,
    enabled: false,
  });

  useClickOutside([searchRef], () => setIsSearchFocus(false));

  const handleSearch = useCallback(() => {
    refetch().then(({ data }) => {
      if (!data?.results?.length) {
        navigate("/not-found");
        setSearch("");
        setIsSearchFocus(false);
      }
    });
  }, [refetch, navigate, setIsSearchFocus]);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClickSuggestion = (promotionId: number) => {
    navigate(`/promotion/${promotionId}`);
    setSearch("");
    setIsSearchFocus(false);
  };

  return (
    <div ref={searchRef} className="relative flex-[0_1_578px] z-[30]">
      <div className="box-secondary flex items-center gap-[5px]">
        
        <input
          type="text"
          value={search}
          placeholder={isSearchFocus ? "" : "Поиск акций"}
          onFocus={() => setIsSearchFocus(true)}
          className="w-full leading-[10px] placeholder:text-black max-h-[20px]"
          onChange={({ target: { value } }) => setSearch(value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-2 py-1 text-white rounded"
        >
          <img src={searchIcon} alt="search" />
        </button>
      
      </div>
      <div
        className={clsx(
          "absolute left-[-16px] top-[-20px] rounded-[24px] px-[16px] pt-[93px] pb-[32px] w-[calc(100%+34px)] h-[287px] bg-[rgba(243,243,243,1)] z-[-1] opacity-0 pointer-events-none trans-def",
          { "opacity-100 pointer-events-auto": isSearchFocus }
        )}
      >
        <div className="overflow-hidden flex flex-col justify-start p-[30px] text-[16px] font-bold items-start h-full [&>:not(:last-child)]:mb-[24px]">
          {isLoading ? (
            <Loading />
          ) : (
            data?.results?.map((promotion) => (
              <Link
                key={promotion.id}
                onClick={() => handleClickSuggestion(promotion.id)}
                to={`/promotion/${promotion.id}`}
                className="block hover:text-green"
              >
                {promotion.title}
              </Link>
            ))
          )}
          {data?.results?.length === 0 && (
            <div className="text-gray-600 mt-2">Нет результатов</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
