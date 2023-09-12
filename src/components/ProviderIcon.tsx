import { ProviderKind } from "@/data/providers";
import { Icon } from "@chakra-ui/react";
import Image from "next/image";
import { SiAmazonaws } from "react-icons/si";
import { MdOutlineQuestionMark } from "react-icons/md";

export const ProviderIcon = ({ provider }: { provider: ProviderKind }) => {
  if (provider === ProviderKind.AWS) {
    return <Icon as={SiAmazonaws} boxSize="1.25rem" />;
  }
  if (provider === ProviderKind.COREWEAVE) {
    return (
      <Image
        src="/coreweave-logo.svg"
        width="20"
        height="20"
        alt="CoreWeave logo"
      />
    );
  }
  if (provider === ProviderKind.LAMBDALABS) {
    return (
      <Image src="/lambda-logo.svg" width="20" height="20" alt="Lambda logo" />
    );
  }
  if (provider === ProviderKind.MODAL) {
    return (
      <Image src="/modal-logo.svg" width="20" height="20" alt="Modal logo" />
    );
  }
  return <Icon as={MdOutlineQuestionMark} boxSize="1.25rem" />;
};
