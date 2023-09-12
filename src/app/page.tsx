import { GpuTable } from "@/app/GpuTable";
import { getGpuData } from "@/data/gpus";

export default function Home() {
  const data = getGpuData();

  return <GpuTable data={data} />;
}
