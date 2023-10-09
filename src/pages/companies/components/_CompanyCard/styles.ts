import { createStyles, rem } from "@mantine/core";
import { colors } from "@theme";

export const useStyles = createStyles((theme) => ({
  imageWithInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  machineImageContainer: {
    display: "flex",
    paddingRight: rem(4),
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    // border: "1px solid black",
  },
  infoContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    marginLeft: rem(4),
    // border: "1px solid",
  },
  minorDetailsWithCount: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // border: "1px solid black",
  },
  labelButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomButton: {
    minWidth: rem(112),
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
  leftAlign: {
    justifyContent: "flex-start",
  },
  rightAlign: {
    justifyContent: "flex-end",
  },
  labelButton: {
    color: colors.titleText,
    // textDecorationLine: "underline",
    accentColor: colors.titleText,
    flexWrap: "nowrap",
  },
}));
