"use client";

import {
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useSearch } from "@/context/Search";

export const SearchInput = (props: InputGroupProps) => {
  const { setGlobalQuery, globalQuery } = useSearch();

  return (
    <InputGroup {...props}>
      <InputLeftElement pointerEvents="none">
        <SearchIcon opacity="0.7" fontSize="sm" mt="-0.25rem" />
      </InputLeftElement>
      <Input
        size="sm"
        placeholder="Search..."
        transition="all 0.15s"
        width={globalQuery ? "300px" : "150px"}
        _placeholder={{ opacity: "0.7" }}
        _focus={{
          width: "300px",
        }}
        value={globalQuery}
        onChange={(e) => setGlobalQuery?.(e.target.value)}
      />
    </InputGroup>
  );
};
