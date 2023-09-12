import { GpuDetailRow, ProviderKind } from "@/data/providers";
import { formatGpuModel } from "@/shared/formatters";
import { Box, Flex } from "@chakra-ui/react";
import { CellContext } from "@tanstack/react-table";
import { ProviderIcon } from "./ProviderIcon";

export const ProviderCell = ({
  info,
  gpuModel,
}: {
  info: CellContext<GpuDetailRow, string | null>;
  gpuModel: string;
}) => {
  return (
    <Flex alignItems="center" gap="1">
      <ProviderIcon provider={info.getValue() as ProviderKind} />
      {info.getValue()}
      <Box hidden>
        {formatGpuModel(gpuModel)} instance pricing and availability
      </Box>
    </Flex>
  );
};
