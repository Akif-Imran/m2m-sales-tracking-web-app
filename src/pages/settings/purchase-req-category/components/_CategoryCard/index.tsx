import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Badge, Card, Flex, Menu, Stack, Text } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import { openDeleteModalHelper } from "@helpers";
import { removeExpenseType } from "@thunks";
import { deleteExpenseType } from "@slices";
import { notify } from "@utility";

interface OwnProps {
  item: IExpenseType;
  setForEdit: (item: IExpenseType) => void;
}

const _CategoryCard: React.FC<OwnProps> = ({ item, setForEdit }) => {
  const { theme } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Expense Type`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Expense Type? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeExpenseType({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Expense Type", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteExpenseType(id));
            }
          })
          .catch((err) => {
            console.log("Delete Expense Type: ", err?.message);
            notify("Delete Expense Type", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Expense Type", "Operation canceled!", "error"),
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

export { _CategoryCard };
