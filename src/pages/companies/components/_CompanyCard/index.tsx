import React from "react";
import { useStyles } from "./styles";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Card,
  Flex,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconBriefcase,
  IconCalendarPlus,
  IconCaretRightFilled,
  IconCash,
  IconDots,
  IconFiles,
  IconShoppingBag,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";
import { colors, theme } from "@theme";
import { useNavigate } from "react-router-dom";
import { routes } from "@routes";

interface OwnProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  item: ICompany;
  openContact: () => void;
  openFollowUp: () => void;
  openExpense: () => void;
  openPurchaseRequest: () => void;
  handleDelete: () => void;
}

const _CompanyCard: React.FC<OwnProps> = ({
  onClick,
  item,
  openContact,
  openFollowUp,
  openExpense,
  openPurchaseRequest,
  handleDelete,
}) => {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    // toggleLayout();
    navigate(route);
    // setScrollIndex(index);
  };

  const noImageStyle = {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      filter: `invert(33%) sepia(65%) saturate(0%) hue-rotate(253deg) brightness(98%) contrast(88%)`,
      objectFit: "contain",
      width: rem(64),
      height: rem(64),
    },
  };

  const menuStyles = {
    itemLabel: {
      fontSize: theme.fontSize.sm,
    },
  };
  const menuIconStyle = {
    stroke: 1.3,
    size: 16,
    color: colors.titleText,
  };

  return (
    <Card shadow="sm" mb={"xs"} px={"sm"} py={"lg"} radius={"md"} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <Avatar
            src={item?.logo ? `${item?.logo}` : "/company.png"}
            radius={item?.logo ? rem(250) : rem(250)}
            size={"xl"}
            //@ts-expect-error style works
            styles={item?.logo ? undefined : noImageStyle}
          />
        </div>
        <div className={classes.infoContainer}>
          <div className={classes.minorDetailsWithCount}>
            <div className={classes.textWithIconButton}>
              <Flex direction={"row"} align={"center"} justify={"space-between"}>
                <Text fw={"bold"} fs={"normal"} fz={"md"} color={colors.titleText}>
                  {item?.name}
                </Text>
                {/* <ActionIcon
                  variant="transparent"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routes.company.project_nav(item.id.toString()));
                  }}
                >
                  <IconInfoSquareRounded size={22} stroke={1.3} color={colors.titleText} />
                </ActionIcon> */}
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
                    <IconDots {...menuIconStyle} size={22} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Company</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconUserPlus {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openContact();
                    }}
                  >
                    Contact
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>New</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconBriefcase {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate({
                        pathname: routes.project.list,
                        search: "?open=add",
                      });
                    }}
                  >
                    Project
                  </Menu.Item>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconCalendarPlus {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openFollowUp();
                    }}
                  >
                    Follow Up
                  </Menu.Item>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconShoppingBag {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openPurchaseRequest();
                    }}
                  >
                    Purchase Request
                  </Menu.Item>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconCash size={menuIconStyle.size} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openExpense();
                    }}
                  >
                    Expense / Claim
                  </Menu.Item>
                  <Menu.Label>Options</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconFiles {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleNavigate(routes.reports.list_nav(item._id));
                    }}
                  >
                    Reports
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    icon={<IconTrash size={menuIconStyle.size} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete();
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
            <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
              {item?.phone || "N/A"}
            </Text>
            <Anchor href={`mailto:${item?.email}`} underline={true} target="_blank" c={"blue"}>
              {item?.email || "N/A"}
            </Anchor>
            <Anchor href={item?.website} underline={true} target="_blank" c={"blue"}>
              {item?.website || "N/A"}
            </Anchor>
            <div className={classes.textWithIconButton}>
              <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
                {item?.city || "N/A"} {item?.state || "N/A"} {item.country || "N/A"}
              </Text>
              <Tooltip label={"View Details"} position="bottom" withinPortal withArrow>
                <UnstyledButton
                  className={cx(classes.bottomButton, classes.rightAlign, classes.noPadding)}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(routes.company.project_nav(item._id));
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
          </div>
        </div>
      </div>

      {/* <div className={classes.labelButtonsContainer}>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openContact();
          }}
        >
          <IconUserPlus stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Contact
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openFollowUp();
          }}
        >
          <IconCalendarPlus stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Follow Up
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.rightAlign)}
          onClick={(event) => {
            event.stopPropagation();
            openExpense();
          }}
        >
          <IconCash stroke={1.3} size={22} color={colors.titleText} />
          <Text
            fw={"normal"}
            fs={"normal"}
            fz={"sm"}
            ml={rem(4)}
            mr={"xs"}
            className={classes.labelButton}
          >
            Expense
          </Text>
        </UnstyledButton>
        <UnstyledButton
          className={cx(classes.bottomButton, classes.leftAlign)}
          onClick={(event) => {
            event.stopPropagation();
            handleNavigate(routes.reports.list_nav(item.id.toString()));
          }}
        >
          <IconFiles stroke={1.3} size={22} color={colors.titleText} />
          <Text fw={"normal"} fs={"normal"} fz={"sm"} ml={rem(4)} className={classes.labelButton}>
            Reports
          </Text>
        </UnstyledButton>
      </div> */}
    </Card>
  );
};

export { _CompanyCard };
