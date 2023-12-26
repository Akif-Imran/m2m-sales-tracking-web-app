import { BASE_URL } from "@api";
import { bodyTextStyle, cardConfig, titleTextStyle } from "@global-styles";
import {
  Card,
  Flex,
  Avatar,
  Anchor,
  Text,
  Tooltip,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { routes } from "@routes";
import { selectContactsWithRecords, selectModule, useAppSelector } from "@store";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { colors } from "@theme";
import React from "react";
import { PhotoView } from "react-photo-view";
import { useNavigate } from "react-router-dom";

interface OwnProps {
  contact: ReturnType<typeof selectContactsWithRecords>[0];
}

export const _ContactCard: React.FC<OwnProps> = ({ contact }) => {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();
  const { module } = useAppSelector(selectModule);

  return (
    <Card {...cardConfig}>
      <React.Fragment key={contact._id}>
        <Flex direction={"row"} justify={"flex-start"} align={"flex-start"} columnGap={"sm"}>
          <Flex my={"auto"}>
            <PhotoView
              key={contact._id}
              src={contact.businessCard ? `${BASE_URL}\\${contact.businessCard}` : "/user.png"}
            >
              <Avatar
                src={contact.businessCard ? `${BASE_URL}\\${contact.businessCard}` : "/user.png"}
                size={88}
              />
            </PhotoView>
          </Flex>
          <Flex direction={"column"} w={"100%"}>
            <Flex direction={"row"} justify={"space-between"} align={"center"}>
              <Flex direction={"row"} align={"center"} justify={"flex-start"}>
                <Text {...titleTextStyle} mr={"xs"}>
                  Name:
                </Text>
                <Text {...bodyTextStyle}>{contact?.name || "N/A"}</Text>
              </Flex>
              {/* <Menu withinPortal withArrow position="bottom-end">
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical size={16} stroke={1.3} color={colors.titleText} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Options</Menu.Label>
                  <Menu.Item
                    color="red"
                    icon={<IconTrashFilled stroke={1.3} size={16} />}
                    onClick={() => handleDelete(contact._id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu> */}
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text {...titleTextStyle} mr={"xs"}>
                Company:
              </Text>
              <Text {...bodyTextStyle}>{contact?.company?.name || "N/A"}</Text>
            </Flex>
            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text {...titleTextStyle} mr={"xs"}>
                Email:
              </Text>
              <Anchor {...bodyTextStyle} href={contact?.email} target={"_blank"} c={"blue"}>
                {contact?.email || "N/A"}
              </Anchor>
            </Flex>

            <Flex direction={"row"} align={"center"} justify={"flex-start"}>
              <Text {...titleTextStyle} mr={"xs"}>
                Department:
              </Text>
              <Text {...bodyTextStyle}>{contact?.department || "N/A"}</Text>
            </Flex>

            <Flex direction={"row"} align={"flex-start"} justify={"flex-start"}>
              <Text {...titleTextStyle} mr={"xs"}>
                Mobile:
              </Text>
              <Text {...bodyTextStyle}>{contact?.mobile.join(", ") || "N/A"}</Text>
            </Flex>

            <div className={classes.textWithIconButton}>
              <Flex direction={"row"} align={"flex-start"} justify={"flex-start"}>
                <Text {...titleTextStyle} mr={"xs"}>
                  Designation:
                </Text>
                <Text {...bodyTextStyle}>{contact?.designation || "N/A"}</Text>
              </Flex>
              <Tooltip label={"Contact's Company Details"} position="bottom" withinPortal withArrow>
                <UnstyledButton
                  className={cx(classes.bottomButton, classes.rightAlign, classes.noPadding)}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (module === "crm") {
                      navigate(routes.company.prospect_nav(contact.customerId));
                    } else if (module === "project") {
                      navigate(routes.company.project_nav(contact.customerId));
                    }
                  }}
                >
                  <IconCaretRightFilled
                    stroke={1.3}
                    size={22}
                    style={{ color: colors.titleText }}
                  />
                </UnstyledButton>
              </Tooltip>
            </div>
          </Flex>
        </Flex>
      </React.Fragment>
    </Card>
  );
};

export default _ContactCard;

const useStyles = createStyles((theme) => ({
  textWithIconButton: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // border: "1px solid black",
  },
  bottomButton: {
    display: "flex",
    flexDirection: "row",
    // flex: 1,
    paddingBlock: theme.spacing.xs,
    paddingInline: theme.spacing.xs,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.fn.lighten(colors.mediumGray, 0.6),
    },
  },
  noPadding: {
    paddingBlock: 0,
    paddingInline: 0,
  },

  rightAlign: {
    justifyContent: "flex-end",
  },
}));
