import { Icon, IconProps } from "@chakra-ui/react";
import { Twemoji } from "../../components/Twemoji";
import { fromProvider } from "cloud-regions-country-flags";

const RegionFlag = ({
  region,
  ...props
}: { region?: string | null } & IconProps) => {
  const getRegionFlag = (region?: string | null) => {
    const providerRegion = fromProvider(region ?? "", "AWS");
    if (providerRegion.flag === "⚠️") {
      return "🌎";
    }
    return providerRegion.flag;
  };

  return (
    <Icon
      as={Twemoji}
      emoji={getRegionFlag(region)}
      boxSize="1rem"
      {...props}
    />
  );
};

export default RegionFlag;
