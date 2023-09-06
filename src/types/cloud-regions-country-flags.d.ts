declare module "cloud-regions-country-flags" {
  type Region = {
    location: string;
    flag: string;
    country: string;
    latitude: number;
    longitude: number;
    raw: string;
  };

  export function fromProvider(
    region: string,
    provider: "AWS" | "GCP" | "Vercel",
  ): Region;
}
