import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, ScrollArea, Stack, Text, TextInput, rem } from "@mantine/core";
import { colors } from "@theme";
import { selectWarehouses, useAppSelector } from "@store";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { _AddWarehouseModal, _WarehouseCard } from "./components";

interface OwnProps {}

export const Warehouses: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin },
  } = useAuthContext();
  const { classes: gclasses } = useGStyles();
  const { data: warehouses } = useAppSelector(selectWarehouses);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addModalOpened, setAddModalOpened] = React.useState(false);
  const [editModalOpened, setEditModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof warehouses>([]);
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<IWarehouse>({} as IWarehouse);

  const handleEditSupplier = React.useCallback((type: IWarehouse) => {
    setSelectedWarehouse(type);
    setEditModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = warehouses.filter((project) =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  React.useEffect(() => {
    setSearchedData(warehouses);
  }, [warehouses]);

  const rows =
    searchedData.length === 0 ? (
      <center>
        <Text color={colors.titleText} align="center">
          No Warehouses...
        </Text>
      </center>
    ) : (
      <>
        {searchedData.map((supplier) => {
          return (
            <_WarehouseCard key={supplier._id} item={supplier} setForEdit={handleEditSupplier} />
          );
        })}
      </>
    );

  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} m={"xs"} color={colors.titleText}>
          Warehouses
        </Text>
        <Flex gap={"md"} m={"xs"} className={gclasses.searchContainer}>
          <TextInput
            value={searchQuery}
            className={gclasses.searchInput}
            placeholder="Search by any field"
            icon={<IconSearch size={16} />}
            onChange={(e) => onChangeSearch(e.target?.value)}
            // rightSection={
            //   <IconFilter size={14} color={colors.borderColor} onClick={showFilterModal} />
            // }
          />
          {isAdmin && (
            <Button
              variant="filled"
              rightIcon={<IconPlus size={16} />}
              onClick={() => setAddModalOpened(true)}
            >
              Warehouse
            </Button>
          )}
        </Flex>
        <ScrollArea type="scroll" h={"72vh"}>
          {rows}
        </ScrollArea>
        <_AddWarehouseModal
          mode="add"
          title="Add Warehouse"
          record={undefined}
          opened={addModalOpened}
          onClose={() => setAddModalOpened(false)}
        />
        <_AddWarehouseModal
          mode="edit"
          title="Update Warehouse"
          record={selectedWarehouse}
          opened={editModalOpened}
          onClose={() => setEditModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default Warehouses;
