import { createStyles } from "@mantine/core";
import { colors } from "@theme";

export const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  grayContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: colors.thinGray,
  },
  centeredContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  chartsContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 600,
    lineHeight: 1,
  },
}));
