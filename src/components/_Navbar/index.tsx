import React, { useState } from "react";
import { Navbar, Tooltip } from "@mantine/core";
import {
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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStyles } from "./styles";
import { routes } from "@routes";

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
    link: routes.prospects.list,
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

interface _NavbarProps {
  opened: boolean;
  close: () => void;
}
const _Navbar: React.FC<_NavbarProps> = ({ opened, close }) => {
  const { classes, cx } = useStyles();
  const location = useLocation();
  const [active, setActive] = useState<ActivePage>("Dashboard");
  const navigate = useNavigate();

  const links = data.map((item) => {
    // we need to make change to the api need to inform yahya about them.
    return (
      <Tooltip
        label={item.label}
        withinPortal
        withArrow
        position="right"
        arrowPosition="center"
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
            close();
          }}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          {opened && <span>{item.label}</span>}
        </NavLink>
      </Tooltip>
    );
  });
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
      navigate(routes.prospects.list);
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

  return (
    <Navbar
      p={opened ? "sm" : "xs"}
      width={{ sm: opened ? 200 : 80, lg: opened ? 250 : 80 }}
      className={classes.navbar}
      hiddenBreakpoint="sm"
      hidden={!opened}
    >
      <Navbar.Section grow>
        {/* <Group className={classes.header} position="apart">
          <MantineLogo size={28} inverted />
          <Code className={classes.version}>v3.1.2</Code>
        </Group> */}
        {links}
      </Navbar.Section>
    </Navbar>
  );
};

export default _Navbar;
