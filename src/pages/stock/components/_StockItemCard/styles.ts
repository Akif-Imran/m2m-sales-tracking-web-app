import { createStyles, rem } from "@mantine/core";

export const useStyles = createStyles((_theme) => ({
  machineImageContainer: {
    display: "flex",
    paddingRight: rem(4),
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    // border: "1px solid black",
  },
}));
