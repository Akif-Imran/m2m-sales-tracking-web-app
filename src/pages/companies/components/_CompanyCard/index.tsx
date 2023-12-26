import React from "react";
import { useStyles } from "./styles";
import { Anchor, Avatar, Card, Flex, Text, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { IconCaretRightFilled } from "@tabler/icons-react";
import { colors } from "@theme";
import { useNavigate } from "react-router-dom";
import { routes } from "@routes";
import { BASE_URL } from "@api";
import { PhotoView } from "react-photo-view";
import { cardConfig, noImageStyle } from "@global-styles";
import { selectModule, useAppSelector } from "@store";

interface OwnProps {
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  item: ICompany;
  openContact: () => void;
  openFollowUp: () => void;
  openExpense: () => void;
  openPurchaseRequest: () => void;
  handleDelete: () => void;
}

const _CompanyCard: React.FC<OwnProps> = ({ onClick, item }) => {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();
  const { module } = useAppSelector(selectModule);

  // const menuStyles = {
  //   itemLabel: {
  //     fontSize: theme.fontSizes.sm,
  //   },
  // };

  return (
    <Card {...cardConfig} onClick={onClick}>
      <div className={classes.imageWithInfoContainer}>
        <div className={classes.machineImageContainer}>
          <PhotoView src={item?.logo ? `${BASE_URL}\\${item?.logo}` : "/company.png"}>
            <Avatar
              src={item?.logo ? `${BASE_URL}\\${item?.logo}` : "/company.png"}
              radius={item?.logo ? rem(250) : rem(250)}
              size={"xl"}
              //@ts-expect-error style works
              styles={item?.logo ? undefined : noImageStyle}
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
              {/* <Menu
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
                  <Menu.Label>Contact</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconUserPlus {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      openContact();
                    }}
                  >
                    Contact Person
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>New</Menu.Label>
                  <Menu.Item
                    c={colors.titleText}
                    icon={<IconBriefcase {...menuIconStyle} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate({
                        pathname: routes.prospects.list,
                        search: `?open=add&customerId=${item._id}`,
                      });
                    }}
                  >
                    Prospect
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
                    icon={<IconCash {...menuIconStyle} />}
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
                  {isAdmin && (
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
                  )}
                </Menu.Dropdown>
              </Menu> */}
            </div>
            <Text fz={"sm"} color={colors.titleText}>
              {item?.phone || "N/A"}
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
            <Anchor href={item?.website} underline={true} target="_blank" c={"blue"} fz={"sm"}>
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
                    if (module === "crm") {
                      navigate(routes.company.prospect_nav(item._id));
                    } else if (module === "project") {
                      navigate(routes.company.project_nav(item._id));
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
