import { createStyles, rem } from "@mantine/core";

export const useStyles = createStyles((_theme) => ({
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
}));
