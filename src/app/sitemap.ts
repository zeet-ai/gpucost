import { getUniqueGpuModels } from "@/data/providers";
import { MetadataRoute } from "next";

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
}

const staticRoutes: SitemapEntry[] = [
  {
    url: "https://gpucost.com/",
    lastModified: new Date(),
  },
  {
    url: "https://gpucost.com/about",
    lastModified: new Date(),
  },
];

const makeDynamicRoutes = (): SitemapEntry[] => {
  return getUniqueGpuModels().map((gpuModel) => ({
    url: `https://gpucost.com/${encodeURIComponent(gpuModel ?? "")}`,
    lastModified: new Date(),
  }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = makeDynamicRoutes();
  return [...staticRoutes, ...dynamicRoutes];
}
