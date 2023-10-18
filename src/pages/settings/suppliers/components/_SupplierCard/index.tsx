import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Anchor, Card, Flex, Menu, Stack, Text } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import { openDeleteModalHelper } from "@helpers";
import { removeSupplier } from "@thunks";
import { deleteSupplier } from "@slices";
import { notify } from "@utility";

interface OwnProps {
  item: ISupplier;
  setForEdit: (item: ISupplier) => void;
}

const _SupplierCard: React.FC<OwnProps> = ({ item, setForEdit }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Supplier`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this supplier? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Supplier",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeSupplier({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Supplier", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteSupplier(id));
            }
          })
          .catch((err) => {
            console.log("Delete Supplier: ", err?.message);
            notify("Delete Supplier", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Supplier", "Operation canceled!", "error"),
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
    <Card shadow="md" m={"md"} key={item._id}>
      <Stack spacing={"xs"}>
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction={"row"} align={"center"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Name: </Text>
            <Text {...bodyTextStyle}>{item.name}</Text>
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
            "Admin Required"
          )}
        </Flex>
        <Flex direction={"column"} justify={"flex-start"} m={0} p={0}>
          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Phone: </Text>
            <Text {...bodyTextStyle}>{item.mobile}</Text>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Email: </Text>
            <Anchor href={item.email} {...bodyTextStyle} color="blue">
              {item.email}
            </Anchor>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>City:</Text>
            <Text {...bodyTextStyle}>{item.city}</Text>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>State: </Text>
            <Text {...bodyTextStyle}>{item.state}</Text>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Country: </Text>
            <Text {...bodyTextStyle}>{item.state}</Text>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Website: </Text>
            <Anchor href={item.website} {...bodyTextStyle} color="blue">
              {item.website}
            </Anchor>
          </Flex>

          <Flex direction={"row"} align={"flex-start"} columnGap={"sm"}>
            <Text {...titleTextStyle}>Address: </Text>
            <Text {...bodyTextStyle}>{item.address}</Text>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
};

export { _SupplierCard };
