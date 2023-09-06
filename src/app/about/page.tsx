"use client";

import { Box } from "@chakra-ui/react";
import AboutPage from "./content.mdx";

export default function Home() {
  return (
    <Box p="6" pt="3" maxW="750px">
      <AboutPage />
    </Box>
  );
}
