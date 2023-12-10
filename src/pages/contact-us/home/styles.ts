import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  mainContainer: {
    position: "relative",
  },
  imageTextContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    // border: "1px solid white",
  },
}));
