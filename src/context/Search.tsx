import React, { useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CostPeriod } from "@/components/CostCell";
import { ColumnFiltersState, OnChangeFn } from "@tanstack/react-table";

interface SearchContext {
  setGlobalQuery: (query: string) => void;
  setCostPeriod: (costPeriod: CostPeriod) => void;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  globalQuery?: string;
  costPeriod?: CostPeriod;
  columnFilters?: ColumnFiltersState;
}

const SearchContext = React.createContext<SearchContext>({
  setGlobalQuery: () => console.warn("no search provider"),
  setCostPeriod: () => console.warn("no search provider"),
  setColumnFilters: () => console.warn("no search provider"),
});

export const SearchProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialColumnFilters = (): ColumnFiltersState => {
    const columnFilters = searchParams.get("columnFilters") ?? "";
    const filters = columnFilters.split(",");
    return (
      filters.map((filter) => {
        const [id, value] = filter.split(":");
        return { id, value };
      }) ?? []
    );
  };

  const makeUrlSafeColumnFilters = (columnFilters: ColumnFiltersState) => {
    return columnFilters
      .map((filter) => `${filter.id}:${filter.value}`)
      .join(",");
  };

  const initialCostPeriod =
    (searchParams.get("costPeriod") as CostPeriod) ?? CostPeriod.Hour;
  const initialGlobalQuery = searchParams.get("q") ?? "";

  const [costPeriod, setCostPeriod] = useState<CostPeriod>(initialCostPeriod);
  const [globalQuery, setGlobalQuery] = useState<string>(initialGlobalQuery);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    getInitialColumnFilters(),
  );

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

    if (columnFilters.length > 0) {
      nextSearchParams.set(
        "columnFilters",
        makeUrlSafeColumnFilters(columnFilters),
      );
    } else {
      nextSearchParams.delete("columnFilters");
    }

    const nextPath = `${pathname}?${nextSearchParams.toString()}`;

    router.replace(nextPath);
  }, [columnFilters, costPeriod, globalQuery, pathname, router, searchParams]);

  return (
    <SearchContext.Provider
      value={{
        globalQuery,
        setGlobalQuery,
        costPeriod,
        setCostPeriod,
        columnFilters,
        setColumnFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
