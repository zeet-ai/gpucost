import { ProviderKind } from "@/data/providers";
import { Flex } from "@chakra-ui/react";
import { CellContext } from "@tanstack/react-table";
import { ProviderIcon } from "./ProviderIcon";
import { GpuRow } from "@/data/gpus";

export const ProvidersCell = ({
  info,
}: {
  info: CellContext<GpuRow, string | null | undefined>;
}) => {
  const providers = info.getValue()?.split(", ");

  if (providers?.length === 0 || providers?.[0] === "") {
    return null;
  }

  return (
    <Flex gap="4" alignItems="center">
      {providers?.map((provider) => (
        <Flex key={provider} alignItems="center" gap="1">
          <ProviderIcon provider={provider as ProviderKind} />
          {provider}
        </Flex>
      ))}
    </Flex>
  );
};
