import { ActionIcon, Avatar, Badge, Card, Flex, Menu, Text, Tooltip, rem } from "@mantine/core";
import React from "react";
import { selectLeadsWithRecords } from "@store";
import {
  IconCornerDownRight,
  IconDotsVertical,
  IconRotateClockwise2,
  IconTrash,
  // IconUserCog,
} from "@tabler/icons-react";
import { BASE_URL } from "@api";
import { menuIconStyle, noImageStyle } from "@global-styles";
import { colors } from "@theme";
import { PhotoView } from "react-photo-view";
import { useStyles } from "./styles";
import { useAuthContext } from "@contexts";
import { projectStatusColors } from "@constants";

interface OwnProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  item: ReturnType<typeof selectLeadsWithRecords>[0];
  handleDelete: (id: string) => void;
  assignEngineer: (projectId: string) => void;
  moveToProject: (prospectId: string) => void;
  updateStatus: (statusId: number, projectId: string) => void;
}

export const _LeadCard: React.FC<OwnProps> = ({
  item,
  onClick,
  handleDelete,
  // assignEngineer,
  moveToProject,
  updateStatus,
}) => {
  const { classes, theme } = useStyles();
  const {
    state: { isAdmin },
  } = useAuthContext();

  const menuStyles = {
    itemLabel: {
      fontSize: theme.fontSizes.sm,
    },
  };

  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"lg"} radius={"md"} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <PhotoView
            src={item?.images.length > 0 ? `${BASE_URL}\\${item?.images[0]}` : "/company.png"}
          >
            <Avatar
              src={item?.images.length > 0 ? `${BASE_URL}\\${item?.images[0]}` : "/company.png"}
              radius={item?.images.length > 0 ? rem(250) : rem(250)}
              size={"xl"}
              //@ts-expect-error style works
              styles={item?.images.length > 0 ? undefined : noImageStyle}
            />
          </PhotoView>
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.minorDetailsWithCount}>
            <div className={classes.textWithIconButton}>
              <Flex direction={"row"} align={"center"} justify={"space-between"}>
                <Text fw={"bold"} fs={"normal"} fz={"md"} color={colors.titleText}>
                  {item?.name}
                </Text>
              </Flex>
              <Menu
                withArrow
                shadow="md"
                withinPortal
                width={rem(180)}
                styles={menuStyles}
                position="bottom-start"
              >
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical color={colors.titleText} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Options</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconRotateClockwise2 {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      updateStatus(item.status, item._id);
                    }}
                  >
                    Update Status
                  </Menu.Item>
                  <Tooltip label="Updates status to Work Order Received" position="right-end">
                    <Menu.Item
                      c={colors.titleText}
                      icon={<IconCornerDownRight {...menuIconStyle} />}
                      onClick={(event) => {
                        event.stopPropagation();
                        moveToProject(item._id);
                      }}
                    >
                      <Text>Move to Projects</Text>
                    </Menu.Item>
                  </Tooltip>
                  {isAdmin && (
                    <>
                      {/* <Menu.Item
                        c={colors.titleText}
                        icon={<IconUserCog {...menuIconStyle} />}
                        onClick={(event) => {
                          event.stopPropagation();
                          assignEngineer(item._id);
                        }}
                      >
                        Assign Engineer
                      </Menu.Item> */}
                      <Menu.Item
                        c={"red"}
                        icon={<IconTrash size={menuIconStyle.size} />}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </div>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Company
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.company?.name || "N/A"}
              </Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Prospect Type:
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.type || "N/A"}
              </Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Value:
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: item.value.currency,
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }).format(item.value.amount) || "N/A"}
              </Text>
            </Flex>
            <div className={classes.textWithIconButton}>
              <Badge variant="filled" color={projectStatusColors[item.status]} mt={"xs"}>
                {item.statusName}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default _LeadCard;
