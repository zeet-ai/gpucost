import data from "./gpus.json";
import { getGpuDetailData } from "./providers";

export type GpuRow = {
  id: string;
  model: string | null;
  shadersMaxClock: string | null;
  memoryBusType: string | null;
  memoryBusWidth: string | null;
  memorySize: string | null;
  memoryBandwidth: string | null;
  memoryClock: string | null;
  processingPowerHalfPrecision: string | null;
  processingPowerSinglePrecision: string | null;
  processingPowerDoublePrecision: string | null;
  cudaCompatiblity: string | null;
  thermalDesignPower: string | null;
  formFactor: string | null;
  availableProviders?: string | null;
  deprecated: boolean;
};

const getProviders = (model: string | null) => {
  const providers = [];
  const providerData = getGpuDetailData();

  for (const provider of providerData) {
    if (
      provider.gpuModelStandardized === model &&
      providers.includes(provider.kind) === false
    ) {
      providers.push(provider.kind);
    }
  }

  return providers.join(", ");
};

const sortGpuData = (a: GpuRow, b: GpuRow) => {
  // gpu with available providers should be first
  if (a.availableProviders && !b.availableProviders) return -1;
  if (!a.availableProviders && b.availableProviders) return 1;

  // deprecated gpu should be last
  if (a.deprecated !== b.deprecated) return a.deprecated ? 1 : -1;

  // sort by memory size
  const memSizeCompare =
    (Number(b.memorySize) || 0) - (Number(a.memorySize) || 0);
  if (memSizeCompare !== 0) return memSizeCompare;

  // sort by FLOP
  const flopCompare =
    (Number(b.processingPowerHalfPrecision) || 0) -
    (Number(a.processingPowerHalfPrecision) || 0);
  if (flopCompare !== 0) return flopCompare;

  // sort by memory bandwidth
  const memBandwidthCompare =
    (Number(b.memoryBandwidth) || 0) - (Number(a.memoryBandwidth) || 0);
  if (memBandwidthCompare !== 0) return memBandwidthCompare;

  // nvlink first
  if (a.model?.includes("NVLINK") && !b.model?.includes("NVLINK")) return -1;
  if (!a.model?.includes("NVLINK") && b.model?.includes("NVLINK")) return 1;

  // sort by model name
  return (a.model ?? "").localeCompare(b.model ?? "");
};

export const getGpuData = () => {
  const rows = (data as Record<string, string | null>[]).map(
    (row, i): GpuRow => ({
      id: i.toString(),
      model: row["Model"],
      shadersMaxClock: row["Shaders Max boost clock (MHz)"],
      memoryBusType: row["Memory Bus type"],
      memoryBusWidth: row["Memory Bus Width (bit)"],
      memorySize: row["Memory (GB)"],
      memoryBandwidth: row["Memory Bandwidth (GB/s)"],
      memoryClock: row["Memory Clock (MT/s)"],
      processingPowerHalfPrecision:
        row["Half precision Processing Power (GFLOPS)"],
      processingPowerSinglePrecision:
        row["Single precision Processing Power (GFLOPS)"],
      processingPowerDoublePrecision:
        row["Double precision Processing Power (GFLOPS)"],
      cudaCompatiblity: row["CUDA Compatibility"],
      thermalDesignPower: row["Thermal Design Power (watts)"],
      formFactor: row["Form Factor"],
      availableProviders: getProviders(row["Model"]),
      deprecated: row["Deprecated"] === "true",
    }),
  );
  return rows.sort(sortGpuData);
};
