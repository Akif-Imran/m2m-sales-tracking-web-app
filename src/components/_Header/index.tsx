import React, { useState } from "react";
import {
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Burger,
  rem,
  Header,
  MediaQuery,
  Image,
  Flex,
  Tooltip,
  Popover,
  Stack,
  Center,
  Loader,
  Card,
  ScrollArea,
  Indicator,
  ActionIcon,
} from "@mantine/core";
import {
  IconLogout,
  IconChevronDown,
  IconTrash,
  IconBellFilled,
  IconDashboard,
  IconUserCircle,
  IconSettingsExclamation,
  IconChecklist,
  IconBuildingBank,
  IconDots,
  IconSquareRounded,
  IconSquareRoundedCheck,
} from "@tabler/icons-react";
import type { TablerIconsProps } from "@tabler/icons-react";
import { useAuthContext } from "@contexts";
import { useStyles } from "./styles";
import { deleteAccount } from "@services";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { colors } from "@theme";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@routes";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";
import { selectNotifications, selectUserTypes, useAppDispatch, useAppSelector } from "@store";
import { markAsRead } from "@slices";

type ActivePage =
  | "Dashboard"
  | "Contacts"
  | "Prospects"
  | "Projects"
  | "Follow ups"
  | "Purchase Request"
  | "Claims"
  | "Users"
  | "Leaves"
  | "Tasks"
  | "More"
  | "Settings"
  | "Help"
  | "About";
interface NavbarButtons {
  link: string;
  links?: { link: string; label: ActivePage; visibleTo: number[] }[];
  label: ActivePage;
  icon: (props: TablerIconsProps) => JSX.Element;
  visibleTo: number[];
}
//UserTypes
// 1 -> Admin
// 2 -> Sales
// 3 -> Engineer
// 4 -> HR
const buttons: NavbarButtons[] = [
  {
    link: routes.dashboard.home,
    label: "Dashboard",
    icon: IconDashboard,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.company.list,
    label: "Contacts",
    icon: IconBuildingBank,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.prospects.list,
    label: "Prospects",
    links: [
      {
        link: routes.prospects.list,
        label: "Prospects",
        visibleTo: [1, 2, 3, 4],
      },
      {
        link: routes.prospects.followUps.list,
        label: "Follow ups",
        visibleTo: [1, 2, 3, 4],
      },
      {
        link: routes.prospects.claims.list,
        label: "Claims",
        visibleTo: [1, 2, 3, 4],
      },
    ],
    icon: IconSettingsExclamation,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.projects.list,
    label: "Projects",
    links: [
      {
        link: routes.projects.list,
        label: "Projects",
        visibleTo: [1, 2, 3, 4],
      },
      {
        link: routes.projects.purchaseRequest.list,
        label: "Purchase Request",
        visibleTo: [1, 2, 3, 4],
      },
    ],
    icon: IconSettingsExclamation,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.user.list,
    label: "Users",
    links: [
      {
        link: routes.user.list,
        label: "Users",
        visibleTo: [1],
      },
      {
        link: routes.user.leaves.list,
        label: "Leaves",
        visibleTo: [1, 2, 3, 4],
      },
    ],
    icon: IconUserCircle,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.task.list,
    label: "Tasks",
    icon: IconChecklist,
    visibleTo: [1, 2, 3, 4],
  },
  {
    link: routes.settings.home,
    links: [
      {
        label: "Settings",
        link: routes.settings.home,
        visibleTo: [1, 2, 3, 4],
      },
      {
        label: "Help",
        link: routes.help.home,
        visibleTo: [1, 2, 3, 4],
      },
      {
        label: "About",
        link: routes.about.home,
        visibleTo: [1, 2, 3, 4],
      },
    ],
    label: "More",
    icon: IconDots,
    visibleTo: [1, 2, 3, 4],
  },
  // {
  //   link: routes.settings.home,
  //   label: "Settings",
  //   icon: IconSettings,
  //   adminOnly: true,
  // },
  // {
  //   link: routes.help.home,
  //   label: "Help",
  //   icon: IconHelpCircle,
  //   adminOnly: false,
  // },
  // {
  //   link: routes.about.home,
  //   label: "About",
  //   icon: IconInfoCircle,
  //   adminOnly: false,
  // },
  // { link: "", label: "Databases", icon: IconDatabaseImport },
  // { link: "", label: "Authentication", icon: Icon2fa },
  // { link: "", label: "Other Settings", icon: IconSettings },
];

interface _HeaderProps {
  toggleNavbar: () => void;
  opened: boolean;
}

const _Header = ({ toggleNavbar, opened }: _HeaderProps) => {
  const { classes, theme, cx } = useStyles();
  const dispatch = useAppDispatch();
  const {
    state: { token, user },
    logout,
  } = useAuthContext();

  const [notificationOpened, setNotificationOpened] = useState(false);
  const {
    count,
    data: notifications,
    isLoading: isFetchingNotifications,
  } = useAppSelector(selectNotifications);
  const { data: userTypes } = useAppSelector(selectUserTypes);
  const navigate = useNavigate();
  //copies over
  const location = useLocation();
  const [active, setActive] = useState<ActivePage>("Dashboard");
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = () => {
    openDeleteModalHelper({
      theme: theme,
      title: `Delete Account`,
      loading: isLoading,
      description: (
        <Text fw={"normal"} fs={"normal"} fz={"sm"} color={colors.titleText}>
          Are you sure you want to delete this Account? This action is destructive and you will have
          to contact support to restore data.
        </Text>
      ),
      cancelLabel: "Cancel",
      confirmLabel: "Delete Account",
      onConfirm: onDeleteAlertOk,
      onCancel: () => notify("Delete Account", "Operation canceled!", "error"),
    });
  };

  const onDeleteAlertOk = () => {
    setIsLoading(true);
    deleteAccount(token)
      .then((res) => {
        notify("Delete Account", res?.message, res.success ? "success" : "error");
        if (res.success) {
          logout();
        }
      })
      .catch((_err) => {
        notify("Delete Account", "Error!", "error");
        console.log(_err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    console.log("useEffect log: ", active);
    if (location.pathname === "/notifications") {
      navigate(routes.notification.list);
      return;
    }
    /*  if (active === "Dashboard") {
      navigate(routes.dashboard.home);
    } else if (active == "Company") {
      navigate(routes.company.list);
    } else if (active === "Projects") {
      navigate(routes.project.list);
    } else if (active === "Follow ups") {
      navigate(routes.project.followUps.list);
    } else if (active === "Purchase Request") {
      navigate(routes.project.purchaseRequest.list);
    } else if (active === "Claims") {
      navigate(routes.project.claims.list);
    } else if (active === "Tasks") {
      navigate(routes.task.list);
    } else if (active === "Users") {
      navigate(routes.user.list);
    } else if (active === "Leaves") {
      navigate(routes.user.leaves.list);
    } else if (active === "Settings") {
      navigate(routes.settings.home);
    } else if (active === "About") {
      navigate(routes.about.home);
    } else if (active === "Help") {
      navigate(routes.help.home);
    } */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // .filter((value) => (isAdmin || isHR ? true : !removePages.includes(value.label)))
  const links = buttons
    .filter((value) => value.visibleTo.includes(user!.userType))
    .map((item) => {
      const menuItems = item.links
        ?.filter((item) => item.visibleTo.includes(user!.userType))
        .map((item) => (
          <Menu.Item
            key={item.link}
            onClick={() => {
              navigate(item.link);
              setActive(item.label);
            }}
          >
            {item.label}
          </Menu.Item>
        ));
      if (menuItems) {
        return (
          <Menu
            key={item.label}
            trigger="hover"
            transitionProps={{ exitDuration: 0 }}
            withinPortal
            withArrow
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.link, {
                  [classes.linkActive]: item.label === active,
                  [classes.iconCentered]: !opened,
                })}
                onClick={(_event) => {
                  console.log("menu click");
                  if (
                    item.links
                      ?.find((inner) => inner.label === item.label)
                      ?.visibleTo.includes(user!.userType)
                  ) {
                    console.log("user is navigated");
                    navigate(item.link);
                  }
                  setActive(item.label);
                }}
              >
                <item.icon className={classes.linkIcon} stroke={1.5} />
                {opened && (
                  <span>
                    {item.label} {"▼"}
                  </span>
                )}
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        );
      }
      // we need to make change to the api need to inform yahya about them.
      return (
        <Tooltip
          label={item.label}
          withinPortal
          position="bottom"
          arrowPosition="center"
          withArrow
          key={item.label}
        >
          <UnstyledButton
            className={cx(classes.link, {
              [classes.linkActive]: item.label === active,
              [classes.iconCentered]: !opened,
            })}
            onClick={(_event) => {
              console.log("simple click");
              if (item.visibleTo.includes(user!.userType)) navigate(item.link);
              setActive(item.label);
            }}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            {opened && <span>{item.label}</span>}
          </UnstyledButton>
        </Tooltip>
      );
    });

  const rows = isFetchingNotifications ? (
    <Stack>
      <Center>
        <Loader variant="dots" />
      </Center>
    </Stack>
  ) : (
    <React.Fragment>
      {notifications.length === 0 ? (
        <Stack>
          <Center>
            <Text color={colors.titleText}>No Notifications</Text>
          </Center>
        </Stack>
      ) : (
        <>
          {notifications.map((notification) => (
            <Card
              shadow="sm"
              mb={"xs"}
              px={"sm"}
              py={"xs"}
              radius={"md"}
              key={notification.id.toString()}
            >
              <Flex direction={"column"}>
                <Flex direction={"row"} justify={"space-between"} align={"center"}>
                  <Text size={"md"}>{notification.title}</Text>
                  <ActionIcon
                    onClick={
                      !notification.isRead ? () => dispatch(markAsRead(notification.id)) : undefined
                    }
                  >
                    {notification.isRead ? (
                      <IconSquareRoundedCheck
                        stroke={1.5}
                        color={theme.colors[theme.primaryColor][6]}
                      />
                    ) : (
                      <IconSquareRounded stroke={1.5} color={theme.colors[theme.primaryColor][6]} />
                    )}
                  </ActionIcon>
                </Flex>
                <Text size={"sm"} c={colors.titleText}>
                  {notification.body}
                </Text>
                <Text className={classes.descText} c={"dark.1"}>
                  {DateTime.fromISO(notification.createdAt).toFormat(DAY_MM_DD_YYYY_HH_MM_SS_A)}
                </Text>
              </Flex>
            </Card>
          ))}
        </>
      )}
    </React.Fragment>
  );

  return (
    <Header height={{ base: 65 }} zIndex={20}>
      <div className={classes.header}>
        <Flex direction={"row"} justify={"center"} align={"center"}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger opened={opened} onClick={toggleNavbar} size="sm" color={theme.white} mr="xl" />
          </MediaQuery>
          <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
            <Flex direction={"row"}>
              {/* <UnstyledButton className={classes.sideBar} onClick={toggleNavbar}>
                <IconMenu2 stroke={1.5} color="white" />
              </UnstyledButton> */}
              <Image
                src={"/icon.png"}
                height={50}
                width={100}
                fit="contain"
                styles={{
                  root: {
                    borderRadius: theme.radius.md,
                  },
                }}
              />
            </Flex>
          </MediaQuery>
        </Flex>

        <Flex gap={"xs"}>{links}</Flex>
        <Group>
          <Popover
            opened={notificationOpened}
            onChange={setNotificationOpened}
            width={400}
            withArrow
            withinPortal
          >
            <Popover.Target>
              <UnstyledButton
                className={classes.sideBar}
                onClick={() => {
                  setNotificationOpened(true);
                }}
              >
                <Indicator size={16} label={count} color={"red"} disabled={count === 0}>
                  <IconBellFilled stroke={1.5} color="white" />
                </Indicator>
              </UnstyledButton>
            </Popover.Target>

            <Popover.Dropdown p={"xs"} bg={colors.thinGray}>
              <ScrollArea h={rem(500)}>{rows}</ScrollArea>
            </Popover.Dropdown>
          </Popover>

          <Menu
            width={250}
            radius="md"
            withinPortal
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar src="/profile.png" alt={user?.name} radius="xl" size={35} />
                  <div>
                    <Text weight={700} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user?.name} (
                      {userTypes.find((ut) => ut.id === user?.userType)?.name || "N/A"})
                    </Text>
                    <Text weight={400} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user?.email}
                    </Text>
                    <Text weight={400} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      Last Login:{" "}
                      {user?.lastLoginTime
                        ? DateTime.fromISO(user?.lastLoginTime).toLocaleString(
                            DateTime.DATETIME_MED_WITH_SECONDS,
                            {
                              locale: "en-US",
                            }
                          )
                        : "N/A"}
                    </Text>
                  </div>
                  <IconChevronDown size={rem(12)} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              {/* <Menu.Item icon={<IconSettings size="0.9rem" stroke={1.5} />}>
              Account settings
            </Menu.Item> */}
              <Menu.Item
                color="red"
                icon={<IconTrash size="0.9rem" stroke={1.5} />}
                onClick={() => handleDelete()}
              >
                Delete Account
              </Menu.Item>
              <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />} onClick={() => logout()}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Header>
  );
};

export default _Header;
