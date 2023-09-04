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
  Divider,
  ScrollArea,
} from "@mantine/core";
import {
  IconLogout,
  IconChevronDown,
  IconTrash,
  IconBellFilled,
  IconSettings,
  IconDashboard,
  IconUserCircle,
  IconSettingsExclamation,
  IconHelpCircle,
  IconInfoCircle,
  IconChecklist,
  IconBuildingBank,
} from "@tabler/icons-react";
import type { TablerIconsProps } from "@tabler/icons-react";
import { useAuthContext } from "@contexts";
import { useStyles } from "./styles";
import { deleteAccount } from "@services";
import { notify } from "@utility";
import { openDeleteModalHelper } from "@helpers";
import { colors } from "@theme";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { routes } from "@routes";
import { DateTime } from "luxon";
import { DAY_MM_DD_YYYY_HH_MM_SS_A } from "@constants";

type ActivePage =
  | "Dashboard"
  | "Company"
  | "Projects"
  | "Users"
  | "Tasks"
  | "Settings"
  | "Help"
  | "About";
interface NavbarButtons {
  link: string;
  label: ActivePage;
  icon: (props: TablerIconsProps) => JSX.Element;
  adminOnly: boolean;
}

const data: NavbarButtons[] = [
  {
    link: routes.dashboard.home,
    label: "Dashboard",
    icon: IconDashboard,
    adminOnly: false,
  },
  {
    link: routes.company.list,
    label: "Company",
    icon: IconBuildingBank,
    adminOnly: false,
  },
  {
    link: routes.project.list,
    label: "Projects",
    icon: IconSettingsExclamation,
    adminOnly: false,
  },
  {
    link: routes.user.list,
    label: "Users",
    icon: IconUserCircle,
    adminOnly: false,
  },
  {
    link: routes.task.list,
    label: "Tasks",
    icon: IconChecklist,
    adminOnly: false,
  },
  {
    link: routes.settings.home,
    label: "Settings",
    icon: IconSettings,
    adminOnly: true,
  },
  {
    link: routes.help.home,
    label: "Help",
    icon: IconHelpCircle,
    adminOnly: false,
  },
  {
    link: routes.about.home,
    label: "About",
    icon: IconInfoCircle,
    adminOnly: false,
  },
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
  const [notificationOpened, setNotificationOpened] = useState(false);
  const {
    state: { token, user },
    logout,
  } = useAuthContext();
  const [notifications, _setNotifications] = React.useState<INotification[]>([]);
  const [searchedNotifications, setSearchedNotifications] = React.useState<INotification[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const navigate = useNavigate();
  //copies over
  const location = useLocation();
  const [active, setActive] = useState<ActivePage>("Dashboard");
  // const [isProfileOpened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchNotifications = React.useCallback(() => {
    setIsFetching(true);
    new Promise((resolve) => {
      console.log(token);
      setTimeout(resolve, 500);
    })
      .then((_res) => {})
      .catch((_err) => {
        notify("Notification", _err.message || "", "error");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [token]);

  React.useEffect(() => {
    if (!notifications) {
      return;
    }
    setSearchedNotifications(notifications);
  }, [notifications]);

  React.useEffect(() => {
    // addInfo();
    fetchNotifications();
  }, [fetchNotifications]);

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
    console.log(active);
    if (location.pathname === "/notifications") {
      navigate(routes.notification.list);
      return;
    }
    if (active === "Dashboard") {
      navigate(routes.dashboard.home);
    } else if (active == "Company") {
      navigate(routes.company.list);
    } else if (active === "Projects") {
      navigate(routes.project.list);
    } else if (active === "Tasks") {
      navigate(routes.task.list);
    } else if (active === "Users") {
      navigate(routes.user.list);
    } else if (active === "Settings") {
      navigate(routes.settings.home);
    } else if (active === "About") {
      navigate(routes.about.home);
    } else if (active === "Help") {
      navigate(routes.help.home);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const links = data.map((item) => {
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
        <NavLink
          className={cx(classes.link, {
            [classes.linkActive]: item.label === active,
            [classes.iconCentered]: !opened,
          })}
          to={item.link}
          onClick={(_event) => {
            setActive(item.label);
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          {opened && <span>{item.label}</span>}
        </NavLink>
      </Tooltip>
    );
  });

  const rows = isFetching ? (
    <Stack>
      <Center>
        <Loader variant="dots" />
      </Center>
    </Stack>
  ) : (
    <React.Fragment>
      {searchedNotifications.length === 0 ? (
        <Stack>
          <Center>
            <Text color={colors.titleText}>No Notifications</Text>
          </Center>
        </Stack>
      ) : (
        <>
          {searchedNotifications.map((notification) => (
            <Card shadow="sm" mb={"xs"} px={"sm"} py={"xs"} radius={"md"} key={notification._id}>
              <Stack spacing={"xs"}>
                <Text className={classes.headerText} fz={rem(24)}>
                  {notification.title}
                </Text>
                <Divider />
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>IMEI</Text>
                  <Text className={classes.descText}>{notification.IMEI || "N/A"}</Text>
                </Flex>
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>Date/Time</Text>
                  <Text className={classes.descText}>
                    {DateTime.fromISO(notification.createdAt, { zone: "utc" }).toFormat(
                      DAY_MM_DD_YYYY_HH_MM_SS_A
                    ) || "N/A"}
                  </Text>
                </Flex>
                <Flex direction={"row"} justify={"space-between"} align={"flex-start"}>
                  <Text className={classes.headerText}>Description</Text>
                  <Text className={classes.descText}>{notification.body || "N/A"}</Text>
                </Flex>
              </Stack>
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
                  // navigate(routes.notification.list);
                }}
              >
                <IconBellFilled stroke={1.5} color="white" />
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
                  <Avatar src="/profile.png" alt={user?.firstName} radius="xl" size={35} />
                  <div>
                    <Text weight={700} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user?.firstName} {user?.lastName} ({user?.userTypeName})
                    </Text>
                    <Text weight={400} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user?.email}
                    </Text>
                    {/* <Text weight={400} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    Last Login:{" "}
                    {DateTime.fromISO(user?.lastLogin || "")
                      .toUTC()
                      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                  </Text> */}
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
