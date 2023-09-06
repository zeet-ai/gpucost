import { Icon, IconProps } from "@chakra-ui/react";
import { Twemoji } from "./Twemoji";
import { fromProvider } from "cloud-regions-country-flags";

const RegionFlag = ({ region, ...props }: { region: string } & IconProps) => {
  const emoji = fromProvider(region, "AWS");
  return (
    <Icon as={Twemoji} emoji={emoji.flag ?? "❔"} boxSize="1rem" {...props} />
  );
};

export default RegionFlag;
