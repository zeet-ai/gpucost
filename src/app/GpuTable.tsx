"use client";

import { GpuRow } from "@/data/gpus";
import { TableProps } from "@chakra-ui/react";
import { VisibilityState, createColumnHelper } from "@tanstack/react-table";
import * as React from "react";
import { Table } from "@/components/Table";
import Link from "next/link";
import { formatGpuModel } from "@/shared/formatters";
import { ProvidersCell } from "@/components/ProvidersCell";

export const GpuTable = ({ data }: { data: GpuRow[] } & TableProps) => {
  const columnHelper = createColumnHelper<GpuRow>();
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("model", {
        header: "Model",
        minSize: 225,
        cell: (info) => (
          <Link
            href={`/${info.getValue()}`}
            style={{ color: "#009E00", fontWeight: "500" }}
          >
            {formatGpuModel(info.getValue() ?? "")}
          </Link>
        ),
      }),
      columnHelper.accessor("shadersMaxClock", {
        header: "Shaders Max Boost Clock (MHz)",
        minSize: 275,
      }),
      columnHelper.accessor("memoryBusType", {
        header: "Memory Bus Type",
        minSize: 175,
      }),
      columnHelper.accessor("memoryBusWidth", {
        header: "Memory Bus Width (bits)",
        minSize: 225,
      }),
      columnHelper.accessor("memorySize", {
        header: "Memory (GB)",
        minSize: 150,
      }),
      columnHelper.accessor("memoryBandwidth", {
        header: "Memory Bandwidth (GB/s)",
        minSize: 225,
      }),
      columnHelper.accessor("memoryClock", {
        header: "Memory Clock (MT/s)",
        minSize: 200,
      }),
      columnHelper.accessor("processingPowerHalfPrecision", {
        header: "Half Precision Processing Power (GFLOPS)",
        minSize: 200,
      }),
      columnHelper.accessor("processingPowerSinglePrecision", {
        header: "Single Precision Processing Power (GFLOPS)",
        minSize: 200,
      }),
      columnHelper.accessor("processingPowerDoublePrecision", {
        header: "Double Precision Processing Power (GFLOPS)",
        minSize: 200,
      }),
      columnHelper.accessor("cudaCompatiblity", {
        header: "CUDA Compatibility",
        minSize: 200,
      }),
      columnHelper.accessor("thermalDesignPower", {
        header: "Thermal Design Power (watts)",
        minSize: 250,
      }),
      columnHelper.accessor("formFactor", {
        header: "Form Factor",
        minSize: 500,
      }),
      columnHelper.accessor("availableProviders", {
        header: "Available Providers",
        minSize: 600,
        cell: (info) => <ProvidersCell info={info} />,
      }),
    ],
    [columnHelper],
  );

  const initialColumnVisibility: Record<keyof GpuRow, boolean> &
    VisibilityState = {
    id: false,
    model: true,
    shadersMaxClock: false,
    memoryBusType: false,
    memoryBusWidth: false,
    memorySize: true,
    memoryBandwidth: true,
    memoryClock: false,
    processingPowerHalfPrecision: true,
    processingPowerSinglePrecision: true,
    processingPowerDoublePrecision: false,
    cudaCompatiblity: false,
    thermalDesignPower: false,
    formFactor: false,
    availableProviders: true,
    deprecated: false,
  };

  return (
    <Table
      title="Find GPU Prices and Availability"
      data={data}
      columns={columns}
      initialColumnVisibility={initialColumnVisibility}
    />
  );
};
