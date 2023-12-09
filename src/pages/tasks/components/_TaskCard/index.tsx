import { ActionIcon, Badge, Card, Flex, Menu, Text, rem } from "@mantine/core";
import { IconDotsVertical, IconRotateClockwise2, IconTrash } from "@tabler/icons-react";
import { colors } from "@theme";
import React from "react";
import { useStyles } from "./styles";
import { selectModule, selectTasksCombined, useAppSelector } from "@store";
import { menuIconStyle } from "@global-styles";
import { useAuthContext } from "@contexts";
import { DateTime } from "luxon";
import { taskStatusColors } from "@constants";

interface OwnProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  item: ReturnType<typeof selectTasksCombined>["tasks"][0];
  handleDelete: (taskId: string) => void;
  updateStatus: (status: number, taskId: string) => void;
}

export const _TaskCard: React.FC<OwnProps> = ({ onClick, item, handleDelete, updateStatus }) => {
  const { classes, theme } = useStyles();
  const {
    state: { isAdmin },
  } = useAuthContext();
  const { module } = useAppSelector(selectModule);

  const menuStyles = {
    itemLabel: {
      fontSize: theme.fontSizes.sm,
    },
  };

  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"lg"} radius={"md"} onClick={onClick}>
      <div className={classes.infoContainer}>
        <div className={classes.minorDetailsWithCount}>
          <div className={classes.textWithIconButton}>
            <Flex direction={"row"} align={"center"} justify={"space-between"}>
              <Text fw={"bold"} fs={"normal"} fz={"md"} color={colors.titleText}>
                {item?.title}
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
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
          <Flex direction={"row"} align={"center"} justify={"flex-start"}>
            <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
              Company:
            </Text>
            <Text color={colors.titleText} fz={"sm"}>
              {item?.company?.name || "N/A"}
            </Text>
          </Flex>
          <Flex direction={"row"} align={"center"} justify={"flex-start"}>
            <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
              {module === "crm" ? "Prospect:" : "Project:"}
            </Text>
            <Text color={colors.titleText} fz={"sm"}>
              {item?.project?.name || "N/A"}
            </Text>
          </Flex>
          <Flex direction={"row"} align={"center"} justify={"flex-start"}>
            <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
              Assigned To:
            </Text>
            <Text color={colors.titleText} fz={"sm"}>
              {item?.assignee?.name || "N/A"}
            </Text>
          </Flex>

          <Flex direction={"row"} align={"center"} justify={"space-between"} w="100%">
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Deadline:
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {DateTime.fromISO(item.completionDeadline).toLocaleString(
                  DateTime.DATETIME_MED_WITH_SECONDS
                )}
              </Text>
            </Flex>
            <Badge variant="filled" color={taskStatusColors[item.status]} mt={"xs"}>
              {item.statusName}
            </Badge>
          </Flex>
        </div>
      </div>
    </Card>
  );
};

export default _TaskCard;
