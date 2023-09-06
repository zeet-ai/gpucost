import React, { useContext, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CostPeriod } from "@/components/CostCell";

interface SearchContext {
  setGlobalQuery: (query: string) => void;
  setCostPeriod: (costPeriod: CostPeriod) => void;
  globalQuery?: string;
  costPeriod?: CostPeriod;
}

const SearchContext = React.createContext<SearchContext>({
  setGlobalQuery: () => console.warn("no search provider"),
  setCostPeriod: () => console.warn("no search provider"),
});

export const SearchProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCostPeriod =
    (searchParams.get("costPeriod") as CostPeriod) ?? CostPeriod.Hour;
  const initialGlobalQuery = searchParams.get("q") ?? "";

  const [costPeriod, setCostPeriod] =
    React.useState<CostPeriod>(initialCostPeriod);

  const [globalQuery, setGlobalQuery] =
    React.useState<string>(initialGlobalQuery);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (costPeriod === CostPeriod.Hour) {
      nextSearchParams.delete("costPeriod");
    } else {
      nextSearchParams.set("costPeriod", costPeriod);
    }

    if (globalQuery) {
      nextSearchParams.set("q", globalQuery);
    } else {
      nextSearchParams.delete("q");
    }

    const nextPath = `${pathname}?${nextSearchParams.toString()}`;

    router.replace(nextPath);
  }, [costPeriod, globalQuery, pathname, router, searchParams]);

  return (
    <SearchContext.Provider
      value={{ globalQuery, setGlobalQuery, costPeriod, setCostPeriod }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
