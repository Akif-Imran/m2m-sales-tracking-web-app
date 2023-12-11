import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Badge, Card, Flex, Menu, Stack, Text } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import { openDeleteModalHelper } from "@helpers";
import { removeWarehouse } from "@thunks";
import { deleteWarehouse } from "@slices";
import { notify } from "@utility";

interface OwnProps {
  item: IWarehouse;
  setForEdit: (item: IWarehouse) => void;
}

export const _WarehouseCard: React.FC<OwnProps> = ({ item, setForEdit }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Warehouse`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Warehouse? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeWarehouse({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Warehouse", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteWarehouse(id));
            }
          })
          .catch((err) => {
            console.log("Delete Warehouse: ", err?.message);
            notify("Delete Warehouse", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Warehouse", "Operation canceled!", "error"),
    });
  };

  const titleTextStyle = {
    fw: 700,
    c: colors.titleText,
    size: "sm",
  };
  const bodyTextStyle = {
    fz: "sm",
    color: colors.titleText,
  };

  return (
    <Card shadow="md" m={"xs"} key={item._id}>
      <Stack spacing={"xs"}>
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction={"column"} columnGap={"sm"}>
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Name: </Text>
              <Text {...bodyTextStyle}>{item.name}</Text>
            </Flex>
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Description: </Text>
              <Text {...bodyTextStyle}>{item.description}</Text>
            </Flex>
          </Flex>
          {isAdmin ? (
            <Menu withArrow withinPortal>
              <Menu.Target>
                <ActionIcon color={colors.titleText}>
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Options</Menu.Label>
                <Menu.Item
                  onClick={() => setForEdit(item)}
                  icon={<IconEdit size={16} />}
                  color={colors.titleText}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<IconTrash size={16} />}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Badge variant="light" color="red">
              <Text>Admin Required</Text>
            </Badge>
          )}
        </Flex>
      </Stack>
    </Card>
  );
};

export default _WarehouseCard;
