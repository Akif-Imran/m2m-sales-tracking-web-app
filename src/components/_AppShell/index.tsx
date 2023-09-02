import { AppShell } from "@mantine/core";
import { _Navbar, _Header } from "..";
import { useDisclosure } from "@mantine/hooks";
import { useStyles } from "./styles";
import { colors } from "../../theme";

interface OwnProps {
  page: React.ReactNode;
}
const _AppShell: React.FC<OwnProps> = ({ page }) => {
  const { classes } = useStyles();
  const [opened, { close: _close, toggle: toggleNavbar }] = useDisclosure(true);
  return (
    <AppShell
      fixed
      padding={"xs"}
      className={classes.main}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      // navbar={<_Navbar opened={opened} close={close} />}
      header={<_Header toggleNavbar={toggleNavbar} opened={opened} />}
      styles={{
        main: {
          backgroundColor: colors.lightGray,
        },
      }}
    >
      {page}
    </AppShell>
  );
};

export { _AppShell };
