import { createStyles, getStylesRef, rem } from "@mantine/core";
import { colors } from "@theme";

export const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    height: "100%",
    paddingInline: 8,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    [theme.fn.largerThan("sm")]: {
      justifyContent: "space-between",
    },
    [theme.fn.smallerThan("sm")]: {
      justifyContent: "space-between",
    },
    // borderBottom: `${rem(1)} solid ${
    //   theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[9]
    // }`,
    // marginBottom: rem(120),
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background!,
        0.1
      ),
    },

    [theme.fn.smallerThan("xs")]: {
      display: "inline-block",
      borderWidth: 1,
    },
  },

  sideBar: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    borderRadius: theme.radius.md,
    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background!,
        0.1
      ),
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({
        variant: "filled",
        color: theme.primaryColor,
      }).background!,
      0.2
    ),
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: rem(38),
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },

  //copies styles form navbar
  navbar: {
    backgroundColor: theme.fn.variant({
      variant: "filled",
      color: theme.primaryColor,
    }).background,
    overflowY: "scroll",
    transition: "width 0.1s ease-in-out",
  },

  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },

  headerNav: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    )}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    )}`,
  },

  iconCentered: {
    justifyContent: "center",
  },
  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    borderRadius: theme.radius.md,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.white,
    opacity: 1,
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 1,
      },
    },
  },

  descText: {
    flex: 1,
    textAlign: "right",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: colors.titleText,
    fontWeight: 400,
    fontSize: rem(12),
    lineHeight: 1,
    // border: "1px solid gray",
  },
  headerText: {
    flex: 1,
    textAlign: "left",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: colors.titleText,
    fontWeight: 700,
    fontSize: rem(12),
    lineHeight: 1,
    // border: "1px solid gray",
  },
}));
