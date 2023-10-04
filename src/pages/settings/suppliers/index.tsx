import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { colors } from "@theme";
import { selectSuppliers, useAppDispatch, useAppSelector } from "@store";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useGStyles } from "@global-styles";
import { useAuthContext } from "@contexts";
import { openDeleteModalHelper } from "@helpers";
import { deleteSupplier } from "@slices";
import { notify } from "@utility";
import { _AddSupplierModal } from "./components";

interface OwnProps {}

export const Suppliers: React.FC<OwnProps> = () => {
  useStyles();
  const {
    state: { isAdmin, isHR },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();
  const { data: suppliers } = useAppSelector(selectSuppliers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addSupplierModalOpened, setAddSupplierModalOpened] = React.useState(false);
  const [searchedData, setSearchedData] = React.useState<typeof suppliers>([]);

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

  const handleDelete = (id: number) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Supplier`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this supplier? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Supplier",
      onConfirm: () => {
        dispatch(deleteSupplier(id));
        notify("Delete Supplier", "Supplier deleted successfully!", "success");
      },
      onCancel: () => notify("Delete Supplier", "Operation canceled!", "error"),
    });
  };

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
            <Card shadow="md" m={"md"} key={supplier.id}>
              <Stack spacing={"xs"}>
                <Flex direction={"row"} justify={"space-between"}>
                  <Text>ID: {supplier.id}</Text>
                  {isAdmin ? (
                    <Group>
                      <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(supplier.id)}>
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  ) : (
                    "Admin Required"
                  )}
                </Flex>
                <Flex direction={"row"} justify={"space-between"} m={0} p={0}>
                  <div>
                    <Text>Name: {supplier.name}</Text>
                    <Text>Phone: {supplier.phone}</Text>
                    <Text>Email: {supplier.email}</Text>
                  </div>
                  <div>
                    <Text align="right">{supplier.city}</Text>
                    <Text align="right">{supplier.state}</Text>
                    <Text align="right">{supplier.country}</Text>
                  </div>
                </Flex>
                <Text>Address: {supplier.address}</Text>
              </Stack>
            </Card>
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
          {/* <Table border={1} bgcolor={theme.white} withBorder>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Website URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table> */}
          {rows}
        </ScrollArea>
        <_AddSupplierModal
          title="Add Supplier"
          opened={addSupplierModalOpened}
          onClose={() => setAddSupplierModalOpened(false)}
        />
      </Stack>
    </Card>
  );
};

export default Suppliers;
