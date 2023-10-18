import React from "react";
import { useStyles } from "./styles";
import { Button, Card, Flex, ScrollArea, Stack, Text, TextInput, rem } from "@mantine/core";
import { colors } from "@theme";
import { selectSuppliers, useAppSelector } from "@store";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { _AddSupplierModal, _SupplierCard } from "./components";

interface OwnProps {}

export const Suppliers: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR },
  } = useAuthContext();
  const { classes: gclasses } = useGStyles();
  const { data: suppliers } = useAppSelector(selectSuppliers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addSupplierModalOpened, setAddSupplierModalOpened] = React.useState(false);
  const [editSupplierModalOpened, setEditSupplierModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof suppliers>([]);
  //TODO - might be unsafe and cause potential undefined issues when reading.
  const [selectedSupplier, setSelectedSupplier] = React.useState<ISupplier>({} as ISupplier);

  const handleEditSupplier = React.useCallback((supplier: ISupplier) => {
    setSelectedSupplier(supplier);
    setEditSupplierModalOpened(true);
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (isAdmin || isHR) {
      const filtered = suppliers.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedData(filtered);
    }
  };

  React.useEffect(() => {
    if (isAdmin || isHR) {
      setSearchedData(suppliers);
    }
  }, [isAdmin, isHR, suppliers]);

  const rows =
    searchedData.length === 0 ? (
      <center>
        <Text color={colors.titleText} align="center">
          No Suppliers
        </Text>
      </center>
    ) : (
      <>
        {searchedData.map((supplier) => {
          return (
            <_SupplierCard key={supplier._id} item={supplier} setForEdit={handleEditSupplier} />
          );
        })}
      </>
    );
  return (
    <Card radius={"md"} shadow="md" h={"92vh"} py={"xs"} mb={"xs"}>
      <Stack>
        <Text fz={rem(25)} color={colors.titleText}>
          Suppliers
        </Text>
        <Flex gap={"md"} className={gclasses.searchContainer}>
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
              onClick={() => setAddSupplierModalOpened(true)}
            >
              Supplier
            </Button>
          )}
        </Flex>
        <ScrollArea type="scroll" h={"72vh"}>
          {rows}
        </ScrollArea>
        <_AddSupplierModal
          mode="add"
          title="Add Supplier"
          record={undefined}
          opened={addSupplierModalOpened}
          onClose={() => setAddSupplierModalOpened(false)}
        />
        <_AddSupplierModal
          mode="edit"
          title="Update Supplier"
          record={selectedSupplier}
          opened={editSupplierModalOpened}
          onClose={() => setEditSupplierModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default Suppliers;
