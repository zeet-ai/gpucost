import {
  Box,
  BoxProps,
  Button,
  Flex,
  Grid,
  GridProps,
  Heading,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import {
  Cell,
  ColumnDef,
  FilterFn,
  Header,
  SortingState,
  TableOptions,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSearch } from "@/context/Search";
import { rankItem } from "@tanstack/match-sorter-utils";
import { FaSort, FaSortDown, FaSortUp, FaTimesCircle } from "react-icons/fa";
import { SearchInput } from "./SearchInput";
import { ChevronDownIcon } from "@chakra-ui/icons";

const SortIcon = <Row,>({ header }: { header: Header<Row, unknown> }) => {
  const direction = header.column.getIsSorted() as string;

  if (direction === "asc") {
    return (
      <Box position="relative" boxSize="3">
        <Icon as={FaSort} opacity="0.25" position="absolute" />
        <Icon as={FaSortUp} transition="all 0.15s" position="absolute" />
      </Box>
    );
  }

  if (direction === "desc") {
    return (
      <Box position="relative" boxSize="3">
        <Icon as={FaSort} opacity="0.25" position="absolute" />
        <Icon as={FaSortDown} transition="all 0.15s" position="absolute" />
      </Box>
    );
  }

  return (
    <Box position="relative" boxSize="3">
      <Icon
        as={FaSort}
        transition="all 0.15s"
        opacity="0.25"
        _hover={{ opacity: "1" }}
        position="absolute"
      />
    </Box>
  );
};

const TableHeaderRow = ({ children, ...props }: GridProps) => {
  return (
    <Grid
      borderBottom="1px solid"
      borderColor="gray.200"
      minWidth="100vw"
      {...props}
    >
      {children}
    </Grid>
  );
};

const TableRow = ({ children, ...props }: GridProps) => {
  return (
    <Grid
      position="absolute"
      top="0"
      left="0"
      borderBottom="1px solid"
      borderColor="gray.200"
      minWidth="100vw"
      _hover={{ bg: "#00d10017" }}
      {...props}
    >
      {children}
    </Grid>
  );
};

const TableCell = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      p="2"
      borderRight="1px solid"
      borderColor="gray.200"
      _last={{ borderRight: "none" }}
      fontSize="sm"
      {...props}
    >
      {children}
    </Box>
  );
};

const TableEmptyState = () => {
  return (
    <Box
      height="100%"
      mt="8"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      No results found
    </Box>
  );
};

const ColumnsMenu = <Row,>({
  columns,
  columnVisibility,
  setColumnVisibility,
  initialColumnVisibility,
}: {
  columns: ColumnDef<Row, string | null>[];
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  initialColumnVisibility?: VisibilityState;
}) => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon ml="-1" />}
        variant="outline"
        colorScheme="gray"
        size="sm"
      >
        Columns
      </MenuButton>
      <MenuList maxHeight="calc(100vh - 200px)" overflow="auto">
        <MenuGroup title="Columns to show" mx="3" my="1">
          {columns.map((column, index) => {
            const { accessorKey, header } = column as {
              accessorKey: string;
              header: string;
            };
            const columnId = accessorKey;
            return (
              <MenuItem
                key={columnId + index}
                fontSize="sm"
                display="flex"
                justifyContent="space-between"
                onClick={() =>
                  setColumnVisibility({
                    ...columnVisibility,
                    [columnId]: !columnVisibility[columnId],
                  })
                }
                gap="2"
              >
                <Text>{header}</Text>
                <Switch
                  size="sm"
                  isChecked={columnVisibility[columnId]}
                  pointerEvents="none"
                />
              </MenuItem>
            );
          })}
        </MenuGroup>
        <Button
          variant="outline"
          size="xs"
          colorScheme="gray"
          m="2"
          onClick={() => setColumnVisibility(initialColumnVisibility ?? {})}
        >
          Restore original settings
        </Button>
      </MenuList>
    </Menu>
  );
};

const ClearFiltersButton = () => {
  const { globalQuery, setGlobalQuery, columnFilters, setColumnFilters } =
    useSearch();

  const clearAllFilters = () => {
    setGlobalQuery("");
    setColumnFilters([]);
  };

  const filterCount = (): number => {
    return (columnFilters?.length ?? 0) + (globalQuery ? 1 : 0);
  };

  return (
    <Button
      variant="outline"
      borderStyle="dashed"
      colorScheme="gray"
      size="sm"
      onClick={clearAllFilters}
      rightIcon={<Icon as={FaTimesCircle} boxSize="0.75rem" opacity="0.5" />}
    >
      Clear Filters
      {filterCount() > 0 && (
        <Text opacity="0.5" ml="1">
          {filterCount()}
        </Text>
      )}
    </Button>
  );
};

export const Table = <Row,>({
  title,
  data,
  columns,
  initialColumnVisibility,
  initialSortingState,
  leftActions,
}: {
  title?: string;
  data: Row[];
  columns: ColumnDef<Row, string | null>[];
  initialColumnVisibility?: VisibilityState;
  initialSortingState?: SortingState;
  leftActions?: React.ReactNode;
}) => {
  const { globalQuery, setGlobalQuery, columnFilters, setColumnFilters } =
    useSearch();

  const [sorting, setSorting] = React.useState<SortingState>(
    initialSortingState ?? [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility ?? {});
  const [hoveredCol, setHoveredCol] = React.useState<string | null>(null);

  const fuzzyFilter: FilterFn<Row> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const config: TableOptions<Row> = {
    columns,
    data,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalQuery,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter: globalQuery,
    },
  };

  const table = useReactTable(config);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: rows.length,
    estimateSize: () => 40,
    overscan: 50,
  });

  const makeGridTemplateColumns = (
    cells: Cell<Row, unknown>[] | Header<Row, unknown>[],
  ): string => {
    return cells
      .map((cell) => `minmax(${cell.column.getSize()}px, 1.33fr)`)
      .join(" ");
  };

  return (
    <Box
      ref={tableContainerRef}
      height="calc(100vh - 68px)"
      width="100vw"
      overflow="auto"
    >
      {title && (
        <Heading
          as="h1"
          bg="bg.surface"
          fontSize="1.15rem"
          lineHeight="3rem"
          p="2"
          fontWeight="bold"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          left="0"
        >
          {title}
        </Heading>
      )}
      <Box
        bg="bg.surface"
        boxShadow="md"
        zIndex="10"
        width="fit-content"
        position="sticky"
        top="0"
      >
        <Flex
          p="2"
          gap="2"
          borderBottom="1px solid"
          borderColor="gray.200"
          justifyContent="space-between"
          position="sticky"
          top="0"
          left="0"
          maxWidth="100vw"
          zIndex="10"
        >
          <Flex gap="2" alignItems="center">
            {leftActions && leftActions}
            <ColumnsMenu
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              initialColumnVisibility={initialColumnVisibility}
            />
            <ClearFiltersButton />
            <Text fontSize="sm">{rows.length} results</Text>
          </Flex>
          <Flex gap="2">
            <SearchInput />
          </Flex>
        </Flex>
        {table.getHeaderGroups().map((headerGroup) => {
          return (
            <TableHeaderRow
              key={headerGroup.id}
              gridTemplateColumns={makeGridTemplateColumns(headerGroup.headers)}
            >
              {headerGroup.headers.map((header) => (
                <Stack
                  key={header.id}
                  bg={hoveredCol === header.id ? "#00d10017" : "transparent"}
                >
                  <Flex
                    key={header.id}
                    p="2"
                    fontWeight="bold"
                    fontSize="sm"
                    alignItems="center"
                    gap="1"
                    justifyContent="space-between"
                    onClick={header.column.getToggleSortingHandler()}
                    cursor="pointer"
                    userSelect="none"
                    onMouseEnter={() => setHoveredCol(header.id)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <Text noOfLines={1} wordBreak="break-all">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Text>
                    <SortIcon header={header} />
                  </Flex>
                  <Box p="2" pt="0" mt="-3">
                    <Input
                      placeholder="Filter..."
                      size="xs"
                      value={(header.column.getFilterValue() ?? "") as string}
                      onChange={(e) =>
                        header.column.setFilterValue(e.target.value)
                      }
                    />
                  </Box>
                </Stack>
              ))}
            </TableHeaderRow>
          );
        })}
      </Box>
      <Box
        height={`${rowVirtualizer.getTotalSize()}px`}
        position="relative"
        width="100%"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const row = rows[virtualItem.index];
          const cells = row.getVisibleCells();
          return (
            <TableRow
              key={row.id}
              height={`${virtualItem.size}px`}
              transform={`translateY(${virtualItem.start}px)`}
              gridTemplateColumns={makeGridTemplateColumns(cells)}
            >
              {cells.map((cell) => (
                <TableCell
                  key={cell.id}
                  bg={
                    hoveredCol === cell.id.split("_")[1]
                      ? "#00d10017"
                      : "transparent"
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
        {rowVirtualizer.getVirtualItems().length === 0 && <TableEmptyState />}
      </Box>
    </Box>
  );
};
