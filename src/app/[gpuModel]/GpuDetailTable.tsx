"use client";

import { Code, Flex, TableProps } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import * as React from "react";
import { Table } from "@/components/Table";
import { GpuDetailRow, getUniqueGpuModels } from "@/data/providers";
import RegionFlag from "./Flag";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu } from "@/components/DropdownMenu";
import { CostCell, CostPeriod, costPeriodOptions } from "@/components/CostCell";
import { formatGpuModel } from "@/shared/formatters";
import { useSearch } from "@/context/Search";
import { ProviderCell } from "@/components/ProviderCell";

export const GpuDetailTable = ({
  data,
  gpuModel,
}: { data: GpuDetailRow[]; gpuModel: string } & TableProps) => {
  const { costPeriod, setCostPeriod } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const columnHelper = createColumnHelper<GpuDetailRow>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor((row): string | null => String(row.kind), {
        id: "kind",
        cell: (info) => <ProviderCell info={info} gpuModel={gpuModel} />,
        header: "Provider Name",
        minSize: 100,
      }),
      columnHelper.accessor("onDemand", {
        cell: (info) => <CostCell info={info} costPeriod={costPeriod} />,
        header: "On Demand Cost",
        minSize: 200,
      }),
      columnHelper.accessor("gpuModel", { header: "GPU Model", minSize: 250 }),
      columnHelper.accessor("gpuModelStandardized", {
        header: "GPU Model (Standardized)",
        minSize: 300,
      }),
      columnHelper.accessor("cpus", { header: "CPUs", minSize: 100 }),
      columnHelper.accessor("gpus", { header: "GPUs", minSize: 100 }),
      columnHelper.accessor("instanceMemory", {
        header: "Instance Memory",
        minSize: 175,
      }),
      columnHelper.accessor("instance", {
        header: "Instance Type",
        minSize: 200,
        cell: (info) => <Code fontSize="xs">{info.getValue()}</Code>,
      }),
      columnHelper.accessor("instanceName", {
        header: "Instance Name",
        minSize: 200,
      }),
      columnHelper.accessor("instanceStorage", {
        header: "Instance Storage",
        minSize: 150,
      }),
      columnHelper.accessor("linuxReservedCost", {
        header: "Linux Reserved Cost",
        minSize: 200,
      }),
      columnHelper.accessor("linuxSpotMaximumCost", {
        header: "Linux Spot Max Cost",
        minSize: 200,
      }),
      columnHelper.accessor("linuxSpotMinimumCost", {
        header: "Linux Spot Min Cost",
        minSize: 200,
      }),
      columnHelper.accessor("networkPerformance", {
        header: "Network Performance",
        minSize: 200,
      }),
      columnHelper.accessor("region", {
        cell: (info) => (
          <Flex alignItems="center" gap={1}>
            <RegionFlag region={info.getValue()} />{" "}
            {info.getValue() || "unknown"}
          </Flex>
        ),
        header: "Region",
        minSize: 150,
      }),
      columnHelper.accessor("windowsOnDemandCost", {
        header: "Windows On Demand Cost",
        minSize: 250,
      }),
      columnHelper.accessor("windowsReservedCost", {
        header: "Windows Reserved Cost",
        minSize: 250,
      }),
      columnHelper.accessor("windowsSpotMaximumCost", {
        header: "Windows Spot Max Cost",
        minSize: 250,
      }),
      columnHelper.accessor("windowsSpotMinimumCost", {
        header: "Windows Spot Min Cost",
        minSize: 250,
      }),
    ],
    [columnHelper, costPeriod, gpuModel],
  );

  const initialColumnVisibility: Record<keyof GpuDetailRow, boolean> = {
    id: false,
    kind: true,
    cpus: true,
    gpuModel: false,
    gpuModelStandardized: false,
    gpus: true,
    instance: true,
    instanceMemory: true,
    instanceName: false,
    instanceStorage: false,
    linuxReservedCost: false,
    linuxSpotMaximumCost: false,
    linuxSpotMinimumCost: false,
    networkPerformance: false,
    onDemand: true,
    region: true,
    windowsOnDemandCost: false,
    windowsReservedCost: false,
    windowsSpotMaximumCost: false,
    windowsSpotMinimumCost: false,
  };

  const prefilteredData = React.useMemo(
    () => data.filter((row) => row.gpuModelStandardized === gpuModel),
    [data, gpuModel],
  );

  return (
    <Table
      title={`${formatGpuModel(gpuModel)} GPU Pricing and Availability`}
      data={prefilteredData}
      columns={columns}
      initialColumnVisibility={initialColumnVisibility}
      leftActions={
        <>
          <DropdownMenu
            options={getUniqueGpuModels().map((gpuModel) => ({
              label: formatGpuModel(gpuModel ?? ""),
              value: gpuModel ?? "",
            }))}
            value={{ label: formatGpuModel(gpuModel), value: gpuModel }}
            label="Model"
            onChange={(option) => {
              const pathWithParams = `/${option.value}${
                searchParams.toString() ? `?${searchParams.toString()}` : ""
              }`;
              router.push(pathWithParams);
            }}
          />
          <DropdownMenu
            options={costPeriodOptions}
            value={
              costPeriodOptions.find((period) => period.value === costPeriod) ??
              costPeriodOptions[2]
            }
            label="Cost per"
            onChange={(option) => {
              setCostPeriod(option.value as CostPeriod);
            }}
          />
        </>
      }
    />
  );
};
