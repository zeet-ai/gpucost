import { GpuDetailRow } from "@/data/providers";
import { Flex } from "@chakra-ui/react";
import { CellContext } from "@tanstack/react-table";
import currency from "currency.js";

export const costPeriodOptions = [
  { label: "Second", value: "second" },
  { label: "Minute", value: "minute" },
  { label: "Hour", value: "hour" },
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export enum CostPeriod {
  Second = "second",
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
}

export const CostCell = ({
  info,
  costPeriod,
}: {
  info: CellContext<GpuDetailRow, string | null>;
  costPeriod?: CostPeriod;
}) => {
  const costWithoutPeriod = info.getValue()?.split("hourly")[0] ?? "0";
  const costPeriodConversions: Record<CostPeriod, (cost: string) => string> = {
    [CostPeriod.Second]: (cost: string) =>
      currency(cost, { precision: 4 })
        .divide(60 * 60)
        .format(),
    [CostPeriod.Minute]: (cost: string) =>
      currency(cost, { precision: 4 }).divide(60).format(),
    [CostPeriod.Hour]: (cost: string) =>
      currency(cost, { precision: 4 }).format(),
    [CostPeriod.Day]: (cost: string) =>
      currency(cost, { precision: 2 }).multiply(24).format(),
    [CostPeriod.Week]: (cost: string) =>
      currency(cost, { precision: 2 })
        .multiply(24 * 7)
        .format(),
    [CostPeriod.Month]: (cost: string) =>
      currency(cost, { precision: 2 })
        .multiply(24 * 30)
        .format(),
    [CostPeriod.Year]: (cost: string) =>
      currency(cost, { precision: 2 })
        .multiply(24 * 365)
        .format(),
  };

  const costForPeriod =
    costPeriodConversions[costPeriod ?? CostPeriod.Hour]?.(costWithoutPeriod) ??
    "0";

  return (
    <Flex alignItems="center" gap={1}>
      {costForPeriod} per {costPeriod}
    </Flex>
  );
};
