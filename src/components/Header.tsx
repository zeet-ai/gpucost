"use client";

import { Box, Button, ButtonProps, Flex, Icon, Stack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { SiGithub } from "react-icons/si";

const HeaderTabLink = ({
  children,
  href,
  exact,
}: { href: string; exact?: boolean } & PropsWithChildren) => {
  const pathname = usePathname();
  const activeStyle = {
    bg: "white",
    color: "black",
    opacity: "1",
    _hover: { bg: "white" },
  };
  const inactiveStyle = { opacity: "0.7" };

  const isActive = () => {
    if (exact) {
      return pathname === href;
    }
    return pathname[0] === href[0] && pathname !== "/about" && pathname !== "/";
  };

  return (
    <Box
      as={Link}
      href={href}
      borderRadius="8px 8px 0 0"
      p="3"
      pb="20px"
      fontWeight="bold"
      bg="rgb(0 0 0 / 35%)"
      color="white"
      _hover={{ bg: "rgb(0 0 0 / 45%)" }}
      transition="all 0.15s"
      {...(isActive() ? activeStyle : inactiveStyle)}
    >
      {children}
    </Box>
  );
};

const HeaderTabButton = ({
  href,
  children,
  ...props
}: { href: string } & ButtonProps & PropsWithChildren) => {
  const pathname = usePathname();
  const activeStyle = {
    bg: "white",
    color: "black",
    _hover: { bg: "white" },
  };
  const inactiveStyle = {};

  return (
    <Button
      as={Link}
      href={href}
      _hover={{ bg: "rgb(0 0 0 / 45%)" }}
      bg="rgb(0 0 0 / 35%)"
      size="sm"
      {...(pathname === href ? activeStyle : inactiveStyle)}
      {...props}
    >
      {children}
    </Button>
  );
};

export const Header = () => {
  return (
    <Box bg="#00D100" p="3" position="sticky" top="0">
      <Stack direction={{ base: "column", md: "row" }} alignItems="center">
        <Link href="/">
          <Image src="/logo.png" width="149" height="41" alt="GPU Cost logo" />
        </Link>
        <Flex
          justifyContent="space-between"
          width="100%"
          mb="-12px"
          flex="1"
          ml="4"
        >
          <Flex gap="2">
            <HeaderTabLink href="/" exact>
              GPUs
            </HeaderTabLink>
            <HeaderTabLink href="/H100">Providers</HeaderTabLink>
          </Flex>
          <Flex gap="3">
            <HeaderTabButton href="/about">About</HeaderTabButton>
            <HeaderTabButton
              leftIcon={<Icon as={SiGithub} />}
              href="https://github.com/zeet-ai/gpucost"
            >
              Star
            </HeaderTabButton>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
};
