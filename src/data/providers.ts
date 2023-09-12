import awsData from "./aws.json";
import cwData from "./coreweave.json";
import modalData from "./modal.json";
import lambdaLabsData from "./lambdalabs.json";

enum ProviderKind {
  AWS = "AWS",
  COREWEAVE = "CoreWeave",
  MODAL = "Modal",
  LAMBDALABS = "LambdaLabs",
}

export type GpuDetailRow = {
  id: string;
  kind: ProviderKind;
  cpus: string | null;
  gpuModel: string | null;
  gpuModelStandardized: string | null;
  gpus: string | null;
  instance: string | null;
  instanceMemory: string | null;
  instanceName: string | null;
  instanceStorage: string | null;
  linuxReservedCost: string | null;
  linuxSpotMaximumCost: string | null;
  linuxSpotMinimumCost: string | null;
  networkPerformance: string | null;
  onDemand: string | null;
  region: string | null;
  windowsOnDemandCost: string | null;
  windowsReservedCost: string | null;
  windowsSpotMaximumCost: string | null;
  windowsSpotMinimumCost: string | null;
};

const parseStandardRow =
  (provider: ProviderKind) =>
  (row: Record<string, string | null>, i: number): GpuDetailRow => ({
    id: provider + i.toString(),
    kind: provider,
    cpus: row["CPUs"],
    gpuModel: row["GPU model"],
    gpuModelStandardized: row["GPU model Standardized"],
    gpus: row["GPUs"],
    instance: row["Instance"],
    instanceMemory: row["Instance Memory"],
    instanceName: row["Instance Name"],
    instanceStorage: row["Instance Storage"],
    linuxReservedCost: row["Linux Reserved cost"],
    linuxSpotMaximumCost: row["Linux Spot Maximum cost"],
    linuxSpotMinimumCost: row["Linux Spot Minimum cost"],
    networkPerformance: row["Network Performance"],
    onDemand: row["On Demand"],
    region: row["Region"],
    windowsOnDemandCost: row["Windows On Demand cost"],
    windowsReservedCost: row["Windows Reserved cost"],
    windowsSpotMaximumCost: row["Windows Spot Maximum cost"],
    windowsSpotMinimumCost: row["Windows Spot Minimum cost"],
  });

export const getGpuDetailData = () => {
  const rows = (awsData as Record<string, string | null>[]).map(
    parseStandardRow(ProviderKind.AWS),
  );

  const cwRows = (cwData as Record<string, string | null>[]).map(
    parseStandardRow(ProviderKind.COREWEAVE),
  );

  const modalRows = (modalData as Record<string, string | null>[]).map(
    parseStandardRow(ProviderKind.MODAL),
  );

  const lambdaLabsRows = (
    lambdaLabsData as Record<string, string | null>[]
  ).map(parseStandardRow(ProviderKind.LAMBDALABS));

  return [...rows, ...cwRows, ...modalRows, ...lambdaLabsRows];
};

export const getUniqueGpuModels = () => {
  const rows = getGpuDetailData();
  const gpuModels = rows.map((row) => row.gpuModelStandardized);
  const uniqueGpuModels = [...new Set(gpuModels)].sort();
  return uniqueGpuModels;
};
