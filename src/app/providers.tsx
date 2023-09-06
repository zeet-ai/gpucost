"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { theme as proTheme } from "@chakra-ui/pro-theme";
import {
  ChakraProvider,
  HeadingProps,
  LinkProps,
  TextProps,
  theme as baseTheme,
  extendTheme,
} from "@chakra-ui/react";

import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Heading, Link as CLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SearchProvider } from "@/context/Search";

const mdComponents = {
  h1: (props: HeadingProps) => <Heading size="lg" mt="3" {...props} />,
  h2: (props: HeadingProps) => <Heading size="md" mt="3" {...props} />,
  h3: (props: HeadingProps) => <Heading size="xs" mt="3" {...props} />,
  h4: (props: HeadingProps) => <Heading size="xxs" mt="3" {...props} />,
  p: (props: TextProps) => <Text mt="1" {...props} />,
  a: (props: LinkProps) => <CLink as={Link} {...props} />,
};

export const theme = extendTheme(
  {
    colors: { ...baseTheme.colors, brand: baseTheme.colors.green },
  },
  proTheme,
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <CacheProvider>
        <MDXProvider components={mdComponents}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </MDXProvider>
      </CacheProvider>
    </SearchProvider>
  );
}
