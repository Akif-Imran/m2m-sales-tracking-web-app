import React from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconRotateClockwise2, IconSearch, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { useAuthContext } from "@contexts";
import { useGStyles } from "@global-styles";
import { deleteStock } from "@slices";
import { _AddStockModal } from "../components";
import { selectStockWithRecords, useAppDispatch, useAppSelector } from "@store";
import { removeStock } from "@thunks";

interface OwnProps {}

export const Stock: React.FC<OwnProps> = () => {
  const {
    state: { isAdmin, isHR, token },
  } = useAuthContext();
  const dispatch = useAppDispatch();
  const { classes: gclasses, theme } = useGStyles();

  const [searchQuery, setSearchQuery] = React.useState("");
  const items = useAppSelector(selectStockWithRecords);
  const [searchedData, setSearchedData] = React.useState<typeof items>([]);
  const [addModalOpened, setAddModalOpened] = React.useState(false);
  const [editModalOpened, setEditModalOpened] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<IStock>({} as IStock);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = items.filter(
      (stock) =>
        stock.supplier?.name?.toLowerCase().includes(query.toLowerCase()) ||
        stock.stockAddedBy?.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.name?.toLowerCase().includes(query.toLowerCase()) ||
        stock.assignee?.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.warehouse?.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedData(filtered);
  };

  const showEditModal = (stock: IStock) => {
    setSelectedItem(stock);
    setEditModalOpened(true);
  };

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Stock`,
      loading: false,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Stock? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Stock",
      onConfirm: () => {
        dispatch(
          removeStock({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Stock", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteStock(res.data._id));
            }
          })
          .catch((err) => {
            console.log("Delete Stock: ", err?.message);
            notify("Delete Stock", "An error occurred", "error");
          });
      },
      onCancel: () => notify("Delete Stock", "Operation canceled!", "error"),
    });
  };

  React.useEffect(() => {
    setSearchedData(items);
  }, [items]);

  const rows =
    searchedData.length === 0 ? (
      <tr>
        <td colSpan={14} color={colors.titleText} align="center">
          No Stock
        </td>
      </tr>
    ) : (
      <>
        {searchedData.map((stock, index) => {
          return (
            <tr key={stock._id}>
              <td>{index + 1}</td>
              <td>{stock.name}</td>
              <td>{stock.type}</td>
              <td>{stock.serialNo}</td>
              <td>{stock.modelNo || "N/A"}</td>
              <td>{stock.assignee?.name || "N/A"}</td>
              <td>{stock.totalCost}</td>
              <td>{stock.supplier?.name || "N/A"}</td>
              <td>{stock.quantity}</td>
              <td>{stock.warehouse?.name || "N/A"}</td>
              <td>
                <Group>
                  {isAdmin ? (
                    <React.Fragment>
                      <ActionIcon color="gray" size={"sm"} onClick={() => showEditModal(stock)}>
                        <IconRotateClockwise2 />
                      </ActionIcon>
                      <ActionIcon color="red" size={"sm"} onClick={() => handleDelete(stock._id)}>
                        <IconTrash />
                      </ActionIcon>
                    </React.Fragment>
                  ) : (
                    <Badge variant="light" color="red">
                      Admin Required
                    </Badge>
                  )}
                </Group>
              </td>
            </tr>
          );
        })}
      </>
    );
  return (
    <Stack spacing={"xs"}>
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
        {!isHR && (
          <Button
            variant="filled"
            rightIcon={<IconPlus size={16} />}
            onClick={() => setAddModalOpened(true)}
          >
            Stock
          </Button>
        )}
      </Flex>
      <ScrollArea type="always" h={"80vh"}>
        <ScrollArea w={"140vw"}>
          <Table border={1} bgcolor={theme.white} withBorder>
            <thead>
              <tr>
                <th colSpan={5}>Stock</th>
                <th colSpan={7}>Details</th>
              </tr>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Serial No.</th>
                <th>Model No.</th>
                <th>Assigned To</th>
                <th>Cost</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Warehouse</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </ScrollArea>
      <_AddStockModal
        mode="add"
        title="Add Stock"
        record={undefined}
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
      />
      <_AddStockModal
        mode="edit"
        title="Update Stock"
        record={selectedItem}
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
      />
    </Stack>
  );
};

export default Stock;
