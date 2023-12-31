import React from "react";
import { useStyles } from "./styles";
import { ActionIcon, Anchor, Avatar, Badge, Card, Flex, Menu, Text, rem } from "@mantine/core";
import { colors } from "@theme";
import { userStatusColors } from "@constants";
import { BASE_URL } from "@api";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { PhotoView } from "react-photo-view";

type CardUser = IUser & {
  userTypeName: string | undefined;
};
interface OwnProps {
  item: CardUser;
  onClick?: () => void;
  handleDelete: (id: string) => void;
  setForEdit: (user: IUser) => void;
}

const _UserCard: React.FC<OwnProps> = ({ item, onClick, handleDelete, setForEdit }) => {
  const { classes, theme } = useStyles();

  const noImageStyle = {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      // filter: `invert(33%) sepia(65%) saturate(0%) hue-rotate(253deg) brightness(98%) contrast(88%)`,
      objectFit: "contain",
    },
  };

  const menuStyles = {
    itemLabel: {
      fontSize: theme.fontSizes.sm,
    },
  };
  const menuIconStyle = {
    stroke: 1.3,
    size: 16,
    color: colors.titleText,
  };

  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"sm"} radius={"md"} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <PhotoView
            key={item._id}
            src={item?.picture ? `${BASE_URL}\\${item?.picture}` : "/user.png"}
          >
            <Avatar
              src={item?.picture ? `${BASE_URL}\\${item?.picture}` : "/user.png"}
              radius={item?.picture ? rem(250) : rem(250)}
              size={"xl"}
              //@ts-expect-error style works
              styles={item?.picture ? undefined : noImageStyle}
            />
          </PhotoView>
          <Badge variant="filled" color={userStatusColors[item.userType]} mt={"xs"}>
            {item.userTypeName?.split("/")[0]}
          </Badge>
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
                    icon={<IconEdit {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      setForEdit(item);
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={menuIconStyle.size} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Email:
              </Text>
              <Anchor
                href={`mailto:${item?.email}`}
                underline={true}
                target="_blank"
                c={"blue"}
                fz={"sm"}
              >
                {item?.email || "N/A"}
              </Anchor>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Mobile No.
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.mobile || "N/A"}
              </Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Designation:
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.designation || "N/A"}
              </Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text fw={700} color={colors.titleText} mr={"xs"} fz={"sm"}>
                Department:
              </Text>
              <Text color={colors.titleText} fz={"sm"}>
                {item?.department || "N/A"}
              </Text>
            </Flex>

            {/* <Anchor href={item?.website} underline={true} target="_blank" c={"blue"}>
              {item?.website || "N/A"}
            </Anchor> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export { _UserCard };
