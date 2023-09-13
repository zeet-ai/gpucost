import { ProviderKind } from "@/data/providers";
import { Flex } from "@chakra-ui/react";
import { CellContext } from "@tanstack/react-table";
import { ProviderIcon } from "./ProviderIcon";
import { GpuRow } from "@/data/gpus";
import { useSearch } from "@/context/Search";

export const ProvidersCell = ({
  info,
}: {
  info: CellContext<GpuRow, string | null | undefined>;
}) => {
  const { columnFilters } = useSearch();
  const providers = info.getValue()?.split(", ");

  const hasProvidersFilter = (provider: string) => {
    const providerFilter = columnFilters?.find(
      (columnFilter) => columnFilter.id === "availableProviders",
    );
    if (providerFilter) {
      const regex = new RegExp(providerFilter?.value as string, "i");
      return regex.test(provider);
    }
    return true;
  };

  if (providers?.length === 0 || providers?.[0] === "") {
    return null;
  }

  return (
    <Flex gap="4" alignItems="center">
      {providers?.filter(hasProvidersFilter).map((provider) => (
        <Flex key={provider} alignItems="center" gap="1">
          <ProviderIcon provider={provider as ProviderKind} />
          {provider}
        </Flex>
      ))}
    </Flex>
  );
};
