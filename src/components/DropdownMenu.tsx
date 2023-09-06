import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@chakra-ui/icons";

type DropdownMenuOption = {
  label: string;
  value: string;
};

export const DropdownMenu = ({
  options,
  label,
  value,
  onChange,
}: {
  options: DropdownMenuOption[];
  value: DropdownMenuOption;
  label?: string;
  onChange?: (option: DropdownMenuOption) => void;
}) => {
  const [selected, setSelected] = React.useState<DropdownMenuOption>(value);

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon ml="-1" />}
        variant="outline"
        colorScheme="gray"
        size="sm"
      >
        <Flex gap="1">
          {label && <Text opacity="0.5">{label}:</Text>}
          {selected?.label || "Select an option"}
        </Flex>
      </MenuButton>
      <MenuList maxHeight="calc(100vh - 150px)" overflow="auto">
        <MenuGroup title={label} mx="3" my="1">
          {options.map((option) => {
            return (
              <MenuItem
                key={option.value}
                fontSize="sm"
                display="flex"
                justifyContent="space-between"
                onClick={() => {
                  setSelected(option);
                  onChange?.(option);
                }}
                gap="2"
                icon={
                  option.value === selected.value ? (
                    <CheckIcon />
                  ) : (
                    <Box mr="3" />
                  )
                }
                iconSpacing="1"
              >
                <Text>{option.label}</Text>
              </MenuItem>
            );
          })}
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};
