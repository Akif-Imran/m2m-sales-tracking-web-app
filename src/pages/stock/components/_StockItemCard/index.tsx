/* import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Avatar, Badge, Card, Flex, Menu, Stack, Text, rem } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import { useAuthContext } from "@contexts";
import { selectStockWithRecords, useAppDispatch } from "@store";
import { openDeleteModalHelper } from "@helpers";
import { removeStock } from "@thunks";
import { deleteStock } from "@slices";
import { notify } from "@utility";
import { stockItemStatusColors } from "@constants";
import { PhotoView } from "react-photo-view";

interface OwnProps {
  item: ReturnType<typeof selectStockWithRecords>[0];
  setForEdit: (item: IStockItem) => void;
}

const _StockItemCard: React.FC<OwnProps> = ({ item, setForEdit }) => {
  const { theme, classes } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { isAdmin, token },
  } = useAuthContext();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = (id: string) => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Stock Item`,
      loading: isDeleting,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Stock item? This action is destructive and you will
          have to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: () => {
        setIsDeleting((_prev) => true);
        dispatch(
          removeStock({
            token,
            id,
          })
        )
          .unwrap()
          .then((res) => {
            notify("Delete Stock Item", res?.message, res.success ? "success" : "error");
            if (res.success) {
              dispatch(deleteStock(id));
            }
          })
          .catch((err) => {
            console.log("Delete Stock Item: ", err?.message);
            notify("Delete Stock Item", "An error occurred", "error");
          })
          .finally(() => {
            setIsDeleting((_prev) => false);
          });
      },
      onCancel: () => notify("Delete Stock Item", "Operation canceled!", "error"),
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
        <Flex direction={"row"} justify={"flex-start"} columnGap={"sm"}>
          <div className={classes.machineImageContainer}>
            <PhotoView
              key={item._id}
              src={item?.image ? `${item?.image}` : "/user.png"}
              // src={item?.image ? `${BASE_URL}\\${item?.picture}` : "/user.png"}
            >
              <Avatar
                src={item?.image ? `${item?.image}` : "/user.png"}
                radius={item?.image ? rem(250) : rem(250)}
                size={"xl"}
                //@ts-expect-error style works
                styles={item?.image ? undefined : noImageStyle}
                // src={item?.image ? `${BASE_URL}\\${item?.picture}` : "/user.png"}
              />
            </PhotoView>
            <Badge variant="light" color={stockItemStatusColors[item.status]} mt={"sm"}>
              <Text>{item.statusName}</Text>
            </Badge>
          </div>
          <Flex direction={"column"} columnGap={"sm"} w={"100%"}>
            <Flex direction={"row"} justify={"space-between"}>
              <Flex direction={"row"} align={"center"} columnGap={"sm"}>
                <Text {...titleTextStyle}>No: </Text>
                <Text {...bodyTextStyle}>{item.no}</Text>
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
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Name: </Text>
              <Text {...bodyTextStyle}>{item.name}</Text>
            </Flex>
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Type: </Text>
              <Text {...bodyTextStyle}>{item.type}</Text>
            </Flex>
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Assigned To: </Text>
              <Text {...bodyTextStyle}>{item.assignee?.name || "N/A"}</Text>
            </Flex>
            <Flex direction={"row"} align={"center"} columnGap={"sm"}>
              <Text {...titleTextStyle}>Cost: </Text>
              <Text {...bodyTextStyle}>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: item.cost.currency,
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(item.cost.amount || 0)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
};

export { _StockItemCard };
 */
