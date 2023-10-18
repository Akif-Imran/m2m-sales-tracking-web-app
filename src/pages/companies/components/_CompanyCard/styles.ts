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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // border: "1px solid black",
  },
  textWithIconButton: {
    width: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // border: "1px solid black",
  },
  labelButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    // justifyContent: "space-between", //when there are more buttons than 1
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
