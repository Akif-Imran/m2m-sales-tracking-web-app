import { ActionIcon, Avatar, Badge, Card, Flex, Menu, Text, rem } from "@mantine/core";
import React from "react";
import { selectProjectWithRecords } from "@store";
import {
  IconDotsVertical,
  IconRotateClockwise2,
  IconTrash,
  IconUserCog,
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
  item: ReturnType<typeof selectProjectWithRecords>[0];
  handleDelete: (id: string) => void;
  assignEngineer: (projectId: string) => void;
  updateStatus: (statusId: number, projectId: string) => void;
}

export const _ProjectCard: React.FC<OwnProps> = ({
  item,
  onClick,
  handleDelete,
  assignEngineer,
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
          <PhotoView src={item?.image ? `${BASE_URL}\\${item?.image}` : "/company.png"}>
            <Avatar
              src={item?.image ? `${BASE_URL}\\${item?.image}` : "/company.png"}
              radius={item?.image ? rem(250) : rem(250)}
              size={"xl"}
              //@ts-expect-error style works
              styles={item?.image ? undefined : noImageStyle}
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
                  {isAdmin && (
                    <>
                      <Menu.Item
                        c={colors.titleText}
                        icon={<IconUserCog {...menuIconStyle} />}
                        onClick={(event) => {
                          event.stopPropagation();
                          assignEngineer(item._id);
                        }}
                      >
                        Assign Engineer
                      </Menu.Item>
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
                Prospect
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.company?.name || "N/A"}
              </Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Lead Type:
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

export default _ProjectCard;
