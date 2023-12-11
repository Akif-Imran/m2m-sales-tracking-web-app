import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, ScrollArea, Stack, Text, TextInput, rem } from "@mantine/core";
import { selectStockWithRecords, useAppSelector } from "@store";
import { _AddStockModal, _StockItemCard } from "./components";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { colors } from "@theme";

interface OwnProps {}

export const StockItems: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR },
  } = useAuthContext();
  const { classes: gclasses } = useGStyles();
  const items = useAppSelector(selectStockWithRecords);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addModalOpened, setAddModalOpened] = React.useState(false);
  const [editModalOpened, setEditModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof items>([]);
  const [selectedItem, setSelectedItem] = React.useState<IStockItem>({} as IStockItem);

  const handleEditSupplier = React.useCallback((type: IStockItem) => {
    setSelectedItem(type);
    setEditModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin || isHR) {
      const filtered = items.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    setSearchedData(items);
  }, [isAdmin, isHR, items]);

  const rows =
    searchedData.length === 0 ? (
      <center>
        <Text color={colors.titleText} align="center">
          No Stock items...
        </Text>
      </center>
    ) : (
      <>
        {searchedData.map((item) => {
          return <_StockItemCard key={item._id} item={item} setForEdit={handleEditSupplier} />;
        })}
      </>
    );

  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} m={"xs"} color={colors.titleText}>
          Stock Items
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
              Item
            </Button>
          )}
        </Flex>
        <ScrollArea type="scroll" h={"72vh"}>
          {rows}
        </ScrollArea>
        <_AddStockModal
          mode="add"
          title="Add Stock Item"
          record={undefined}
          opened={addModalOpened}
          onClose={() => setAddModalOpened(false)}
        />
        <_AddStockModal
          mode="edit"
          title="Update Stock Item"
          record={selectedItem}
          opened={editModalOpened}
          onClose={() => setEditModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default StockItems;
