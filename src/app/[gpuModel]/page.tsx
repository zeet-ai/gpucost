import { GpuDetailTable } from "@/app/[gpuModel]/GpuDetailTable";
import { getGpuDetailData, getUniqueGpuModels } from "@/data/providers";
import { formatGpuModel } from "@/shared/formatters";
import { Metadata, ResolvingMetadata } from "next";

type GpuDetailProps = {
  params: {
    gpuModel: string;
  };
};

export async function generateStaticParams() {
  const paths = getUniqueGpuModels().map((gpuModel) => ({
    params: { gpuModel },
  }));
  return paths;
}

export async function generateMetadata(
  { params }: GpuDetailProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const decodedGpuModel = decodeURIComponent(params.gpuModel);
  const gpuModelWithVendor = formatGpuModel(decodedGpuModel);
  const title = `${gpuModelWithVendor} GPU Pricing and Availability across Clouds`;
  const description = `Find the best deals on ${gpuModelWithVendor} GPUs across various cloud providers. Availability and Cost calculator for ${gpuModelWithVendor} GPUs.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: (await parent).openGraph?.images,
    },
  };
}

export default function GpuDetail({ params }: GpuDetailProps) {
  const data = getGpuDetailData();
  const decodedGpuModel = decodeURIComponent(params.gpuModel);

  return <GpuDetailTable data={data} gpuModel={decodedGpuModel} />;
}
